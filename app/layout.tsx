import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catalog Page - Take Home Exercise",
  description: "A catalog page built with Next.js and Chakra UI for a take-home exercise. Alex Denyshchyk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
