// src/middleware.ts

export { default } from "next-auth/middleware";

export const config = {
  // Corrected matcher to exclude public pages from NextAuth middleware
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api/auth, /api/webhooks, /_next, /favicon.ico
     * And the following exact public routes:
     * - /login, /signup, /privacy-policy
     * * NOTE: Next.js matchers are applied to the URL path *only*.
     * The regex below ensures the paths are excluded from authentication.
     */
    "/((?!api/auth|_next|favicon.ico|login|signup|privacy-policy|api/webhooks).*)",
  ],
};
