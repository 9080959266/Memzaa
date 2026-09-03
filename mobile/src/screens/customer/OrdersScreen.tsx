import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ShoppingBag, ChevronRight, Clock, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IOrder } from '../../types';

export const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders || []);
        }
      } catch (e) {
        console.error('Orders fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Orders & Live Production Status</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyView}>
          <ShoppingBag size={40} color="#f59e0b" />
          <Text style={styles.emptyTitle}>No Orders Placed Yet</Text>
          <Text style={styles.emptySub}>Customize fine-art frames and canvas prints from the photo store!</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {orders.map((order) => {
            const statusColor: Record<string, string> = {
              ORDER_PLACED: '#3b82f6',
              PHOTOS_UPLOADED: '#8b5cf6',
              EDITING: '#f59e0b',
              PROOF_READY: '#06b6d4',
              CUSTOMER_APPROVED: '#10b981',
              PRINTING: '#f97316',
              QUALITY_CHECK: '#ec4899',
              READY: '#10b981',
              OUT_FOR_DELIVERY: '#14b8a6',
              DELIVERED: '#22c55e',
            };
            const currentBadgeColor = statusColor[order.currentStatus] || '#f59e0b';

            return (
              <TouchableOpacity
                key={order._id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetail', { id: order._id })}
                activeOpacity={0.8}
              >
                <View style={styles.topRow}>
                  <Text style={styles.orderId}>#{order.orderId}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: currentBadgeColor + '20' }]}>
                    <Text style={[styles.statusText, { color: currentBadgeColor }]}>
                      {order.currentStatus.replace(/_/g, ' ')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.dateText}>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>

                {/* Items thumbnail previews */}
                <View style={styles.itemsRow}>
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: item.customization?.uploadedPhoto || item.thumbnail }}
                      style={styles.thumb}
                    />
                  ))}
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {order.items?.[0]?.title}
                    </Text>
                    <Text style={styles.itemCount}>
                      {order.items.length} {order.items.length === 1 ? 'Keepsake Item' : 'Keepsake Items'}
                    </Text>
                  </View>
                </View>

                <View style={styles.footerRow}>
                  <Text style={styles.totalText}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
                  <View style={styles.trackBtn}>
                    <Text style={styles.trackText}>Track Stepper</Text>
                    <ChevronRight size={14} color="#f59e0b" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
  orderCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dateText: {
    color: '#64748b',
    fontSize: 10,
    marginBottom: 12,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: '#1e293b',
  },
  itemTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  itemCount: {
    color: '#94a3b8',
    fontSize: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  totalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
});
