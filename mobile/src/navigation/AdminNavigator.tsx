import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShieldCheck, Store, Tag, Users, BarChart3, User } from 'lucide-react-native';

import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminStudiosScreen } from '../screens/admin/AdminStudiosScreen';
import { AdminCouponsScreen } from '../screens/admin/AdminCouponsScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminReportsScreen } from '../screens/admin/AdminReportsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';

const Tab = createBottomTabNavigator();

export const AdminNavigator: React.FC = () => {
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
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Overview"
        component={AdminDashboardScreen}
        options={{
          title: 'Admin Master Center',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <ShieldCheck size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Studios"
        component={AdminStudiosScreen}
        options={{
          title: 'Studio Verification',
          tabBarLabel: 'Studios',
          tabBarIcon: ({ color }) => <Store size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={AdminReportsScreen}
        options={{
          title: 'Platform Financials & GMV',
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color }) => <BarChart3 size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{
          title: 'Users & Studio Partners',
          tabBarLabel: 'Users',
          tabBarIcon: ({ color }) => <Users size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Coupons"
        component={AdminCouponsScreen}
        options={{
          title: 'Promotions Engine',
          tabBarLabel: 'Coupons',
          tabBarIcon: ({ color }) => <Tag size={18} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
