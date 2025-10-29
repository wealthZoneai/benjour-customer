import React from "react";
 
interface PageHeaderProps {
  title: string;
}
 
const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <header className="relative mx-1 md:mx-2 h-[205px] md:h-[255px] overflow-hidden mb-5 shadow-lg">
      {/* Background Image */}
      <img
        src={`https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80`}
        alt={`${title} Banner`}
        className="absolute inset-0 w-full h-full object-cover object-right "
      />
 
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent " />
 
      {/* Title Section */}
      <div className="relative z-10 flex items-center h-full pl-6 md:pl-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-wide">
            {title}
          </h1>
          <div className="w-24 h-1 bg-amber-400 mt-2 rounded-full" />
          <p className="text-sm md:text-base text-gray-200 mt-2 italic">
            Explore our exclusive collection
          </p>
        </div>
      </div>
 
      {/* Soft Shine Animation */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-3xl" />
    </header>
  );
};
 
export default PageHeader;