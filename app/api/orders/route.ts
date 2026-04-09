import { NextResponse } from "next/server";
import { seededOrders } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ orders: seededOrders });
}

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json(
    {
      message: "Order accepted in demo mode.",
      order: payload
    },
    { status: 201 }
  );
}
