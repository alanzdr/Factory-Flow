import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "@/styles/index.css";

import Contexts from "@/contexts";
import { cn } from "@/lib/utils";

import Header from "@/layouts/Header";

const fontSans = Exo_2({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Factory Flow",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Contexts>
          <Header />
          {children}
        </Contexts>
      </body>
    </html>
  );
}
