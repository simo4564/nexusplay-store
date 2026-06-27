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

    const { gameId, rating, comment } = await req.json();

    if (!gameId || !rating || !comment) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const review = await db.review.create({
      data: {
        gameId,
        userId: (session.user as any).id,
        rating: Number(rating),
        comment
      }
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error submitting review" }, { status: 500 });
  }
}
