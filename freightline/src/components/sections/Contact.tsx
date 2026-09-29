"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="contact" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-xl rounded-sm border border-primary/30 bg-primary/5 p-12 text-center">
            <Mail className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Message Sent</h3>
            <p className="mt-3 text-muted-foreground">
              A Freightline team member will reach out within 1 business day.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative border-b border-[#3a3530]/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            / Contact
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Get in Touch
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact info */}
          <div className="space-y-6 lg:col-span-2">
            {[
              { icon: Phone, label: "Phone", value: "+1 (888) 555-FLOW" },
              { icon: Mail, label: "Email", value: "solutions@freightline.com" },
              { icon: MapPin, label: "HQ", value: "1200 Industrial Dr, Suite 400\nChicago, IL 60607" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#3a3530]/50 bg-[#1a1a1a]">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 whitespace-pre-line text-sm text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Full Name"
                className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </div>
            <input
              placeholder="Company Name"
              className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
            <select className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Inquiry Type</option>
              <option>New Shipper Onboarding</option>
              <option>Existing Account Support</option>
              <option>Partnership / Carrier Interest</option>
              <option>General Inquiry</option>
            </select>
            <textarea
              required
              rows={4}
              placeholder="Tell us about your logistics needs..."
              className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-sm bg-primary px-8 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-accent glow-orange"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}