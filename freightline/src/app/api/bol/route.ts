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

    // Deterministic fallback: generate a BOL stub without needing an AI key
    const now = Date.now();
    const bolNumber = `BOL-${now.toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      bolNumber,
      documentName,
      documentType,
      receivedAt: new Date().toISOString(),
      status: "staged",
      message: `Document "${documentName}" received. BOL #${bolNumber} issued for carrier assignment.`,
      stub: {
        shipper: "Freightline Logistics Inc.",
        consignee: "(Awaiting assignment)",
        origin: "(To be confirmed)",
        destination: "(To be confirmed)",
        pieces: 0,
        weight: "0 lbs",
        bolNumber,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON with documentName." },
      { status: 400 },
    );
  }
}