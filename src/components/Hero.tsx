import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const carImages = [
  {
    url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    caption: "Discover Luxury",
    description: "Experience the epitome of automotive excellence with our curated collection of premium vehicles.",
  },
  {
    url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    caption: "Experience Performance",
    description: "Feel the thrill of unmatched performance with our selection of high-performance vehicles.",
  },
  {
    url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    caption: "Embrace Excellence",
    description: "Find your perfect match from our extensive collection of premium cars.",
  },
];

const Hero = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-gray-900">
      <Carousel 
        className="w-full h-[90vh]" 
        opts={{ loop: true }}
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {carImages.map((image, index) => (
            <CarouselItem key={index} className="relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url('${image.url}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              </div>
              <div className="relative container mx-auto px-6 h-[90vh] flex items-center">
                <div className="max-w-2xl animate-fadeIn space-y-8">
                  <h1 className="text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
                    {image.caption}
                  </h1>
                  <p className="text-xl text-gray-200 mb-8 leading-relaxed animate-fade-in delay-200">
                    {image.description}
                  </p>
                  <div className="space-x-6 animate-fade-in delay-300">
                    <Link
                      to="/sellers"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center space-x-2 shadow-lg"
                    >
                      <span>Browse Sellers</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                    <Link
                      to="/cars"
                      className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center space-x-2 shadow-lg"
                    >
                      <span>Browse Cars</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 011 1v6h-.05a2.5 2.5 0 01-4.9 0H14V7z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-8 right-8 space-x-4">
          <CarouselPrevious className="relative translate-y-0 left-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-none text-white" />
          <CarouselNext className="relative translate-y-0 right-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-none text-white" />
        </div>
      </Carousel>
    </div>
  );
};

export default Hero;