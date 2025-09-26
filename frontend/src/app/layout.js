import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

import Providers from "./Providers";
import SplashWrapper from "@/components/SplashWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Flash",
  description:
    "Step into the stock market with Flash: real-time trading, watchlists, and portfolio tracking, all risk-free.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Flash",
    description:
      "Step into the stock market with Flash: real-time trading, watchlists, and portfolio tracking, all risk-free.",
    url: "https:/flash-sim.vercel.app",
    siteName: "Flash",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Flash",
    description:
      "Step into the stock market with Flash: real-time trading, watchlists, and portfolio tracking, all risk-free.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full overflow-hidden max-md:h-auto max-md:overflow-auto"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full max-md:h-auto max-md:overflow-auto`}
      >
        <SplashWrapper>
          <Providers>{children}</Providers>
        </SplashWrapper>
      </body>
    </html>
  );
}
