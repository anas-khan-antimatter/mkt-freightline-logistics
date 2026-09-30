"use client";

import { useState } from "react";
import { Circle, Minus } from "lucide-react";

// Simplified lane data
const laneGroups = [
  { region: "Pacific Northwest", lanes: ["Seattle → Portland", "Portland → Spokane", "Vancouver → Seattle", "Spokane → Boise"] },
  { region: "West Coast", lanes: ["Los Angeles → San Francisco", "San Diego → Phoenix", "Portland → Los Angeles", "Oakland → Reno"] },
  { region: "Mountain West", lanes: ["Denver → Salt Lake City", "Phoenix → Albuquerque", "Denver → Albuquerque", "Salt Lake City → Boise"] },
  { region: "Midwest", lanes: ["Chicago → Detroit", "Indianapolis → Columbus", "St. Louis → Kansas City", "Chicago → Minneapolis"] },
  { region: "Texas / South Central", lanes: ["Houston → Dallas", "Dallas → Austin", "San Antonio → Houston", "Oklahoma City → Dallas"] },
  { region: "Southeast", lanes: ["Atlanta → Charlotte", "Nashville → Atlanta", "Orlando → Miami", "Atlanta → Jacksonville"] },
  { region: "Northeast", lanes: ["Newark → Philadelphia", "Boston → New York", "Baltimore → Washington", "Albany → New York"] },
  { region: "Eastern Canada", lanes: ["Toronto → Montreal", "Montreal → Quebec City", "Toronto → Ottawa", "Hamilton → Toronto"] },
];

export default function LaneMap() {
  const [activeRegion, setActiveRegion] = useState<string>("Pacific Northwest");

  const activeLanes = laneGroups.find((g) => g.region === activeRegion)?.lanes ?? [];

  return (
    <section id="lane-map" className="relative border-b border-[#3a3530]/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            / Lane Network
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Coverage Map
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            2,400+ lanes spanning the U.S., Canada, and Mexico. Select a region to
            explore our direct routes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Region selector — left */}
          <div className="lg:col-span-4">
            {/* Stylized map placeholder */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-[#3a3530]/30 bg-gradient-to-br from-[#1a1a1a] via-[#151515] to-[#121212]">
              {/* Grid dots background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #e65c00 0.5px, transparent 0.5px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Route visualization */}
              <svg
                viewBox="0 0 800 500"
                className="h-full w-full"
                fill="none"
              >
                {/* Continent outline (simplified) */}
                <path
                  d="M200 50 L250 60 L300 80 L350 100 L420 80 L480 120 L520 180 L540 250 L500 320 L450 380 L400 420 L350 440 L280 430 L220 400 L180 350 L150 280 L140 210 L160 140 L180 80 Z"
                  stroke="#3a3530"
                  strokeWidth="1"
                  className="opacity-40"
                />

                {/* Active region lanes — highlighted */}
                {activeLanes.map((lane, i) => {
                  // Pseudo-random positions per lane
                  const startX = 180 + Math.sin(i * 2.3) * 160 + 100;
                  const startY = 100 + Math.cos(i * 1.7) * 140 + 80;
                  const endX = 180 + Math.sin(i * 2.3 + 1.5) * 160 + 100;
                  const endY = 100 + Math.cos(i * 1.7 + 1.5) * 140 + 80;
                  return (
                    <g key={lane}>
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke="#e65c00"
                        strokeWidth="2"
                        className="opacity-80"
                        strokeDasharray="4 3"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="100"
                          dur={`${2 + i}s`}
                          repeatCount="indefinite"
                        />
                      </line>
                      <circle
                        cx={startX}
                        cy={startY}
                        r="4"
                        fill="#e65c00"
                      />
                      <circle
                        cx={endX}
                        cy={endY}
                        r="4"
                        fill="#e65c00"
                      />
                    </g>
                  );
                })}

                {/* Static route network (dim) */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <line
                    key={`static-${i}`}
                    x1={120 + Math.sin(i * 1.1) * 280}
                    y1={80 + Math.cos(i * 0.9) * 200}
                    x2={120 + Math.sin(i * 1.1 + 0.5) * 280}
                    y2={80 + Math.cos(i * 0.9 + 0.5) * 200}
                    stroke="#3a3530"
                    strokeWidth="0.5"
                    className="opacity-30"
                  />
                ))}
              </svg>

              {/* Region label overlaid */}
              <div className="absolute bottom-4 left-4 rounded-sm border border-primary/20 bg-[#121212]/80 px-3 py-1.5">
                <span className="font-mono text-xs text-primary">
                  {activeRegion.toUpperCase()}
                </span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {activeLanes.length} direct lanes
                </span>
              </div>
            </div>
          </div>

          {/* Region list — right */}
          <div className="space-y-1 lg:col-span-1">
            {laneGroups.map((group) => (
              <button
                key={group.region}
                onClick={() => setActiveRegion(group.region)}
                className={`w-full rounded-sm px-3 py-2.5 text-left text-sm transition-colors ${
                  activeRegion === group.region
                    ? "border-l-2 border-primary bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-[#1a1a1a] hover:text-foreground"
                }`}
              >
                {group.region}
              </button>
            ))}
          </div>
        </div>

        {/* Lane list for active region */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {activeLanes.map((lane) => (
            <div
              key={lane}
              className="corner-accent flex items-center gap-2 rounded-sm border border-[#3a3530]/30 px-3 py-2"
            >
              <Minus className="h-3 w-3 shrink-0 text-primary" />
              <span className="text-xs font-medium text-foreground">{lane}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}