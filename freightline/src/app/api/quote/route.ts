import { NextResponse } from "next/server";

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

const urgencyMultipliers: Record<string, number> = {
  standard: 1.0,
  expedited: 1.35,
  "same-day": 1.8,
  "next-day": 1.5,
};

function estimateRate(
  weight: number,
  distance: number,
  commodityClass: string,
  palletCount: number,
  urgency: string,
): Record<string, number | string | null | Record<string, number>> {
  const baseRate = 1.45;
  let weightMultiplier = 1;
  if (weight <= 500) weightMultiplier = 0.6;
  else if (weight <= 2000) weightMultiplier = 0.8;
  else if (weight <= 5000) weightMultiplier = 1.0;
  else if (weight <= 10000) weightMultiplier = 1.3;
  else if (weight <= 20000) weightMultiplier = 1.7;
  else weightMultiplier = 2.2;

  const distanceMultiplier = distance < 100 ? 1.5 : distance < 300 ? 1.2 : distance < 800 ? 1.0 : 0.85;

  const commodityMatch = commodityClasses.find((c) => c.class === commodityClass);
  const classMultiplier = commodityMatch?.multiplier ?? 1;

  const urgencyMult = urgencyMultipliers[urgency] ?? 1;

  const rawLineHaul = baseRate * distance * weightMultiplier * distanceMultiplier * classMultiplier;
  const urgencySurcharge = rawLineHaul * (urgencyMult - 1);
  const lineHaul = rawLineHaul + urgencySurcharge;

  const fuelSurcharge = distance * 0.35;
  const palletFee = palletCount * 12.5;
  const accessorials = palletFee;

  const total = lineHaul + fuelSurcharge + accessorials;

  // Determine discount tier
  let discountLabel: string | null = null;
  let discountAmount = 0;
  if (distance >= 1500 && weight >= 20000) {
    discountAmount = total * 0.08;
    discountLabel = "Volume Discount (8%)";
  } else if (distance >= 800 && weight >= 10000) {
    discountAmount = total * 0.04;
    discountLabel = "Lane Discount (4%)";
  }

  const afterDiscount = total - discountAmount;

  return {
    lineHaul: Math.round(lineHaul * 100) / 100,
    fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
    palletFee: Math.round(palletFee * 100) / 100,
    accessorials: Math.round(accessorials * 100) / 100,
    total: Math.round(afterDiscount * 100) / 100,
    breakdown: {
      "Line Haul": Math.round(lineHaul * 100) / 100,
      "Fuel Surcharge": Math.round(fuelSurcharge * 100) / 100,
      "Pallet Fee": Math.round(palletFee * 100) / 100,
      ...(discountLabel ? { [discountLabel]: -Math.round(discountAmount * 100) / 100 } : {}),
    },
    classMultiplier,
    weightMultiplier,
    distanceMultiplier,
    urgencyMultiplier: urgencyMult,
    discountLabel,
    discountAmount: Math.round(discountAmount * 100) / 100,
    perMile: Math.round((afterDiscount / distance) * 100) / 100,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const weight = Number(body.weight) || 5000;
    const distance = Number(body.distance) || 400;
    const commodityClass = body.commodityClass || "65";
    const palletCount = Number(body.palletCount) || 4;
    const urgency = body.urgency || "standard";

    if (weight < 1 || distance < 1) {
      return NextResponse.json(
        { error: "Weight and distance must be positive numbers" },
        { status: 400 },
      );
    }

    const result = estimateRate(weight, distance, commodityClass, palletCount, urgency);

    return NextResponse.json({
      success: true,
      ...result,
      input: { weight, distance, commodityClass, palletCount, urgency },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON with weight, distance, commodityClass, palletCount, urgency." },
      { status: 400 },
    );
  }
}