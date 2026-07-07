import { useMemo } from "react";

interface CategoryHeroData {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  ctaText?: string;
  ctaLink?: string;
}

const CATEGORY_HERO_DATA: Record<string, CategoryHeroData> = {
  toys: {
    title: "Toys",
    description: "Discover amazing toys that spark imagination and endless fun for kids of all ages",
    imageUrl: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop premium toys and games for children",
    ctaText: "Shop Now",
    ctaLink: "/category/toys"
  },
  "gym-sports": {
    title: "Gym & Sports",
    description: "Transform your fitness journey with professional gym equipment and sports gear",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop premium gym and sports equipment",
    ctaText: "Shop Now",
    ctaLink: "/category/gym-sports"
  },
  cosmetics: {
    title: "Cosmetics",
    description: "Enhance your natural beauty with premium makeup and skincare products",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop luxury cosmetics and beauty products",
    ctaText: "Shop Now",
    ctaLink: "/category/cosmetics"
  },
  "garden-outdoor": {
    title: "Garden & Outdoor",
    description: "Create your perfect outdoor oasis with garden essentials and patio furniture",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop garden and outdoor living essentials",
    ctaText: "Shop Now",
    ctaLink: "/category/garden-outdoor"
  },
  "home-kitchen": {
    title: "Home & Kitchen",
    description: "Elevate your living space with stylish home decor and kitchen essentials",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop home and kitchen essentials",
    ctaText: "Shop Now",
    ctaLink: "/category/home-kitchen"
  },
  hardware: {
    title: "Tools & Hardware",
    description: "Tackle any project with professional-grade tools and equipment",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop professional tools and equipment",
    ctaText: "Shop Now",
    ctaLink: "/category/hardware"
  },
  tools: {
    title: "Tools",
    description: "Tackle any project with professional-grade tools and equipment",
    imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop professional tools and equipment",
    ctaText: "Shop Now",
    ctaLink: "/category/tools"
  },
  "electronics-tech": {
    title: "Electronics & Tech",
    description: "Stay connected and productive with cutting-edge electronics and tech gadgets",
    imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop electronics and tech gadgets",
    ctaText: "Shop Now",
    ctaLink: "/category/electronics-tech"
  },
  electronics: {
    title: "Electronic & Tech",
    description: "Make your life easy with smart technology",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop electronics and tech gadgets",
    ctaText: "Shop Now",
    ctaLink: "/category/electronics"
  },
  beddings: {
    title: "Beddings",
    description: "Create your sanctuary with luxurious bedding and comfortable sleep essentials",
    imageUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop premium bedding and sleep essentials",
    ctaText: "Shop Now",
    ctaLink: "/category/beddings"
  },
  linean: {
    title: "Beddings",
    description: "Create your sanctuary with luxurious bedding and comfortable sleep essentials",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-acece34c2c8e?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop premium bedding and sleep essentials",
    ctaText: "Shop Now",
    ctaLink: "/category/linean"
  },
  clothing: {
    title: "Clothing",
    description: "Express your style with trendy fashion apparel for every occasion",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop fashionable clothing and apparel",
    ctaText: "Shop Now",
    ctaLink: "/category/clothing"
  },
  kapre: {
    title: "Clothing",
    description: "Express your style with trendy fashion apparel for every occasion",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop fashionable clothing and apparel",
    ctaText: "Shop Now",
    ctaLink: "/category/kapre"
  },
  crockery: {
    title: "Crockery",
    description: "Discover utensils and crockery and decorations",
    imageUrl: "https://images.unsplash.com/photo-1578849675582-8d51ec53e05c?w=1200&h=600&fit=crop&q=75&auto=format",
    altText: "Shop home and kitchen essentials",
    ctaText: "Shop Now",
    ctaLink: "/category/crockery"
  }
};

const FALLBACK_HERO_DATA: CategoryHeroData = {
  title: "Category",
  description: "Discover amazing products in this category",
  imageUrl: "/images/hero-banner.svg",
  altText: "Shop products in this category",
  ctaText: "Shop Now",
  ctaLink: "/shop"
};

export function useCategoryHero(categoryName?: string, categorySlug?: string) {
  return useMemo(() => {
    if (!categoryName && !categorySlug) {
      return FALLBACK_HERO_DATA;
    }

    // Normalize inputs for matching
    const slugKey = categorySlug?.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const nameKey = categoryName?.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Try slug first, then name
    return CATEGORY_HERO_DATA[slugKey] || 
           CATEGORY_HERO_DATA[nameKey] || 
           FALLBACK_HERO_DATA;
  }, [categoryName, categorySlug]);
}

// Helper function to add new categories
export function addCategoryHeroData(key: string, data: CategoryHeroData) {
  (CATEGORY_HERO_DATA as Record<string, CategoryHeroData>)[key] = data;
}
