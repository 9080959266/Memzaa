import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { DollarSign, Clock, Calendar, AlertTriangle, ArrowRight, Kanban, Sparkles, Store } from 'lucide-react-native';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';

export const SellerDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/seller/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (e) {
      console.error('Seller dash error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || {
    todaysOrders: 4,
    pendingOrders: 6,
    processingOrders: 8,
    readyOrders: 3,
    todayRevenue: 7850,
    monthlyRevenue: 189500,
    upcomingBookingsCount: 3,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Header */}
      <View style={styles.welcomeCard}>
        <View style={styles.badge}>
          <Store size={12} color="#f59e0b" />
          <Text style={styles.badgeText}>STUDIO OWNER PARTNER</Text>
        </View>
        <Text style={styles.welcomeTitle}>Welcome back, {user?.name.split(' ')[0]}!</Text>
        <Text style={styles.welcomeSub}>Manage photo retouching, package pricing, and shoot bookings</Text>
      </View>

      {/* Primary Kanban Trigger Banner */}
      <TouchableOpacity
        style={styles.kanbanBanner}
        onPress={() => navigation.navigate('Kanban')}
        activeOpacity={0.8}
      >
        <View style={styles.kanbanIcon}>
          <Kanban size={22} color="#0f172a" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.kanbanTitle}>Open 10-Stage Kanban Board</Text>
          <Text style={styles.kanbanSub}>Swipe columns, advance photo retouches & mark QC</Text>
        </View>
        <ArrowRight size={18} color="#f59e0b" />
      </TouchableOpacity>

      {/* Financial KPIs */}
      <Text style={styles.sectionTitle}>Earnings & Orders</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Today's Revenue</Text>
          <Text style={styles.kpiValue}>₹{metrics.todayRevenue.toLocaleString('en-IN')}</Text>
          <Text style={styles.kpiSub}>+14% vs yesterday</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Monthly Revenue</Text>
          <Text style={[styles.kpiValue, { color: '#f59e0b' }]}>₹{metrics.monthlyRevenue.toLocaleString('en-IN')}</Text>
          <Text style={styles.kpiSub}>Payout due 15th</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Active Photo Jobs</Text>
          <Text style={[styles.kpiValue, { color: '#8b5cf6' }]}>{metrics.processingOrders + metrics.pendingOrders}</Text>
          <Text style={styles.kpiSub}>{metrics.processingOrders} in Retouching</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Upcoming Shoots</Text>
          <Text style={[styles.kpiValue, { color: '#06b6d4' }]}>{metrics.upcomingBookingsCount}</Text>
          <Text style={styles.kpiSub}>Next shoot tomorrow</Text>
        </View>
      </View>

      {/* Upcoming Shoots Strip */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Shoots</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
          <Text style={styles.seeAll}>Calendar →</Text>
        </TouchableOpacity>
      </View>

      {data?.upcomingBookings?.map((b: any) => (
        <View key={b._id} style={styles.bookingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bkgTitle}>{b.packageId?.title || 'Photoshoot Session'}</Text>
            <Text style={styles.bkgClient}>Client: {b.customerId?.name} ({b.customerId?.phone})</Text>
            <Text style={styles.bkgDate}>📅 {b.eventDate} • ⏰ {b.timeSlot}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.bkgPaid}>₹{b.advanceAmount} Paid</Text>
            <Text style={styles.bkgDue}>₹{b.remainingAmount} Due</Text>
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f59e0b15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '800',
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  welcomeSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  kanbanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b50',
    gap: 12,
  },
  kanbanIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kanbanTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  kanbanSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  kpiValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 4,
    fontFamily: 'monospace',
  },
  kpiSub: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAll: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bkgTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  bkgClient: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 1,
  },
  bkgDate: {
    color: '#f59e0b',
    fontSize: 10,
    marginTop: 2,
  },
  bkgPaid: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
  bkgDue: {
    color: '#64748b',
    fontSize: 9,
  },
});
