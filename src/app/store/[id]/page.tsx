import { db } from "@/lib/db";
import GameDetailsClient from "./GameDetailsClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const game = await db.game.findUnique({ where: { id: resolvedParams.id } });
  
  if (!game) return { title: "Game Not Found" };

  return {
    title: `${game.title} | NexusPlay Store`,
    description: game.description.substring(0, 160),
    openGraph: {
      title: `${game.title} - $${game.price}`,
      description: game.description.substring(0, 160),
      images: [{ url: game.imageUrl, width: 1200, height: 630 }],
    },
  };
}

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
