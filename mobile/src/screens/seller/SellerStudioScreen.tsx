import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera, MapPin, Phone, Mail, Plus, Trash2, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IStudio } from '../../types';
import { CustomButton } from '../../components/common/CustomButton';

export const SellerStudioScreen: React.FC = () => {
  const [studio, setStudio] = useState<IStudio | null>(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [city, setCity] = useState('');
  const [startingPrice, setStartingPrice] = useState('5000');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await api.get('/studios/my-studio');
        if (res.data.success) {
          const s = res.data.studio;
          setStudio(s);
          setName(s.name || '');
          setTagline(s.tagline || '');
          setCity(s.city || 'Chennai');
          setStartingPrice(String(s.startingPrice || 5000));
        }
      } catch (e) {}
    };
    fetchStudio();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/studios/my-studio', {
        name,
        tagline,
        city,
        startingPrice: Number(startingPrice),
      });
      Alert.alert('Studio Updated! ✅', 'Your public studio page has been updated.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Studio Profile & Branding</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Studio Brand Name *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tagline</Text>
          <TextInput style={styles.input} value={tagline} onChangeText={setTagline} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City / Location *</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Starting Session Price (₹) *</Text>
          <TextInput
            style={styles.input}
            value={startingPrice}
            onChangeText={setStartingPrice}
            keyboardType="number-pad"
          />
        </View>

        <CustomButton
          title="Save Studio Profile"
          onPress={handleSave}
          loading={isSaving}
          style={{ marginTop: 10 }}
        />
      </View>

      {/* Portfolio Previews */}
      {studio?.portfolio && studio.portfolio.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portfolio Uploads ({studio.portfolio.length})</Text>
          <View style={styles.portfolioGrid}>
            {studio.portfolio.map((p, idx) => (
              <Image key={idx} source={{ uri: p.url }} style={styles.portfolioThumb} />
            ))}
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  portfolioThumb: {
    width: '31%',
    height: 80,
    borderRadius: 10,
    backgroundColor: '#0f172a',
  },
});
