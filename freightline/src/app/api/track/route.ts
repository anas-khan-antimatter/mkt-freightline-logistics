import { NextResponse } from "next/server";

// Mock tracking database
const trackingDB: Record<string, {
  status: "in-transit" | "delivered" | "delayed" | "processing";
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  pickupDate: string;
  estDelivery: string;
  events: { date: string; location: string; description: string }[];
}> = {
  "FL-2024-7821": {
    status: "in-transit",
    origin: "Chicago, IL",
    destination: "Atlanta, GA",
    cargo: "Steel Coils",
    weight: "42,500 lbs",
    pickupDate: "2024-09-26",
    estDelivery: "2024-09-29",
    events: [
      { date: "2024-09-26 08:14", location: "Chicago, IL", description: "Pickup complete — seal #8742A" },
      { date: "2024-09-26 14:30", location: "Gary, IN", description: "Scale check — 42,500 lbs verified" },
      { date: "2024-09-27 06:45", location: "Indianapolis, IN", description: "In transit — driver rotation" },
      { date: "2024-09-28 02:12", location: "Nashville, TN", description: "Fuel stop — ETA on schedule" },
      { date: "2024-09-28 18:00", location: "Chattanooga, TN", description: "Last check-in before delivery" },
    ],
  },
  "FL-2024-5632": {
    status: "delivered",
    origin: "Dallas, TX",
    destination: "Phoenix, AZ",
    cargo: "Auto Parts",
    weight: "18,200 lbs",
    pickupDate: "2024-09-22",
    estDelivery: "2024-09-24",
    events: [
      { date: "2024-09-22 10:30", location: "Dallas, TX", description: "Pickup complete" },
      { date: "2024-09-22 21:15", location: "Abilene, TX", description: "Cross-dock transfer" },
      { date: "2024-09-23 09:40", location: "El Paso, TX", description: "Border check complete" },
      { date: "2024-09-24 11:22", location: "Phoenix, AZ", description: "DELIVERED — signed by M. Chen" },
    ],
  },
  "FL-2024-3345": {
    status: "delayed",
    origin: "Seattle, WA",
    destination: "Denver, CO",
    cargo: "Industrial Equipment",
    weight: "38,700 lbs",
    pickupDate: "2024-09-25",
    estDelivery: "2024-09-28",
    events: [
      { date: "2024-09-25 07:50", location: "Seattle, WA", description: "Pickup complete" },
      { date: "2024-09-26 13:20", location: "Spokane, WA", description: "Weather delay — I-90 restricted" },
      { date: "2024-09-27 10:00", location: "Spokane, WA", description: "Route re-routed via I-84" },
    ],
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim().toUpperCase() || "";

  if (!id) {
    return NextResponse.json(
      { error: "Missing tracking id parameter" },
      { status: 400 }
    );
  }

  const record = trackingDB[id];
  if (!record) {
    return NextResponse.json(
      { error: "No shipment found for that tracking number", found: false },
      { status: 404 }
    );
  }

  // Deterministic AI fallback: enrich with insight if no external model key
  const insight = generateInsight(record);

  return NextResponse.json({ found: true, ...record, insight });
}

function generateInsight(record: {
  status: string; origin: string; destination: string; events: { location: string }[];
}): string {
  switch (record.status) {
    case "delayed":
      return `⚠️ Delay detected. Shipment from ${record.origin} to ${record.destination} is behind schedule due to weather/route conditions. Next update expected within 4 hours.`;
    case "in-transit":
      return `📦 Shipment is on schedule from ${record.origin} to ${record.destination}. ${record.events.length} location events logged. ETA remains unchanged.`;
    case "delivered":
      return `✅ Shipment completed. Final delivery at ${record.events[record.events.length - 1].location}. Proof of delivery available.`;
    default:
      return `Shipment is being processed. Check back for tracking events.`;
  }
}