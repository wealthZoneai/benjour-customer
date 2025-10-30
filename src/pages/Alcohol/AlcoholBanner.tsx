import React from "react";
import barBg from "../../assets/alcohol-banner.png";

const AlcoholBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[250px] md:h-[350px] overflow-hidden shadow-2xl rounded-3xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 hover:scale-105 rounded-3xl"
        style={{
          backgroundImage: `url(${barBg})`,
        }}
      />

      {/* Updated Gradient Overlay - smoother, darker for contrast */}
      <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/85 via-[#2b1b0a]/70 to-transparent rounded-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center rounded-3xl">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in-up">
            <span className="text-white">Discover Premium Spirits,</span>
            <span
              className="block mt-2 bg-linear-to-r from-amber-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent"
            >
              Crafted for Every <br /> Celebration
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
            {/* <button 
              className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 hover:from-yellow-400 hover:to-amber-500 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Explore Now
            </button> */}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-amber-300/25 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-float-slow" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-200/20 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-float" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center p-1">
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
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
};

export default AlcoholBanner;
