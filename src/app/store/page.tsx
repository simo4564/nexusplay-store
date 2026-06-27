import { db } from "@/lib/db";
import StoreClient from "./StoreClient";

export default async function StorePage() {
  const games = await db.game.findMany({
    orderBy: { title: "asc" },
  });

  return <StoreClient games={games} />;
}
