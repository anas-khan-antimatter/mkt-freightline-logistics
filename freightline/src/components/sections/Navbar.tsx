"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Tracking", href: "/tracking" },
  { label: "Lanes", href: "/lanes" },
  { label: "Quote", href: "/quote" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#3a3530]/50 bg-[#121212]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
            <span className="text-sm font-bold text-primary-foreground">FL</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            FREIGHTLINE
          </span>
          <span className="hidden text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground sm:inline-block">
            Industrial Logistics
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="rounded-sm border border-primary/40 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Contact
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-muted-foreground hover:text-primary md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[#3a3530]/50 bg-[#121212] px-6 pb-6 pt-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-[#3a3530]/30 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}