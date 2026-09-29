"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="industrial-grid relative min-h-[90vh] flex items-center overflow-hidden border-b border-[#3a3530]/30">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#1a1510] to-[#121212]" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 sm:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
              B2B Freight Network
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Freight That
            <br />
            <span className="glow-orange-text text-primary">Moves Industry</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            End-to-end industrial logistics across North America. Freightline
            connects manufacturers, distributors, and suppliers with a network
            that delivers — on time, every time.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#quote"
              className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-8 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-accent glow-orange"
            >
              Get a Quote
            </Link>
            <Link
              href="/tracking"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-[#3a3530] px-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
            >
              Track Shipment
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-[#3a3530]/30 pt-8">
            {[
              { value: "2,400+", label: "Lanes Covered" },
              { value: "99.3%", label: "On-Time Rate" },
              { value: "850+", label: "Fleet Assets" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-2xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="scanline absolute inset-0 pointer-events-none" />
    </section>
  );
}