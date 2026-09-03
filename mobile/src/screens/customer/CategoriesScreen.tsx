import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Camera, Gift, Sparkles, ChevronRight, ArrowRight } from 'lucide-react-native';
import api from '../../api/client';
import { IPhotoshootCategory } from '../../types';

export const CategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'photoshoots' | 'products'>('photoshoots');
  const [categories, setCategories] = useState<IPhotoshootCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const PRODUCT_CATEGORIES = [
    {
      id: 'frames',
      title: '🖼️ Solid Wood Photo Frames',
      desc: 'Handcrafted teak wood, matte black & rose gold frames with custom engraving.',
      startsAt: '₹499',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      tag: 'Frames',
    },
    {
      id: 'albums',
      title: '📖 Luxury Velvet & Leather Albums',
      desc: 'Flush-mount seamless panoramic layflat wedding & baby photo albums.',
      startsAt: '₹1,999',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      tag: 'Albums',
    },
    {
      id: 'canvas',
      title: '🎨 Museum Canvas Prints',
      desc: '300 DPI textured archival cotton canvas on solid timber stretcher bars.',
      startsAt: '₹799',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      tag: 'Canvas Prints',
    },
    {
      id: 'gifts',
      title: '🎁 Personalized Magic Mugs & Keepsakes',
      desc: 'Heat-activated magic ceramic mugs, 3D crystals, and couple keychains.',
      startsAt: '₹349',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      tag: 'Mugs',
    },
    {
      id: 'editing',
      title: '🧑‍🎨 High-End Photo Retouching',
      desc: 'Skin retouching, color grading, background replacement, and old photo restoration.',
      startsAt: '₹199',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      tag: 'Personalized Gifts',
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories || []);
        }
      } catch (e) {
        console.error('Categories error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Segmented Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'photoshoots' && styles.tabBtnActive]}
          onPress={() => setActiveTab('photoshoots')}
        >
          <Camera size={14} color={activeTab === 'photoshoots' ? '#0f172a' : '#94a3b8'} />
          <Text style={[styles.tabBtnText, activeTab === 'photoshoots' && styles.tabBtnTextActive]}>
            Photoshoot Disciplines
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'products' && styles.tabBtnActive]}
          onPress={() => setActiveTab('products')}
        >
          <Gift size={14} color={activeTab === 'products' ? '#0f172a' : '#94a3b8'} />
          <Text style={[styles.tabBtnText, activeTab === 'products' && styles.tabBtnTextActive]}>
            Photo Products
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'photoshoots' ? (
          /* PHOTOSHOOT DISCIPLINES */
          <View>
            <Text style={styles.sectionTitle}>Select Photoshoot Discipline</Text>
            <Text style={styles.sectionSubtitle}>
              Explore vetted studios, compare packages, and reserve shoot dates
            </Text>

            {isLoading ? (
              <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 30 }} />
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={styles.catCard}
                  onPress={() => navigation.navigate('PhotoshootTab', { selectedType: cat.name })}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: cat.image }} style={styles.catImage} />
                  <View style={styles.catInfo}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catDesc} numberOfLines={2}>
                      {cat.description}
                    </Text>

                    <View style={styles.catBottomRow}>
                      <Text style={styles.startsAt}>Starts ₹{cat.startingPrice?.toLocaleString('en-IN')}</Text>
                      <View style={styles.bookAction}>
                        <Text style={styles.bookActionText}>Book Shoot</Text>
                        <ChevronRight size={14} color="#f59e0b" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          /* PHOTO PRODUCTS */
          <View>
            <Text style={styles.sectionTitle}>Customizable Photo Keepsakes</Text>
            <Text style={styles.sectionSubtitle}>
              Personalize with your photos, engraved names & anniversary dates
            </Text>

            {PRODUCT_CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCatCard}
                onPress={() => navigation.navigate('StoreTab', { category: item.tag })}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.image }} style={styles.productCatImg} />
                <View style={styles.productCatInfo}>
                  <Text style={styles.productCatTitle}>{item.title}</Text>
                  <Text style={styles.productCatDesc}>{item.desc}</Text>

                  <View style={styles.catBottomRow}>
                    <Text style={styles.startsAt}>Starts {item.startsAt}</Text>
                    <View style={styles.bookAction}>
                      <Text style={styles.bookActionText}>Explore & Customize</Text>
                      <ArrowRight size={14} color="#f59e0b" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 6,
    margin: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#f59e0b',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },
  catCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  catImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#0f172a',
  },
  catInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  catName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  catDesc: {
    color: '#94a3b8',
    fontSize: 10,
    lineHeight: 14,
  },
  catBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startsAt: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
  bookAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bookActionText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
  },
  productCatCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  productCatImg: {
    width: '100%',
    height: 120,
    backgroundColor: '#0f172a',
  },
  productCatInfo: {
    padding: 14,
  },
  productCatTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  productCatDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
});
