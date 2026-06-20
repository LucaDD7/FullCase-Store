import { createContext, useContext, useState } from 'react';
import { supabase } from '../supabaseClient';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartVersion, setCartVersion] = useState(0);

  const bumpVersion = () => setCartVersion(v => v + 1);

  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    bumpVersion();
  };

  const incrementQuantity = async (id) => {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    const { data } = await supabase.from('products').select('stock').eq('id', id).single();
    if (!data || item.quantity >= data.stock) return;

    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
    bumpVersion();
  };

  const decrementQuantity = (id) => {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    setCart(prev => {
      if (item.quantity > 1) {
        return prev.map(p => p.id === id ? { ...p, quantity: p.quantity - 1 } : p);
      }
      return prev.filter(p => p.id !== id);
    });
    bumpVersion();
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
    bumpVersion();
  };

  const clearCart = () => {
    setCart([]);
    bumpVersion();
  };

  const finalizePurchase = async () => {
    for (const item of cart) {
      const { data } = await supabase.from('products').select('stock').eq('id', item.id).single();
      await supabase
        .from('products')
        .update({ stock: Math.max(0, (data?.stock ?? 0) - item.quantity) })
        .eq('id', item.id);
    }
    setCart([]);
    bumpVersion();
  };

  const subtotal = cart.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0);
  const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
  const discount = totalItems >= 3 ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  return (
    <CartContext.Provider value={{
      cart,
      cartVersion,
      addToCart,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
      finalizePurchase,
      subtotal,
      discount,
      total,
      totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
