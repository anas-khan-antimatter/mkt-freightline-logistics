"use client";

import { useState, useCallback } from "react";
import { Upload, Table, FileText, ArrowRight, Trash2, Download } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

interface LoadRow {
  id: number;
  origin: string;
  destination: string;
  weight: string;
  commodity: string;
  carrier: string;
  status: string;
  bol: string;
}

export default function UploadPage() {
  const [rows, setRows] = useState<LoadRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const parseCSV = useCallback((text: string, name: string) => {
    setError("");
    const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      setError("CSV must have a header row and at least one data row.");
      return;
    }

    const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
    const originIdx = header.findIndex((h) => h.includes("origin"));
    const destIdx = header.findIndex((h) => h.includes("dest") || h.includes("destination"));
    const weightIdx = header.findIndex((h) => h.includes("weight"));
    const commIdx = header.findIndex((h) => h.includes("commod") || h.includes("cargo"));
    const carrierIdx = header.findIndex((h) => h.includes("carrier"));
    const statusIdx = header.findIndex((h) => h.includes("status"));

    if (originIdx === -1 || destIdx === -1) {
      setError("CSV must have at least 'origin' and 'destination' columns.");
      return;
    }

    const parsed: LoadRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const origin = originIdx < cols.length ? cols[originIdx] : "";
      const dest = destIdx < cols.length ? cols[destIdx] : "";
      if (!origin || !dest) continue;

      parsed.push({
        id: i,
        origin,
        destination: dest,
        weight: weightIdx !== -1 && weightIdx < cols.length ? cols[weightIdx] : "—",
        commodity: commIdx !== -1 && commIdx < cols.length ? cols[commIdx] : "—",
        carrier: carrierIdx !== -1 && carrierIdx < cols.length ? cols[carrierIdx] : "—",
        status: statusIdx !== -1 && statusIdx < cols.length ? cols[statusIdx] : "staged",
        bol: `BOL-${Date.now().toString(36).toUpperCase()}-${String(i).padStart(3, "0")}`,
      });
    }

    if (parsed.length === 0) {
      setError("No valid rows found. Check column headers.");
      return;
    }

    setRows(parsed);
    setFileName(name);
  }, []);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      if (text) parseCSV(text, file.name);
    };
    reader.readAsText(file);
  }, [parseCSV]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: Event) => {
    const input = e.target as HTMLInputElement;
    handleFile(input.files?.[0]);
  }, [handleFile]);

  const clearAll = () => {
    setRows([]);
    setFileName("");
    setError("");
  };

  // Status badge color
  const statusClass = (s: string) => {
    const lower = s.toLowerCase();
    if (lower === "delivered" || lower === "completed") return "text-primary";
    if (lower === "in-transit" || lower === "en route") return "text-primary";
    if (lower === "delayed" || lower === "exception") return "text-destructive";
    return "text-muted-foreground";
  };

  const statusDot = (s: string) => {
    const lower = s.toLowerCase();
    if (lower === "delivered" || lower === "completed") return "bg-primary";
    if (lower === "in-transit" || lower === "en route") return "bg-primary pulse-dot";
    if (lower === "delayed" || lower === "exception") return "bg-destructive";
    return "bg-muted-foreground";
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#2a2a2a]/30 py-20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="mb-12 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / Loads Upload
              </span>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Upload Load Sheet
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Drop a CSV with your loads data. Columns like <span className="font-mono text-primary">origin</span>,{" "}
                <span className="font-mono text-primary">destination</span>, <span className="font-mono text-primary">weight</span>,{" "}
                <span className="font-mono text-primary">commodity</span>, <span className="font-mono text-primary">carrier</span>,{" "}
                <span className="font-mono text-primary">status</span> are auto-detected.
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative mx-auto max-w-xl rounded-sm border-2 border-dashed p-10 text-center transition-colors ${
                dragging ? "border-primary bg-primary/5" : "border-[#2a2a2a] bg-[#1c1c1c] hover:border-primary/30"
              }`}
            >
              <Upload className={`mx-auto h-10 w-10 ${dragging ? "text-primary" : "text-muted-foreground"}`} />
              <p className="mt-4 text-sm text-foreground">
                {dragging ? "Release to upload" : "Drop CSV here or click to browse"}
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>

            {error && (
              <div className="mx-auto mt-4 max-w-xl rounded-sm border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Actions when data loaded */}
            {rows.length > 0 && (
              <div className="mx-auto mt-4 max-w-xl flex items-center gap-4">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {fileName || `${rows.length} loads loaded`}
                </span>
                <span className="stencil-label">
                  {rows.length} row{rows.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-sm border border-[#2a2a2a] px-3 py-1 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </button>
                <button
                  onClick={() => {
                    // Client-side CSV export
                    const header = Object.keys(rows[0]).join(",");
                    const csv = rows.map((r) =>
                      [r.origin, r.destination, r.weight, r.commodity, r.carrier, r.status, r.bol].map((v) => `"${v}"`).join(",")
                    ).join("\n");
                    const blob = new Blob([`${header}\n${csv}`], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `freightline-loads-${Date.now()}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 rounded-sm border border-[#2a2a2a] px-3 py-1 text-xs text-foreground hover:border-primary hover:text-primary"
                >
                  <Download className="h-3 w-3" />
                  Export CSV
                </button>
              </div>
            )}

            {/* Sample data button */}
            {rows.length === 0 && (
              <div className="mx-auto mt-6 max-w-xl text-center">
                <p className="text-xs text-muted-foreground">No CSV handy?</p>
                <button
                  onClick={() =>
                    parseCSV(
                      `origin,destination,weight,commodity,carrier,status
Chicago, IL,Atlanta, GA,"42,500 lbs",Steel Coils,Freightline FL-1,in-transit
Dallas, TX,Phoenix, AZ,"18,200 lbs",Auto Parts,Freightline FL-2,delivered
Seattle, WA,Denver, CO,"38,700 lbs",Industrial Equipment,Freightline FL-3,delayed
Detroit, MI,Memphis, TN,"9,400 lbs",Beverages,Freightline FL-4,staged
Charlotte, NC,Dallas, TX,"22,100 lbs",Machinery,Freightline FL-5,in-transit
Los Angeles, CA,Chicago, IL,"33,500 lbs",Electronics,Freightline FL-6,staged
New York, NY,Miami, FL,"12,800 lbs",Furniture,Freightline FL-7,delivered`,
                      "sample-loads.csv",
                    )
                  }
                  className="mt-2 rounded-sm border border-primary/20 px-4 py-2 text-xs font-mono text-primary hover:bg-primary/10"
                >
                  Load Sample Data
                </button>
              </div>
            )}

            {/* Data table */}
            {rows.length > 0 && (
              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary text-left">
                      <th className="data-cell-header">#</th>
                      <th className="data-cell-header">Origin</th>
                      <th className="data-cell-header">Destination</th>
                      <th className="data-cell-header">Weight</th>
                      <th className="data-cell-header">Commodity</th>
                      <th className="data-cell-header">Carrier</th>
                      <th className="data-cell-header">Status</th>
                      <th className="data-cell-header">BOL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`border-b border-[rgba(255,255,255,0.04)] ${
                          i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.015)]"
                        }`}
                      >
                        <td className="data-cell font-mono text-muted-foreground">{i + 1}</td>
                        <td className="data-cell text-foreground">{r.origin}</td>
                        <td className="data-cell text-foreground">
                          <span className="flex items-center gap-1.5">
                            {r.destination}
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </span>
                        </td>
                        <td className="data-cell font-mono text-muted-foreground">{r.weight}</td>
                        <td className="data-cell text-muted-foreground">{r.commodity}</td>
                        <td className="data-cell font-mono text-xs text-muted-foreground">{r.carrier}</td>
                        <td className="data-cell">
                          <span className={`inline-flex items-center gap-1.5 ${statusClass(r.status)}`}>
                            <span className={`inline-block h-2 w-2 rounded-full ${statusDot(r.status)}`} />
                            <span className="text-xs font-mono uppercase">{r.status}</span>
                          </span>
                        </td>
                        <td className="data-cell font-mono text-[11px] text-primary">{r.bol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footnote */}
            {rows.length > 0 && (
              <div className="mt-8 border-t border-[#2a2a2a]/30 pt-6">
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="stencil-label">All parsing done client-side</span>
                  <span className="stencil-label">No data uploaded to server</span>
                  <span className="stencil-label">BOLs generated locally</span>
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