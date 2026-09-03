import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import { Search, Mic, Camera, X, ArrowLeft, Clock, TrendingUp, Sparkles, Star, ChevronRight } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api/client';
import { IStudio, IProduct } from '../../types';

export const SearchScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [query, setQuery] = useState('');
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(route.params?.openVoice || false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Wedding Photography',
    'Teak Wood Frames',
    'Baby Photoshoot',
    'Pre-Wedding in Chennai',
    'Canvas Prints',
  ]);

  const TRENDING_TAGS = [
    '💍 Traditional Wedding',
    '💕 Outdoor Pre-Wedding',
    '👶 Newborn & Baby',
    '🖼️ Engraved Wooden Frames',
    '🌸 Puberty Ceremony',
    '🎁 Personalized Photo Mugs',
  ];

  useEffect(() => {
    if (route.params?.openCamera) {
      handleCameraSearch();
    }
  }, [route.params?.openCamera]);

  useEffect(() => {
    if (!query.trim()) {
      setStudios([]);
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const [studiosRes, prodsRes] = await Promise.all([
          api.get(`/studios?search=${encodeURIComponent(query)}&limit=6`),
          api.get(`/products?search=${encodeURIComponent(query)}&limit=6`),
        ]);

        if (studiosRes.data.success) setStudios(studiosRes.data.studios || []);
        if (prodsRes.data.success) setProducts(prodsRes.data.products || []);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleVoiceSearch = () => {
    setIsVoiceModalVisible(true);
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const simulatedVoices = [
        'Wedding photo studios in Chennai',
        'Custom engraved teak wood frame',
        'Baby photoshoot packages',
      ];
      const randomQuery = simulatedVoices[Math.floor(Math.random() * simulatedVoices.length)];
      setQuery(randomQuery);
      setIsVoiceModalVisible(false);
    }, 2500);
  };

  const handleCameraSearch = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setQuery('Teak Wood Frames');
      }
    } catch (e) {}
  };

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Search Input Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Search size={16} color="#94a3b8" />
          <TextInput
            style={styles.input}
            placeholder="Search studios, packages, frames..."
            placeholderTextColor="#64748b"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={handleVoiceSearch}>
          <Mic size={18} color="#f59e0b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerIconBtn} onPress={handleCameraSearch}>
          <Camera size={18} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Results List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 30 }} />
        ) : query.trim() ? (
          <View>
            {studios.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Studios Matching "{query}"</Text>
                {studios.map((s) => (
                  <TouchableOpacity
                    key={s._id}
                    style={styles.resultItem}
                    onPress={() => navigation.navigate('StudioDetail', { id: s._id })}
                  >
                    <Image source={{ uri: s.logoImage }} style={styles.resultThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultTitle}>{s.name}</Text>
                      <Text style={styles.resultSub}>📍 {s.city} • ⭐ {s.rating.toFixed(1)}</Text>
                      <Text style={styles.resultPrice}>Starts ₹{s.startingPrice.toLocaleString('en-IN')}</Text>
                    </View>
                    <ChevronRight size={16} color="#64748b" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {products.length > 0 && (
              <View style={[styles.section, { marginTop: 16 }]}>
                <Text style={styles.sectionHeader}>Custom Keepsakes Matching "{query}"</Text>
                {products.map((p) => (
                  <TouchableOpacity
                    key={p._id}
                    style={styles.resultItem}
                    onPress={() => navigation.navigate('ProductDetail', { slug: p.slug })}
                  >
                    <Image source={{ uri: p.thumbnail }} style={styles.resultThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultTitle}>{p.title}</Text>
                      <Text style={styles.resultSub}>{p.category}</Text>
                      <Text style={styles.resultPrice}>
                        ₹{(p.discountPrice || p.basePrice).toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#64748b" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {studios.length === 0 && products.length === 0 && (
              <View style={styles.emptyView}>
                <Text style={styles.emptyTitle}>No results found for "{query}"</Text>
                <Text style={styles.emptySub}>Try searching for "Wedding", "Pre-Wedding", or "Frame".</Text>
              </View>
            )}
          </View>
        ) : (
          /* Recent & Trending Tags */
          <View>
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTop}>
                  <Text style={styles.sectionHeader}>Recent Searches</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.tagsRow}>
                  {recentSearches.map((term, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.historyChip}
                      onPress={() => handleSelectSearch(term)}
                    >
                      <Clock size={12} color="#64748b" />
                      <Text style={styles.historyText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={[styles.section, { marginTop: 20 }]}>
              <View style={styles.sectionTop}>
                <TrendingUp size={14} color="#f59e0b" />
                <Text style={[styles.sectionHeader, { marginLeft: 6 }]}>Trending Searches</Text>
              </View>

              <View style={styles.tagsRow}>
                {TRENDING_TAGS.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.trendingChip}
                    onPress={() => handleSelectSearch(tag.replace(/^[^\w\s]+/, '').trim())}
                  >
                    <Text style={styles.trendingText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Voice Search Simulation Modal */}
      <Modal visible={isVoiceModalVisible} transparent animationType="fade">
        <View style={styles.voiceOverlay}>
          <View style={styles.voiceCard}>
            <View style={styles.micCircle}>
              <Mic size={32} color="#0f172a" />
            </View>
            <Text style={styles.voiceTitle}>
              {isListening ? 'Listening... Speak now 🎙️' : 'Processing speech...'}
            </Text>
            <Text style={styles.voiceSub}>
              "Say 'Wedding photographer' or 'Teak wood frames'"
            </Text>

            <TouchableOpacity
              style={styles.voiceCloseBtn}
              onPress={() => setIsVoiceModalVisible(false)}
            >
              <Text style={styles.voiceCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backBtn: {
    padding: 6,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    gap: 6,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    paddingVertical: 8,
  },
  headerIconBtn: {
    padding: 6,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeader: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  clearText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  trendingChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f59e0b40',
  },
  trendingText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  resultThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#0f172a',
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  resultSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  resultPrice: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  emptyView: {
    alignItems: 'center',
    padding: 30,
    gap: 6,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  voiceOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  voiceCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  micCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  voiceTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  voiceSub: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  voiceCloseBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  voiceCloseText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
