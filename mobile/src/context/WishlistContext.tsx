import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { IStudio, IProduct } from '../types';

interface WishlistContextType {
  studios: IStudio[];
  products: IProduct[];
  toggleStudio: (studioId: string) => Promise<void>;
  toggleProduct: (productId: string) => Promise<void>;
  isStudioInWishlist: (studioId: string) => boolean;
  isProductInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (res.data.success) {
          setStudios(res.data.studios || []);
          setProducts(res.data.products || []);
        }
      } catch (e) {}
    };
    fetchWishlist();
  }, []);

  const toggleStudio = async (studioId: string) => {
    try {
      const res = await api.post('/wishlist/toggle-studio', { studioId });
      if (res.data.success) {
        setStudios((prev) =>
          prev.some((s) => s._id === studioId)
            ? prev.filter((s) => s._id !== studioId)
            : [...prev, { _id: studioId } as IStudio]
        );
      }
    } catch (e) {}
  };

  const toggleProduct = async (productId: string) => {
    try {
      const res = await api.post('/wishlist/toggle-product', { productId });
      if (res.data.success) {
        setProducts((prev) =>
          prev.some((p) => p._id === productId)
            ? prev.filter((p) => p._id !== productId)
            : [...prev, { _id: productId } as IProduct]
        );
      }
    } catch (e) {}
  };

  const isStudioInWishlist = (studioId: string) => studios.some((s) => s._id === studioId);
  const isProductInWishlist = (productId: string) => products.some((p) => p._id === productId);

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

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
