import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Kanban, Store, Layers, Calendar, Package, DollarSign, User } from 'lucide-react-native';

import { SellerDashboardScreen } from '../screens/seller/SellerDashboardScreen';
import { SellerKanbanScreen } from '../screens/seller/SellerKanbanScreen';
import { SellerStudioScreen } from '../screens/seller/SellerStudioScreen';
import { SellerPackagesScreen } from '../screens/seller/SellerPackagesScreen';
import { SellerBookingsScreen } from '../screens/seller/SellerBookingsScreen';
import { SellerInventoryScreen } from '../screens/seller/SellerInventoryScreen';
import { SellerRevenueScreen } from '../screens/seller/SellerRevenueScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';

const Tab = createBottomTabNavigator();

export const SellerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: '800', fontSize: 16 },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#db2777',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={SellerDashboardScreen}
        options={{
          title: 'Studio Overview',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Kanban"
        component={SellerKanbanScreen}
        options={{
          title: 'Photo Jobs Kanban',
          tabBarLabel: 'Kanban',
          tabBarIcon: ({ color }) => <Kanban size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={SellerBookingsScreen}
        options={{
          title: 'Shoot Bookings',
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color }) => <Calendar size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={SellerInventoryScreen}
        options={{
          title: 'Workshop Stock',
          tabBarLabel: 'Inventory',
          tabBarIcon: ({ color }) => <Package size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Revenue"
        component={SellerRevenueScreen}
        options={{
          title: 'Earnings & Payouts',
          tabBarLabel: 'Revenue',
          tabBarIcon: ({ color }) => <DollarSign size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Studio"
        component={SellerStudioScreen}
        options={{
          title: 'Studio Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Store size={18} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
