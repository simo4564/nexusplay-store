import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import styles from "./page.module.css";
import GameCard from "@/components/GameCard";
import Link from "next/link";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's orders to show their games
  // For the sake of the demo, if they have no orders, we'll just show an empty state.
  // We'll also fetch their name to personalize it
  const userOrders = await db.order.findMany({
    where: { userId: (session.user as any).id },
    include: { game: true },
    orderBy: { createdAt: "desc" }
  });

  const games = userOrders.map(order => order.game);
  
  // Deduplicate games in case they bought the same one twice
  const uniqueGames = Array.from(new Map(games.map(item => [item.id, item])).values());

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container">
          <h1 className="text-gradient">Welcome, {session.user.name || 'Gamer'}</h1>
          <p className={styles.subtitle}>Your Digital Game Library</p>
        </div>
      </header>

      <main className="container">
        {uniqueGames.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Your library is empty.</h2>
            <p>It looks like you haven't purchased any games yet!</p>
            <Link href="/store" className="btn btn-primary" style={{ marginTop: '2rem' }}>
              Explore the Store
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {uniqueGames.map((game) => (
              <div key={game.id} className={styles.gameWrapper}>
                <GameCard game={game} />
                <div className={styles.playOverlay}>
                  <button className="btn btn-primary">Play Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
