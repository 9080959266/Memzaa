import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Camera, Mail, Lock, Sparkles, User, Store, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password');
      return;
    }
    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: 'customer' | 'shop_owner' | 'admin') => {
    try {
      setIsSubmitting(true);
      await demoLogin(role);
    } catch (e: any) {
      Alert.alert('Demo Login Failed', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Camera size={28} color="#0f172a" />
        </View>
        <Text style={styles.brandTitle}>
          MEM<Text style={{ color: '#db2777' }}>ORAA</Text>
        </Text>
        <Text style={styles.tagline}>Capture Moments. Preserve Memories.</Text>
      </View>

      {/* 1-Tap Demo Switcher Strip */}
      <View style={styles.demoCard}>
        <View style={styles.demoHeader}>
          <Sparkles size={14} color="#f59e0b" />
          <Text style={styles.demoHeaderText}>1-Tap Instant Demo Login:</Text>
        </View>

        <View style={styles.demoButtonsRow}>
          <TouchableOpacity style={styles.demoBtn} onPress={() => handleQuickDemo('customer')}>
            <User size={14} color="#3b82f6" />
            <Text style={styles.demoBtnText}>Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoBtn} onPress={() => handleQuickDemo('shop_owner')}>
            <Store size={14} color="#f59e0b" />
            <Text style={styles.demoBtnText}>Shop Owner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoBtn} onPress={() => handleQuickDemo('admin')}>
            <ShieldCheck size={14} color="#a855f7" />
            <Text style={styles.demoBtnText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Standard Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Sign In with Email</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputBox}>
            <Mail size={16} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="customer@memora.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Lock size={16} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          loading={isSubmitting}
          style={{ marginTop: 8 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tagline: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  demoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  demoHeaderText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
    paddingVertical: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  footerLink: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '800',
  },
});
