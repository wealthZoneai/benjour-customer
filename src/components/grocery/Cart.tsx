import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center z-50"
      >
        <FaShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Your Cart ({totalItems} items)</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaShoppingCart size={48} className="mb-4" />
                <p>Your cart is empty</p>
                <p className="text-sm mt-2">Add items to get started</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-l-md hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-10 text-center border-t border-b">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-r-md hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t sticky bottom-0 bg-white">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/checkout');
                      setIsOpen(false);
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
