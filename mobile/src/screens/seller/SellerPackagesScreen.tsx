import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { Plus, Trash2, CheckCircle2, X } from 'lucide-react-native';
import api from '../../api/client';
import { IPackage } from '../../types';
import { CustomButton } from '../../components/common/CustomButton';

export const SellerPackagesScreen: React.FC = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('15000');
  const [durationHours, setDurationHours] = useState('3');
  const [editedPhotosCount, setEditedPhotosCount] = useState('30');
  const [rawPhotosCount, setRawPhotosCount] = useState('300');
  const [description, setDescription] = useState('Comprehensive session with drone and retouches');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const [pkgRes, catRes] = await Promise.all([
        api.get('/studios/my-studio'),
        api.get('/categories'),
      ]);

      if (pkgRes.data.success) setPackages(pkgRes.data.packages || []);
      if (catRes.data.success && catRes.data.categories.length > 0) {
        setCategories(catRes.data.categories);
        setCategoryId(catRes.data.categories[0]._id);
      }
    } catch (e) {
      console.error('Packages error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreate = async () => {
    if (!title || !price) {
      Alert.alert('Missing Info', 'Please enter package title and pricing.');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        title,
        categoryId,
        price: Number(price),
        durationHours: Number(durationHours),
        editedPhotosCount: Number(editedPhotosCount),
        rawPhotosCount: Number(rawPhotosCount),
        description,
        deliverables: ['High-Res Digital Retouches', 'Velvet Photo Album', 'Online Cloud Gallery'],
      };

      const res = await api.post('/packages', payload);
      if (res.data.success) {
        setShowModal(false);
        fetchPackages();
        Alert.alert('Package Published! 📦', 'New package is now bookable by customers.');
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
          <Text style={styles.title}>Photoshoot Packages</Text>
          <Text style={styles.subtitle}>{packages.length} Active Packages Listed</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Plus size={16} color="#0f172a" />
          <Text style={styles.addText}>Add Package</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {packages.map((pkg) => (
            <View key={pkg._id} style={styles.pkgCard}>
              <View style={styles.pkgTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pkgCategory}>{pkg.categoryId?.name || 'Category'}</Text>
                  <Text style={styles.pkgTitle}>{pkg.title}</Text>
                </View>
                <Text style={styles.pkgPrice}>₹{pkg.price.toLocaleString('en-IN')}</Text>
              </View>

              <Text style={styles.pkgDesc}>{pkg.description}</Text>

              <View style={styles.specsRow}>
                <Text style={styles.specItem}>⏱️ {pkg.durationHours}h</Text>
                <Text style={styles.specItem}>✨ {pkg.editedPhotosCount} Retouched</Text>
                <Text style={styles.specItem}>📷 {pkg.rawPhotosCount}+ Raw</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Add Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Photoshoot Package</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Package Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Traditional Wedding Ceremony"
                  placeholderTextColor="#64748b"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Hours</Text>
                  <TextInput
                    style={styles.input}
                    value={durationHours}
                    onChangeText={setDurationHours}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Edited Photos</Text>
                  <TextInput
                    style={styles.input}
                    value={editedPhotosCount}
                    onChangeText={setEditedPhotosCount}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <CustomButton
                title="Publish Package"
                onPress={handleCreate}
                loading={isSubmitting}
                style={{ marginTop: 14, marginBottom: 30 }}
              />
            </ScrollView>
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
    marginBottom: 16,
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
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
  list: {
    flex: 1,
  },
  pkgCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pkgTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pkgCategory: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  pkgTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  pkgPrice: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  pkgDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 10,
  },
  specItem: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
