import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Search, Sparkles, Heart, Tag } from 'lucide-react-native';
import api from '../../api/client';
import { IProduct } from '../../types';
import { MobileCustomizer } from '../../components/customer/MobileCustomizer';
import { useWishlist } from '../../context/WishlistContext';

const CATEGORIES = [
  'All',
  'Frames',
  'Albums',
  'Canvas Prints',
  'Mugs',
  'Personalized Gifts',
];

export const ProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [customizingProduct, setCustomizingProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toggleProduct, isProductInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (search) params.append('search', search);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products || []);
        }
      } catch (e) {
        console.error('Products fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, search]);

  return (
    <View style={styles.container}>
      {/* Top Search & Categories Filter */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Search size={16} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search custom frames, mugs, canvas..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.catPill, selectedCategory === c && styles.catPillActive]}
              onPress={() => setSelectedCategory(c)}
            >
              <Text style={[styles.catText, selectedCategory === c && styles.catTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          <View style={styles.grid}>
            {products.map((prod) => {
              const inWishlist = isProductInWishlist(prod._id);
              const price = prod.discountPrice || prod.basePrice;

              return (
                <View key={prod._id} style={styles.productCard}>
                  <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => navigation.navigate('ProductDetail', { slug: prod.slug })}
                  >
                    <Image source={{ uri: prod.thumbnail }} style={styles.image} />
                    <TouchableOpacity
                      style={[styles.heartBtn, inWishlist && styles.heartBtnActive]}
                      onPress={() => toggleProduct(prod._id)}
                    >
                      <Heart size={12} color={inWishlist ? '#ffffff' : '#f8fafc'} fill={inWishlist ? '#ffffff' : 'transparent'} />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  <View style={styles.details}>
                    <Text style={styles.title} numberOfLines={1}>
                      {prod.title}
                    </Text>
                    <Text style={styles.categoryBadge}>{prod.category}</Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.price}>₹{price.toLocaleString('en-IN')}</Text>
                      {prod.discountPrice && (
                        <Text style={styles.oldPrice}>₹{prod.basePrice}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.customizeBtn}
                      onPress={() => setCustomizingProduct(prod)}
                    >
                      <Sparkles size={11} color="#0f172a" />
                      <Text style={styles.customizeText}>Customize</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Live 3D Customizer */}
      {customizingProduct && (
        <MobileCustomizer
          visible={!!customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          product={customizingProduct}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    paddingVertical: 8,
  },
  catScroll: {
    flexDirection: 'row',
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catPillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  catText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  catTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 4,
  },
  imageContainer: {
    height: 130,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 14,
  },
  heartBtnActive: {
    backgroundColor: '#e11d48',
  },
  details: {
    padding: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  categoryBadge: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  price: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  oldPrice: {
    color: '#64748b',
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#f59e0b',
    paddingVertical: 7,
    borderRadius: 10,
  },
  customizeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '900',
  },
});
