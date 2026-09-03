import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MapPin, Bell, Heart, Search, Mic, Camera, User, Store, ShieldCheck, ChevronDown, X, Sparkles } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';

export const Header: React.FC<{
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  navigation?: any;
}> = ({ selectedCity = 'Chennai', onCityChange, navigation }) => {
  const { user, demoLogin } = useAuth();
  const { studios, products } = useWishlist();
  const { unreadCount } = useNotifications();

  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);

  const CITIES = [
    'Chennai',
    'Bengaluru',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Coimbatore',
    'Madurai',
    'Kochi',
    'Kolkata',
    'Pune',
  ];

  const totalWishlistCount = (studios?.length || 0) + (products?.length || 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.headerWrapper}>
        {/* Top Strip: Brand & Location on Left, Actions on Right */}
        <View style={styles.topRow}>
          <View style={styles.leftGroup}>
            {/* MEMORAA Brand */}
            <TouchableOpacity
              style={styles.brandContainer}
              onPress={() => setIsRoleModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.brandIconBadge}>
                <Camera size={14} color="#ffffff" />
              </View>
              <Text style={styles.brandName}>
                MEM<Text style={{ color: '#db2777' }}>ORAA</Text>
              </Text>
            </TouchableOpacity>

            {/* City Chip */}
            <TouchableOpacity
              style={styles.locationChip}
              onPress={() => setIsCityModalVisible(true)}
              activeOpacity={0.8}
            >
              <MapPin size={11} color="#db2777" />
              <Text style={styles.locationText} numberOfLines={1}>
                {selectedCity}
              </Text>
              <ChevronDown size={10} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Right Icons: Wishlist, Notification, Portal Switch */}
          <View style={styles.rightGroup}>
            {/* Wishlist */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation?.navigate('Wishlist')}
              activeOpacity={0.7}
            >
              <Heart size={18} color="#475569" />
              {totalWishlistCount > 0 && (
                <View style={styles.badgePink}>
                  <Text style={styles.badgeText}>{totalWishlistCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation?.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Bell size={18} color="#475569" />
              {unreadCount > 0 && (
                <View style={[styles.badgePink, { backgroundColor: '#f59e0b' }]}>
                  <Text style={[styles.badgeText, { color: '#0f172a' }]}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Role Demo Pill */}
            <TouchableOpacity
              style={styles.roleDemoPill}
              onPress={() => setIsRoleModalVisible(true)}
              activeOpacity={0.7}
            >
              <User size={11} color="#db2777" />
              <Text style={styles.roleDemoText}>
                {user?.role === 'shop_owner' ? 'Studio' : user?.role === 'admin' ? 'Admin' : 'Demo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meesho / Shopsy Style Rounded Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation?.navigate('Search')}
          activeOpacity={0.9}
        >
          <Search size={16} color="#94a3b8" />
          <Text style={styles.searchPlaceholder}>
            Search studios, frames, wedding shoots...
          </Text>
          <View style={styles.searchActionIcons}>
            <TouchableOpacity
              style={styles.searchMiniBtn}
              onPress={() => navigation?.navigate('Search', { openVoice: true })}
            >
              <Mic size={15} color="#db2777" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchMiniBtn}
              onPress={() => navigation?.navigate('Search', { openCamera: true })}
            >
              <Camera size={15} color="#db2777" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* City Picker Bottom Sheet */}
        <Modal visible={isCityModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MapPin size={18} color="#db2777" />
                  <Text style={styles.modalTitle}>Select Shoot Location</Text>
                </View>
                <TouchableOpacity onPress={() => setIsCityModalVisible(false)} style={styles.closeBtn}>
                  <X size={18} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 320 }}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.cityItem,
                      selectedCity === city && styles.cityItemActive,
                    ]}
                    onPress={() => {
                      if (onCityChange) onCityChange(city);
                      setIsCityModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.cityItemText,
                        selectedCity === city && styles.cityItemTextActive,
                      ]}
                    >
                      📍 {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* 1-Tap Portal Switcher Modal */}
        <Modal visible={isRoleModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { paddingBottom: 28 }]}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={18} color="#db2777" />
                  <Text style={styles.modalTitle}>1-Tap Portal Switcher</Text>
                </View>
                <TouchableOpacity onPress={() => setIsRoleModalVisible(false)} style={styles.closeBtn}>
                  <X size={18} color="#64748b" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSub}>
                Switch between user roles instantly to test mobile flows:
              </Text>

              <TouchableOpacity
                style={[styles.roleCard, user?.role === 'customer' && styles.roleCardActive]}
                onPress={async () => {
                  await demoLogin('customer');
                  setIsRoleModalVisible(false);
                }}
              >
                <View style={[styles.roleIconCircle, { backgroundColor: '#db277715' }]}>
                  <User size={18} color="#db2777" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleCardTitle}>Customer Portal</Text>
                  <Text style={styles.roleCardSub}>Book shoots, 3D frame customizer, 10-step stepper</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleCard, user?.role === 'shop_owner' && styles.roleCardActive]}
                onPress={async () => {
                  await demoLogin('shop_owner');
                  setIsRoleModalVisible(false);
                }}
              >
                <View style={[styles.roleIconCircle, { backgroundColor: '#f59e0b15' }]}>
                  <Store size={18} color="#f59e0b" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleCardTitle}>Studio Owner Partner</Text>
                  <Text style={styles.roleCardSub}>10-stage photo job Kanban, packages CRUD, calendar</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleCard, user?.role === 'admin' && styles.roleCardActive]}
                onPress={async () => {
                  await demoLogin('admin');
                  setIsRoleModalVisible(false);
                }}
              >
                <View style={[styles.roleIconCircle, { backgroundColor: '#7c3aed15' }]}>
                  <ShieldCheck size={18} color="#7c3aed" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleCardTitle}>Super Admin Desk</Text>
                  <Text style={styles.roleCardSub}>10% commission KPIs, studio verification, coupons</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#db2777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 105,
  },
  locationText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    position: 'relative',
    padding: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgePink: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#db2777',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  roleDemoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#db277710',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#db277730',
  },
  roleDemoText: {
    color: '#db2777',
    fontSize: 10,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchPlaceholder: {
    flex: 1,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  searchActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchMiniBtn: {
    padding: 2,
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
  closeBtn: {
    padding: 4,
  },
  modalSub: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 16,
  },
  cityItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cityItemActive: {
    backgroundColor: '#db2777',
    borderColor: '#db2777',
  },
  cityItemText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  cityItemTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  roleCardActive: {
    borderColor: '#db2777',
    backgroundColor: '#db277708',
  },
  roleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  roleCardSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
});
