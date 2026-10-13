import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mwangaza | Scholarship opportunities for your next chapter",
  description:
    "Explore scholarship opportunities, check eligibility, and apply online. Your next chapter starts here.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, inter.variable)}
    >
      <body className="min-h-full bg-[#faf9f6] font-sans text-[#20291f]">{children}</body>
    </html>
  );
}
