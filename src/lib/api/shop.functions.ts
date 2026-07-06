import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url_1: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  brand_id: string | null;
  category_id: string | null;
  stock: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  brand?: { id: string; name: string; slug: string };
  category?: { id: string; name: string; slug: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_banner_image_url: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  parent?: Category;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string | null;
  deal_price: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  products?: Product[];
}

// Fetch all products with optional filters
export const getProducts = createServerFn({ method: "GET" })
  .validator(
    z.object({
      category_id: z.string().optional(),
      brand_id: z.string().optional(),
      featured: z.boolean().optional(),
      search: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    let query = supabase
      .from("products")
      .select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug)
      `)
      .eq("stock", 0, { not: true });

    if (data.category_id) {
      query = query.eq("category_id", data.category_id);
    }
    if (data.brand_id) {
      query = query.eq("brand_id", data.brand_id);
    }
    if (data.featured !== undefined) {
      query = query.eq("featured", data.featured);
    }
    if (data.search) {
      query = query.ilike("name", `%${data.search}%`);
    }

    if (data.limit) {
      query = query.limit(data.limit);
    }
    if (data.offset) {
      query = query.range(data.offset, data.offset + (data.limit || 10) - 1);
    }

    query = query.order("created_at", { ascending: false });

    const { data: products, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return (products as Product[]) || [];
  });

// Fetch single product by slug
export const getProductBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug)
      `)
      .eq("slug", data.slug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return product as Product;
  });

// Fetch all categories
export const getCategories = createServerFn({ method: "GET" })
  .validator(
    z.object({
      parent_id: z.string().nullable().optional(),
    })
  )
  .handler(async ({ data }) => {
    let query = supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (data.parent_id !== undefined) {
      query = query.eq("parent_id", data.parent_id);
    }

    const { data: categories, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return (categories as Category[]) || [];
  });

// Fetch category by slug with children
export const getCategoryBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", data.slug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    // Fetch children
    const { data: children } = await supabase
      .from("categories")
      .select("*")
      .eq("parent_id", category.id)
      .order("name", { ascending: true });

    return { ...category, children } as Category;
  });

// Fetch all brands
export const getBrands = createServerFn({ method: "GET" }).handler(async () => {
  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch brands: ${error.message}`);
  }

  return (brands as Brand[]) || [];
});

// Fetch brand by slug
export const getBrandBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { data: brand, error } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", data.slug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch brand: ${error.message}`);
    }

    return brand as Brand;
  });

// Fetch published blog posts
export const getBlogPosts = createServerFn({ method: "GET" })
  .validator(
    z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (data.limit) {
      query = query.limit(data.limit);
    }
    if (data.offset) {
      query = query.range(data.offset, data.offset + (data.limit || 10) - 1);
    }

    const { data: posts, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch blog posts: ${error.message}`);
    }

    return (posts as BlogPost[]) || [];
  });

// Fetch single blog post by slug
export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .single();

    if (error) {
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }

    return post as BlogPost;
  });

// Fetch active deals with products
export const getDeals = createServerFn({ method: "GET" })
  .validator(
    z.object({
      active: z.boolean().optional(),
      limit: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    let query = supabase
      .from("deals")
      .select(`
        *,
        deal_products(
          product:products(
            *,
            brand:brands(id, name, slug),
            category:categories(id, name, slug)
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (data.active !== undefined) {
      query = query.eq("active", data.active);
    }
    if (data.limit) {
      query = query.limit(data.limit);
    }

    const { data: deals, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch deals: ${error.message}`);
    }

    // Transform the data to match the Deal interface
    const transformedDeals = (deals || []).map((deal: any) => ({
      ...deal,
      products: deal.deal_products?.map((dp: any) => dp.product) || [],
    }));

    return transformedDeals as Deal[];
  });

// Fetch settings
export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data: settings, error } = await supabase
    .from("settings")
    .select("*");

  if (error) {
    throw new Error(`Failed to fetch settings: ${error.message}`);
  }

  const settingsMap: Record<string, string> = {};
  (settings || []).forEach((setting: any) => {
    settingsMap[setting.key] = setting.value;
  });

  return settingsMap;
});
