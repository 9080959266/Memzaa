import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, ShieldCheck, Star, Calendar, CheckCircle2, Camera, Heart, Clock } from 'lucide-react-native';
import api from '../../api/client';
import { IStudio, IPackage, IReview } from '../../types';
import { RatingStars } from '../../components/common/RatingStars';
import { BookingModal } from '../../components/customer/BookingModal';
import { useWishlist } from '../../context/WishlistContext';

export const StudioDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { id } = route.params;
  const { toggleStudio, isStudioInWishlist } = useWishlist();

  const [studio, setStudio] = useState<IStudio | null>(null);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [activeTab, setActiveTab] = useState<'packages' | 'portfolio' | 'amenities' | 'reviews'>('packages');
  const [selectedPkg, setSelectedPkg] = useState<IPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/studios/${id}`);
        if (res.data.success) {
          setStudio(res.data.studio);
          setPackages(res.data.packages || []);
          setReviews(res.data.reviews || []);
        }
      } catch (e) {
        console.error('Studio fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchStudio();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  if (!studio) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: '#ffffff' }}>Studio not found</Text>
      </View>
    );
  }

  const inWishlist = isStudioInWishlist(studio._id);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Banner Header */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: studio.bannerImage }} style={styles.banner} />
          <View style={styles.bannerOverlay} />

          <TouchableOpacity
            style={[styles.heartBtn, inWishlist && styles.heartBtnActive]}
            onPress={() => toggleStudio(studio._id)}
          >
            <Heart size={16} color={inWishlist ? '#ffffff' : '#ffffff'} fill={inWishlist ? '#ffffff' : 'transparent'} />
          </TouchableOpacity>

          <View style={styles.bannerInfo}>
            <Image source={{ uri: studio.logoImage }} style={styles.logo} />
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {studio.name}
                </Text>
                {studio.verifiedStatus === 'approved' && (
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={10} color="#ffffff" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>

              <Text style={styles.cityText}>📍 {studio.city} • ⏰ {studio.operatingHours?.open} - {studio.operatingHours?.close}</Text>

              <View style={styles.ratingRow}>
                <RatingStars rating={studio.rating} reviewCount={studio.reviewCount} showCount />
                <Text style={styles.startsAtText}>Starts ₹{studio.startingPrice.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabsRow}>
          {[
            { key: 'packages', label: `Packages (${packages.length})` },
            { key: 'portfolio', label: `Portfolio (${studio.portfolio.length})` },
            { key: 'amenities', label: 'Gear & Amenities' },
            { key: 'reviews', label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: PACKAGES */}
        {activeTab === 'packages' && (
          <View style={styles.tabContent}>
            {packages.map((pkg) => {
              const finalPrice = pkg.discountPrice || pkg.price;
              const advanceAmt = Math.round((finalPrice * (pkg.advancePercentage || 20)) / 100);

              return (
                <View key={pkg._id} style={styles.pkgCard}>
                  <View style={styles.pkgTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pkgTitle}>{pkg.title}</Text>
                      <Text style={styles.pkgDesc}>{pkg.description}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.pkgPrice}>₹{finalPrice.toLocaleString('en-IN')}</Text>
                      <Text style={styles.pkgAdvance}>{pkg.advancePercentage}% Advance (₹{advanceAmt})</Text>
                    </View>
                  </View>

                  <View style={styles.pkgSpecs}>
                    <Text style={styles.pkgSpecItem}>⏱️ {pkg.durationHours}h Session</Text>
                    <Text style={styles.pkgSpecItem}>✨ {pkg.editedPhotosCount} Retouches</Text>
                    <Text style={styles.pkgSpecItem}>📷 {pkg.rawPhotosCount}+ Raw</Text>
                  </View>

                  {/* Deliverables */}
                  <View style={styles.deliverablesList}>
                    {pkg.deliverables?.map((d, idx) => (
                      <View key={idx} style={styles.deliverableRow}>
                        <CheckCircle2 size={12} color="#10b981" />
                        <Text style={styles.deliverableText}>{d}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.bookBtn} onPress={() => setSelectedPkg(pkg)}>
                    <Calendar size={14} color="#0f172a" />
                    <Text style={styles.bookBtnText}>Book This Package</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 2: PORTFOLIO GALLERY */}
        {activeTab === 'portfolio' && (
          <View style={styles.portfolioGrid}>
            {studio.portfolio.map((p, idx) => (
              <View key={idx} style={styles.portfolioItem}>
                <Image source={{ uri: p.url }} style={styles.portfolioImg} />
                <View style={styles.portfolioOverlay}>
                  <Text style={styles.portfolioCat}>{p.category}</Text>
                  <Text style={styles.portfolioTitle} numberOfLines={1}>
                    {p.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: AMENITIES & EQUIPMENT */}
        {activeTab === 'amenities' && (
          <View style={styles.tabContent}>
            <View style={styles.amenitiesCard}>
              <Text style={styles.cardHeader}>Studio Amenities</Text>
              {studio.amenities?.map((a, idx) => (
                <View key={idx} style={styles.deliverableRow}>
                  <CheckCircle2 size={13} color="#10b981" />
                  <Text style={styles.deliverableText}>{a}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.amenitiesCard, { marginTop: 12 }]}>
              <Text style={styles.cardHeader}>Camera Gear & Lighting</Text>
              {studio.equipment?.map((eq, idx) => (
                <View key={idx} style={styles.deliverableRow}>
                  <Camera size={13} color="#f59e0b" />
                  <Text style={styles.deliverableText}>{eq}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            {reviews.map((rev) => (
              <View key={rev._id} style={styles.reviewCard}>
                <View style={styles.revHeader}>
                  <Text style={styles.revUser}>{rev.userId?.name || 'Verified Customer'}</Text>
                  <RatingStars rating={rev.rating} size={11} />
                </View>
                <Text style={styles.revTitle}>{rev.title}</Text>
                <Text style={styles.revComment}>{rev.comment}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Booking Modal */}
      {selectedPkg && (
        <BookingModal
          visible={!!selectedPkg}
          onClose={() => setSelectedPkg(null)}
          pkg={selectedPkg}
          studio={studio}
          onBookingSuccess={() => navigation.navigate('Bookings')}
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
  bannerContainer: {
    height: 220,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  heartBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  heartBtnActive: {
    backgroundColor: '#e11d48',
  },
  bannerInfo: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f59e0b',
    backgroundColor: '#ffffff',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
  },
  cityText: {
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  startsAtText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#f59e0b',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  tabContent: {
    padding: 16,
  },
  pkgCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pkgTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pkgTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  pkgDesc: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  pkgPrice: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  pkgAdvance: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  pkgSpecs: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  pkgSpecItem: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
  },
  deliverablesList: {
    gap: 6,
    marginBottom: 14,
  },
  deliverableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliverableText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
  portfolioItem: {
    width: '48%',
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1e293b',
  },
  portfolioImg: {
    width: '100%',
    height: '100%',
  },
  portfolioOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 6,
  },
  portfolioCat: {
    color: '#f59e0b',
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  portfolioTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  amenitiesCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  cardHeader: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  reviewCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  revHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  revUser: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  revTitle: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  revComment: {
    color: '#94a3b8',
    fontSize: 11,
  },
});
