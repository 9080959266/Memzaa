import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { User, MapPin, Phone, Mail, LogOut, Plus, ShieldCheck, Sparkles, Image as ImageIcon, Heart, Bell, Headphones, ChevronRight, Store } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';

export const ProfileScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { user, logout, updateProfile, demoLogin } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setIsUpdating(true);
      await updateProfile({ name, phone });
      Alert.alert('Saved! ✅', 'Profile changes updated.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name || 'Aarav Sharma'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'customer@memora.com'}</Text>

        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'CUSTOMER'}</Text>
        </View>
      </View>

      {/* Quick Portal Switcher */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Sparkles size={14} color="#db2777" />
          <Text style={styles.sectionTitle}>Quick Portal Switcher</Text>
        </View>

        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[styles.roleSwitchBtn, user?.role === 'customer' && styles.activeSwitch]}
            onPress={() => demoLogin('customer')}
          >
            <Text style={[styles.roleSwitchText, user?.role === 'customer' && styles.activeText]}>
              Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleSwitchBtn, user?.role === 'shop_owner' && styles.activeSwitch]}
            onPress={() => demoLogin('shop_owner')}
          >
            <Text style={[styles.roleSwitchText, user?.role === 'shop_owner' && styles.activeText]}>
              Studio Owner
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleSwitchBtn, user?.role === 'admin' && styles.activeSwitch]}
            onPress={() => demoLogin('admin')}
          >
            <Text style={[styles.roleSwitchText, user?.role === 'admin' && styles.activeText]}>
              Super Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Shortcuts */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Account & Services</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation?.navigate('SavedAddresses')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#db277715' }]}>
            <MapPin size={16} color="#db2777" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>Saved Delivery Addresses</Text>
            <Text style={styles.menuSub}>Manage home & office delivery addresses</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation?.navigate('MyPhotos')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#06b6d415' }]}>
            <ImageIcon size={16} color="#06b6d4" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>My Photos Vault</Text>
            <Text style={styles.menuSub}>Cloud storage for prints & albums</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation?.navigate('Wishlist')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#f43f5e15' }]}>
            <Heart size={16} color="#f43f5e" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>Wishlist & Saved Studios</Text>
            <Text style={styles.menuSub}>Your favorite photo studios and products</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation?.navigate('HelpSupport')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#10b98115' }]}>
            <Headphones size={16} color="#10b981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>24/7 Help & Customer Support</Text>
            <Text style={styles.menuSub}>FAQs, tickets, and phone support</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Edit Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Personal Profile</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <CustomButton
          title="Save Changes"
          onPress={handleSaveProfile}
          loading={isUpdating}
          style={{ marginTop: 8 }}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <LogOut size={16} color="#e11d48" />
        <Text style={styles.logoutText}>Sign Out from Account</Text>
      </TouchableOpacity>

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
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#db2777',
    marginBottom: 10,
    backgroundColor: '#f1f5f9',
  },
  userName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },
  userEmail: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  rolePill: {
    backgroundColor: '#db277715',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleText: {
    color: '#db2777',
    fontSize: 10,
    fontWeight: '900',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleSwitchBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  activeSwitch: {
    backgroundColor: '#db2777',
  },
  roleSwitchText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  activeText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  menuSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#0f172a',
    fontSize: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginTop: 8,
  },
  logoutText: {
    color: '#e11d48',
    fontSize: 13,
    fontWeight: '800',
  },
});
