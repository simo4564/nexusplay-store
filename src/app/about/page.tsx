"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gradient"
          >
            About NexusPlay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.subtitle}
          >
            Redefining the digital PC gaming experience.
          </motion.p>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <motion.div 
          className={styles.contentGrid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className={styles.textSection}>
            <h2>Our Mission</h2>
            <p>
              At NexusPlay, we believe that gaming is more than just entertainment; it's an immersive 
              art form. We are dedicated to curating and providing the most high-end, premium PC games 
              in the market. From breathtaking AAA titles to masterpiece indie games, we ensure that 
              every game on our platform meets the highest standards of quality, storytelling, and performance.
            </p>
            
            <h2 style={{ marginTop: '3rem' }}>Why Choose Us?</h2>
            <ul className={styles.featuresList}>
              <li>
                <strong>Curated Selection:</strong> We don't just sell games, we handpick the best 
                experiences for true gamers.
              </li>
              <li>
                <strong>Instant Delivery:</strong> Get your digital game keys instantly upon purchase. No waiting.
              </li>
              <li>
                <strong>Immersive Experience:</strong> Our platform is built for gamers, with stunning visuals 
                and blazing fast performance.
              </li>
            </ul>
          </div>
          
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img 
                src="/images/hero_cyberpunk_game.jpg" 
                alt="Immersive Gaming" 
                className={styles.image} 
              />
            </div>
            <div className={styles.glassCard}>
              <h3>Join the Nexus</h3>
              <p>Over 1 million gamers have already upgraded their digital library with us.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
