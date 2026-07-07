import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbCategory = Tables<"categories">;

export function useCategories() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      setCategories(data || []);
      setLoading(false);
    };

    fetchCategories();

    const channel = supabase
      .channel("categories-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newCat = payload.new as DbCategory;
            if (newCat.active) setCategories((prev) => [...prev, newCat]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as DbCategory;
            setCategories((prev) => {
              if (!updated.active) return prev.filter((c) => c.id !== updated.id);
              const exists = prev.find((c) => c.id === updated.id);
              if (exists) return prev.map((c) => (c.id === updated.id ? updated : c));
              return [...prev, updated];
            });
          } else if (payload.eventType === "DELETE") {
            const old = payload.old as Partial<DbCategory>;
            setCategories((prev) => prev.filter((c) => c.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { categories, loading };
}
