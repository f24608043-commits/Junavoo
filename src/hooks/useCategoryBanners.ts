import { useMemo } from "react";

interface CategoryBannerData {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  ctaLink: string;
}

const CATEGORY_BANNERS: Record<string, CategoryBannerData> = {
  toys: {
    title: "Toys",
    description: "Discover amazing toys and games for kids of all ages",
    imageUrl: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop premium toys online",
    ctaLink: "/category/toys"
  },
  "gym-sports": {
    title: "Gym & Sports",
    description: "Build your strength and stay active with quality gym and sports equipment",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Buy high quality gym and sports equipment",
    ctaLink: "/category/gym-sports"
  },
  cosmetics: {
    title: "Cosmetics",
    description: "Enhance your beauty with premium cosmetics and skincare products",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop premium cosmetics and beauty products",
    ctaLink: "/category/cosmetics"
  },
  "garden-outdoor": {
    title: "Garden & Outdoor",
    description: "Create your perfect outdoor oasis with garden essentials and patio furniture",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop garden and outdoor living essentials",
    ctaLink: "/category/garden-outdoor"
  },
  "home-kitchen": {
    title: "Home & Kitchen",
    description: "Discover utensils and crockery for everyday living",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop home and kitchen essentials",
    ctaLink: "/category/home-kitchen"
  },
  tools: {
    title: "Tools",
    description: "Tackle any project with professional-grade tools and equipment",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop professional tools and equipment",
    ctaLink: "/category/tools"
  },
  "electronics-tech": {
    title: "Electronic & Tech",
    description: "Make your life easy with smart technology",
    imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop electronics and tech gadgets",
    ctaLink: "/category/electronics-tech"
  },
  beddings: {
    title: "Beddings",
    description: "Create your sanctuary with luxurious bedding and comfortable sleep essentials",
    imageUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop premium bedding and sleep essentials",
    ctaLink: "/category/beddings"
  },
  clothing: {
    title: "Clothing",
    description: "Express your style with trendy fashion apparel for every occasion",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop fashionable clothing and apparel",
    ctaLink: "/category/clothing"
  },
  crockery: {
    title: "Home & Kitchen",
    description: "Discover utensils and crockery for everyday living",
    imageUrl: "https://images.unsplash.com/photo-1578849675582-8d51ec53e05c?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop home and kitchen essentials",
    ctaLink: "/category/home-kitchen"
  },
  linean: {
    title: "Beddings",
    description: "Create your sanctuary with luxurious bedding and comfortable sleep essentials",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-acece34c2c8e?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop premium bedding and sleep essentials",
    ctaLink: "/category/beddings"
  },
  kapre: {
    title: "Clothing",
    description: "Express your style with trendy fashion apparel for every occasion",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop fashionable clothing and apparel",
    ctaLink: "/category/clothing"
  },
  hardware: {
    title: "Tools",
    description: "Tackle any project with professional-grade tools and equipment",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=400&fit=crop&q=75&auto=format",
    altText: "Shop professional tools and equipment",
    ctaLink: "/category/hardware"
  }
};

const FALLBACK_BANNER: CategoryBannerData = {
  title: "Category",
  description: "Discover amazing products in this category",
  imageUrl: "/images/hero-banner.svg",
  altText: "Shop products in this category",
  ctaLink: "/shop"
};

export function useCategoryBanner(categoryName?: string, categorySlug?: string) {
  return useMemo(() => {
    if (!categoryName && !categorySlug) {
      return FALLBACK_BANNER;
    }

    // Normalize inputs for matching
    const slugKey = categorySlug?.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const nameKey = categoryName?.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Try slug first, then name
    return CATEGORY_BANNERS[slugKey] || 
           CATEGORY_BANNERS[nameKey] || 
           FALLBACK_BANNER;
  }, [categoryName, categorySlug]);
}

// Helper function to add new categories
export function addCategoryBannerData(key: string, data: CategoryBannerData) {
  (CATEGORY_BANNERS as Record<string, CategoryBannerData>)[key] = data;
}