import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MapPin, CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || 'Priya Ramanathan');
  const [phone, setPhone] = useState(user?.phone || '+91 98401 23456');
  const [street, setStreet] = useState('14, 4th Main Road, Besant Nagar');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('600090');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!fullName || !phone || !street || !city || !pincode) {
      Alert.alert('Missing Address', 'Please fill in all shipping details.');
      return;
    }

    try {
      setIsProcessing(true);
      const payload = {
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          pincode,
        },
        paymentMethod,
        transactionId: `TXN_MOB_${Date.now()}`,
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        await clearCart();
        Alert.alert(
          '🎉 Order Placed Successfully!',
          `Order #${res.data.order.orderId} is confirmed. Tracking timeline activated!`,
          [
            {
              text: 'Track Order',
              onPress: () => navigation.navigate('OrderDetail', { id: res.data.order._id }),
            },
          ]
        );
      }
    } catch (e: any) {
      Alert.alert('Checkout Error', e.message || 'Payment simulation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Delivery & Payment</Text>

      {/* 1. Shipping Address */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MapPin size={16} color="#f59e0b" />
          <Text style={styles.cardTitle}>Shipping Address (Pan-India)</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Recipient Name"
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98401 23456"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street / House / Flat No.</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
            placeholder="Street Address"
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              value={pincode}
              onChangeText={setPincode}
              placeholder="600090"
              placeholderTextColor="#64748b"
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>

      {/* 2. Payment Method */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <CreditCard size={16} color="#f59e0b" />
          <Text style={styles.cardTitle}>Payment Method (INR ₹)</Text>
        </View>

        <View style={styles.paymentOptions}>
          {[
            { id: 'razorpay', label: 'UPI / GPay / PhonePe' },
            { id: 'card', label: 'Credit / Debit Card' },
            { id: 'upi', label: 'Net Banking' },
          ].map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.payOption, paymentMethod === m.id && styles.payOptionActive]}
              onPress={() => setPaymentMethod(m.id as any)}
            >
              <View style={[styles.radioDot, paymentMethod === m.id && styles.radioDotActive]} />
              <Text style={[styles.payLabel, paymentMethod === m.id && styles.payLabelActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. Total & Action */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.sumLabel}>Total Payable Amount</Text>
          <Text style={styles.sumAmount}>₹{cart.total.toLocaleString('en-IN')}</Text>
        </View>

        <CustomButton
          title={`Pay ₹${cart.total.toLocaleString('en-IN')} & Confirm Order`}
          onPress={handlePlaceOrder}
          loading={isProcessing}
          icon={<Lock size={14} color="#0f172a" />}
          style={{ marginTop: 14 }}
        />
      </View>
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
    paddingBottom: 40,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  paymentOptions: {
    gap: 8,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  payOptionActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#f59e0b10',
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#64748b',
  },
  radioDotActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#f59e0b',
  },
  payLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  payLabelActive: {
    color: '#ffffff',
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  sumAmount: {
    color: '#f59e0b',
    fontSize: 20,
    fontWeight: '900',
  },
});
