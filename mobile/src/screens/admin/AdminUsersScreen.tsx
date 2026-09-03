import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Users, Search, Shield, Store, User, CheckCircle, Ban } from 'lucide-react-native';

interface IUserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'shop_owner' | 'admin';
  status: 'active' | 'suspended';
  joinedDate: string;
}

export const AdminUsersScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'shop_owner'>('all');
  const [users, setUsers] = useState<IUserItem[]>([
    {
      id: 'u1',
      name: 'Aarav Sharma',
      email: 'customer@memora.com',
      phone: '+91 98401 23456',
      role: 'customer',
      status: 'active',
      joinedDate: '01 Aug 2026',
    },
    {
      id: 'u2',
      name: 'Rajesh Varma (Priya Studios)',
      email: 'owner@memora.com',
      phone: '+91 98402 34567',
      role: 'shop_owner',
      status: 'active',
      joinedDate: '15 Jul 2026',
    },
    {
      id: 'u3',
      name: 'Kavitha Ramanathan',
      email: 'kavitha@gmail.com',
      phone: '+91 98403 45678',
      role: 'customer',
      status: 'active',
      joinedDate: '20 Aug 2026',
    },
    {
      id: 'u4',
      name: 'Suresh Babu (Classic Arts)',
      email: 'classic@studios.com',
      phone: '+91 98404 56789',
      role: 'shop_owner',
      status: 'suspended',
      joinedDate: '10 Jun 2026',
    },
  ]);

  const toggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Search size={16} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Role Filter Chips */}
      <View style={styles.filterRow}>
        {(['all', 'customer', 'shop_owner'] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.filterChip, roleFilter === r && styles.filterChipActive]}
            onPress={() => setRoleFilter(r)}
          >
            <Text style={[styles.filterText, roleFilter === r && styles.filterTextActive]}>
              {r === 'all' ? 'All Users' : r === 'customer' ? 'Customers' : 'Studios'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((u) => (
          <View key={u.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.userRoleBadge}>
                {u.role === 'customer' ? (
                  <User size={12} color="#db2777" />
                ) : (
                  <Store size={12} color="#f59e0b" />
                )}
                <Text style={styles.roleText}>{u.role.toUpperCase()}</Text>
              </View>

              <TouchableOpacity
                style={[styles.statusToggle, u.status === 'active' ? styles.statusActive : styles.statusSusp]}
                onPress={() => toggleStatus(u.id)}
              >
                <Text style={[styles.statusToggleText, u.status === 'active' ? styles.textActive : styles.textSusp]}>
                  {u.status === 'active' ? 'ACTIVE' : 'SUSPENDED'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{u.name}</Text>
            <Text style={styles.email}>{u.email} • {u.phone}</Text>
            <Text style={styles.joined}>Joined {u.joinedDate}</Text>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 12,
    color: '#0f172a',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleText: {
    color: '#0f172a',
    fontSize: 9,
    fontWeight: '800',
  },
  statusToggle: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusSusp: {
    backgroundColor: '#fee2e2',
  },
  statusToggleText: {
    fontSize: 9,
    fontWeight: '900',
  },
  textActive: {
    color: '#16a34a',
  },
  textSusp: {
    color: '#e11d48',
  },
  name: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  email: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  joined: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 6,
  },
});
