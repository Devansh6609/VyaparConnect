import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure to set this in your .env.local file
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
        session.user.primaryWorkflow = token.primaryWorkflow;
      }
      return session;
    },
    async jwt({ token, user }) {
      // If user object exists, it's the initial sign-in.
      if (user) {
        token.id = user.id;
      } // If token.id is not available, something is wrong, return the token.

      if (!token.id) {
        return token;
      } // On every session access, re-fetch the user data from the DB. // This ensures the session is always fresh, which is crucial for // flows like onboarding where user data changes.

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        include: { settings: true },
      });

      if (!dbUser) {
        // User not found in DB, invalidate the session by returning a modified token
        token.id = undefined as unknown as string; // FIX: Cast 'undefined' to 'string' to satisfy compiler
        return token;
      } // Update the token with the latest data from the database

      return {
        ...token, // preserve original token properties like iat, exp
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        hasCompletedOnboarding: dbUser.hasCompletedOnboarding,
        primaryWorkflow: dbUser.settings?.primaryWorkflow || "HYBRID",
      };
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const getAuthSession = () => getServerSession(authOptions);
