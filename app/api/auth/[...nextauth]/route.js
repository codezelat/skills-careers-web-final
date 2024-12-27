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
        const jobSeekerCollection = client.db().collection("jobseekers");
        const recruiterCollection = client.db().collection("recruiters");
        const adminCollection = client.db().collection("admins");

        // Check if user exists in jobseekers collection
        let user = await jobSeekerCollection.findOne({
          email: credentials.email,
        });

        if (user) {
          // Concatenate firstname and lastname to create the full name
          const fullName = user.firstName + " " + user.lastName;

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
            email: user.email,
            name: fullName,
            role: "jobseeker",
          };
        }

        // Check if user exists in recruiters collection
        user = await recruiterCollection.findOne({
          email: credentials.email,
        });

        if (user) {
          // Verify password for recruiter
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
            email: user.email,
            name: user.recruiterName,
            role: "recruiter",
          };
        }

        // Check if user exists in admins collection
        user = await adminCollection.findOne({
          email: credentials.email,
        });

        if (user) {
          // Concatenate firstname and lastname to create the full name
          const fullName = user.firstName + " " + user.lastName;

          // Verify password for recruiter
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
            email: user.email,
            name: fullName,
            role: "admin",
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
          const existingUser = await db
            .collection("jobseekers")
            .findOne({ email });

          if (existingUser) {
            user.id = existingUser._id;
            user.role = "jobseeker";
            client.close();
            return true; // Allow sign-in
          }

          // If user doesn't exist, create new jobseeker profile
          await db.collection("jobseekers").insertOne({
            email,
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ")[1] || "",
            profileImage: user.image || "",
            contactNumber: "",
            position: "",
            personalProfile: "",
            dob: "",
            nationality: "",
            maritalStatus: "",
            languages: "",
            religion: "",
            address: "",
            ethnicity: "",
            experience: "",
            education: "",
            licensesCertifications: "",
            softSkills: "",
            professionalExpertise: "",
            password: null,
          });

          user.role = "jobseeker";
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
        session.user.role = token.role || "guest";
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "guest";
        token.email = user.email;
        token.name = user.name;
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
