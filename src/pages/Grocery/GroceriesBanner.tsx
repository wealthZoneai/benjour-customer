import React from 'react';

const GroceriesBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[250px] md:h-[350px] overflow-hidden shadow-2xl  ">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-emerald-900/70 via-emerald-800/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">
          {/* <span className="inline-block bg-white/20 backdrop-blur-sm text-emerald-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            🍏 Fresh & Organic
          </span> */}
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
            Fresh Groceries, 
            <span className="text-emerald-300 block mt-2">
              Delivered to Your Doorstep
            </span>
          </h1>

          {/* <p className="text-lg sm:text-xl text-emerald-100 mb-8 max-w-lg animate-fade-in-up animation-delay-200">
            Get handpicked, farm-fresh fruits, vegetables, and daily essentials — carefully sourced and delivered with love.
          </p> */}

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
            {/* <button 
              className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Learn more
            </button> */}

          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-slow" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-1deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
};

export default GroceriesBanner;
