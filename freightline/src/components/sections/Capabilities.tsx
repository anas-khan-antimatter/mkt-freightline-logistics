"use client";

import { Truck, Container, Warehouse, Route, Shield, Clock } from "lucide-react";

const capabilities = [
  {
    icon: Truck,
    title: "Full Truckload (FTL)",
    description:
      "Dedicated trailers for high-volume freight. Direct-door service with实时 visibility and guaranteed capacity across all major North American corridors.",
  },
  {
    icon: Container,
    title: "Intermodal Rail",
    description:
      "Cost-efficient long-hail shipping combining rail backbone with last-mile truck delivery. 30-40% reduction over pure over-the-road transit.",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Distribution",
    description:
      "Over 2M sq ft of industrial warehouse space across 14 strategic hubs. Cross-docking, inventory management, and just-in-time distribution.",
  },
  {
    icon: Route,
    title: "LTL Consolidation",
    description:
      "Optimized less-than-truckload consolidation for partial loads. Network optimization reduces transit times by up to 25% vs traditional LTL carriers.",
  },
  {
    icon: Shield,
    title: "Hazmat & Specialized",
    description:
      "Fully certified hazmat handling with Class 1-9 capabilities. Temperature-controlled, over-dimensional, and sensitive equipment transport.",
  },
  {
    icon: Clock,
    title: "Expedited Services",
    description:
      "Time-critical shipping with guaranteed delivery windows. Dedicated teams for hot loads, emergency restocks, and production-line-saving deliveries.",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative border-b border-[#3a3530]/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            / Capabilities
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            What We Move
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            From raw materials to finished goods, our network handles every class of
            freight with industry-specific infrastructure and compliance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-px overflow-hidden rounded-sm border border-[#3a3530]/30 bg-[#3a3530]/30 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group relative bg-[#121212] p-8 transition-colors hover:bg-[#1a1714]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-[#3a3530]/50 bg-[#1a1a1a]">
                <cap.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{cap.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}