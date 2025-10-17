// FIX: Changed to a type-only import for 'Metadata' to resolve module resolution errors.
import { type Metadata } from "next";
// FIX: Replace non-Google fonts (Geist, Geist_Mono) with available Google Fonts.
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { Providers } from "@/components/providers";

// FIX: Replaced Geist with Inter
const interSans = Inter({
  variable: "--font-inter-sans", // Updated variable name
  subsets: ["latin"],
});

// FIX: Replaced Geist_Mono with Roboto_Mono
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono", // Updated variable name
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VyaparConnect CRM",
  description: "A CRM application for managing WhatsApp Business conversations, products, and sales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // FIX: Use the new font variable names
        className={`${interSans.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}