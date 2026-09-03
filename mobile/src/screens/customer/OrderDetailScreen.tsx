import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, MapPin, Truck, FileText, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IOrder } from '../../types';
import { OrderTimelineView } from '../../components/customer/OrderTimelineView';

export const OrderDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { id } = route.params;
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (e) {
        console.error('Order fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: '#ffffff' }}>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Order #{order.orderId}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.invoiceBtn}
          onPress={() => Alert.alert('Tax Invoice', `Invoice generated for ₹${order.totalAmount}. Ready to print/export!`)}
        >
          <FileText size={14} color="#f59e0b" />
          <Text style={styles.invoiceText}>Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* 1. VISUAL 10-STEP TIMELINE STEPPER */}
      <View style={{ marginBottom: 16 }}>
        <OrderTimelineView timeline={order.timeline} currentStatus={order.currentStatus} />
      </View>

      {/* 2. ITEMS SUMMARY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Custom Keepsakes ({order.items.length})</Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Image
              source={{ uri: item.customization?.uploadedPhoto || item.thumbnail }}
              style={styles.thumb}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.customization && (
                <View style={styles.customSpecs}>
                  {item.customization.customName && (
                    <Text style={styles.specText}>Names: {item.customization.customName}</Text>
                  )}
                  {item.customization.customDate && (
                    <Text style={styles.specText}>Date: {item.customization.customDate}</Text>
                  )}
                  {item.customization.frameColor && (
                    <Text style={styles.specText}>Finish: {item.customization.frameColor}</Text>
                  )}
                </View>
              )}
              <View style={styles.priceQtyRow}>
                <Text style={styles.qtyText}>Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.itemTotal.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 3. SHIPPING ADDRESS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MapPin size={16} color="#f59e0b" />
          <Text style={styles.cardTitle}>Delivery Address</Text>
        </View>
        <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
        <Text style={styles.addressText}>{order.shippingAddress.street}</Text>
        <Text style={styles.addressText}>
          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
        </Text>
        <Text style={styles.addressPhone}>Phone: {order.shippingAddress.phone}</Text>
      </View>

      {/* 4. TOTALS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Breakdown</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalVal}>₹{order.subtotal.toLocaleString('en-IN')}</Text>
        </View>
        {order.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: '#10b981' }]}>Discount ({order.couponCode})</Text>
            <Text style={[styles.totalVal, { color: '#10b981' }]}>- ₹{order.discount.toLocaleString('en-IN')}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Delivery</Text>
          <Text style={styles.totalVal}>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</Text>
        </View>
        <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10 }]}>
          <Text style={[styles.totalLabel, { fontSize: 14, color: '#ffffff' }]}>Grand Total</Text>
          <Text style={[styles.totalVal, { fontSize: 18, color: '#f59e0b' }]}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  orderDate: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  invoiceText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  thumb: {
    width: 60,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#0f172a',
  },
  itemTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  customSpecs: {
    marginVertical: 4,
  },
  specText: {
    color: '#94a3b8',
    fontSize: 10,
  },
  priceQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyText: {
    color: '#64748b',
    fontSize: 11,
  },
  itemPrice: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '900',
  },
  addressName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  addressText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  addressPhone: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  totalVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
