import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ShieldCheck, Store, Users, DollarSign, TrendingUp, CheckCircle2, XCircle } from 'lucide-react-native';
import api from '../../api/client';

export const AdminDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (e) {
      console.error('Admin dash error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/studios/${id}/moderate`, { status });
      fetchDashboard();
      Alert.alert('Status Updated', `Studio set to ${status}.`);
    } catch (e) {}
  };

  const stats = data?.stats || {
    totalCustomers: 128,
    totalStudios: 18,
    totalOrders: 95,
    totalRevenue: 545000,
    platformCommission: 54500,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBadge}>
        <ShieldCheck size={14} color="#a855f7" />
        <Text style={styles.headerBadgeText}>SUPER ADMIN MASTER PORTAL</Text>
      </View>
      <Text style={styles.title}>Platform Executive KPIs</Text>
      <Text style={styles.subtitle}>10% platform take-rate & partner moderation desk</Text>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Platform Volume</Text>
          <Text style={styles.kpiValue}>₹{stats.totalRevenue.toLocaleString('en-IN')}</Text>
          <Text style={styles.growth}>+32% YoY</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>10% Commission Profit</Text>
          <Text style={[styles.kpiValue, { color: '#a855f7' }]}>₹{stats.platformCommission.toLocaleString('en-IN')}</Text>
          <Text style={[styles.growth, { color: '#a855f7' }]}>Net Profit</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Verified Studios</Text>
          <Text style={[styles.kpiValue, { color: '#06b6d4' }]}>{stats.totalStudios}</Text>
          <Text style={styles.growth}>Pan-India</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Orders</Text>
          <Text style={[styles.kpiValue, { color: '#f59e0b' }]}>{stats.totalOrders}</Text>
          <Text style={styles.growth}>Completed</Text>
        </View>
      </View>

      {/* Pending Studio Verification Queue */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Studio Approval Queue</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Studios')}>
          <Text style={styles.seeAll}>All Studios →</Text>
        </TouchableOpacity>
      </View>

      {data?.pendingStudios?.length === 0 || !data?.pendingStudios ? (
        <View style={styles.emptyQueue}>
          <Text style={styles.emptyText}>No pending studio applications.</Text>
        </View>
      ) : (
        data.pendingStudios.map((s: any) => (
          <View key={s._id} style={styles.studioItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.studioName}>{s.name}</Text>
              <Text style={styles.studioCity}>{s.city} • Owner: {s.ownerId?.name}</Text>
              <Text style={styles.studioPrice}>Starting ₹{s.startingPrice}</Text>
            </View>

            <View style={styles.actionBtns}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => handleModerate(s._id, 'approved')}
              >
                <CheckCircle2 size={14} color="#ffffff" />
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleModerate(s._id, 'rejected')}
              >
                <XCircle size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

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
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#a855f720',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  headerBadgeText: {
    color: '#a855f7',
    fontSize: 9,
    fontWeight: '800',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 18,
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
  growth: {
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
  sectionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  seeAll: {
    color: '#a855f7',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyQueue: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 11,
  },
  studioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  studioName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  studioCity: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  studioPrice: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  actionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: '#e11d48',
    padding: 6,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
});
