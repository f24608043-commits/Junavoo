import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryHeroProps {
  title: string;
  description: string;
  imageUrl: string;
  ctaLink?: string;
  ctaText?: string;
}

export function CategoryHero({ 
  title, 
  description, 
  imageUrl, 
  ctaLink = "/shop", 
  ctaText = "Shop Now" 
}: CategoryHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Add optimized CSS to document head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slowZoom {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
      }
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-slow-zoom {
        animation: slowZoom 20s ease-in-out infinite alternate;
        will-change: transform;
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
      }
      .animation-delay-200 {
        animation-delay: 0.2s;
      }
      .animation-delay-400 {
        animation-delay: 0.4s;
      }
      .hero-container {
        contain: layout style paint;
      }
      .hero-image {
        backface-visibility: hidden;
        transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);
    
    setIsLoaded(true);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden bg-gray-200" />
    );
  }

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden hero-container">
      {/* Background Image with Performance Optimizations */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Shop premium ${title.toLowerCase()} online`}
          className={`absolute inset-0 w-full h-full object-cover hero-image transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100 animate-slow-zoom' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)} // Show content even if image fails
          style={{
            imageRendering: 'auto',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}
        />
        
        {/* Optimized Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
      </div>
      
      {/* Optimized Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      
      {/* Mobile Gradient */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      
      {/* Content Overlay with Performance Optimizations */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0">
            {/* Category Title - H1 for SEO */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight animate-fade-in-up leading-tight drop-shadow-lg">
              {title}
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-medium mb-6 md:mb-8 animate-fade-in-up animation-delay-200 leading-relaxed drop-shadow-md">
              {description}
            </p>
            
            {/* Optimized CTA Button */}
            <div className="animate-fade-in-up animation-delay-400">
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full md:w-auto transform-gpu"
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
                }}
              >
                {ctaText}
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
