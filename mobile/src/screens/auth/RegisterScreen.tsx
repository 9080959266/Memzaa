import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Camera, User, Mail, Lock, Phone, Store } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register } = useAuth();
  const [role, setRole] = useState<'customer' | 'shop_owner'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [studioName, setStudioName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      await register({
        name,
        email,
        password,
        phone,
        role,
        studioName: role === 'shop_owner' ? studioName || `${name}'s Studio` : undefined,
      });
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Camera size={22} color="#0f172a" />
        </View>
        <Text style={styles.title}>Join MEMORAA</Text>
        <Text style={styles.subtitle}>Create an account to book shoots or manage your photography studio</Text>
      </View>

      {/* Role Toggle */}
      <View style={styles.roleToggle}>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'customer' && styles.roleBtnActive]}
          onPress={() => setRole('customer')}
        >
          <User size={14} color={role === 'customer' ? '#0f172a' : '#94a3b8'} />
          <Text style={[styles.roleBtnText, role === 'customer' && styles.roleBtnTextActive]}>
            Customer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleBtn, role === 'shop_owner' && styles.roleBtnActive]}
          onPress={() => setRole('shop_owner')}
        >
          <Store size={14} color={role === 'shop_owner' ? '#0f172a' : '#94a3b8'} />
          <Text style={[styles.roleBtnText, role === 'shop_owner' && styles.roleBtnTextActive]}>
            Studio Partner
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <View style={styles.inputBox}>
            <User size={16} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Aarav Sharma"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputBox}>
            <Phone size={16} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="+91 98400 12345"
              placeholderTextColor="#64748b"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {role === 'shop_owner' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Studio Brand Name *</Text>
            <View style={styles.inputBox}>
              <Store size={16} color="#f59e0b" />
              <TextInput
                style={styles.input}
                placeholder="e.g. Royal Lens Photography"
                placeholderTextColor="#64748b"
                value={studioName}
                onChangeText={setStudioName}
              />
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <View style={styles.inputBox}>
            <Mail size={16} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="name@domain.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
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
          title="Create Account"
          onPress={handleRegister}
          loading={isSubmitting}
          style={{ marginTop: 10 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleBtnActive: {
    backgroundColor: '#f59e0b',
  },
  roleBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  roleBtnTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
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
    paddingVertical: 10,
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
