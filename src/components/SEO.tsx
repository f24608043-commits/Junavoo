import { useEffect, useRef } from "react";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  jsonLd?: object | object[];
}

export default function SEO({
  title,
  description,
  url = typeof window !== "undefined" ? window.location.href : "",
  image = "https://junavoo.com/images/hero-banner.svg",
  type = "website",
  jsonLd,
}: SEOProps) {
  const jsonLdElementRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    document.title = `${title} | Junavo`;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("robots", "index, follow");
    
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", url, true);
    setMeta("og:image", image, true);
    setMeta("og:type", type, true);
    
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, url, image, type]);

  useEffect(() => {
    if (jsonLd) {
      if (jsonLdElementRef.current) {
        document.head.removeChild(jsonLdElementRef.current);
      }
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
      jsonLdElementRef.current = script;
    }
    return () => {
      if (jsonLdElementRef.current && document.head.contains(jsonLdElementRef.current)) {
        document.head.removeChild(jsonLdElementRef.current);
        jsonLdElementRef.current = null;
      }
    };
  }, [jsonLd]);

  return null;
}

export { generateWebsiteSchema, generateOrganizationSchema, generateFAQSchema, generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/schema-helpers";