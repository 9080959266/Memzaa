import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { DollarSign, TrendingUp, CheckCircle, Clock, ArrowDownRight, CreditCard, Building } from 'lucide-react-native';

export const SellerRevenueScreen: React.FC = () => {
  const [payouts] = useState([
    {
      id: 'pay_901',
      date: '01 Sep 2026',
      amount: 42500,
      commission: 4250,
      netPayout: 38250,
      status: 'Completed',
      utr: 'UTR98321049281',
      bank: 'HDFC Bank (**** 4892)',
    },
    {
      id: 'pay_902',
      date: '15 Aug 2026',
      amount: 38000,
      commission: 3800,
      netPayout: 34200,
      status: 'Completed',
      utr: 'UTR81920391028',
      bank: 'HDFC Bank (**** 4892)',
    },
    {
      id: 'pay_903',
      date: 'Upcoming (15 Sep 2026)',
      amount: 19500,
      commission: 1950,
      netPayout: 17550,
      status: 'Processing',
      utr: 'Scheduled',
      bank: 'HDFC Bank (**** 4892)',
    },
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Gross Revenue Card */}
      <View style={styles.revenueHero}>
        <Text style={styles.heroLabel}>Total Net Studio Earnings (After 10% Fee)</Text>
        <Text style={styles.heroAmount}>₹89,950</Text>
        <View style={styles.heroBreakdown}>
          <Text style={styles.breakdownText}>Gross Sales: ₹99,950</Text>
          <Text style={styles.breakdownText}>Platform Fee (10%): -₹9,995</Text>
        </View>
      </View>

      {/* Quick Payout Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Next Payout</Text>
          <Text style={[styles.statVal, { color: '#f59e0b' }]}>₹17,550</Text>
          <Text style={styles.statSub}>15 Sep 2026</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Settled to Bank</Text>
          <Text style={[styles.statVal, { color: '#10b981' }]}>₹72,400</Text>
          <Text style={styles.statSub}>2 Transfers</Text>
        </View>
      </View>

      {/* Bank Account Info */}
      <View style={styles.bankCard}>
        <Building size={16} color="#db2777" />
        <View style={{ flex: 1 }}>
          <Text style={styles.bankName}>HDFC Bank Ltd</Text>
          <Text style={styles.bankAccount}>A/C: **********4892 • IFSC: HDFC0001248</Text>
        </View>
        <Text style={styles.verifiedTag}>VERIFIED</Text>
      </View>

      {/* Payout History */}
      <Text style={styles.sectionTitle}>Fortnightly Settlement History</Text>
      {payouts.map((pay) => (
        <View key={pay.id} style={styles.payoutCard}>
          <View style={styles.payoutHeader}>
            <View>
              <Text style={styles.payoutDate}>{pay.date}</Text>
              <Text style={styles.payoutUtr}>Ref: {pay.utr}</Text>
            </View>

            <View style={[styles.statusBadge, pay.status === 'Completed' ? styles.statusOk : styles.statusProc]}>
              <Text style={[styles.statusBadgeText, pay.status === 'Completed' ? styles.statusOkText : styles.statusProcText]}>
                {pay.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.payoutDetails}>
            <Text style={styles.detailText}>Gross: ₹{pay.amount.toLocaleString('en-IN')}</Text>
            <Text style={styles.detailText}>10% Commission: -₹{pay.commission.toLocaleString('en-IN')}</Text>
            <Text style={styles.netText}>Net Payout: ₹{pay.netPayout.toLocaleString('en-IN')}</Text>
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
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  revenueHero: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  heroAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 12,
  },
  heroBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  breakdownText: {
    color: '#cbd5e1',
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  statSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  bankName: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  bankAccount: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
  },
  verifiedTag: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '900',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  payoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  payoutDate: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  payoutUtr: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusOk: {
    backgroundColor: '#dcfce7',
  },
  statusProc: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  statusOkText: {
    color: '#16a34a',
  },
  statusProcText: {
    color: '#d97706',
  },
  payoutDetails: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 2,
  },
  detailText: {
    color: '#64748b',
    fontSize: 10,
  },
  netText: {
    color: '#db2777',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
});
