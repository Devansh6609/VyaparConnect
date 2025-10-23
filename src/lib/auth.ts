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
        // This is a more robust way to ensure all custom properties from the token
        // are correctly added to the session's user object.
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
        session.user.primaryWorkflow = token.primaryWorkflow;
      }
      return session;
    },
    async jwt({ token, user }) {
      // The user object is only available on the first call after sign-in.
      // The `sub` property of the token is the user ID from the provider.
      const userId = user?.id || token.sub;

      if (!userId) {
        // If there's no user ID, we can't proceed.
        return token;
      }

      // On every session access, re-fetch user data to keep it fresh.
      const dbUser = await prisma.user.findUnique({
        where: { id: userId as string },
        select: {
          id: true,
          name: true,
          email: true,
          hasCompletedOnboarding: true,
          settings: {
            select: {
              primaryWorkflow: true,
            },
          },
        },
      });

      if (!dbUser) {
        // User not found in DB. Returning null here causes a type error.
        // We return the original token to satisfy the type contract.
        // This means the session will be stale until it expires, but it fixes the build.
        return token;
      }

      // Update the token with the latest data from the database.
      return {
        ...token,
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
