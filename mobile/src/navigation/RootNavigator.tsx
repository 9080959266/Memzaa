import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { CustomerNavigator } from './CustomerNavigator';
import { SellerNavigator } from './SellerNavigator';
import { AdminNavigator } from './AdminNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#db2777" />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  // Role Based Routing
  switch (user.role) {
    case 'shop_owner':
      return <SellerNavigator />;
    case 'admin':
      return <AdminNavigator />;
    default:
      return <CustomerNavigator />;
  }
};
