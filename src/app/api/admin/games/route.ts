import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, imageUrl, genre, releaseDate, developer } = body;

    const game = await db.game.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        genre,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        developer
      }
    });

    return NextResponse.json({ success: true, game }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating game" }, { status: 500 });
  }
}
