// [...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

// Define authentication options
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const userCollection = client.db().collection("users");

        // Check if user exists in jobseekers collection
        let user = await userCollection.findOne({
          email: credentials.email,
        });

        if (user) {
          // Verify password for jobseeker
          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
          if (!isValid) {
            client.close();
            throw new Error("Could not log you in!");
          }
          client.close();
          return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage
          };
        }

        // If no user is found in either collection
        client.close();
        throw new Error("No user found");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Only process for Google sign-in
      if (account?.provider === "google") {
        const { email } = user;

        try {
          const client = await connectToDatabase();
          const db = client.db();

          // Check if user exists in jobseekers collection
          const existingUser = await db.collection("users").findOne({ email });

          if (existingUser) {
            user.id = existingUser._id;
            user.firstName = existingUser.firstName;
            user.lastName = existingUser.lastName;
            user.email = existingUser.email;
            user.role = existingUser.role;
            user.profileImage = existingUser.profileImage;

            client.close();
            return true; // Allow sign-in
          }

          // If user doesn't exist, redirect to signup
          if (!existingUser) {
            alert("Not Account Found, Please Sign Up ...");
          }
          // await db.collection("jobseekers").insertOne({
          //   email,
          //   firstName: user.name?.split(" ")[0] || "",
          //   lastName: user.name?.split(" ")[1] || "",
          //   profileImage: user.image || "",
          //   password: null,
          // });

          client.close();
          return true;
        } catch (error) {
          console.error("Database error:", error);
          return false;
        }
      }
      return true; // Allow sign-in for other providers
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.role = token.role || "guest";
        session.user.profileImage = token.profileImage;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.role = user.role || "guest";
        token.profileImage = user.profileImage;
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/home",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

//FLAMES
