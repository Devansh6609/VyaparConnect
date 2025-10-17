import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Manually define the enum type to avoid module resolution issues in a .d.ts file
type WorkflowType = "QUOTATION_FOCUSED" | "ORDER_FOCUSED" | "HYBRID";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      hasCompletedOnboarding: boolean;
      primaryWorkflow: WorkflowType;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    hasCompletedOnboarding: boolean;
    primaryWorkflow: WorkflowType;
  }
}
