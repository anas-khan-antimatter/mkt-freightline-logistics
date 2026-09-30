"use client";

import { useState, useEffect } from "react";
import { Package, PackageCheck, Truck, ArrowRight, Search, AlertCircle, MapPin } from "lucide-react";
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
  const [animPhase, setAnimPhase] = useState(0); // 0=hidden, 1=card, 2=all-events

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(false);
    setData(null);
    setAnimPhase(0);

    const id = trackingId.trim().toUpperCase() || "";
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
        // Staggered animation: card first, then events after
        setTimeout(() => setAnimPhase(1), 200);
        setTimeout(() => setAnimPhase(2), 500);
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
    setTimeout(() => {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }, 100);
  };

  const cfg = data ? statusConfig[data.status] : null;

  // Compute progress percentage for status rail
  const progressPct = data?.events
    ? Math.min(100, Math.round((data.events.length / Math.max(data.events.length + 1, 5)) * 100))
    : 0;

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

            {/* Loading indicator */}
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
                {/* ── 1. Status banner (fade-in phase 1) ── */}
                <div
                  className={`corner-stencil industrial-border flex items-center gap-4 border p-6 transition-all duration-500 ${
                    animPhase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    data.status === "delayed" ? "border-destructive text-destructive" :
                    data.status === "delivered" ? "border-primary text-primary" :
                    "border-primary text-primary"
                  }`}>
                    {data.status === "delivered" ? (
                      <PackageCheck className="h-6 w-6" />
                    ) : data.status === "delayed" ? (
                      <AlertCircle className="h-6 w-6" />
                    ) : (
                      <Truck className="h-6 w-6" />
                    )}
                  </span>
                  <div>
                    <p className={`font-mono text-sm uppercase tracking-wider ${cfg.color} flex items-center gap-2`}>
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                        data.status === "delivered" ? "bg-primary" :
                        data.status === "delayed" ? "bg-destructive" :
                        "bg-primary pulse-dot"
                      }`} />
                      {cfg.label}
                    </p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {data.origin} <span className="text-muted-foreground mx-2">→</span> {data.destination}
                    </p>
                  </div>
                </div>

                {/* ── 2. Progress status rail (phase 1) ── */}
                <div className={`transition-all duration-500 ${
                  animPhase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                  {/* Journey progress bar */}
                  <div className="relative h-2 rounded-sm bg-[#2a2a2a] overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-sm bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px]">
                    <span className="stencil-label">{data.origin}</span>
                    <span className="stencil-label">{data.destination}</span>
                  </div>
                </div>

                {/* ── 3. Shipment info grid (phase 1) ── */}
                <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 transition-all duration-500 ${
                  animPhase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
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

                {/* ── 4. AI insight badge (phase 1) ── */}
                {data.insight && (
                  <div className={`flex items-start gap-3 rounded-sm border border-primary/20 bg-primary/5 p-4 transition-all duration-500 ${
                    animPhase >= 1 ? "opacity-100" : "opacity-0"
                  }`}>
                    <span className="text-sm text-primary">📋</span>
                    <p className="text-sm text-foreground">{data.insight}</p>
                  </div>
                )}

                {/* ── 5. Animated timeline (phase 2) ── */}
                <div className={`transition-all duration-700 ${
                  animPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}>
                  <div className="mb-4 flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Tracking Events
                    </span>
                    <span className="stencil-label">{data.events.length} event{data.events.length !== 1 ? "s" : ""}</span>
                  </div>

                  <div className="timeline-rail space-y-0">
                    {data.events.map((event: any, i: number) => {
                      const isLast = i === data.events.length - 1;
                      const isFirst = i === 0;
                      const delay = i * 120; // staggered animation entrance
                      return (
                        <div
                          key={i}
                          className="relative flex gap-5 pb-6 last:pb-0 transition-all duration-500"
                          style={{
                            opacity: animPhase >= 2 ? 1 : 0,
                            transform: animPhase >= 2 ? "translateY(0)" : "translateY(8px)",
                            transitionDelay: `${delay}ms`,
                          }}
                        >
                          {/* Connector dot */}
                          <div className={`relative mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                            isLast
                              ? "border-2 border-primary bg-primary/20 shadow-[0_0_8px_rgba(245,200,66,0.25)]"
                              : "border border-[#2a2a2a] bg-[#1c1c1c]"
                          }`}>
                            <span className={`inline-block h-2 w-2 rounded-full transition-all duration-300 ${
                              isLast ? "bg-primary pulse-dot" : "bg-[#404040]"
                            }`} />
                          </div>

                          {/* Event content */}
                          <div className="flex-1 rounded-sm border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] p-3">
                            <div className="flex items-baseline gap-3">
                              <span className="font-mono text-[11px] text-muted-foreground">{event.date}</span>
                              <span className="stencil-label">{event.location}</span>
                              {isFirst && <span className="stencil-label">PICKUP</span>}
                              {isLast && data.status === "delivered" && <span className="stencil-label">DELIVERED</span>}
                            </div>
                            <p className="mt-1 text-sm text-foreground">{event.description}</p>
                            {isLast && data.status !== "delivered" && (
                              <p className="mt-1.5 text-[10px] text-primary">
                                ▲ Next update expected within 4 hours
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── 6. Route summary ── */}
                <div className={`border-t border-[#2a2a2a]/30 pt-6 transition-all duration-700 ${
                  animPhase >= 2 ? "opacity-100" : "opacity-0"
                }`}>
                  <div className="flex flex-wrap gap-2">
                    <span className="stencil-label">Origin: {data.origin}</span>
                    <span className="stencil-label">Dest: {data.destination}</span>
                    <span className="stencil-label">Stops: {data.events.length}</span>
                    <span className="stencil-label">Status: {cfg.label}</span>
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