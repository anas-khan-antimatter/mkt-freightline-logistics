"use client";

import { useState } from "react";
import { Scale, Ruler, DollarSign, ArrowRight, Calculator, RotateCcw } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

// Rate bands based on weight & distance
function estimateRate(weight: number, distance: number): number {
  const baseRate = 1.45; // $/mile base
  let weightMultiplier = 1;
  if (weight <= 500) weightMultiplier = 0.6;
  else if (weight <= 2000) weightMultiplier = 0.8;
  else if (weight <= 5000) weightMultiplier = 1.0;
  else if (weight <= 10000) weightMultiplier = 1.3;
  else if (weight <= 20000) weightMultiplier = 1.7;
  else weightMultiplier = 2.2;

  const distanceMultiplier = distance < 100 ? 1.5 : distance < 300 ? 1.2 : distance < 800 ? 1.0 : 0.85;
  const fuelSurcharge = 0.35;
  const minCharge = 150;
  const raw = baseRate * distance * weightMultiplier * distanceMultiplier + fuelSurcharge * distance;
  return Math.max(minCharge, Math.round(raw * 100) / 100);
}

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

export default function QuotePage() {
  const [weight, setWeight] = useState<number>(5000);
  const [distance, setDistance] = useState<number>(400);
  const [commodity, setCommodity] = useState<string>("65");
  const [palletCount, setPalletCount] = useState<number>(4);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const weightLbs = weight;
  const distanceMiles = distance;

  const baseRate = estimateRate(weightLbs, distanceMiles);
  const commodityMult = commodityClasses.find((c) => c.class === commodity)?.multiplier ?? 1;
  const adjustedRate = baseRate * commodityMult;

  const fuelSurcharge = distanceMiles * 0.35;
  const lineHaul = adjustedRate - fuelSurcharge;
  const palletFee = palletCount * 12.5;

  const total = adjustedRate + palletFee;

  const handleReset = () => {
    setWeight(5000);
    setDistance(400);
    setCommodity("65");
    setPalletCount(4);
    setShowBreakdown(false);
  };

  const selectedCommodity = commodityClasses.find((c) => c.class === commodity);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="border-b border-[#3a3530]/30 bg-gradient-to-b from-[#121212] to-[#0f0f0f] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / LTL Rate Estimator
              </span>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Estimate Your Freight Rate
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Adjust weight, distance, and cargo class for an instant LTL rate estimate.
                Final rates confirmed by a Freightline specialist.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="grid gap-8 lg:grid-cols-5">
                {/* Controls */}
                <div className="space-y-6 lg:col-span-3">
                  {/* Weight */}
                  <div className="rounded-sm border border-[#3a3530]/30 bg-[#1a1a1a] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" />
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Weight
                        </span>
                      </div>
                      <span className="font-mono text-lg font-bold text-primary">
                        {weightLbs.toLocaleString()} <span className="text-xs text-muted-foreground">lbs</span>
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
                  <div className="rounded-sm border border-[#3a3530]/30 bg-[#1a1a1a] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Distance
                        </span>
                      </div>
                      <span className="font-mono text-lg font-bold text-primary">
                        {distanceMiles.toLocaleString()} <span className="text-xs text-muted-foreground">mi</span>
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
                  <div className="rounded-sm border border-[#3a3530]/30 bg-[#1a1a1a] p-5">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Commodity Class
                      </span>
                    </div>
                    <select
                      value={commodity}
                      onChange={(e) => setCommodity(e.target.value)}
                      className="mt-2 w-full rounded-sm border border-[#3a3530] bg-[#121212] px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      {commodityClasses.map((c) => (
                        <option key={c.class} value={c.class}>
                          Class {c.class} — {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pallet Count */}
                  <div className="rounded-sm border border-[#3a3530]/30 bg-[#1a1a1a] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Pallets
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPalletCount(Math.max(1, palletCount - 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#3a3530] text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          −
                        </button>
                        <span className="font-mono w-6 text-center text-lg font-bold text-primary">
                          {palletCount}
                        </span>
                        <button
                          onClick={() => setPalletCount(Math.min(30, palletCount + 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#3a3530] text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset to defaults
                  </button>
                </div>

                {/* Rate Card */}
                <div className="lg:col-span-2">
                  <div className="sticky top-28 rounded-sm border border-primary/20 bg-gradient-to-b from-[#1a1510] to-[#121212] p-6">
                    <div className="mb-4 text-center">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Estimated LTL Rate
                      </span>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-primary">
                          ${total.toFixed(0)}
                        </span>
                        <span className="ml-1 text-sm text-muted-foreground">USD</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        ~${(total / distanceMiles).toFixed(2)} / mile
                      </p>
                    </div>

                    <button
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="mt-4 w-full rounded-sm border border-[#3a3530]/50 px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {showBreakdown ? "Hide" : "Show"} Breakdown
                    </button>

                    {showBreakdown && (
                      <div className="mt-4 space-y-2 border-t border-[#3a3530]/30 pt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Line Haul</span>
                          <span className="font-mono text-foreground">${lineHaul.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Fuel Surcharge</span>
                          <span className="font-mono text-foreground">${fuelSurcharge.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Pallet Fee ({palletCount} × $12.50)</span>
                          <span className="font-mono text-foreground">${palletFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Class Multiplier</span>
                          <span className="font-mono text-foreground">{selectedCommodity ? `Class ${commodity} (${commodityMult}x)` : '—'}</span>
                        </div>
                        <div className="flex justify-between border-t border-[#3a3530]/30 pt-2 text-sm font-bold">
                          <span className="text-foreground">Total</span>
                          <span className="font-mono text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 space-y-3">
                      <a
                        href="#quote"
                        className="flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-accent glow-orange"
                      >
                        Book This Shipment
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <p className="text-center text-[10px] text-muted-foreground">
                        Estimate only. Final rate confirmed by Freightline specialist.
                      </p>
                    </div>
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