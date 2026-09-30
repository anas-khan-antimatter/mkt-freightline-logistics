"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { label: "FTL", href: "#capabilities" },
        { label: "Intermodal", href: "#capabilities" },
        { label: "Warehousing", href: "#capabilities" },
        { label: "Hazmat", href: "#capabilities" },
        { label: "Expedited", href: "#capabilities" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Case Studies", href: "#case-studies" },
        { label: "Careers", href: "#" },
        { label: "News", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Track Shipment", href: "/tracking" },
        { label: "Get a Quote", href: "#quote" },
        { label: "Lane Map", href: "#lane-map" },
        { label: "Support", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#3a3530]/30 bg-[#0f0f0f]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
                <span className="text-sm font-bold text-primary-foreground">FL</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                FREIGHTLINE
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Industrial logistics for North America&apos;s supply chain. Moving what matters,
              from raw materials to finished goods.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="mb-4 font-mono text-xs uppercase tracking-wider text-primary">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#3a3530]/30 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Freightline Logistics Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">CCPA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}