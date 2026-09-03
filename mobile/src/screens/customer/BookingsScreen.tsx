import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar, Clock, MapPin, Phone, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IBooking } from '../../types';

export const BookingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.bookings || []);
        }
      } catch (e) {
        console.error('Bookings error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Photoshoot Bookings</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : bookings.length === 0 ? (
        <View style={styles.emptyView}>
          <Calendar size={40} color="#f59e0b" />
          <Text style={styles.emptyTitle}>No Photoshoots Booked</Text>
          <Text style={styles.emptySub}>Browse top-rated studios for weddings, rituals, and portraits!</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {bookings.map((b) => (
            <View key={b._id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.bookingId}>#{b.bookingId}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{b.bookingStatus}</Text>
                </View>
              </View>

              <Text style={styles.pkgTitle}>{b.packageId?.title || 'Photoshoot Package'}</Text>
              <Text style={styles.studioName}>{b.studioId?.name}</Text>

              <View style={styles.specsBox}>
                <View style={styles.specRow}>
                  <Calendar size={13} color="#f59e0b" />
                  <Text style={styles.specText}>{b.eventDate} ({b.timeSlot})</Text>
                </View>
                <View style={styles.specRow}>
                  <MapPin size={13} color="#f59e0b" />
                  <Text style={styles.specText}>{b.venue?.address} ({b.venue?.venueType})</Text>
                </View>
                {b.studioId?.phone && (
                  <View style={styles.specRow}>
                    <Phone size={13} color="#64748b" />
                    <Text style={styles.specText}>Studio: {b.studioId.phone}</Text>
                  </View>
                )}
              </View>

              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.subLabel}>Total Package Value</Text>
                  <Text style={styles.totalVal}>₹{b.totalAmount.toLocaleString('en-IN')}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.advancePaid}>Advance Paid: ₹{b.advanceAmount}</Text>
                  <Text style={styles.balanceDue}>Due on shoot: ₹{b.remainingAmount}</Text>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  list: {
    flex: 1,
  },
  emptyView: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingId: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  pkgTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  studioName: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
  },
  specsBox: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 12,
    gap: 6,
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  subLabel: {
    color: '#64748b',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  totalVal: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  advancePaid: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  balanceDue: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
  },
});
