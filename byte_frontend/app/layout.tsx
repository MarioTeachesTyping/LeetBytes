import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { PIXEL_FONT_OFF_CLASS, PIXEL_FONT_STORAGE_KEY } from "@/lib/pixelFont";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved "Pixel Font: Off" choice before first paint, so the
            regular font doesn't flash to pixel font then swap back. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem(${JSON.stringify(
              PIXEL_FONT_STORAGE_KEY
            )})==='off')document.documentElement.classList.add(${JSON.stringify(
              PIXEL_FONT_OFF_CLASS
            )});}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${minecraftFont.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
