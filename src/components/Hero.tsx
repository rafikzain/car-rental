import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      <div className="relative container mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl animate-fadeIn">
          <h1 className="text-5xl font-bold text-white mb-6">
            Luxury Cars at Your Fingertips
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
    </div>
  );
};

export default Hero;