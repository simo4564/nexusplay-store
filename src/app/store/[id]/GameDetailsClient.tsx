"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";
import { Game } from "@prisma/client";
import { ShoppingCart, Star, Share2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/store/useCart";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GameDetailsClient({ game }: { game: Game }) {
  const { addItem, setIsOpen } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToCart = () => {
    addItem(game);
    setIsOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id, rating, comment }),
      });
      if (res.ok) {
        setComment("");
        setRating(5);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBackground}>
          <img src={game.imageUrl} alt={game.title} className={styles.bgImage} />
        </div>
      </div>
      
      <main className={`container ${styles.mainContent}`}>
        <motion.div 
          className={styles.contentGrid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.leftColumn}>
            <div className={styles.coverWrapper}>
              <img src={game.imageUrl} alt={game.title} className={styles.coverImage} />
            </div>
          </div>
          
          <div className={styles.rightColumn}>
            <span className={styles.genre}>{game.genre}</span>
            <h1 className={styles.title}>{game.title}</h1>
            <div className={styles.meta}>
              <div className={styles.rating}>
                <Star className={styles.starIcon} size={18} fill="#f59e0b" />
                <span>4.8/5</span>
              </div>
              <span className={styles.developer}>Developer: {game.developer}</span>
            </div>
            
            <p className={styles.description}>{game.description}</p>
            
            <div className={styles.purchaseBox}>
              <div className={styles.priceContainer}>
                <span className={styles.price}>${game.price}</span>
              </div>
              <div className={styles.actions}>
                <button 
                  className="btn btn-primary" 
                  style={{ flexGrow: 1, gap: '0.5rem', fontSize: '1.1rem' }}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className={`btn ${styles.iconBtn}`}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Media Section */}
        <motion.div 
          className={styles.mediaSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Official Trailer</h2>
          <div className={styles.videoContainer}>
            {/* Mock video player using a generic open source Big Buck Bunny or just an iframe */}
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0" 
              title="Game Trailer" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className={styles.iframe}
            ></iframe>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div 
          className={styles.reviewsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Player Reviews</h2>
          
          <div className={styles.reviewFormContainer}>
            {session ? (
              <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                <h4>Write a Review</h4>
                <div className={styles.ratingSelect}>
                  <span>Rating:</span>
                  <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={24} 
                        fill={star <= rating ? "#f59e0b" : "transparent"} 
                        color={star <= rating ? "#f59e0b" : "#4b5563"}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you think of the game?"
                  required
                  className={styles.reviewInput}
                  rows={4}
                />
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className={styles.loginToReview}>
                <p>Please log in to leave a review.</p>
              </div>
            )}
          </div>

          <div className={styles.reviewsList}>
            {(game as any).reviews?.length > 0 ? (
              (game as any).reviews.map((review: any) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <h4>{review.user.name || 'Anonymous Player'}</h4>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "transparent"} color={i < review.rating ? "#f59e0b" : "#4b5563"} />
                      ))}
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <div className={styles.emptyReviews}>
                <p>No reviews yet. Be the first to review this game!</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
