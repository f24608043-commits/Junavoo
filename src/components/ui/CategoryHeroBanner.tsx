import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCategoryHero } from "@/hooks/use-category-hero";
import { useEffect, useState } from "react";

interface CategoryHeroBannerProps {
  categoryName: string;
  categorySlug?: string;
}

export function CategoryHeroBanner({ categoryName, categorySlug }: CategoryHeroBannerProps) {
  const config = useCategoryHero(categoryName, categorySlug);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add custom CSS to document head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slowZoom {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
      }
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-slow-zoom {
        animation: slowZoom 20s ease-in-out infinite alternate;
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
      }
      .animation-delay-200 {
        animation-delay: 0.2s;
      }
      .animation-delay-400 {
        animation-delay: 0.4s;
      }
    `;
    document.head.appendChild(style);
    
    setIsLoaded(true);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="relative w-full h-[40vh] md:h-[45vh] lg:h-[60vh] overflow-hidden bg-gray-200" />
    );
  }

  return (
    <div className="relative w-full h-[40vh] md:h-[45vh] lg:h-[60vh] overflow-hidden">
      {/* Background Image with Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={config.imageUrl}
          alt={config.altText}
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
          loading="lazy"
        />
      </div>
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      {/* Mobile Gradient */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-7xl text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0">
            {/* Category Title - H1 for SEO */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight animate-fade-in-up">
              {config.title}
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium mb-6 md:mb-8 animate-fade-in-up animation-delay-200">
              {config.description}
            </p>
            
            {/* CTA Button */}
            {config.ctaText && config.ctaLink && (
              <div className="animate-fade-in-up animation-delay-400">
                <Link
                  to={config.ctaLink}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full md:w-auto"
                >
                  {config.ctaText}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
