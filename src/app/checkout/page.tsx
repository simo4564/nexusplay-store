"use client";

import { useCart } from "@/store/useCart";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    
    if (session) {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: getTotal() })
      });
    }

    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.successCard}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <CheckCircle2 size={64} className={styles.successIcon} />
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase. Your digital game keys have been sent to your email.</p>
          <Link href="/store" className="btn btn-primary" style={{ marginTop: '2rem' }}>
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="text-gradient">Checkout</h1>
      </header>

      <main className={`container ${styles.checkoutGrid}`}>
        <div className={styles.formSection}>
          <div className={styles.glassCard}>
            <h2>Payment Details</h2>
            <form onSubmit={(e) => { e.preventDefault(); handlePay(); }} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Cardholder Name</label>
                <input type="text" placeholder="John Doe" required className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label>Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" required className={styles.input} />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>CVC</label>
                  <input type="text" placeholder="123" required className={styles.input} />
                </div>
              </div>
              
              <button 
                type="submit" 
                className={`btn btn-primary ${styles.payBtn}`}
                disabled={isProcessing || items.length === 0}
              >
                {isProcessing ? "Processing..." : `Pay $${getTotal().toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.glassCard}>
            <h2>Order Summary</h2>
            <div className={styles.itemsList}>
              {items.length === 0 ? (
                <p className={styles.empty}>Your cart is empty.</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <img src={item.imageUrl} alt={item.title} className={styles.itemImage} />
                    <div className={styles.itemInfo}>
                      <h4>{item.title}</h4>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalPrice}>${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
