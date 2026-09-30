"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const cargoTypes = [
  "Full Truckload (FTL)",
  "Less-than-Truckload (LTL)",
  "Intermodal Rail",
  "Expedited",
  "Hazmat",
  "Temperature Controlled",
  "Over-Dimensional",
  "Other",
];

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="quote" className="relative border-b border-[#3a3530]/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-xl rounded-sm border border-primary/30 bg-primary/5 p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Quote Request Received</h3>
            <p className="mt-3 text-muted-foreground">
              A Freightline logistics specialist will respond within 2 hours with your
              custom rate and capacity availability. Reference #FL-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="relative border-b border-[#3a3530]/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            / Get a Quote
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Request a Rate
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Submit your shipment details and our team will deliver a competitive
            rate within 2 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Contact Information</label>
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  required
                  placeholder="Full Name"
                  className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
                <input
                  required
                  placeholder="Phone"
                  className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Cargo details */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Cargo Details</label>
              <div className="grid gap-4 sm:grid-cols-4">
                <select className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">Cargo Type</option>
                  {cargoTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  required
                  type="number"
                  placeholder="Weight (lbs)"
                  className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Pallets"
                  className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Est. Value ($)"
                  className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Origin</label>
              <input
                required
                placeholder="City, State"
                className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Destination</label>
              <input
                required
                placeholder="City, State"
                className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Pickup window */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Earliest Pickup</label>
              <input
                required
                type="date"
                className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Latest Delivery</label>
              <input
                required
                type="date"
                className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Special Requirements</label>
              <textarea
                rows={3}
                placeholder="Hazmat class, dock height restrictions, liftgate, appointment scheduling..."
                className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-sm bg-primary px-8 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-accent glow-orange"
          >
            <Send className="h-4 w-4" />
            Submit Quote Request
          </button>
        </form>
      </div>
    </section>
  );
}