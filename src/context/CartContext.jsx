import { createContext, useContext, useState } from 'react';
import { supabase } from '../supabaseClient';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Agregar producto al carrito
  const addToCart = async (product) => {
    if (product.stock <= 0) return;

    // Reducir stock en Supabase
    const { error } = await supabase
  .from('products')
  .update({ stock: product.stock - 1 })
  .eq('id', product.id)
  .select(); // 👈 importante: devuelve el producto actualizado

    if (error) {
      console.error("Error al actualizar stock:", error);
      return;
    }

    // Guardar en carrito
    setCart((prev) => [...prev, product]);
  };

  // Quitar producto del carrito (devuelve stock)
  const removeFromCart = async (id) => {
    const product = cart.find(p => p.id === id);
    if (!product) return;

    const { error } = await supabase
      .from('products')
      .update({ stock: product.stock + 1 })
      .eq('id', product.id);

    if (error) {
      console.error("Error al devolver stock:", error);
      return;
    }

    setCart((prev) => prev.filter(p => p.id !== id));
  };

  // Vaciar carrito (devuelve stock de todos)
  const clearCart = async () => {
    for (const product of cart) {
      await supabase
        .from('products')
        .update({ stock: product.stock + 1 })
        .eq('id', product.id);
    }
    setCart([]);
  };

  // Finalizar compra (no devuelve stock)
  const finalizePurchase = async () => {
    // acá podrías registrar la orden en otra tabla "orders"
    // y limpiar el carrito sin devolver stock
    setCart([]);
  };

  const subtotal = cart.reduce((sum, p) => sum + Number(p.price), 0);
  const discount = cart.length >= 3 ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      finalizePurchase,
      subtotal,
      discount,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);