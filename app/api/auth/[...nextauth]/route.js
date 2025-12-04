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

        try {
          const db = client.db();
          const userCollection = db.collection("users");

          const user = await userCollection.findOne({
            email: credentials.email,
          });

          if (user) {
            const isValid = await verifyPassword(
              credentials.password,
              user.password
            );

            if (!isValid) {
              throw new Error("Could not log you in!");
            }

            return {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              profileImage: user.profileImage,
            };
          }

          const admin = await db.collection("admins").findOne({
            email: credentials.email,
          });

          if (admin) {
            const isValid = await verifyPassword(
              credentials.password,
              admin.password
            );

            if (!isValid) {
              throw new Error("Could not log you in!");
            }

            return {
              id: admin._id,
              firstName: admin.firstName,
              lastName: admin.lastName,
              email: admin.email,
              role: "admin",
              profileImage: admin.profileImage,
            };
          }

          const recruiter = await db.collection("recruiters").findOne({
            email: credentials.email,
          });

          if (recruiter) {
            const isValid = await verifyPassword(
              credentials.password,
              recruiter.password
            );

            if (!isValid) {
              throw new Error("Could not log you in!");
            }

            return {
              id: recruiter._id,
              firstName: recruiter.recruiterName,
              lastName: "",
              email: recruiter.email,
              role: "recruiter",
              profileImage: recruiter.logo,
            };
          }

          throw new Error("No user found");
        } finally {
          await client.close();
        }
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
        // Fetch fresh user data from database to get updated profile image
        try {
          const client = await connectToDatabase();
          const db = client.db();
          
          const user = await db.collection("users").findOne({ email: token.email });
          
          if (user) {
            session.user.id = token.id;
            session.user.firstName = user.firstName || token.firstName;
            session.user.lastName = user.lastName || token.lastName;
            session.user.email = user.email;
            session.user.role = user.role || token.role || "guest";
            session.user.profileImage = user.profileImage; // Fresh from DB
          } else {
            // Fallback to token if user not found
            session.user.id = token.id;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.email = token.email;
            session.user.role = token.role || "guest";
            session.user.profileImage = token.profileImage;
          }
          
          await client.close();
        } catch (error) {
          console.error("Error fetching user in session callback:", error);
          // Fallback to token data on error
          session.user.id = token.id;
          session.user.firstName = token.firstName;
          session.user.lastName = token.lastName;
          session.user.email = token.email;
          session.user.role = token.role || "guest";
          session.user.profileImage = token.profileImage;
        }
      }
      return session;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session?.profileImage) {
        token.profileImage = session.profileImage;
      }
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
      // Get the actual base URL from environment or request
      const actualBaseUrl = process.env.NEXTAUTH_URL || baseUrl;

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${actualBaseUrl}${url}`;

      // Allows callback URLs on the same origin
      try {
        const urlOrigin = new URL(url).origin;
        const baseOrigin = new URL(actualBaseUrl).origin;
        if (urlOrigin === baseOrigin) return url;
      } catch (error) {
        console.error("Redirect URL parsing error:", error);
      }

      return actualBaseUrl;
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
