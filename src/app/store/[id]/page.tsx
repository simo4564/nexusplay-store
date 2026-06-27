import { db } from "@/lib/db";
import GameDetailsClient from "./GameDetailsClient";
import { notFound } from "next/navigation";

export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const game = await db.game.findUnique({
    where: { id: resolvedParams.id },
    include: { reviews: { include: { user: true } } }
  });

  if (!game) {
    notFound();
  }

  return <GameDetailsClient game={game} />;
}
