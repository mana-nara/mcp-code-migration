import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MigrateAI - 10x Your Migration to Next.js",
  description: "AI-powered platform that converts React to Next.js with 99.8% accuracy, saving hundreds of development hours",
};

export const viewport: Viewport = {
  themeColor: "#129990",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-mono`}
      >
        {children}
      </body>
    </html>
  );
}
