export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - api/webhooks (Webhook routes, which need to be public)
     * - login (the login page)
     * - signup (the signup page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|api/webhooks|login|signup|_next/static|_next/image|favicon.ico).*)",
  ],
};
