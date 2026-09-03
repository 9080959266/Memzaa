import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { Tag, Plus, CheckCircle2, X } from 'lucide-react-native';
import api from '../../api/client';
import { ICoupon } from '../../types';
import { CustomButton } from '../../components/common/CustomButton';

export const AdminCouponsScreen: React.FC = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [minOrder, setMinOrder] = useState('499');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/coupons/admin-all');
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (e) {
      console.error('Coupons error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async () => {
    if (!code) {
      Alert.alert('Missing Code', 'Please enter a coupon promo code.');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await api.post('/coupons', {
        code: code.toUpperCase(),
        description: description || 'Special Promotional Discount',
        discountPercent: Number(discountPercent),
        minOrderAmount: Number(minOrder),
        maxDiscountAmount: 2000,
        validTill: new Date(Date.now() + 180 * 86400000),
      });
      if (res.data.success) {
        setShowModal(false);
        setCode('');
        fetchCoupons();
        Alert.alert('Coupon Activated! 🏷️', `Promo code ${code} is now live.`);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Promotions & Coupons</Text>
          <Text style={styles.subtitle}>{coupons.length} Active Codes</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Plus size={16} color="#ffffff" />
          <Text style={styles.addText}>New Coupon</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {coupons.map((c) => (
            <View key={c._id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.codeText}>{c.code}</Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </View>

              <Text style={styles.desc}>{c.description}</Text>

              <View style={styles.specsRow}>
                <Text style={styles.specText}>
                  Discount: <Text style={{ color: '#ffffff', fontWeight: '800' }}>{c.discountPercent}% OFF</Text>
                </Text>
                <Text style={styles.specText}>
                  Min Cart: <Text style={{ color: '#ffffff', fontWeight: '800' }}>₹{c.minOrderAmount}</Text>
                </Text>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Promotional Coupon</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Coupon Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. FESTIVE25"
                placeholderTextColor="#64748b"
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Discount Percentage (%) *</Text>
              <TextInput
                style={styles.input}
                value={discountPercent}
                onChangeText={setDiscountPercent}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minimum Order Value (₹)</Text>
              <TextInput
                style={styles.input}
                value={minOrder}
                onChangeText={setMinOrder}
                keyboardType="number-pad"
              />
            </View>

            <CustomButton
              title="Activate Coupon"
              onPress={handleCreate}
              loading={isSubmitting}
              style={{ backgroundColor: '#a855f7', marginTop: 12, marginBottom: 30 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#a855f7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  codeText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  activeBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '800',
  },
  desc: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 8,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 8,
  },
  specText: {
    color: '#94a3b8',
    fontSize: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
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
    paddingVertical: 10,
  },
});
