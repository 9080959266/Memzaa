import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Package, AlertTriangle, Plus, RefreshCw, CheckCircle2 } from 'lucide-react-native';

interface IInventoryItem {
  id: string;
  name: string;
  category: 'Frames' | 'Albums' | 'Paper / Prints' | 'Mugs & Gifts';
  stock: number;
  minThreshold: number;
  unitCost: number;
}

export const SellerInventoryScreen: React.FC = () => {
  const [items, setItems] = useState<IInventoryItem[]>([
    {
      id: 'inv_1',
      name: '12x18 Solid Teak Wood Frame Moulding',
      category: 'Frames',
      stock: 4,
      minThreshold: 10,
      unitCost: 350,
    },
    {
      id: 'inv_2',
      name: '8x10 Matte Black Aluminium Frames',
      category: 'Frames',
      stock: 28,
      minThreshold: 15,
      unitCost: 180,
    },
    {
      id: 'inv_3',
      name: '12x36 Layflat Velvet Hardcover Blanks',
      category: 'Albums',
      stock: 6,
      minThreshold: 8,
      unitCost: 850,
    },
    {
      id: 'inv_4',
      name: '300 GSM Archival Luster Photo Paper (Roll)',
      category: 'Paper / Prints',
      stock: 45,
      minThreshold: 20,
      unitCost: 120,
    },
    {
      id: 'inv_5',
      name: '11oz Grade-A Sublimation Magic Mugs',
      category: 'Mugs & Gifts',
      stock: 3,
      minThreshold: 15,
      unitCost: 90,
    },
  ]);

  const restock = (id: string, amount: number) => {
    setItems(items.map((it) => (it.id === id ? { ...it, stock: it.stock + amount } : it)));
    Alert.alert('Restocked! 📦', `Added ${amount} units to workshop inventory.`);
  };

  const lowStockCount = items.filter((i) => i.stock <= i.minThreshold).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Overview Cards */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total SKUs</Text>
          <Text style={styles.kpiVal}>{items.length}</Text>
        </View>

        <View style={[styles.kpiCard, { borderColor: lowStockCount > 0 ? '#f59e0b' : '#e2e8f0' }]}>
          <Text style={[styles.kpiLabel, { color: '#f59e0b' }]}>⚠️ Low Stock Alerts</Text>
          <Text style={[styles.kpiVal, { color: '#f59e0b' }]}>{lowStockCount}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Workshop Raw Materials & Frames</Text>

      {items.map((item) => {
        const isLow = item.stock <= item.minThreshold;
        return (
          <View key={item.id} style={[styles.card, isLow && styles.cardLow]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>

              <View style={[styles.stockBadge, isLow ? styles.badgeLow : styles.badgeOk]}>
                <Text style={[styles.stockBadgeText, isLow ? styles.textLow : styles.textOk]}>
                  {isLow ? 'LOW STOCK' : 'IN STOCK'}
                </Text>
              </View>
            </View>

            <View style={styles.statsStrip}>
              <Text style={styles.statLine}>
                Current Stock: <Text style={{ fontWeight: '900', color: isLow ? '#e11d48' : '#0f172a' }}>{item.stock} units</Text>
              </Text>
              <Text style={styles.statLine}>
                Threshold: <Text style={{ fontWeight: '700' }}>{item.minThreshold} units</Text>
              </Text>
            </View>

            {/* Quick Restock Actions */}
            <View style={styles.actionRow}>
              <Text style={styles.actionLabel}>Quick Restock:</Text>
              <TouchableOpacity style={styles.restockBtn} onPress={() => restock(item.id, 10)}>
                <Plus size={11} color="#ffffff" />
                <Text style={styles.restockBtnText}>+10</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.restockBtn} onPress={() => restock(item.id, 50)}>
                <Plus size={11} color="#ffffff" />
                <Text style={styles.restockBtnText}>+50</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

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
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  kpiVal: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  sectionHeader: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardLow: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemCategory: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  itemName: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeLow: {
    backgroundColor: '#fef3c7',
  },
  badgeOk: {
    backgroundColor: '#dcfce7',
  },
  stockBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  textLow: {
    color: '#d97706',
  },
  textOk: {
    color: '#16a34a',
  },
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statLine: {
    color: '#64748b',
    fontSize: 11,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  actionLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  restockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  restockBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
});
