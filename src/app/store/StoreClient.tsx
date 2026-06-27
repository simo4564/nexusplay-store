"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import GameCard from "@/components/GameCard";
import { Game } from "@prisma/client";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

export default function StoreClient({ games }: { games: Game[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(200);

  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.genre));
    return Array.from(cats);
  }, [games]);

  const filteredGames = useMemo(() => {
    let result = games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? game.genre === selectedCategory : true;
      const matchesPrice = game.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

    return result;
  }, [games, searchQuery, selectedCategory, sortBy, maxPrice]);

  return (
    <div className={styles.store}>
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gradient"
          >
            Store
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.searchBar}
          >
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search for games..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
        
        <div className={`container ${styles.filters}`}>
          <button 
            className={`${styles.filterBtn} ${!selectedCategory ? styles.active : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={`container ${styles.advancedFilters}`}>
          <div className={styles.filterGroup}>
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.select}>
              <option value="newest">Newest Releases</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Max Price: ${maxPrice}</label>
            <input 
              type="range" 
              min="0" 
              max="200" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className={styles.slider}
            />
          </div>
        </div>
      </header>
      
      <main className={`container ${styles.main}`}>
        <motion.div layout className={styles.grid}>
          <AnimatePresence>
            {filteredGames.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.noResults}
              >
                <p>No games found matching your search.</p>
              </motion.div>
            ) : (
              filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
