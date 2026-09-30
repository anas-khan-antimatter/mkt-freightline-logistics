import { NextResponse } from "next/server";

const corridors = [
  { id: "cor-001", origin: "Chicago, IL", destination: "Atlanta, GA", distance: "716 mi", avgTransit: "2.5 days", lanes: 47, ratePerMile: 2.14 },
  { id: "cor-002", origin: "Dallas, TX", destination: "Phoenix, AZ", distance: "1,020 mi", avgTransit: "3 days", lanes: 32, ratePerMile: 1.87 },
  { id: "cor-003", origin: "Seattle, WA", destination: "Denver, CO", distance: "1,310 mi", avgTransit: "3.5 days", lanes: 18, ratePerMile: 2.31 },
  { id: "cor-004", origin: "Los Angeles, CA", destination: "Chicago, IL", distance: "2,020 mi", avgTransit: "5 days", lanes: 89, ratePerMile: 1.65 },
  { id: "cor-005", origin: "New York, NY", destination: "Miami, FL", distance: "1,280 mi", avgTransit: "3 days", lanes: 55, ratePerMile: 2.02 },
  { id: "cor-006", origin: "Detroit, MI", destination: "Kansas City, MO", distance: "690 mi", avgTransit: "2 days", lanes: 24, ratePerMile: 1.93 },
  { id: "cor-007", origin: "Houston, TX", destination: "New Orleans, LA", distance: "350 mi", avgTransit: "1 day", lanes: 41, ratePerMile: 2.48 },
  { id: "cor-008", origin: "Portland, OR", destination: "Salt Lake City, UT", distance: "780 mi", avgTransit: "2 days", lanes: 15, ratePerMile: 2.15 },
  { id: "cor-009", origin: "Minneapolis, MN", destination: "Memphis, TN", distance: "850 mi", avgTransit: "2.5 days", lanes: 22, ratePerMile: 1.79 },
  { id: "cor-010", origin: "Charlotte, NC", destination: "Indianapolis, IN", distance: "620 mi", avgTransit: "1.5 days", lanes: 33, ratePerMile: 1.96 },
  { id: "cor-011", origin: "Denver, CO", destination: "Los Angeles, CA", distance: "1,020 mi", avgTransit: "3 days", lanes: 38, ratePerMile: 1.88 },
  { id: "cor-012", origin: "Atlanta, GA", destination: "Dallas, TX", distance: "800 mi", avgTransit: "2 days", lanes: 44, ratePerMile: 1.74 },
];

const regions = [
  { name: "Midwest", corridors: ["cor-001", "cor-006", "cor-009"] },
  { name: "Southwest", corridors: ["cor-002", "cor-007", "cor-011"] },
  { name: "West Coast", corridors: ["cor-004", "cor-008"] },
  { name: "Northeast", corridors: ["cor-005", "cor-010"] },
  { name: "Pacific NW", corridors: ["cor-003", "cor-008"] },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region = url.searchParams.get("region")?.trim();
  const minLanes = Number(url.searchParams.get("minLanes") || 0);
  const maxRate = Number(url.searchParams.get("maxRate") || 999);

  let filtered = [...corridors];

  if (region) {
    const regionEntry = regions.find((r) => r.name.toLowerCase() === region.toLowerCase());
    if (regionEntry) {
      filtered = filtered.filter((c) => regionEntry.corridors.includes(c.id));
    } else {
      // Try matching origin/destination
      filtered = filtered.filter(
        (c) =>
          c.origin.toLowerCase().includes(region.toLowerCase()) ||
          c.destination.toLowerCase().includes(region.toLowerCase()),
      );
    }
  }

  filtered = filtered.filter((c) => c.lanes >= minLanes && c.ratePerMile <= maxRate);

  return NextResponse.json({
    corridors: filtered,
    total: filtered.length,
    regions: regions.map((r) => ({ name: r.name, count: r.corridors.length })),
    filters: { region, minLanes, maxRate },
  });
}