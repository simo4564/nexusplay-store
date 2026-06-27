import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, total } = await req.json();

    // Create orders for each item
    for (const item of items) {
      // Create an order for each quantity (or just one order per unique game for digital)
      await db.order.create({
        data: {
          userId: (session.user as any).id,
          gameId: item.id,
          total: item.price
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Error processing checkout" }, { status: 500 });
  }
}
