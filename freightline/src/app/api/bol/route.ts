import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const documentName = body.documentName?.trim() || "";
    const documentType = body.documentType?.trim() || "unknown";

    if (!documentName) {
      return NextResponse.json(
        { error: "documentName is required" },
        { status: 400 },
      );
    }

    // Deterministic AI fallback: generate a BOL stub
    const nowMs = new Date().getTime();
    const bolNumber = `BOL-${nowMs.toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const now = new Date().toISOString();

    return NextResponse.json({
      success: true,
      bolNumber,
      documentName,
      documentType,
      receivedAt: now,
      status: "staged",
      message: `Document "${documentName}" received. BOL #${bolNumber} issued for carrier assignment.`,
      // In production this would be persisted and routed to the appropriate carrier
      stub: {
        shipper: "Freightline Logistics Inc.",
        consignee: "(Awaiting assignment)",
        origin: "(To be confirmed)",
        destination: "(To be confirmed)",
        pieces: 0,
        weight: "0 lbs",
        bolNumber,
        date: now.split("T")[0],
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON with documentName." },
      { status: 400 },
    );
  }
}