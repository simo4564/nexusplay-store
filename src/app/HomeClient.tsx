"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";
import GameCard from "@/components/GameCard";
import { Game } from "@prisma/client";

export default function HomeClient({ games }: { games: Game[] }) {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gradient"
          >
            Next-Gen Gaming
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the future of digital PC gaming. Stunning worlds, immersive stories, and unparalleled performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={styles.heroActions}
          >
            <a href="/store" className="btn btn-primary">Browse Store</a>
            <a href="/about" className="btn btn-secondary">Learn More</a>
          </motion.div>
        </div>
      </section>
      
      <section className={`container ${styles.featured}`}>
        <h2>Featured Titles</h2>
        <div className={styles.grid}>
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
