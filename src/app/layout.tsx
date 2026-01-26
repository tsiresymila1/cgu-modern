import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // [MODIFIED]
import "./globals.css";

const outfit = Outfit({ // [MODIFIED]
  variable: "--font-outfit", // [MODIFIED]
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legal & Privacy Platform", // [MODIFIED]
  description: "Unified terms and privacy policy platform",
};

import NextTopLoader from 'nextjs-toploader';

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`} // [MODIFIED]
      >
        <NextTopLoader 
          color="#3ecf8e"
          height={2}
          showSpinner={false}
          shadow="0 0 10px #3ecf8e,0 0 5px #3ecf8e"
        />
        {children}
        <Toaster closeButton position="top-right" richColors />
      </body>
    </html>
  );
}
