import { db } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function Home() {
  const games = await db.game.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return <HomeClient games={games} />;
}
