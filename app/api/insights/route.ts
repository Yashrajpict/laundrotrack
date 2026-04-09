import { NextResponse } from "next/server";
import { buildAllInsights } from "@/lib/ml";

export async function GET() {
  return NextResponse.json({ insights: buildAllInsights() });
}
