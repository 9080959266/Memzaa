import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { ICart, ICartItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: ICart;
  itemCount: number;
  addToCart: (productId: string, quantity: number, customization?: any) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<string>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const emptyCart: ICart = {
  items: [],
  subtotal: 0,
  discount: 0,
  deliveryFee: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<ICart>(emptyCart);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      // Fallback local cart
      const stored = await AsyncStorage.getItem('@memora_cart');
      if (stored) setCart(JSON.parse(stored));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1, customization?: any) => {
    try {
      setIsLoading(true);
      const res = await api.post('/cart/items', { productId, quantity, customization });
      if (res.data.success) {
        setCart(res.data.cart);
        await AsyncStorage.setItem('@memora_cart', JSON.stringify(res.data.cart));
      }
    } catch (err) {
      // Local fallback
      setCart((prev) => {
        const newItem: ICartItem = {
          _id: `local_item_${Date.now()}`,
          productId: { _id: productId, title: 'Personalized Photo Keepsake', basePrice: 1299 },
          quantity,
          unitPrice: 1299,
          itemTotal: 1299 * quantity,
          customization,
        };
        const updatedItems = [...prev.items, newItem];
        const subtotal = updatedItems.reduce((acc, i) => acc + i.itemTotal, 0);
        const updated = {
          ...prev,
          items: updatedItems,
          subtotal,
          deliveryFee: subtotal > 1500 ? 0 : 99,
          total: subtotal + (subtotal > 1500 ? 0 : 99),
        };
        AsyncStorage.setItem('@memora_cart', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(itemId);
        return;
      }
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        await AsyncStorage.setItem('@memora_cart', JSON.stringify(res.data.cart));
      }
    } catch (err) {
      setCart((prev) => {
        const updated = {
          ...prev,
          items: prev.items.map((i) =>
            i._id === itemId ? { ...i, quantity, itemTotal: i.unitPrice * quantity } : i
          ),
        };
        const subtotal = updated.items.reduce((acc, i) => acc + i.itemTotal, 0);
        updated.subtotal = subtotal;
        updated.total = subtotal - updated.discount + updated.deliveryFee;
        return updated;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      if (res.data.success) {
        setCart(res.data.cart);
        await AsyncStorage.setItem('@memora_cart', JSON.stringify(res.data.cart));
      }
    } catch (err) {
      setCart((prev) => {
        const updated = {
          ...prev,
          items: prev.items.filter((i) => i._id !== itemId),
        };
        const subtotal = updated.items.reduce((acc, i) => acc + i.itemTotal, 0);
        updated.subtotal = subtotal;
        updated.total = subtotal - updated.discount + updated.deliveryFee;
        return updated;
      });
    }
  };

  const applyCoupon = async (code: string) => {
    const res = await api.post('/cart/coupon', { code });
    if (res.data.success) {
      setCart(res.data.cart);
      return res.data.message || 'Coupon applied successfully!';
    }
    throw new Error(res.data.message || 'Invalid coupon code');
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
    } catch (e) {}
    setCart(emptyCart);
    await AsyncStorage.removeItem('@memora_cart');
  };

  const itemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
