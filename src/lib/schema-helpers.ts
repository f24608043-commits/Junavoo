export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Junavo",
  "url": "https://junavoo.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://junavoo.com/shop?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Junavo",
  "url": "https://junavoo.com",
  "logo": "https://junavoo.com/favicon.svg",
  "sameAs": [
    "https://facebook.com/junavoo",
    "https://instagram.com/junavoo",
    "https://twitter.com/junavoo"
  ]
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateCollectionPageSchema = (products: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Shop All Products",
  "url": "https://junavoo.com/shop",
  "hasPart": products.map(p => ({
    "@type": "Product",
    "name": p.name,
    "url": p.url
  }))
});