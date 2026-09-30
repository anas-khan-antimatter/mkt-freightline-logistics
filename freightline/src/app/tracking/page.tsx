"use client";

import { useState } from "react";
import { Package, PackageCheck, Truck, ArrowRight, Search, AlertCircle } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const statusConfig: Record<string, { label: string; color: string }> = {
  "in-transit": { label: "In Transit", color: "text-primary" },
  delivered: { label: "Delivered", color: "text-green-500" },
  delayed: { label: "Delayed", color: "text-destructive" },
  processing: { label: "Processing", color: "text-muted-foreground" },
};

const sampleIds = ["FL-2024-7821", "FL-2024-5632", "FL-2024-3345"];

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(false);
    setData(null);

    const id = trackingId.trim().toUpperCase() || (e ? "" : "");
    if (!id) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(id)}`);
      const result = await res.json();
      if (result.found) {
        setData(result);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fillSample = (id: string) => {
    setTrackingId(id);
    // auto-search after brief render
    setTimeout(() => {
      const ev = { preventDefault: () => {} } as React.FormEvent;
      handleSearch(ev);
    }, 100);
  };

  const cfg = data ? statusConfig[data.status] : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#2a2a2a]/30 py-24">
          <div className="mx-auto max-w-4xl px-6">
            {/* Section header */}
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

            {/* Search form */}
            <form onSubmit={handleSearch} className="mx-auto max-w-xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={trackingId}
                    onChange={(e) => { setTrackingId(e.target.value); setError(false); }}
                    placeholder="e.g. FL-2024-7821"
                    className="w-full rounded-sm border border-[#2a2a2a] bg-[#1c1c1c] py-4 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
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
                <p className="mt-3 text-sm text-destructive">
                  No shipment found for that tracking number. Try a demo ID below.
                </p>
              )}
            </form>

            {/* Quick links */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {sampleIds.map((id) => (
                <button
                  key={id}
                  onClick={() => fillSample(id)}
                  className="rounded-sm border border-[#2a2a2a]/30 px-3 py-1.5 text-xs font-mono text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {id}
                </button>
              ))}
              <span className="text-xs text-muted-foreground self-center">(demo IDs)</span>
            </div>

            {/* Loading */}
            {loading && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-primary pulse-dot" />
                  <span className="text-sm text-muted-foreground">Querying network…</span>
                </div>
              </div>
            )}

            {/* Results */}
            {data && cfg && !loading && (
              <div className="mt-12 space-y-8">
                {/* Status banner */}
                <div className={`corner-stencil industrial-border flex items-center gap-4 border p-6`}>
                  <span className={`inline-block h-8 w-8 ${data.status === "delayed" ? "text-destructive" : "text-primary"}`}>
                    {data.status === "delivered" ? "✓" : data.status === "delayed" ? "⚠" : "▶"}
                  </span>
                  <div>
                    <p className={`font-mono text-sm uppercase tracking-wider ${cfg.color}`}>
                      {cfg.label}
                    </p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {data.origin} <span className="text-muted-foreground mx-2">→</span> {data.destination}
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
                    <div key={item.label} className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI insight badge */}
                {data.insight && (
                  <div className="flex items-start gap-3 rounded-sm border border-primary/20 bg-primary/5 p-4">
                    <span className="text-sm text-primary">📋</span>
                    <p className="text-sm text-foreground">{data.insight}</p>
                  </div>
                )}

                {/* Animated timeline */}
                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Tracking Events
                  </p>
                  <div className="timeline-rail space-y-0">
                    {data.events.map((event: any, i: number) => (
                      <div key={i} className="relative flex gap-5 pb-6 last:pb-0">
                        {/* Dot */}
                        <div className={`relative mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          i === data.events.length - 1
                            ? "border-2 border-primary"
                            : "border border-[#2a2a2a]"
                        } ${i === data.events.length - 1 ? "bg-primary/20" : "bg-[#1c1c1c]"}`}>
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                            i === data.events.length - 1 ? "bg-primary pulse-dot" : "bg-[#404040]"
                          }`} />
                        </div>
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-[11px] text-muted-foreground">{event.date}</span>
                            <span className="stencil-label">{event.location}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-foreground">{event.description}</p>
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