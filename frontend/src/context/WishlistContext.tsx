import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/client';
import { IStudio, IProduct } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  studios: IStudio[];
  products: IProduct[];
  toggleStudio: (studioId: string) => Promise<void>;
  toggleProduct: (productId: string) => Promise<void>;
  isStudioInWishlist: (studioId: string) => boolean;
  isProductInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setStudios([]);
      setProducts([]);
      return;
    }
    try {
      const res = await api.get('/wishlist');
      if (res.data.success && res.data.wishlist) {
        setStudios(res.data.wishlist.studios || []);
        setProducts(res.data.wishlist.products || []);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleStudio = async (studioId: string) => {
    if (!isAuthenticated) return;
    try {
      const res = await api.post('/wishlist/toggle-studio', { studioId });
      if (res.data.success && res.data.wishlist) {
        setStudios(res.data.wishlist.studios || []);
        setProducts(res.data.wishlist.products || []);
      }
    } catch {
      // Ignore
    }
  };

  const toggleProduct = async (productId: string) => {
    if (!isAuthenticated) return;
    try {
      const res = await api.post('/wishlist/toggle-product', { productId });
      if (res.data.success && res.data.wishlist) {
        setStudios(res.data.wishlist.studios || []);
        setProducts(res.data.wishlist.products || []);
      }
    } catch {
      // Ignore
    }
  };

  const isStudioInWishlist = (studioId: string) => {
    return studios.some(s => (s._id || s.toString()) === studioId);
  };

  const isProductInWishlist = (productId: string) => {
    return products.some(p => (p._id || p.toString()) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        studios,
        products,
        toggleStudio,
        toggleProduct,
        isStudioInWishlist,
        isProductInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
