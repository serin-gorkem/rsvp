import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Manrope,
} from "next/font/google";

import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Birinci Yılımız",
  description:
    "Birlikte geçirdiğimiz ilk yılı kutlamak için sizi de aramızda görmek istiyoruz.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="tr">
      <body
        className={`${displayFont.variable} ${bodyFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}