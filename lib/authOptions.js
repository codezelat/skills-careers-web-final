import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

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

            // Check if user is a jobseeker and if they're restricted
            if (user.role === "jobseeker") {
              const jobseeker = await db.collection("jobseekers").findOne({
                email: user.email,
              });

              if (jobseeker?.isRestricted) {
                throw new Error(
                  "Your account has been restricted. Please contact support."
                );
              }
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

            // Check if recruiter is restricted
            if (recruiter.isRestricted) {
              throw new Error(
                "Your account has been restricted. Please contact support."
              );
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
          // Don't close - connection is cached and reused
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
    async signIn({ user, account, profile }) {
      // Process for Google and LinkedIn sign-in
      if (account?.provider === "google" || account?.provider === "linkedin") {
        const { email, name, image } = user;

        try {
          const client = await connectToDatabase();
          const db = client.db();

          // Check if user exists in users collection
          let existingUser = await db.collection("users").findOne({ email });

          if (existingUser) {
            user.id = existingUser._id;
            user.firstName = existingUser.firstName;
            user.lastName = existingUser.lastName;
            user.email = existingUser.email;
            user.role = existingUser.role;
            user.profileImage = existingUser.profileImage;

            // Don't close - connection is cached and reused
            return true; // Allow sign-in
          }

          // Check if user exists as recruiter
          const existingRecruiter = await db
            .collection("recruiters")
            .findOne({ email });

          if (existingRecruiter) {
            user.id = existingRecruiter._id;
            user.firstName =
              existingRecruiter.recruiterName || existingRecruiter.companyName;
            user.lastName = "";
            user.email = existingRecruiter.email;
            user.role = "recruiter";
            user.profileImage = existingRecruiter.logo;

            // Don't close - connection is cached and reused
            return true; // Allow sign-in
          }

          // Check if this is a signup flow (coming from register page)
          // We'll detect this by checking the callback URL or creating a flag
          // For now, we'll auto-create the account with default role "jobseeker"
          // You can enhance this by passing role through state

          // Auto-create account for new OAuth users
          const nameParts = (name || email.split("@")[0]).split(" ");
          const firstName = nameParts[0] || "User";
          const lastName = nameParts.slice(1).join(" ") || "";

          const newUser = {
            firstName,
            lastName,
            email,
            role: "jobseeker", // Default role, can be updated later
            profileImage: image || null,
            createdAt: new Date(),
            isVerified: true, // OAuth users are pre-verified
            authProvider: account.provider,
          };

          const result = await db.collection("users").insertOne(newUser);
          const newUserId = result.insertedId;

          // Create corresponding jobseeker profile
          const jobseekerProfile = {
            userId: newUserId,
            email,
            firstName,
            lastName,
            profileImage: image || null,
            contactNumber: "",
            bio: "",
            city: "",
            country: "",
            dob: null,
            gender: "",
            skills: [],
            softSkills: [],
            expertise: [],
            socialMedia: {
              linkedin: "",
              github: "",
              twitter: "",
              facebook: "",
              instagram: "",
              website: "",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await db.collection("jobseekers").insertOne(jobseekerProfile);

          user.id = newUserId;
          user.firstName = firstName;
          user.lastName = lastName;
          user.email = email;
          user.role = "jobseeker";
          user.profileImage = image;

          // Don't close - connection is cached and reused
          return true; // Allow sign-in with new account
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

          const user = await db
            .collection("users")
            .findOne({ email: token.email });

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

          // Don't close - connection is cached and reused
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
