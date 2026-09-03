import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search, MapPin, Filter, Layers, Star, X, Sparkles } from 'lucide-react-native';
import api from '../../api/client';
import { IStudio, IPhotoshootCategory } from '../../types';
import { StudioCard } from '../../components/customer/StudioCard';

export const StudiosScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const initialCategory = route.params?.category || 'All';
  const initialSearch = route.params?.search || '';

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [categories, setCategories] = useState<IPhotoshootCategory[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);

  const CITIES = ['All', 'Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad'];

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCity !== 'All') params.append('city', selectedCity);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);

        const [res, catRes] = await Promise.all([
          api.get(`/studios?${params.toString()}`),
          api.get('/categories'),
        ]);

        if (res.data.success) setStudios(res.data.studios);
        if (catRes.data.success) setCategories(catRes.data.categories);
      } catch (e) {
        console.error('Studios error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudios();
  }, [search, selectedCity, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Search & Filter Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Search size={16} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search studios..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* City Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {CITIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.cityPill, selectedCity === c && styles.cityPillActive]}
              onPress={() => setSelectedCity(c)}
            >
              <Text style={[styles.cityPillText, selectedCity === c && styles.cityPillTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Studios List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : studios.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyTitle}>No Studios Found</Text>
          <Text style={styles.emptySub}>Try adjusting your city filter or search terms.</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ padding: 16 }}>
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              onPress={() => navigation.navigate('StudioDetail', { id: studio._id })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topBar: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    paddingVertical: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  cityPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cityPillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  cityPillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  cityPillTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  list: {
    flex: 1,
  },
  emptyView: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
