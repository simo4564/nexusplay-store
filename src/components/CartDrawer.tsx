"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, CreditCard } from "lucide-react";
import { useCart } from "@/store/useCart";
import styles from "./CartDrawer.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, getTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2>Your Cart</h2>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.itemsList}>
              {items.length === 0 ? (
                <div className={styles.emptyCart}>
                  <p>Your cart is empty.</p>
                  <button className="btn btn-primary" onClick={() => setIsOpen(false)} style={{marginTop: '1rem'}}>
                    Browse Store
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <img src={item.imageUrl} alt={item.title} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <h4>{item.title}</h4>
                      <p className={styles.itemPrice}>${item.price} x {item.quantity}</p>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>${getTotal().toFixed(2)}</span>
                </div>
                <button className={`btn btn-primary ${styles.checkoutBtn}`} onClick={handleCheckout}>
                  <CreditCard size={20} style={{marginRight: '0.5rem'}} />
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
