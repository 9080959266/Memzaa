import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { CustomButton } from '../../components/common/CustomButton';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cart, updateQuantity, removeItem, applyCoupon, isLoading } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!couponCode.trim()) return;
    try {
      setIsApplying(true);
      const msg = await applyCoupon(couponCode.trim().toUpperCase());
      Alert.alert('Coupon Applied! 🎉', msg);
    } catch (e: any) {
      Alert.alert('Coupon Error', e.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.emptyIconCircle}>
          <ShoppingBag size={32} color="#f59e0b" />
        </View>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>
          Discover customized solid teak wood photo frames, magic mugs, and fine-art albums!
        </Text>
        <CustomButton
          title="Explore Photo Store"
          onPress={() => navigation.navigate('Store')}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Review Cart Items ({cart.items.length})</Text>

        {/* Cart Item Cards */}
        {cart.items.map((item) => {
          const product = item.productId;
          const custom = item.customization;

          return (
            <View key={item._id} style={styles.cartCard}>
              <Image
                source={{
                  uri:
                    custom?.uploadedPhoto ||
                    product?.thumbnail ||
                    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.thumbnail}
              />

              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {product?.title || 'Custom Photo Keepsake'}
                </Text>

                {custom && (
                  <View style={styles.customSpecs}>
                    {custom.customName && (
                      <Text style={styles.specText}>Names: {custom.customName}</Text>
                    )}
                    {custom.customDate && (
                      <Text style={styles.specText}>Date: {custom.customDate}</Text>
                    )}
                    {custom.frameColor && (
                      <Text style={styles.specText}>Finish: {custom.frameColor}</Text>
                    )}
                  </View>
                )}

                <Text style={styles.itemPrice}>₹{item.unitPrice.toLocaleString('en-IN')}</Text>

                {/* Quantity Controls & Delete */}
                <View style={styles.controlsRow}>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      <Minus size={12} color="#cbd5e1" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <Plus size={12} color="#cbd5e1" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeItem(item._id)}
                  >
                    <Trash2 size={16} color="#e11d48" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {/* Promo Coupon Card */}
        <View style={styles.couponCard}>
          <View style={styles.couponHeader}>
            <Tag size={14} color="#f59e0b" />
            <Text style={styles.couponTitle}>Apply Discount Coupon</Text>
          </View>
          <View style={styles.couponInputRow}>
            <TextInput
              style={styles.couponInput}
              placeholder="e.g. WELCOME10"
              placeholderTextColor="#64748b"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApply}
              disabled={isApplying}
            >
              <Text style={styles.applyBtnText}>{isApplying ? '...' : 'Apply'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items Subtotal</Text>
            <Text style={styles.summaryValue}>₹{cart.subtotal.toLocaleString('en-IN')}</Text>
          </View>

          {cart.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#10b981' }]}>Coupon Discount ({cart.couponCode})</Text>
              <Text style={[styles.summaryValue, { color: '#10b981' }]}>- ₹{cart.discount.toLocaleString('en-IN')}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pan-India Delivery</Text>
            <Text style={[styles.summaryValue, cart.deliveryFee === 0 && { color: '#10b981' }]}>
              {cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{cart.total.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Checkout Bar */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.barLabel}>Total Payable</Text>
          <Text style={styles.barAmount}>₹{cart.total.toLocaleString('en-IN')}</Text>
        </View>

        <CustomButton
          title="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          icon={<ArrowRight size={16} color="#0f172a" />}
          style={{ flex: 1, marginLeft: 16 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  customSpecs: {
    marginTop: 4,
    marginBottom: 6,
    gap: 2,
  },
  specText: {
    color: '#94a3b8',
    fontSize: 10,
  },
  itemPrice: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 2,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
  },
  deleteBtn: {
    padding: 6,
  },
  couponCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  couponTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    borderWidth: 1,
    borderColor: '#334155',
  },
  applyBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f59e0b',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  totalValue: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  barLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  barAmount: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
});
