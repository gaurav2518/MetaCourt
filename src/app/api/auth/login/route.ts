import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Login route not implemented yet." },
    { status: 501 }
  );
}
