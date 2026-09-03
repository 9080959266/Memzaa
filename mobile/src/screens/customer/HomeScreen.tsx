import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { Search, Sparkles, MapPin, Star, Heart, ShieldCheck, Headphones, Zap, Gift, Camera, ChevronRight, Package, Truck, Layers, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IStudio, IProduct } from '../../types';
import { Header } from '../../components/common/Header';
import { MobileCustomizer } from '../../components/customer/MobileCustomizer';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeSegment, setActiveSegment] = useState<'all' | 'for_you' | 'trending'>('all');
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [isLoading, setIsLoading] = useState(true);

  // Customizer modal
  const [customizingProduct, setCustomizingProduct] = useState<IProduct | null>(null);

  const NEARBY_STUDIOS_DEMO = [
    {
      _id: 's1',
      name: 'Priya Frames & Photo Gifts',
      rating: 4.9,
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      price: 499,
    },
    {
      _id: 's2',
      name: 'Classic Photo Framing & Arts',
      rating: 4.8,
      distance: '1.5 km',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      price: 450,
    },
    {
      _id: 's3',
      name: 'Star Gift Creators & Digital Studio',
      rating: 4.6,
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      price: 349,
    },
    {
      _id: 's4',
      name: 'Golden Memories Studio Shop',
      rating: 4.3,
      distance: '3.2 km',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      price: 520,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studiosRes, prodRes] = await Promise.all([
          api.get('/studios?limit=8'),
          api.get('/products?featured=true&limit=6'),
        ]);

        if (studiosRes.data.success && studiosRes.data.studios?.length > 0) {
          setStudios(studiosRes.data.studios);
        } else {
          setStudios(NEARBY_STUDIOS_DEMO as any);
        }
        if (prodRes.data.success) setProducts(prodRes.data.products || []);
      } catch (e) {
        setStudios(NEARBY_STUDIOS_DEMO as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayStudios = studios.length > 0 ? studios : NEARBY_STUDIOS_DEMO;

  return (
    <View style={styles.container}>
      {/* Top Bar with Location, Search, Wishlist, Notification */}
      <Header
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        navigation={navigation}
      />

      {/* TOP SEGMENT TABS (All | For You | Trending) */}
      <View style={styles.topSegmentBar}>
        {[
          { key: 'all', label: 'All' },
          { key: 'for_you', label: 'For You' },
          { key: 'trending', label: 'Trending' },
        ].map((tab) => {
          const isActive = activeSegment === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.segmentTab, isActive && styles.segmentTabActive]}
              onPress={() => setActiveSegment(tab.key as any)}
            >
              <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* GRAND MEESHO-STYLE MEMORA HERO BANNER (Exactly matching uploaded screenshot) */}
        <View style={styles.heroBannerContainer}>
          <View style={styles.heroBannerCard}>
            {/* Header Script */}
            <View style={styles.heroTopRow}>
              <Text style={styles.scriptQuote}>Moments Today, ✨{'\n'}Memories Forever</Text>
            </View>

            {/* MEMORA Brand Title */}
            <View style={styles.brandTitleRow}>
              <Text style={styles.heroBrandM}>M</Text>
              <Text style={styles.heroBrandName}>MEMORA</Text>
              <Heart size={14} color="#ec4899" fill="#ec4899" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.heroTagline}>
              ♥ Personalized with Love, Delivered with Care. ♥
            </Text>

            {/* Composite Images Collage Row */}
            <View style={styles.collageRow}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80' }}
                style={styles.collageFrame}
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' }}
                style={styles.collageMug}
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80' }}
                style={styles.collageAlbum}
              />
            </View>

            {/* 5 Feature Cards */}
            <View style={styles.fiveFeaturesRow}>
              <View style={styles.featurePill}>
                <Text style={styles.featureIcon}>🏠</Text>
                <Text style={styles.featureTitle}>CAPTURE</Text>
                <Text style={styles.featureSub}>Every Moment</Text>
              </View>

              <View style={styles.featurePill}>
                <Text style={styles.featureIcon}>📖</Text>
                <Text style={styles.featureTitle}>PERSONALIZE</Text>
                <Text style={styles.featureSub}>Your Story</Text>
              </View>

              <View style={styles.featurePill}>
                <Text style={styles.featureIcon}>🎁</Text>
                <Text style={styles.featureTitle}>GIFT</Text>
                <Text style={styles.featureSub}>What Matters</Text>
              </View>

              <View style={styles.featurePill}>
                <Text style={styles.featureIcon}>🛡️</Text>
                <Text style={styles.featureTitle}>QUALITY</Text>
                <Text style={styles.featureSub}>You Can Trust</Text>
              </View>

              <View style={styles.featurePill}>
                <Text style={styles.featureIcon}>📦</Text>
                <Text style={styles.featureTitle}>DELIVERED</Text>
                <Text style={styles.featureSub}>With Care</Text>
              </View>
            </View>

            {/* Trust Badges Strip */}
            <View style={styles.trustStrip}>
              <View style={styles.trustItem}>
                <Sparkles size={11} color="#fbcfe8" />
                <Text style={styles.trustText}>Premium Quality</Text>
              </View>
              <View style={styles.trustItem}>
                <Heart size={11} color="#fbcfe8" />
                <Text style={styles.trustText}>Made with Love</Text>
              </View>
              <View style={styles.trustItem}>
                <ShieldCheck size={11} color="#fbcfe8" />
                <Text style={styles.trustText}>Secure Payments</Text>
              </View>
              <View style={styles.trustItem}>
                <Headphones size={11} color="#fbcfe8" />
                <Text style={styles.trustText}>24/7 Support</Text>
              </View>
              <View style={styles.trustItem}>
                <Zap size={11} color="#fbcfe8" />
                <Text style={styles.trustText}>Fast & Safe</Text>
              </View>
            </View>

            {/* Bottom Quote Banner */}
            <View style={styles.bottomQuoteRow}>
              <Heart size={14} color="#ffffff" fill="#ffffff" />
              <Text style={styles.bottomQuoteText}>
                Because some moments deserve to live forever ♥
              </Text>
            </View>
          </View>
        </View>

        {/* NEARBY STUDIOS SECTION (Matching uploaded screenshot 2-column grid) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Studios</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Studios')}>
            <Text style={styles.seeAllPink}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nearbyGrid}>
          {displayStudios.slice(0, 6).map((studio: any, idx: number) => {
            const distanceText = studio.distance || `${(1.1 + idx * 0.4).toFixed(1)} km`;
            const studioImage =
              studio.logoImage ||
              studio.image ||
              studio.bannerImage ||
              'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';

            return (
              <TouchableOpacity
                key={studio._id || idx}
                style={styles.nearbyCard}
                onPress={() => navigation.navigate('StudioDetail', { id: studio._id })}
                activeOpacity={0.88}
              >
                <View style={styles.nearbyImageContainer}>
                  <Image source={{ uri: studioImage }} style={styles.nearbyImage} />
                </View>

                <View style={styles.nearbyInfo}>
                  <Text style={styles.nearbyTitle} numberOfLines={1}>
                    {studio.name}
                  </Text>

                  <View style={styles.ratingDistanceRow}>
                    <Star size={11} color="#eab308" fill="#eab308" />
                    <Text style={styles.ratingText}>
                      {(studio.rating || 4.8).toFixed(1)} • {distanceText}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TRENDING PHOTO GIFTS & KEEPSAKES */}
        <View style={[styles.sectionHeader, { marginTop: 14 }]}>
          <Text style={styles.sectionTitle}>Customizable Photo Gifts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}>
            <Text style={styles.seeAllPink}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
          {products.map((prod) => (
            <View key={prod._id} style={styles.productCard}>
              <Image source={{ uri: prod.thumbnail }} style={styles.productImage} />
              <View style={styles.productContent}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {prod.title}
                </Text>
                <Text style={styles.productPrice}>
                  ₹{(prod.discountPrice || prod.basePrice).toLocaleString('en-IN')}
                </Text>

                <TouchableOpacity
                  style={styles.customizeBtn}
                  onPress={() => setCustomizingProduct(prod)}
                >
                  <Sparkles size={11} color="#ffffff" />
                  <Text style={styles.customizeBtnText}>Customize</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Live Customizer Modal */}
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
    backgroundColor: '#f8fafc',
  },
  topSegmentBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  segmentTabActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: '#db2777', // Hot pink indicator
  },
  segmentLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  segmentLabelActive: {
    color: '#db2777',
    fontWeight: '900',
  },
  scroll: {
    flex: 1,
  },
  heroBannerContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  heroBannerCard: {
    backgroundColor: '#3b0764', // Deep royal purple
    borderRadius: 22,
    padding: 14,
    shadowColor: '#3b0764',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  heroTopRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  scriptQuote: {
    color: '#f472b6',
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '700',
    textAlign: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  heroBrandM: {
    color: '#ec4899',
    fontSize: 24,
    fontWeight: '900',
  },
  heroBrandName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTagline: {
    color: '#cbd5e1',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  collageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 6,
  },
  collageFrame: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#b45309',
  },
  collageMug: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  collageAlbum: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  fiveFeaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 8,
    marginTop: 10,
  },
  featurePill: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '900',
  },
  featureSub: {
    color: '#fbcfe8',
    fontSize: 6,
    marginTop: 1,
  },
  trustStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trustText: {
    color: '#fbcfe8',
    fontSize: 7,
    fontWeight: '700',
  },
  bottomQuoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#db2777',
    borderRadius: 12,
    paddingVertical: 7,
    marginTop: 10,
  },
  bottomQuoteText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '900',
  },
  seeAllPink: {
    color: '#db2777', // Hot Pink
    fontSize: 12,
    fontWeight: '800',
  },
  nearbyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  nearbyCard: {
    width: (width - 34) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 4,
  },
  nearbyImageContainer: {
    height: 105,
    backgroundColor: '#f1f5f9',
  },
  nearbyImage: {
    width: '100%',
    height: '100%',
  },
  nearbyInfo: {
    padding: 10,
  },
  nearbyTitle: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
  ratingDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  productsScroll: {
    paddingLeft: 14,
    marginBottom: 20,
  },
  productCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#f1f5f9',
  },
  productContent: {
    padding: 8,
  },
  productTitle: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  productPrice: {
    color: '#db2777',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 6,
  },
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#db2777',
    paddingVertical: 5,
    borderRadius: 6,
  },
  customizeBtnText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});
