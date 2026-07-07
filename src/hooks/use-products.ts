import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<"products">;

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();

    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newProduct = payload.new as DbProduct;
            if (newProduct.active) {
              setProducts((prev) => [newProduct, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as DbProduct;
            setProducts((prev) => {
              if (!updated.active) {
                return prev.filter((p) => p.id !== updated.id);
              }
              const exists = prev.find((p) => p.id === updated.id);
              if (exists) {
                return prev.map((p) => (p.id === updated.id ? updated : p));
              }
              return [updated, ...prev];
            });
          } else if (payload.eventType === "DELETE") {
            const old = payload.old as Partial<DbProduct>;
            setProducts((prev) => prev.filter((p) => p.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, loading };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .single();
      setProduct(data);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel(`product-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products", filter: `id=eq.${id}` },
        (payload) => {
          const updated = payload.new as DbProduct;
          setProduct(updated.active ? updated : null);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  return { product, loading };
}
