import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/client';
import { ICart, ICartItemCustomization } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: ICart | null;
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number, customization?: ICartItemCustomization) => Promise<void>;
  addPackageToCart: (packageId: string, studioId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<string>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number = 1, customization?: ICartItemCustomization) => {
    try {
      const res = await api.post('/cart/add', { productId, quantity, customization });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const addPackageToCart = async (packageId: string, studioId?: string, quantity: number = 1) => {
    try {
      const res = await api.post('/cart/add', { packageId, studioId, quantity, itemType: 'package' });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add package to cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const applyCoupon = async (code: string): Promise<string> => {
    try {
      const res = await api.post('/cart/apply-coupon', { code });
      if (res.data.success) {
        setCart(res.data.cart);
        return res.data.message;
      }
      return 'Coupon applied';
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to apply coupon');
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        addToCart,
        addPackageToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
