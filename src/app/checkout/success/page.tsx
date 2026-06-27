"use client";

import { useEffect } from "react";
import { useCart } from "@/store/useCart";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css"; // Reuse checkout styles

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful return from Stripe
    clearCart();
  }, [clearCart]);

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.successCard}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        style={{ margin: '0 auto' }}
      >
        <CheckCircle2 size={64} className={styles.successIcon} />
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your digital game keys have been sent to your email and added to your Library.</p>
        <Link href="/library" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Go to Library
        </Link>
      </motion.div>
    </div>
  );
}
