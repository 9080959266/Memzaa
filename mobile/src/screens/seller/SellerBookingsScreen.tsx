import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Calendar, Clock, MapPin, User, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IBooking } from '../../types';

export const SellerBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/bookings/studio-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (e) {
      console.error('Bookings error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleMarkComplete = async (id: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { bookingStatus: 'completed' });
      fetchBookings();
      Alert.alert('Done ✅', 'Booking marked completed.');
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Studio Bookings & Calendar</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : bookings.length === 0 ? (
        <View style={styles.emptyView}>
          <Calendar size={40} color="#f59e0b" />
          <Text style={styles.emptyTitle}>No Bookings</Text>
          <Text style={styles.emptySub}>When customers reserve dates, they appear here.</Text>
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

              <Text style={styles.pkgTitle}>{b.packageId?.title || 'Photoshoot Session'}</Text>
              <Text style={styles.clientText}>Client: {b.customerId?.name} ({b.customerId?.phone})</Text>

              <View style={styles.specsBox}>
                <View style={styles.specRow}>
                  <Calendar size={13} color="#f59e0b" />
                  <Text style={styles.specText}>{b.eventDate} ({b.timeSlot})</Text>
                </View>
                <View style={styles.specRow}>
                  <MapPin size={13} color="#f59e0b" />
                  <Text style={styles.specText}>{b.venue?.address} ({b.venue?.venueType})</Text>
                </View>
              </View>

              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.paidText}>Advance Paid: ₹{b.advanceAmount}</Text>
                  <Text style={styles.dueText}>Due on shoot: ₹{b.remainingAmount}</Text>
                </View>

                {b.bookingStatus !== 'completed' && (
                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => handleMarkComplete(b._id)}
                  >
                    <CheckCircle2 size={13} color="#0f172a" />
                    <Text style={styles.doneBtnText}>Mark Done</Text>
                  </TouchableOpacity>
                )}
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
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingId: {
    color: '#f59e0b',
    fontSize: 11,
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
    marginTop: 4,
  },
  clientText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  specsBox: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 10,
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
  paidText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  dueText: {
    color: '#64748b',
    fontSize: 10,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  doneBtnText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
});
