"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Search, Filter } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

interface Corridor {
  id: string;
  origin: string;
  destination: string;
  distance: string;
  avgTransit: string;
  lanes: number;
  ratePerMile: number;
}

interface RegionGroup {
  name: string;
  count: number;
}

export default function LanesPage() {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [regions, setRegions] = useState<RegionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [regionFilter]);

  async function fetchData() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (regionFilter) params.set("region", regionFilter);
      const res = await fetch(`/api/lanes?${params.toString()}`);
      const data = await res.json();
      setCorridors(data.corridors || []);
      setRegions(data.regions || []);
    } catch {
      setCorridors([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = searchQuery
    ? corridors.filter((c) =>
        c.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.destination.toLowerCase().includes(searchQuery.toLowerCase()))
    : corridors;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#2a2a2a]/30 py-20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="mb-12 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / Freight Corridors
              </span>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Lane Coverage Map
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Browse Freightline&apos;s active corridors across North America. Filter by region or search origin/destination.
              </p>
            </div>

            {/* Controls */}
            <div className="mb-8 flex flex-wrap items-end gap-4">
              {/* Region filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={regionFilter}
                  onChange={(e) => { setRegionFilter(e.target.value); setSearchQuery(""); }}
                  className="rounded-sm border border-[#2a2a2a] bg-[#1c1c1c] px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">All Regions</option>
                  {regions.map((r) => (
                    <option key={r.name} value={r.name}>{r.name} ({r.count})</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search origin or destination…"
                  className="w-full rounded-sm border border-[#2a2a2a] bg-[#1c1c1c] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                {filtered.length} corridors
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary text-left">
                    <th className="data-cell-header">Origin</th>
                    <th className="data-cell-header">Destination</th>
                    <th className="data-cell-header">Distance</th>
                    <th className="data-cell-header">Transit</th>
                    <th className="data-cell-header">Lanes</th>
                    <th className="data-cell-header">Rate / mi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="data-cell text-center text-muted-foreground">Loading corridor data…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="data-cell text-center text-muted-foreground">No corridors match the current filters.</td></tr>
                  ) : (
                    filtered.map((cor, i) => (
                      <tr
                        key={cor.id}
                        className={`data-cell border-b border-[rgba(255,255,255,0.04)] ${i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.015)]"}`}
                      >
                        <td className="data-cell font-medium text-foreground">{cor.origin}</td>
                        <td className="data-cell text-foreground">
                          <span className="flex items-center gap-2">
                            {cor.destination}
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </span>
                        </td>
                        <td className="data-cell font-mono text-muted-foreground">{cor.distance}</td>
                        <td className="data-cell font-mono text-muted-foreground">{cor.avgTransit}</td>
                        <td className="data-cell text-right">
                          <span className="font-mono text-primary">{cor.lanes}</span>
                        </td>
                        <td className="data-cell text-right font-mono text-foreground">${cor.ratePerMile.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend note */}
            <div className="mt-8 border-t border-[#2a2a2a]/30 pt-6">
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="stencil-label">Lanes = active weekly departures</span>
                <span className="stencil-label">Transit = door-to-door avg</span>
                <span className="stencil-label">Rate = LTL base / mi</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}