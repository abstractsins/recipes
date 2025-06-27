import type { Metadata } from "next";
import "./css/globals.css";
import "./css/inputs.css";
import "./css/react-select.css";

import {
  Geist,
  Geist_Mono,
  Parkinsans,
  Alatsi
} from "next/font/google";

const parkinsans = Parkinsans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-parkinsans',
});

const alatsi = Alatsi({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-alatsi',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipes",
  description: "Recipe database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`
        ${parkinsans.variable} 
        ${geistSans.variable} 
        ${geistMono.variable}
        ${alatsi}
      `}>
        {children}
      </body>
    </html>
  );
}
