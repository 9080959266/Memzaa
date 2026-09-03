import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { MapPin, Plus, Trash2, Edit3, Check, X, Home, Briefcase, Navigation } from 'lucide-react-native';
import { CustomButton } from '../../components/common/CustomButton';

interface IAddressItem {
  id: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export const SavedAddressesScreen: React.FC = () => {
  const [addresses, setAddresses] = useState<IAddressItem[]>([
    {
      id: 'addr_1',
      fullName: 'Aarav Sharma',
      phone: '+91 98401 23456',
      house: 'Flat 4B, Shanthi Apartments',
      street: '14, 4th Main Road, Besant Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600090',
      type: 'Home',
      isDefault: true,
    },
    {
      id: 'addr_2',
      fullName: 'Aarav Sharma (Office)',
      phone: '+91 98401 23456',
      house: 'Level 6, Ascendas IT Park',
      street: 'CSIR Road, Taramani',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600113',
      type: 'Work',
      isDefault: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('600090');
  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const openAddModal = () => {
    setEditingId(null);
    setFullName('Aarav Sharma');
    setPhone('+91 98401 23456');
    setHouse('');
    setStreet('');
    setCity('Chennai');
    setState('Tamil Nadu');
    setPincode('600090');
    setType('Home');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!fullName || !phone || !street || !pincode) {
      Alert.alert('Missing Fields', 'Please fill in all address details.');
      return;
    }

    if (editingId) {
      setAddresses(
        addresses.map((a) =>
          a.id === editingId
            ? { ...a, fullName, phone, house, street, city, state, pincode, type }
            : a
        )
      );
    } else {
      const newAddr: IAddressItem = {
        id: `addr_${Date.now()}`,
        fullName,
        phone,
        house,
        street,
        city,
        state,
        pincode,
        type,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddr]);
    }

    setShowModal(false);
    Alert.alert('Saved! ✅', 'Address updated in your delivery address book.');
  };

  const setDefault = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Saved Delivery Addresses</Text>
          <Text style={styles.subtitle}>Manage addresses for courier delivery of frames & albums</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Plus size={16} color="#ffffff" />
          <Text style={styles.addBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {addresses.map((addr) => (
          <View key={addr.id} style={[styles.card, addr.isDefault && styles.cardDefault]}>
            <View style={styles.cardHeader}>
              <View style={styles.typeBadge}>
                {addr.type === 'Home' ? (
                  <Home size={12} color="#db2777" />
                ) : addr.type === 'Work' ? (
                  <Briefcase size={12} color="#06b6d4" />
                ) : (
                  <Navigation size={12} color="#f59e0b" />
                )}
                <Text style={styles.typeText}>{addr.type}</Text>
              </View>

              {addr.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setDefault(addr.id)}>
                  <Text style={styles.makeDefaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.nameText}>{addr.fullName}</Text>
            {addr.house ? <Text style={styles.addressText}>{addr.house}, {addr.street}</Text> : <Text style={styles.addressText}>{addr.street}</Text>}
            <Text style={styles.addressText}>{addr.city}, {addr.state} - {addr.pincode}</Text>
            <Text style={styles.phoneText}>Phone: {addr.phone}</Text>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteAddress(addr.id)}>
                <Trash2 size={14} color="#e11d48" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add / Edit Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Address' : 'Add Delivery Address'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Recipient Name *</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Aarav Sharma" />

              <Text style={styles.fieldLabel}>Phone Number *</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

              <Text style={styles.fieldLabel}>House / Flat / Building No.</Text>
              <TextInput style={styles.input} value={house} onChangeText={setHouse} placeholder="Flat 4B, Shanthi Apts" />

              <Text style={styles.fieldLabel}>Street & Area Details *</Text>
              <TextInput style={styles.input} value={street} onChangeText={setStreet} placeholder="14, 4th Main Road, Besant Nagar" />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <TextInput style={styles.input} value={city} onChangeText={setCity} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fieldLabel}>Pincode *</Text>
                  <TextInput style={styles.input} value={pincode} onChangeText={setPincode} keyboardType="number-pad" />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Address Tag</Text>
              <View style={styles.typesRow}>
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typePill, type === t && styles.typePillActive]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typePillText, type === t && styles.typePillTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomButton title="Save Address" onPress={handleSave} style={{ marginTop: 16, marginBottom: 30 }} />
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
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#db2777',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDefault: {
    borderColor: '#db2777',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '800',
  },
  defaultBadge: {
    backgroundColor: '#db277715',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#db2777',
    fontSize: 9,
    fontWeight: '900',
  },
  makeDefaultText: {
    color: '#db2777',
    fontSize: 10,
    fontWeight: '700',
  },
  nameText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  addressText: {
    color: '#475569',
    fontSize: 11,
    lineHeight: 16,
  },
  phoneText: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 10,
    paddingTop: 8,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    color: '#e11d48',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  fieldLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#0f172a',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  row: {
    flexDirection: 'row',
  },
  typesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  typePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  typePillActive: {
    backgroundColor: '#db2777',
  },
  typePillText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  typePillTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
});
