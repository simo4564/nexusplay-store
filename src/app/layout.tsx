import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Providers from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusPlay | Premium Digital Games",
  description: "Experience the ultimate collection of high-end digital masterpieces.",
  openGraph: {
    title: "NexusPlay | Premium Digital Games",
    description: "Experience the ultimate collection of high-end digital masterpieces.",
    url: "https://digital-games-store.vercel.app",
    siteName: "NexusPlay",
    images: [
      {
        url: "https://digital-games-store.vercel.app/images/hero_cyberpunk_game.jpg", // Using one of our high-end images
        width: 1200,
        height: 630,
        alt: "NexusPlay Storefront",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CustomCursor />
        <Providers>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
