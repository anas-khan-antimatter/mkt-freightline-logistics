"use client";

import { useState, useEffect } from "react";
import { Scale, Ruler, DollarSign, ArrowRight, Calculator, RotateCcw, Clock } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const commodityClasses = [
  { class: "50", label: "Steel / Iron", multiplier: 0.8 },
  { class: "55", label: "Bricks / Cement", multiplier: 0.85 },
  { class: "60", label: "Auto Parts", multiplier: 0.95 },
  { class: "65", label: "Beverages", multiplier: 1.0 },
  { class: "70", label: "Furniture", multiplier: 1.1 },
  { class: "77.5", label: "Electronics", multiplier: 1.25 },
  { class: "85", label: "Machinery", multiplier: 1.4 },
  { class: "92.5", label: "Hazmat", multiplier: 1.7 },
  { class: "100", label: "Perishables", multiplier: 1.9 },
];

const urgencyOptions = [
  { value: "standard", label: "Standard", mult: 1.0, eta: "3-5 days" },
  { value: "expedited", label: "Expedited", mult: 1.35, eta: "2-3 days" },
  { value: "next-day", label: "Next Day", mult: 1.5, eta: "1 day" },
  { value: "same-day", label: "Same Day", mult: 1.8, eta: "Same day" },
];

export default function QuotePage() {
  const [weight, setWeight] = useState<number>(5000);
  const [distance, setDistance] = useState<number>(400);
  const [commodity, setCommodity] = useState<string>("65");
  const [palletCount, setPalletCount] = useState<number>(4);
  const [urgency, setUrgency] = useState<string>("standard");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const selectedCommodity = commodityClasses.find((c) => c.class === commodity);
  const selectedUrgency = urgencyOptions.find((u) => u.value === urgency);

  // Live client-side estimate (instant feedback)
  const liveEstimate = (() => {
    const base = 1.45;
    let wm = 1;
    if (weight <= 500) wm = 0.6;
    else if (weight <= 2000) wm = 0.8;
    else if (weight <= 5000) wm = 1.0;
    else if (weight <= 10000) wm = 1.3;
    else if (weight <= 20000) wm = 1.7;
    else wm = 2.2;
    const dm = distance < 100 ? 1.5 : distance < 300 ? 1.2 : distance < 800 ? 1.0 : 0.85;
    const cm = selectedCommodity?.multiplier ?? 1;
    const um = selectedUrgency?.mult ?? 1;
    const lh = base * distance * wm * dm * cm * um;
    const fs = distance * 0.35;
    const pf = palletCount * 12.5;
    return Math.max(150, Math.round((lh + fs + pf) * 100) / 100);
  })();

  // Fetch server-side quote from /api/quote
  const fetchApiQuote = async () => {
    setApiLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight,
          distance,
          commodityClass: commodity,
          palletCount,
          urgency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApiResult(data);
      }
    } catch {
      // Fallback: use client-side estimate
      setApiResult({
        lineHaul: liveEstimate - distance * 0.35 - palletCount * 12.5,
        fuelSurcharge: distance * 0.35,
        palletFee: palletCount * 12.5,
        total: liveEstimate,
        perMile: distance > 0 ? liveEstimate / distance : 0,
        breakdown: {
          "Line Haul": liveEstimate - distance * 0.35 - palletCount * 12.5,
          "Fuel Surcharge": distance * 0.35,
          "Pallet Fee": palletCount * 12.5,
        },
      });
    } finally {
      setApiLoading(false);
    }
  };

  // Fetch on load and when params change (debounced)
  useEffect(() => {
    const timer = setTimeout(fetchApiQuote, 600);
    return () => clearTimeout(timer);
  }, [weight, distance, commodity, palletCount, urgency]);

  const handleReset = () => {
    setWeight(5000);
    setDistance(400);
    setCommodity("65");
    setPalletCount(4);
    setUrgency("standard");
    setShowBreakdown(false);
  };

  const result = apiResult || {
    total: liveEstimate,
    lineHaul: liveEstimate - distance * 0.35 - palletCount * 12.5,
    fuelSurcharge: distance * 0.35,
    palletFee: palletCount * 12.5,
    perMile: distance > 0 ? liveEstimate / distance : 0,
    discountLabel: null,
    discountAmount: 0,
    breakdown: {
      "Line Haul": liveEstimate - distance * 0.35 - palletCount * 12.5,
      "Fuel Surcharge": distance * 0.35,
      "Pallet Fee": palletCount * 12.5,
    },
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#2a2a2a]/30 bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a] py-20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="mb-12 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / LTL Rate Estimator
              </span>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Estimate Your Freight Rate
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Adjust weight, distance, cargo class, and urgency for an instant LTL rate estimate.
                Powered by the <span className="font-mono text-primary">/api/quote</span> engine.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="grid gap-8 lg:grid-cols-5">
                {/* ── Controls ── */}
                <div className="space-y-5 lg:col-span-3">
                  {/* Weight */}
                  <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" />
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Weight
                        </span>
                      </div>
                      <span className="font-mono text-lg font-bold text-primary">
                        {weight.toLocaleString()} <span className="text-xs text-muted-foreground">lbs</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={45000}
                      step={100}
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="mt-3 w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>100 lbs</span>
                      <span>45,000 lbs</span>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Distance
                        </span>
                      </div>
                      <span className="font-mono text-lg font-bold text-primary">
                        {distance.toLocaleString()} <span className="text-xs text-muted-foreground">mi</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={3000}
                      step={25}
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="mt-3 w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>25 mi</span>
                      <span>3,000 mi</span>
                    </div>
                  </div>

                  {/* Commodity Class */}
                  <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Commodity Class
                      </span>
                    </div>
                    <select
                      value={commodity}
                      onChange={(e) => setCommodity(e.target.value)}
                      className="mt-2 w-full rounded-sm border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      {commodityClasses.map((c) => (
                        <option key={c.class} value={c.class}>
                          Class {c.class} — {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pallets */}
                  <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-primary" />
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Pallets
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPalletCount(Math.max(1, palletCount - 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2a2a2a] text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          −
                        </button>
                        <span className="font-mono w-6 text-center text-lg font-bold text-primary">
                          {palletCount}
                        </span>
                        <button
                          onClick={() => setPalletCount(Math.min(30, palletCount + 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2a2a2a] text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Urgency */}
                  <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Urgency
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {urgencyOptions.map((u) => (
                        <button
                          key={u.value}
                          onClick={() => setUrgency(u.value)}
                          className={`rounded-sm border px-3 py-1.5 text-xs font-mono transition-colors ${
                            urgency === u.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-[#2a2a2a] bg-transparent text-muted-foreground hover:border-primary/30 hover:text-primary"
                          }`}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                    {selectedUrgency && (
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Est. transit: <span className="font-semibold text-primary">{selectedUrgency.eta}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset to defaults
                  </button>
                </div>

                {/* ── Rate Card ── */}
                <div className="lg:col-span-2">
                  <div className="sticky top-28 rounded-sm border border-primary/20 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6">
                    {/* Loading indicator */}
                    {apiLoading && (
                      <div className="mb-3 text-center">
                        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-block h-2 w-2 rounded-full bg-primary pulse-dot" />
                          Recalculating…
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Estimated LTL Rate
                      </span>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-primary">
                          ${result.total.toFixed(0)}
                        </span>
                        <span className="ml-1 text-sm text-muted-foreground">USD</span>
                      </div>
                      {distance > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          ~${result.perMile.toFixed(2)} / mile
                        </p>
                      )}
                    </div>

                    {result.discountLabel && (
                      <div className="mt-3 rounded-sm border border-primary/20 bg-primary/5 px-3 py-2">
                        <p className="text-xs font-mono text-primary">{result.discountLabel}</p>
                        <p className="text-xs text-muted-foreground">−${result.discountAmount.toFixed(2)}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="mt-4 w-full rounded-sm border border-[#2a2a2a]/50 px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {showBreakdown ? "Hide" : "Show"} Breakdown
                    </button>

                    {showBreakdown && (
                      <div className="mt-4 space-y-2 border-t border-[#2a2a2a]/30 pt-4">
                        {Object.entries(result.breakdown || {}).map(([key, val]: [string, unknown]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{key}</span>
                            <span className={`font-mono ${Number(val) < 0 ? "text-primary" : "text-foreground"}`}>
                              {Number(val) < 0 ? `−${Math.abs(Number(val)).toFixed(2)}` : `${Number(val).toFixed(2)}`}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between border-t border-primary/30 pt-2 text-xs font-bold">
                          <span className="text-primary">Total</span>
                          <span className="font-mono text-primary">${result.total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {/* Ship this freight CTA */}
                    <button className="mt-5 w-full cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-accent">
                      <span className="flex items-center justify-center gap-2">
                        Ship This Freight
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>

                    <p className="mt-2 text-center text-[10px] text-muted-foreground">
                      Final rate confirmed by Freightline specialist
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}