import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

import "./globals.css";
import { cn } from "@/lib/utils";
// import { ThemeProvider } from "@/providers/theme-provider";

import { poppins } from "./fonts";

export const metadata: Metadata = {
  title: "DNA Learning Center Nigeria",
  metadataBase: new URL("http://localhost:3000"),
  keywords: ["DNA Learning Center Nigeria"],
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Smartob Technologies" }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "DNA Learning Center Nigeria",
    siteName: "DNA Learning Center Nigeria",
    images: {
      url: "/images/og.jpg",
      width: 1200,
      height: 630,
      alt: "Opengraph image",
    },
    locale: "en_US",
    type: "website",
  },
  description:
    "DNA Learning Center Nigeria is an online medical laboratory system",
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(poppins.variable, "font-poppins antialiased")}>
        <NextTopLoader color="blue" showSpinner={false} />

        <Toaster />
        <main className="relative size-full">{children}</main>
      </body>
    </html>
  );
}
