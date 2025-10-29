import ProductCard from "./ProductCard";

// Placeholder Data (replace with your actual API data)
const dummyProducts: Product[] = [
    { id: 1, name: "Craft IPA", price: 12.99, imageUrl: "...", category: 'alcohol' },
    { id: 2, name: "Organic Apples", price: 3.49, imageUrl: "...", category: 'grocery' },
    { id: 3, name: "Fine Merlot", price: 25.00, imageUrl: "...", category: 'alcohol' },
    { id: 4, name: "Aged Cheddar", price: 7.99, imageUrl: "...", category: 'grocery' },
    { id: 5, name: "Whiskey", price: 45.00, imageUrl: "...", category: 'alcohol' },
    { id: 6, name: "Bananas", price: 0.99, imageUrl: "...", category: 'grocery' },
];

const MainContent: React.FC<{ onAddToCart: (id: number) => void }> = ({ onAddToCart }) => {
  const alcoholProducts = dummyProducts.filter(p => p.category === 'alcohol');
  const groceryProducts = dummyProducts.filter(p => p.category === 'grocery');

  const QuickAccess = () => (
    <div className="flex overflow-x-scroll snap-x space-x-3 md:space-x-4 py-3 mb-8 no-scrollbar">
      {['Beer & Wine', 'Spirits', 'Fresh Produce', 'Dairy', 'Snacks', 'Bakery'].map(cat => (
        <div 
          key={cat} 
          className="flex-shrink-0 px-5 py-2 bg-white border border-gray-300 rounded-full cursor-pointer text-sm font-medium hover:bg-blue-600 hover:text-white transition-all snap-center"
        >
          {cat}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <QuickAccess />

      {/* --- Alcohol Section --- */}
      <section className="product-section bg-gray-900 text-white p-6 rounded-xl mb-12">
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-3">🔥 Top Shelf Alcohol Picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {alcoholProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>
      
      {/* --- Groceries Section --- */}
      <section className="product-section bg-green-50 p-6 rounded-xl">
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-green-500 pl-3">🥦 Daily Grocery Essentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groceryProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainContent;

// NOTE: You must also define the Product interface in MainContent.tsx if it's not imported globally.