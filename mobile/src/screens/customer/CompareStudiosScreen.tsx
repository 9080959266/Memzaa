import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Check, X, Star, Calendar, ShieldCheck, Sparkles } from 'lucide-react-native';
import api from '../../api/client';
import { IStudio } from '../../types';

export const CompareStudiosScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/studios?limit=4');
        if (res.data.success) {
          setStudios(res.data.studios || []);
        }
      } catch (e) {
        console.error('Compare studios fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudios();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topInfo}>
        <Sparkles size={14} color="#f59e0b" />
        <Text style={styles.topInfoText}>
          Side-by-Side Multi-Studio Comparison Matrix
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
          {studios.map((studio, idx) => (
            <View key={studio._id} style={styles.compareCol}>
              {/* Studio Header Card */}
              <View style={styles.colHeader}>
                <Image source={{ uri: studio.logoImage }} style={styles.logo} />
                <Text style={styles.studioName} numberOfLines={1}>
                  {studio.name}
                </Text>
                <Text style={styles.cityText}>📍 {studio.city}</Text>

                <View style={styles.ratingBadge}>
                  <Star size={10} color="#0f172a" fill="#0f172a" />
                  <Text style={styles.ratingText}>
                    {studio.rating.toFixed(1)} ({studio.reviewCount})
                  </Text>
                </View>

                <Text style={styles.priceText}>
                  Starts ₹{studio.startingPrice.toLocaleString('en-IN')}
                </Text>
              </View>

              {/* Comparison Metric Rows */}
              <View style={styles.specsList}>
                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>Turnaround Time</Text>
                  <Text style={styles.specVal}>3-5 Business Days</Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>Advance Payable</Text>
                  <Text style={[styles.specVal, { color: '#10b981' }]}>20% Deposit</Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>Camera Gear</Text>
                  <Text style={styles.specVal} numberOfLines={2}>
                    {studio.equipment?.join(', ') || 'Sony Alpha A7 IV, G-Master'}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>Amenities</Text>
                  <Text style={styles.specVal} numberOfLines={2}>
                    {studio.amenities?.join(', ') || 'Changing Suite, Drone, AC'}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>Free Reschedule</Text>
                  <Text style={[styles.specVal, { color: '#10b981' }]}>✓ Up to 48 Hours</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('StudioDetail', { id: studio._id })}
              >
                <Calendar size={12} color="#0f172a" />
                <Text style={styles.bookBtnText}>Choose & Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 14,
  },
  topInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  topInfoText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  horizontalScroll: {
    flex: 1,
  },
  compareCol: {
    width: 240,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  colHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 12,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#f59e0b',
    marginBottom: 8,
  },
  studioName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  cityText: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  ratingText: {
    color: '#0f172a',
    fontSize: 9,
    fontWeight: '900',
  },
  priceText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
  },
  specsList: {
    gap: 8,
    marginBottom: 14,
  },
  specBox: {
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 10,
  },
  specLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  specVal: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookBtnText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
});
