import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import styles from "./page.module.css";
import { User, Mail, Calendar, Package } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch full user profile with order history
  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      orders: {
        include: { game: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) redirect("/login");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container">
          <h1 className="text-gradient">My Account</h1>
          <p className={styles.subtitle}>Manage your profile and view order history</p>
        </div>
      </header>

      <main className={`container ${styles.grid}`}>
        <section className={styles.profileSection}>
          <div className={styles.card}>
            <h2>Profile Details</h2>
            <div className={styles.avatarPlaceholder}>
              <User size={48} color="#c5a880" />
            </div>
            <div className={styles.infoGroup}>
              <div className={styles.infoRow}>
                <User size={18} className={styles.icon} />
                <div>
                  <label>Full Name</label>
                  <p>{user.name || "N/A"}</p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Mail size={18} className={styles.icon} />
                <div>
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Calendar size={18} className={styles.icon} />
                <div>
                  <label>Member Since</label>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem' }}>
              Edit Profile
            </button>
          </div>
        </section>

        <section className={styles.ordersSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Order History</h2>
              <Package size={24} className={styles.icon} />
            </div>
            
            {user.orders.length === 0 ? (
              <div className={styles.emptyState}>
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {user.orders.map((order) => (
                  <div key={order.id} className={styles.orderItem}>
                    <img src={order.game.imageUrl} alt={order.game.title} className={styles.orderImage} />
                    <div className={styles.orderDetails}>
                      <h3>{order.game.title}</h3>
                      <p className={styles.orderDate}>
                        Purchased on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={styles.orderPrice}>
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
