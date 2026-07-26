import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const minecraftFont = localFont({
  src: "../public/fonts/Minecraft.ttf",
  variable: "--font-minecraft",
});

export const metadata: Metadata = {
  title: "LeetBytes",
  description: "My LeetCode solutions.",
  icons: {
    icon: "/base/icon-dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en">
      <body
        className={`${minecraftFont.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
