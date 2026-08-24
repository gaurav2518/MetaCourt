import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Juror applications are submitted through POST /api/juror/apply and reviewed through /api/admin/jurors.",
    },
    { status: 200 }
  );
}
