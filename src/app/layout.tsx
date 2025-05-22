import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Metadata with domain verification meta tag and custom icon
export const metadata: Metadata = {
  title: "Lirivelle - Sweet Digital Space",
  description: "Your digital sanctuary for whispers, blogs, heart talks, and more.",
  icons: {
    icon: "/kelly.svg",
  },
  other: {
    "fd166196214ba457d7cf19a285392a5ad11795b0": "fd166196214ba457d7cf19a285392a5ad11795b0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
