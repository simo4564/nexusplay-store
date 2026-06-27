import { Game } from "@prisma/client";
import styles from "./GameCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/useCart";
import Tilt from "react-parallax-tilt";

export default function GameCard({ game }: { game: Game }) {
  const { addItem, setIsOpen } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a link
    e.stopPropagation();
    addItem(game);
    setIsOpen(true);
  };

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1000}
      transitionSpeed={1500}
      scale={1.02}
      gyroscope={true}
      className={styles.cardWrapper}
    >
      <div className={styles.card}>
        <Link href={`/store/${game.id}`} className={styles.imageContainer}>
          <img
            src={game.imageUrl}
            alt={game.title}
            className={styles.image}
          />
          <div className={styles.overlay}>
            <span className={styles.viewText}>View Details</span>
          </div>
        </Link>
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{game.title}</h3>
            <span className={styles.price}>${game.price}</span>
          </div>
          <p className={styles.genre}>{game.genre}</p>
          <div className={styles.actions}>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', gap: '0.5rem' }}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Tilt>
  );
}
