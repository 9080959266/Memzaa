import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Layers, ShoppingCart, Truck, Camera } from 'lucide-react-native';

// Customer Tabs & Screens
import { HomeScreen } from '../screens/customer/HomeScreen';
import { CategoriesScreen } from '../screens/customer/CategoriesScreen';
import { CartScreen } from '../screens/customer/CartScreen';
import { OrdersScreen } from '../screens/customer/OrdersScreen';
import { PhotoshootBookingScreen } from '../screens/customer/PhotoshootBookingScreen';

// Stack Screens
import { StudiosScreen } from '../screens/customer/StudiosScreen';
import { StudioDetailScreen } from '../screens/customer/StudioDetailScreen';
import { ProductsScreen } from '../screens/customer/ProductsScreen';
import { ProductDetailScreen } from '../screens/customer/ProductDetailScreen';
import { CheckoutScreen } from '../screens/customer/CheckoutScreen';
import { OrderDetailScreen } from '../screens/customer/OrderDetailScreen';
import { BookingsScreen } from '../screens/customer/BookingsScreen';
import { ProofsScreen } from '../screens/customer/ProofsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { SearchScreen } from '../screens/customer/SearchScreen';
import { WishlistScreen } from '../screens/customer/WishlistScreen';
import { NotificationsScreen } from '../screens/customer/NotificationsScreen';
import { CompareStudiosScreen } from '../screens/customer/CompareStudiosScreen';
import { MyPhotosScreen } from '../screens/customer/MyPhotosScreen';
import { SavedAddressesScreen } from '../screens/customer/SavedAddressesScreen';
import { HelpSupportScreen } from '../screens/customer/HelpSupportScreen';

import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomerTabs: React.FC = () => {
  const { itemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: '#db2777', // Meesho vibrant pink
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      {/* 1. Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
          ),
        }}
      />

      {/* 2. Categories */}
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <Layers size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
          ),
        }}
      />

      {/* 3. Cart */}
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <ShoppingCart size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
              {itemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* 4. My Orders (Delivery Truck icon exactly like Meesho screenshot) */}
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <Truck size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
              <View style={[styles.cartBadge, { backgroundColor: '#db2777' }]}>
                <Text style={styles.cartBadgeText}>2</Text>
              </View>
            </View>
          ),
        }}
      />

      {/* 5. Photoshoot */}
      <Tab.Screen
        name="PhotoshootTab"
        component={PhotoshootBookingScreen}
        options={{
          tabBarLabel: 'Photoshoot',
          tabBarIcon: ({ color, focused }) => (
            <Camera size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const CustomerNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: '800', fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={CustomerTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Saved Wishlist' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="CompareStudios" component={CompareStudiosScreen} options={{ title: 'Compare Studios' }} />
      <Stack.Screen name="MyPhotos" component={MyPhotosScreen} options={{ title: 'My Photos Vault' }} />
      <Stack.Screen name="Studios" component={StudiosScreen} options={{ title: 'Explore Studios' }} />
      <Stack.Screen name="StudioDetail" component={StudioDetailScreen} options={{ title: 'Studio Profile' }} />
      <Stack.Screen name="StoreTab" component={ProductsScreen} options={{ title: 'Photo Keepsake Store' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Secure Checkout' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: '10-Stage Order Tracker' }} />
      <Stack.Screen name="Bookings" component={BookingsScreen} options={{ title: 'Photoshoot Bookings' }} />
      <Stack.Screen name="Proofs" component={ProofsScreen} options={{ title: 'Proof Approvals' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} options={{ title: 'Delivery Addresses' }} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ title: 'Help & Support' }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#db2777',
    borderRadius: 9,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
});
