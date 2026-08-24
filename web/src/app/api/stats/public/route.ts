import { NextResponse } from "next/server";

import { getPublicStats } from "@/lib/publicStats";

export async function GET() {
  try {
    const stats = await getPublicStats();

    return NextResponse.json(stats, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        totalCasesFiled: 0,
        decisionsMade: 0,
        totalJurors: 0,
      },
      { status: 200 }
    );
  }
}
