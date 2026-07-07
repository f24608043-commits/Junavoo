import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './CardFlip.css';

interface CardFlipProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  image: string;
}

export default function CardFlip({
  title,
  subtitle,
  description,
  features,
  buttonText,
  buttonLink,
  image
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full h-80 perspective-1000 group">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        } group-hover:rotate-y-180`}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl">
          <div className="relative w-full h-full">
            <img 
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-sm opacity-90">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-2xl bg-white shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
            <p className="text-gray-700 mb-6">{description}</p>
            
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Link 
            to={buttonLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {buttonText}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
