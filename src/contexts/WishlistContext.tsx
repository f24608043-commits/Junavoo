import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type WishlistContextType = {
  items: string[];
  toggleItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  totalItems: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const KEY = "junavo-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const hasItem = (id: string) => items.includes(id);

  return (
    <WishlistContext.Provider value={{ items, toggleItem, hasItem, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
