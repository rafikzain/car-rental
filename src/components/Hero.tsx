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
  },
  {
    url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    caption: "Experience Performance",
  },
  {
    url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    caption: "Embrace Excellence",
  },
];

const Hero = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gray-900">
      <Carousel 
        className="w-full h-[80vh]" 
        opts={{ loop: true }}
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {carImages.map((image, index) => (
            <CarouselItem key={index} className="relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                style={{
                  backgroundImage: `url('${image.url}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
              </div>
              <div className="relative container mx-auto px-6 h-[80vh] flex items-center">
                <div className="max-w-2xl animate-fadeIn">
                  <h1 className="text-5xl font-bold text-white mb-6">
                    {image.caption}
                  </h1>
                  <p className="text-xl text-gray-200 mb-8">
                    Experience the thrill of driving premium vehicles. Buy or rent your dream car today.
                  </p>
                  <div className="space-x-4">
                    <Link
                      to="/cars"
                      className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Browse Cars
                    </Link>
                    <Link
                      to="/about"
                      className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 right-4 space-x-2">
          <CarouselPrevious className="relative translate-y-0 left-0 bg-white/20 hover:bg-white/40 border-none text-white" />
          <CarouselNext className="relative translate-y-0 right-0 bg-white/20 hover:bg-white/40 border-none text-white" />
        </div>
      </Carousel>
    </div>
  );
};

export default Hero;