import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart3, TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const AdminReportsScreen: React.FC = () => {
  const CATEGORIES_BREAKDOWN = [
    { name: '💍 Wedding Photoshoots', pct: 45, gmv: '₹66,825', color: '#db2777' },
    { name: '👶 Baby & Birthday Shoots', pct: 25, gmv: '₹37,125', color: '#f59e0b' },
    { name: '💕 Pre-Wedding Shoots', pct: 18, gmv: '₹26,730', color: '#06b6d4' },
    { name: '🖼️ Custom Frames & Gifts', pct: 12, gmv: '₹17,820', color: '#10b981' },
  ];

  const TOP_STUDIOS = [
    { name: 'Priya Frames & Photo Gifts', city: 'Chennai', shoots: 14, revenue: '₹48,200', rating: 4.9 },
    { name: 'Classic Photo Framing & Arts', city: 'Bengaluru', shoots: 11, revenue: '₹39,500', rating: 4.8 },
    { name: 'Star Gift Creators & Digital', city: 'Mumbai', shoots: 9, revenue: '₹28,400', rating: 4.6 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Financials */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total Platform GMV</Text>
        <Text style={styles.heroGmv}>₹1,48,500</Text>

        <View style={styles.heroCommissionRow}>
          <View>
            <Text style={styles.commLabel}>Net 10% Commission</Text>
            <Text style={styles.commVal}>₹14,850</Text>
          </View>
          <View style={styles.growthBadge}>
            <ArrowUpRight size={12} color="#10b981" />
            <Text style={styles.growthText}>+32% MoM</Text>
          </View>
        </View>
      </View>

      {/* Category Volume Breakdown */}
      <Text style={styles.sectionTitle}>Category Revenue Distribution</Text>
      <View style={styles.card}>
        {CATEGORIES_BREAKDOWN.map((cat, idx) => (
          <View key={idx} style={styles.catRow}>
            <View style={styles.catHeader}>
              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.catGmv}>{cat.gmv} ({cat.pct}%)</Text>
            </View>

            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${cat.pct}%`, backgroundColor: cat.color }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Top Performing Studios */}
      <Text style={styles.sectionTitle}>Top Studio Partners by GMV</Text>
      {TOP_STUDIOS.map((st, idx) => (
        <View key={idx} style={styles.studioCard}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{idx + 1}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.studioName}>{st.name}</Text>
            <Text style={styles.studioSub}>📍 {st.city} • ⭐ {st.rating} • {st.shoots} Completed Jobs</Text>
          </View>

          <Text style={styles.studioRevenue}>{st.revenue}</Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  heroLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  heroGmv: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 14,
  },
  heroCommissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  commLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  commVal: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#10b98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  growthText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  catRow: {
    marginBottom: 12,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catName: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  catGmv: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  studioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#db277715',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#db2777',
    fontSize: 11,
    fontWeight: '900',
  },
  studioName: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  studioSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  studioRevenue: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '900',
  },
});
