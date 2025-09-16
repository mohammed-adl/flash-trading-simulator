import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "Stock simulator with real-time market data",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
