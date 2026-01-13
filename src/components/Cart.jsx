import React from 'react';
import { useCart } from '../context/CartContext';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="p-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4 p-4 border rounded-lg">
                  <img
                    src={item.img || item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                    className="w-20 h-20 object-cover rounded"
                    alt={item.title || item.name || 'Product'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-lg font-bold text-orange-500">{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-gray-200 rounded"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-3 py-1 bg-gray-100 rounded">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-gray-200 rounded"
                      >
                        <FaPlus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 bg-red-500 text-white rounded ml-2"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total: ₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;