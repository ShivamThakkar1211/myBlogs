import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        try {
          console.log("Received Credentials:", credentials);

          const user = await User.findOne({
            $or: [
              { email: { $regex: new RegExp(`^${credentials.identifier}$`, "i") } },
              { username: { $regex: new RegExp(`^${credentials.identifier}$`, "i") } }
            ]
          });

          if (!user) {
            console.log("No user found for:", credentials.identifier);
            throw new Error("No user found");
          }

          console.log("User found:", user);
          console.log("User isVerified:", user.isVerified);

          if (!user.isVerified) {
            throw new Error("User not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("Password incorrect");
          }

          return user;
        } catch (error) {
          console.error("Auth Error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
