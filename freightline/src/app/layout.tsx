import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freightline | Industrial Logistics — B2B Freight Solutions",
  description:
    "Freightline delivers end-to-end B2B freight logistics across North America. Capabilities, lane coverage, quote requests, and real-time tracking for industrial shipping.",
  keywords: [
    "freight",
    "logistics",
    "B2B shipping",
    "freightline",
    "industrial logistics",
    "supply chain",
  ],
  openGraph: {
    title: "Freightline | Industrial Logistics",
    description:
      "End-to-end B2B freight logistics across North America. Get a quote, track shipments, and explore our capabilities.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}