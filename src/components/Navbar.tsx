"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { items, toggleCart } = useCart();
  const { data: session } = useSession();
  
  // Calculate total items
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link href="/" className="logo text-gradient">NexusPlay</Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/store">Store</Link>
          {session ? (
            <>
              <Link href="/library">Library</Link>
              <Link href="/admin" style={{ color: '#c5a880' }}>Admin</Link>
            </>
          ) : (
            <Link href="/about">About</Link>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{gap: '0.5rem'}} onClick={toggleCart}>
            <ShoppingCart size={18} />
            Cart ({itemCount})
          </button>
          
          {session ? (
            <button className="btn btn-primary" style={{gap: '0.5rem'}} onClick={() => signOut()}>
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{gap: '0.5rem'}}>
              <User size={18} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
