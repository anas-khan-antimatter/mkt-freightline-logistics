"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Ship, BarChart3, Map, TrendingUp, Clock, Activity } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const mockShipments = [
  { id: "FL-2024-7821", status: "in-transit", origin: "Chicago, IL", destination: "Atlanta, GA", cargo: "Steel Coils", weight: "42,500 lbs", eta: "2024-09-29" },
  { id: "FL-2024-5632", status: "delivered", origin: "Dallas, TX", destination: "Phoenix, AZ", cargo: "Auto Parts", weight: "18,200 lbs", eta: "Delivered" },
  { id: "FL-2024-3345", status: "delayed", origin: "Seattle, WA", destination: "Denver, CO", cargo: "Industrial Equipment", weight: "38,700 lbs", eta: "Delayed — weather" },
];

const recentActivity = [
  { time: "09:42", event: "BOL FL-2024-7821 updated — driver assigned" },
  { time: "08:15", event: "CSV upload processed — 14 new loads staged" },
  { time: "07:30", event: "Lane rate change: Chicago→Atlanta now $2.14/mi" },
  { time: "06:50", event: "Quote #Q-8921 promoted to shipment" },
  { time: "05:00", event: "System alert: I-90 winter advisory active" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"shipments" | "analytics" | "activity">("shipments");

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#2a2a2a]/30 py-24">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    / Shipper Portal
                  </span>
                  <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Operations Dashboard
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="stencil-label">ACME Logistics Inc.</span>
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary pulse-dot" />
                  <span className="font-mono text-[10px] text-primary">LIVE</span>
                </div>
              </div>
            </div>

            {/* KPI cards */}
            <div className="mb-10 grid gap-4 grid-cols-2 sm:grid-cols-4">
              {[
                { label: "Active Shipments", value: "18", icon: Ship, prefix: "" },
                { label: "This Week", value: "47", icon: TrendingUp, prefix: "" },
                { label: "Avg Transit", value: "2.3", icon: Clock, suffix: "days" },
                { label: "On-Time %", value: "94.2", icon: Activity, suffix: "%" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {kpi.label}
                    </p>
                    <kpi.icon className="h-4 w-4 text-primary/60" />
                  </div>
                  <p className="mt-1.5 text-2xl font-bold font-mono text-primary">
                    {kpi.prefix}{kpi.value}<span className="text-xs text-muted-foreground">{kpi.suffix || ""}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-8 flex gap-0">
              {(["shipments", "analytics", "activity"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-mono uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "border-b border-[#2a2a2a] text-muted-foreground hover:text-primary"
                  }`}
                >
                  {tab === "shipments" ? "Shipments" : tab === "analytics" ? "Lane Analytics" : "Activity Log"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "shipments" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary text-left">
                      <th className="data-cell-header">Tracking #</th>
                      <th className="data-cell-header">Cargo</th>
                      <th className="data-cell-header">Origin</th>
                      <th className="data-cell-header">Destination</th>
                      <th className="data-cell-header">Weight</th>
                      <th className="data-cell-header">Status</th>
                      <th className="data-cell-header">ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockShipments.map((s, i) => (
                      <tr
                        key={s.id}
                        className={`data-cell border-b border-[rgba(255,255,255,0.04)] ${i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.015)]"}`}
                      >
                        <td className="data-cell font-mono text-primary">{s.id}</td>
                        <td className="data-cell text-foreground">{s.cargo}</td>
                        <td className="data-cell text-muted-foreground">{s.origin}</td>
                        <td className="data-cell text-muted-foreground">{s.destination}</td>
                        <td className="data-cell font-mono text-muted-foreground">{s.weight}</td>
                        <td className="data-cell">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                            s.status === "delivered" ? "text-primary" :
                            s.status === "delayed" ? "text-destructive" :
                            "text-primary"
                          }`}>
                            <span className={`inline-block h-2 w-2 rounded-full ${
                              s.status === "delivered" ? "bg-primary" :
                              s.status === "delayed" ? "bg-destructive pulse-dot" :
                              "bg-primary pulse-dot"
                            }`} />
                            {s.status}
                          </span>
                        </td>
                        <td className="data-cell font-mono text-muted-foreground">{s.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Map className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Top Lanes by Volume</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { lane: "Chicago → Atlanta", pct: 100 },
                      { lane: "LA → Chicago", pct: 78 },
                      { lane: "Dallas → Phoenix", pct: 64 },
                      { lane: "NY → Miami", pct: 55 },
                      { lane: "Seattle → Denver", pct: 42 },
                    ].map((l) => (
                      <div key={l.lane} className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">{l.lane}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 rounded-full bg-[#2a2a2a] overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${l.pct}%` }} />
                          </div>
                          <span className="font-mono text-xs text-primary">{l.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Weekly Shipment Trend</span>
                  </div>
                  <div className="flex items-end gap-2 justify-between pb-4">
                    {[
                      { day: "M", val: 38 },
                      { day: "T", val: 42 },
                      { day: "W", val: 45 },
                      { day: "Th", val: 47 },
                      { day: "F", val: 36 },
                      { day: "Sa", val: 12 },
                      { day: "Su", val: 8 },
                    ].map((d) => (
                      <div key={d.day} className="flex flex-col items-center">
                        <div
                          className="w-6 rounded-sm bg-primary"
                          style={{ height: `${d.val}px`, opacity: 0.5 + (d.val / 47) * 0.5 }}
                        />
                        <span className="mt-1 text-[9px] font-mono text-muted-foreground">{d.day}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground text-center">Total this week: 228 shipments</p>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c]">
                {recentActivity.map((a, i) => (
                  <div key={i} className={`flex items-start gap-4 px-5 py-3.5 ${
                    i < recentActivity.length - 1 ? "border-b border-[rgba(255,255,255,0.04)]" : ""
                  }`}>
                    <span className="font-mono text-[10px] text-muted-foreground">{a.time}</span>
                    <span className="h-5 w-px bg-[#2a2a2a]" />
                    <p className="text-sm text-foreground">{a.event}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}