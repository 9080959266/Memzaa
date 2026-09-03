import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Sparkles, Heart, ShieldCheck, Truck, RotateCw, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IProduct } from '../../types';
import { RatingStars } from '../../components/common/RatingStars';
import { MobileCustomizer } from '../../components/customer/MobileCustomizer';
import { useWishlist } from '../../context/WishlistContext';
import { CustomButton } from '../../components/common/CustomButton';

export const ProductDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { slug } = route.params;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toggleProduct, isProductInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (e) {
        console.error('Product error', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: '#ffffff' }}>Product not found</Text>
      </View>
    );
  }

  const inWishlist = isProductInWishlist(product._id);
  const price = product.discountPrice || product.basePrice;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />

          <TouchableOpacity
            style={[styles.heartBtn, inWishlist && styles.heartBtnActive]}
            onPress={() => toggleProduct(product._id)}
          >
            <Heart size={16} color={inWishlist ? '#ffffff' : '#ffffff'} fill={inWishlist ? '#ffffff' : 'transparent'} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.categoryBadge}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} showCount />
            <Text style={styles.stockText}>✓ In Stock & Customizable</Text>
          </View>

          {/* Price Strip */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{price.toLocaleString('en-IN')}</Text>
            {product.discountPrice && (
              <Text style={styles.oldPrice}>₹{product.basePrice}</Text>
            )}
            <View style={styles.freeShipBadge}>
              <Text style={styles.freeShipText}>Free Delivery</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeader}>Product Highlights</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Customization Inclusions */}
          <View style={styles.customInclusions}>
            <Text style={styles.inclusionsTitle}>✨ Customization Included:</Text>
            <Text style={styles.inclusionItem}>• Upload any high-res photo from your phone</Text>
            <Text style={styles.inclusionItem}>• Engraved couple names & anniversary date</Text>
            <Text style={styles.inclusionItem}>• Choice of 4 solid wood frame finishes</Text>
            <Text style={styles.inclusionItem}>• Archival 300 DPI fine-art print</Text>
          </View>

          {/* Guarantees */}
          <View style={styles.guaranteeGrid}>
            <View style={styles.guaranteeBox}>
              <ShieldCheck size={16} color="#f59e0b" />
              <Text style={styles.guaranteeTitle}>50-Yr Archival</Text>
            </View>
            <View style={styles.guaranteeBox}>
              <Truck size={16} color="#f59e0b" />
              <Text style={styles.guaranteeTitle}>3-5 Day Dispatch</Text>
            </View>
            <View style={styles.guaranteeBox}>
              <RotateCw size={16} color="#f59e0b" />
              <Text style={styles.guaranteeTitle}>Safe Transit</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Launch Customizer Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Base Price</Text>
          <Text style={styles.barPrice}>₹{price.toLocaleString('en-IN')}</Text>
        </View>

        <CustomButton
          title="Launch 3D Customizer"
          onPress={() => setIsCustomizerOpen(true)}
          icon={<Sparkles size={16} color="#0f172a" />}
          style={{ flex: 1, marginLeft: 16 }}
        />
      </View>

      {/* Live Customizer Modal */}
      {isCustomizerOpen && (
        <MobileCustomizer
          visible={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          product={product}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  imageContainer: {
    height: 280,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  heartBtnActive: {
    backgroundColor: '#e11d48',
  },
  detailsCard: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
    paddingBottom: 100,
  },
  categoryBadge: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  price: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  oldPrice: {
    color: '#64748b',
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  freeShipBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  freeShipText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  sectionHeader: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  customInclusions: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
    gap: 4,
  },
  inclusionsTitle: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  inclusionItem: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  guaranteeGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  guaranteeBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  guaranteeTitle: {
    color: '#cbd5e1',
    fontSize: 9,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  priceLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  barPrice: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
});
