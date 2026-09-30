"use client";

import { useState } from "react";
import { Package, PackageCheck, Truck, ArrowRight, Search, AlertCircle } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

// Mock tracking data
const sampleTrackingData: Record<string, {
  status: "in-transit" | "delivered" | "delayed" | "processing";
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  pickupDate: string;
  estDelivery: string;
  events: { date: string; location: string; description: string }[];
}> = {
  "FL-2024-7821": {
    status: "in-transit",
    origin: "Chicago, IL",
    destination: "Atlanta, GA",
    cargo: "Steel Coils",
    weight: "42,500 lbs",
    pickupDate: "2024-09-26",
    estDelivery: "2024-09-29",
    events: [
      { date: "2024-09-26 08:14", location: "Chicago, IL", description: "Pickup complete — seal #8742A" },
      { date: "2024-09-26 14:30", location: "Gary, IN", description: "Scale check — 42,500 lbs verified" },
      { date: "2024-09-27 06:45", location: "Indianapolis, IN", description: "In transit — driver rotation" },
      { date: "2024-09-28 02:12", location: "Nashville, TN", description: "Fuel stop — ETA on schedule" },
      { date: "2024-09-28 18:00", location: "Chattanooga, TN", description: "Last check-in before delivery" },
    ],
  },
  "FL-2024-5632": {
    status: "delivered",
    origin: "Dallas, TX",
    destination: "Phoenix, AZ",
    cargo: "Auto Parts",
    weight: "18,200 lbs",
    pickupDate: "2024-09-22",
    estDelivery: "2024-09-24",
    events: [
      { date: "2024-09-22 10:30", location: "Dallas, TX", description: "Pickup complete" },
      { date: "2024-09-22 21:15", location: "Abilene, TX", description: "Cross-dock transfer" },
      { date: "2024-09-23 09:40", location: "El Paso, TX", description: "Border check complete" },
      { date: "2024-09-24 11:22", location: "Phoenix, AZ", description: "DELIVERED — signed by M. Chen" },
    ],
  },
  "FL-2024-3345": {
    status: "delayed",
    origin: "Seattle, WA",
    destination: "Denver, CO",
    cargo: "Industrial Equipment",
    weight: "38,700 lbs",
    pickupDate: "2024-09-25",
    estDelivery: "2024-09-28",
    events: [
      { date: "2024-09-25 07:50", location: "Seattle, WA", description: "Pickup complete" },
      { date: "2024-09-26 13:20", location: "Spokane, WA", description: "Weather delay — I-90 restricted" },
      { date: "2024-09-27 10:00", location: "Spokane, WA", description: "Route re-routed via I-84" },
    ],
  },
};

const statusConfig = {
  "in-transit": { label: "In Transit", color: "text-primary", bg: "bg-primary/10", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-500", bg: "bg-green-500/10", icon: PackageCheck },
  delayed: { label: "Delayed", color: "text-red-500", bg: "bg-red-500/10", icon: AlertCircle },
  processing: { label: "Processing", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Package },
};

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [data, setData] = useState<typeof sampleTrackingData[keyof typeof sampleTrackingData] | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setData(null);

    if (!trackingId.trim()) {
      setError(true);
      return;
    }

    const result = sampleTrackingData[trackingId.trim().toUpperCase()];
    if (result) {
      setData(result);
    } else {
      setError(true);
    }
  };

  // Quick fill with a known ID
  const fillSample = (id: string) => {
    setTrackingId(id);
    setData(sampleTrackingData[id]);
    setError(false);
  };

  const cfg = data ? statusConfig[data.status] : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#3a3530]/30 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-16 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / Shipment Tracking
              </span>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Track Your Freight
              </h1>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Enter your Freightline tracking number to see real-time shipment status and events.
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mx-auto max-w-xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={trackingId}
                    onChange={(e) => { setTrackingId(e.target.value); setError(false); }}
                    placeholder="e.g. FL-2024-7821"
                    className="w-full rounded-sm border border-[#3a3530] bg-[#1a1a1a] py-4 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-accent"
                >
                  Track
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-500">
                  No shipment found for that tracking number. Try one of the demo IDs below.
                </p>
              )}
            </form>

            {/* Demo quick links */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {Object.keys(sampleTrackingData).map((id) => (
                <button
                  key={id}
                  onClick={() => fillSample(id)}
                  className="rounded-sm border border-[#3a3530]/30 px-3 py-1.5 text-xs font-mono text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {id}
                </button>
              ))}
              <span className="text-xs text-muted-foreground self-center">
                (demo tracking IDs)
              </span>
            </div>

            {/* Results */}
            {data && cfg && (
              <div className="mt-12 space-y-8">
                {/* Status banner */}
                <div className={`flex items-center gap-4 rounded-sm border ${cfg.bg} border-[#3a3530]/30 p-6`}>
                  <cfg.icon className={`h-8 w-8 ${cfg.color}`} />
                  <div>
                    <p className={`font-mono text-sm uppercase tracking-wider ${cfg.color}`}>
                      {cfg.label}
                    </p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {data.origin} <ArrowRight className="mx-2 inline h-4 w-4 text-muted-foreground" /> {data.destination}
                    </p>
                  </div>
                </div>

                {/* Shipment info grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Cargo", value: data.cargo },
                    { label: "Weight", value: data.weight },
                    { label: "Pickup", value: data.pickupDate },
                    { label: "Est. Delivery", value: data.estDelivery },
                  ].map((item) => (
                    <div key={item.label} className="rounded-sm border border-[#3a3530]/30 bg-[#1a1a1a] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Tracking Events
                  </p>
                  <div className="space-y-0">
                    {data.events.map((event, i) => (
                      <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* Connector line */}
                        {i < data.events.length - 1 && (
                          <div className="absolute left-[7px] top-3.5 h-full w-px bg-[#3a3530]/50" />
                        )}
                        {/* Dot */}
                        <div className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                          i === data.events.length - 1
                            ? "border-primary bg-primary/20"
                            : "border-[#3a3530] bg-[#1a1a1a]"
                        }`} />
                        <div className="flex-1">
                          <p className="font-mono text-xs text-muted-foreground">{event.date}</p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">{event.location}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}