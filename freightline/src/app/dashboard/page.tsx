"use client";

import { useState } from "react";
import { Truck, Package, Clock, Route, ArrowRight, Download, Bell, TrendingUp, TrendingDown } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

// Mock data
const recentShipments = [
  { id: "FL-2024-7821", origin: "Chicago, IL", destination: "Atlanta, GA", status: "in-transit", eta: "Sep 29", value: "$4,820" },
  { id: "FL-2024-3345", origin: "Seattle, WA", destination: "Denver, CO", status: "delayed", eta: "Sep 30", value: "$8,150" },
  { id: "FL-2024-9012", origin: "Detroit, MI", destination: "Memphis, TN", status: "processing", eta: "Oct 2", value: "$3,200" },
  { id: "FL-2024-8765", origin: "Charlotte, NC", destination: "Dallas, TX", status: "in-transit", eta: "Sep 30", value: "$5,430" },
];

const alerts = [
  { level: "warning", message: "FL-2024-3345 delayed by weather — I-90 restriction near Spokane" },
  { level: "info", message: "FL-2024-7821 — 60 mi from delivery terminal" },
  { level: "success", message: "FL-2024-5632 delivered — POD available" },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<"shipments" | "analytics" | "alerts">("shipments");

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#2a2a2a]/30 py-20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / Shipper Portal
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Operations Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back, <span className="font-mono text-primary">ACME_CORP #4281</span>
              </p>
            </div>

            {/* KPI cards */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Active Shipments", value: "7", icon: Truck, change: "+2", up: true },
                { label: "In Transit", value: "4", icon: Route, change: "0", up: true },
                { label: "Delayed", value: "1", icon: Clock, change: "+1", up: false },
                { label: "This Month Spend", value: "$43,200", icon: TrendingUp, change: "+12%", up: true },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {kpi.label}
                    </span>
                    <kpi.icon className={`h-4 w-4 ${kpi.up ? "text-primary" : "text-destructive"}`} />
                  </div>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
                  <p className={`mt-0.5 text-xs font-mono ${kpi.up ? "text-primary" : "text-destructive"}`}>
                    {kpi.change} vs last week
                  </p>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div className="mb-8 flex gap-1 rounded-sm border border-[#2a2a2a]/30 bg-[#2a2a2a]/30 p-1">
              {["shipments", "analytics", "alerts"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as typeof tab)}
                  className={`flex-1 rounded-sm px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                    tab === t
                      ? "bg-[#1c1c1c] text-primary"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "shipments" ? "Recent Shipments" : t === "analytics" ? "Analytics" : "Alerts"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "shipments" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary text-left">
                      <th className="data-cell-header">Tracking #</th>
                      <th className="data-cell-header">Origin</th>
                      <th className="data-cell-header">Destination</th>
                      <th className="data-cell-header">Status</th>
                      <th className="data-cell-header">ETA</th>
                      <th className="data-cell-header">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentShipments.map((s, i) => {
                      const statusColor = s.status === "delayed" ? "text-destructive" : s.status === "in-transit" ? "text-primary" : "text-muted-foreground";
                      return (
                        <tr key={s.id} className={`${i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.015)]"} border-b border-[rgba(255,255,255,0.04)]`}>
                          <td className="data-cell font-mono text-primary">{s.id}</td>
                          <td className="data-cell text-foreground">{s.origin}</td>
                          <td className="data-cell text-foreground">{s.destination}</td>
                          <td className="data-cell">
                            <span className={`font-mono text-xs uppercase ${statusColor}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="data-cell font-mono text-muted-foreground">{s.eta}</td>
                          <td className="data-cell font-mono text-foreground">{s.value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-4 text-xs text-muted-foreground border-t border-[#2a2a2a]/30 pt-3">
                  <button className="flex items-center gap-2 text-primary hover:underline">
                    <Download className="h-3.5 w-3.5" />
                    Export Shipment Report (CSV)
                  </button>
                </div>
              </div>
            )}

            {tab === "analytics" && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">On-Time Performance</p>
                  <p className="mt-2 text-3xl font-bold text-primary">94.7%</p>
                  <div className="mt-3 h-2 rounded-sm bg-gradient-to-r from-destructive via-primary to-primary" style={{ width: "94.7%" }} />
                  <p className="mt-1 text-xs text-muted-foreground">Target: 95%</p>
                </div>
                <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Avg Transit Time</p>
                  <p className="mt-2 text-3xl font-bold text-primary">2.3 days</p>
                  <div className="mt-3 h-2 rounded-sm bg-gradient-to-r from-primary to-muted-foreground" style={{ width: "46%" }} />
                  <p className="mt-1 text-xs text-muted-foreground">-0.4 days vs last month</p>
                </div>
                <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Top Lane</p>
                  <p className="mt-2 text-lg font-bold text-foreground">Chicago → Atlanta</p>
                  <p className="text-xs text-muted-foreground">47 shipments this quarter</p>
                </div>
                <div className="rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Cost / Mile Avg</p>
                  <p className="mt-2 text-3xl font-bold text-primary">$1.92</p>
                  <p className="text-xs text-muted-foreground">Across all active lanes</p>
                </div>
              </div>
            )}

            {tab === "alerts" && (
              <div className="space-y-3">
                {alerts.map((a, i) => {
                  const levelDot = a.level === "warning" ? "text-destructive" : a.level === "info" ? "text-primary" : "text-primary";
                  return (
                    <div key={i} className="flex items-start gap-4 rounded-sm border border-[#2a2a2a]/30 bg-[#1c1c1c] p-4">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${levelDot}`} />
                      <p className="text-sm text-foreground">{a.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}