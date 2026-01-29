import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Giphy Explorer - Discover & Share GIFs",
  description: "Explore millions of GIFs with Giphy Explorer. Search, discover, and share your favorite GIFs easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://media.giphy.com" />
        <link rel="preconnect" href="https://media0.giphy.com" />
        <link rel="preconnect" href="https://media1.giphy.com" />
        <link rel="preconnect" href="https://media2.giphy.com" />
        <link rel="preconnect" href="https://media3.giphy.com" />
        <link rel="preconnect" href="https://media4.giphy.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
