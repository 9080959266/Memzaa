import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Heart, X, Check, Star, Sparkles, ChevronLeft, ChevronRight, Eye } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface IPhotoReviewItem {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'favorited' | 'selected' | 'rejected';
}

export const SwipeablePhotoReview: React.FC<{
  photos: IPhotoReviewItem[];
  onConfirmSelection?: (selected: IPhotoReviewItem[]) => void;
}> = ({ photos: initialPhotos, onConfirmSelection }) => {
  const [photoList, setPhotoList] = useState<IPhotoReviewItem[]>(initialPhotos);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPhoto = photoList[currentIndex] || photoList[0];

  const handleAction = (action: 'favorited' | 'selected' | 'rejected') => {
    if (!currentPhoto) return;

    const updated = photoList.map((p, idx) =>
      idx === currentIndex ? { ...p, status: action } : p
    );
    setPhotoList(updated);

    if (currentIndex < photoList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        'Review Complete! 🎉',
        `You have selected ${updated.filter((p) => p.status === 'selected').length} photos and favorited ${updated.filter((p) => p.status === 'favorited').length}.`
      );
      if (onConfirmSelection) {
        onConfirmSelection(updated.filter((p) => p.status !== 'rejected'));
      }
    }
  };

  if (photoList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No photos to review</Text>
      </View>
    );
  }

  const selectedCount = photoList.filter((p) => p.status === 'selected').length;
  const favoritedCount = photoList.filter((p) => p.status === 'favorited').length;
  const rejectedCount = photoList.filter((p) => p.status === 'rejected').length;

  return (
    <View style={styles.container}>
      {/* Top Status Strip */}
      <View style={styles.topStrip}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            Photo {currentIndex + 1} of {photoList.length}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: '#10b98115' }]}>
            <Text style={[styles.statText, { color: '#10b981' }]}>⭐ {selectedCount} Selected</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: '#ec489915' }]}>
            <Text style={[styles.statText, { color: '#ec4899' }]}>❤️ {favoritedCount} Favs</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: '#e11d4815' }]}>
            <Text style={[styles.statText, { color: '#e11d48' }]}>❌ {rejectedCount} Rejected</Text>
          </View>
        </View>
      </View>

      {/* Main Swipe Card */}
      <View style={styles.cardContainer}>
        <Image source={{ uri: currentPhoto.url }} style={styles.cardImage} resizeMode="cover" />

        {/* Current status tag */}
        {currentPhoto.status !== 'pending' && (
          <View
            style={[
              styles.statusTag,
              currentPhoto.status === 'selected' && { backgroundColor: '#10b981' },
              currentPhoto.status === 'favorited' && { backgroundColor: '#ec4899' },
              currentPhoto.status === 'rejected' && { backgroundColor: '#e11d48' },
            ]}
          >
            <Text style={styles.statusTagText}>{currentPhoto.status.toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.cardBottomBar}>
          <Text style={styles.photoTitle} numberOfLines={1}>
            {currentPhoto.title}
          </Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        {/* Reject Button */}
        <TouchableOpacity
          style={[styles.actionCircle, styles.rejectCircle]}
          onPress={() => handleAction('rejected')}
          activeOpacity={0.8}
        >
          <X size={22} color="#e11d48" />
        </TouchableOpacity>

        {/* Select for Album Button */}
        <TouchableOpacity
          style={[styles.actionCircle, styles.selectCircle]}
          onPress={() => handleAction('selected')}
          activeOpacity={0.8}
        >
          <Star size={24} color="#ffffff" fill="#ffffff" />
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity
          style={[styles.actionCircle, styles.favCircle]}
          onPress={() => handleAction('favorited')}
          activeOpacity={0.8}
        >
          <Heart size={22} color="#ffffff" fill="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Navigation arrows for manual browse */}
      <View style={styles.navRow}>
        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          style={[styles.navArrow, currentIndex === 0 && { opacity: 0.3 }]}
        >
          <ChevronLeft size={16} color="#64748b" />
          <Text style={styles.navArrowText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={currentIndex === photoList.length - 1}
          onPress={() => setCurrentIndex(Math.min(photoList.length - 1, currentIndex + 1))}
          style={[styles.navArrow, currentIndex === photoList.length - 1 && { opacity: 0.3 }]}
        >
          <Text style={styles.navArrowText}>Next</Text>
          <ChevronRight size={16} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
  },
  topStrip: {
    marginBottom: 12,
  },
  countBadge: {
    alignSelf: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  countText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  statChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardContainer: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  statusTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  cardBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: 10,
  },
  photoTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  actionCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  rejectCircle: {
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  selectCircle: {
    backgroundColor: '#10b981',
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  favCircle: {
    backgroundColor: '#db2777',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  navArrowText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
});
