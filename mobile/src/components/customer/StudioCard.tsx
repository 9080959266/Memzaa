import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MapPin, ShieldCheck, Heart, Calendar } from 'lucide-react-native';
import { IStudio } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { useWishlist } from '../../context/WishlistContext';

export const StudioCard: React.FC<{
  studio: IStudio;
  onPress: () => void;
  onBookPress?: () => void;
}> = ({ studio, onPress, onBookPress }) => {
  const { toggleStudio, isStudioInWishlist } = useWishlist();
  const inWishlist = isStudioInWishlist(studio._id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Banner / Cover Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: studio.bannerImage }} style={styles.image} resizeMode="cover" />

        {/* Top Badges */}
        <View style={styles.topBadgeRow}>
          {studio.verifiedStatus === 'approved' && (
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={11} color="#ffffff" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.heartButton, inWishlist && styles.heartButtonActive]}
            onPress={() => toggleStudio(studio._id)}
          >
            <Heart size={14} color={inWishlist ? '#ffffff' : '#f8fafc'} fill={inWishlist ? '#ffffff' : 'transparent'} />
          </TouchableOpacity>
        </View>

        {/* Studio Logo Overlay */}
        <Image source={{ uri: studio.logoImage }} style={styles.logoOverlay} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {studio.name}
          </Text>
          <View style={styles.cityBadge}>
            <MapPin size={10} color="#f59e0b" />
            <Text style={styles.cityText}>{studio.city}</Text>
          </View>
        </View>

        <Text style={styles.tagline} numberOfLines={1}>
          {studio.tagline || 'Award-winning candid wedding & portrait photography'}
        </Text>

        <View style={styles.ratingRow}>
          <RatingStars rating={studio.rating} reviewCount={studio.reviewCount} showCount />
          <Text style={styles.priceRangeText}>Price Range: {studio.priceRange}</Text>
        </View>

        {/* Footer: Price & Book Button */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.startsAtLabel}>Starts At</Text>
            <Text style={styles.priceText}>₹{studio.startingPrice.toLocaleString('en-IN')}</Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={onBookPress || onPress}
            activeOpacity={0.8}
          >
            <Calendar size={12} color="#0f172a" />
            <Text style={styles.bookButtonText}>Book Shoot</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heartButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 6,
    borderRadius: 20,
  },
  heartButtonActive: {
    backgroundColor: '#e11d48',
  },
  logoOverlay: {
    position: 'absolute',
    bottom: -16,
    left: 14,
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 14,
    paddingTop: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#0f172a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cityText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  tagline: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceRangeText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  startsAtLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  bookButtonText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
});
