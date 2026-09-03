import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

export const RatingStars: React.FC<{
  rating: number;
  size?: number;
  showCount?: boolean;
  reviewCount?: number;
}> = ({ rating, size = 12, showCount = false, reviewCount = 0 }) => {
  const rounded = Math.round(rating);

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            color="#f59e0b"
            fill={s <= rounded ? '#f59e0b' : 'transparent'}
          />
        ))}
      </View>
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      {showCount && (
        <Text style={styles.countText}>({reviewCount})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  ratingText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
  countText: {
    color: '#64748b',
    fontSize: 10,
  },
});
