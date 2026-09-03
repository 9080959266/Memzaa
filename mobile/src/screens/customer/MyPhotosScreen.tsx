import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Camera, Image as ImageIcon, Heart, Trash2, CheckCircle2, Sparkles, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface IPhotoItem {
  id: string;
  uri: string;
  isFavourite: boolean;
  category: 'uploaded' | 'selected' | 'used_in_order';
  createdAt: string;
}

export const MyPhotosScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'favourites' | 'orders'>('all');
  const [photos, setPhotos] = useState<IPhotoItem[]>([
    {
      id: 'p1',
      uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      isFavourite: true,
      category: 'used_in_order',
      createdAt: '2026-09-01',
    },
    {
      id: 'p2',
      uri: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      isFavourite: true,
      category: 'uploaded',
      createdAt: '2026-09-01',
    },
    {
      id: 'p3',
      uri: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
      isFavourite: false,
      category: 'selected',
      createdAt: '2026-08-28',
    },
    {
      id: 'p4',
      uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      isFavourite: false,
      category: 'used_in_order',
      createdAt: '2026-08-25',
    },
  ]);

  const [previewPhoto, setPreviewPhoto] = useState<IPhotoItem | null>(null);

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets) {
        const newItems: IPhotoItem[] = result.assets.map((asset, idx) => ({
          id: `new_${Date.now()}_${idx}`,
          uri: asset.uri,
          isFavourite: false,
          category: 'uploaded',
          createdAt: new Date().toISOString().split('T')[0],
        }));

        setPhotos([...newItems, ...photos]);
        Alert.alert('Uploaded! 📸', `${newItems.length} photo(s) added to your personal photo vault.`);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0].uri) {
        const newItem: IPhotoItem = {
          id: `cam_${Date.now()}`,
          uri: result.assets[0].uri,
          isFavourite: false,
          category: 'uploaded',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setPhotos([newItem, ...photos]);
        Alert.alert('Photo Captured! 📸', 'Added to your personal photo vault.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const toggleFavourite = (id: string) => {
    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, isFavourite: !p.isFavourite } : p))
    );
    if (previewPhoto && previewPhoto.id === id) {
      setPreviewPhoto({ ...previewPhoto, isFavourite: !previewPhoto.isFavourite });
    }
  };

  const deletePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
    setPreviewPhoto(null);
  };

  const filteredPhotos = photos.filter((p) => {
    if (activeTab === 'favourites') return p.isFavourite;
    if (activeTab === 'orders') return p.category === 'used_in_order';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Upload Buttons */}
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handlePickFromGallery}>
          <ImageIcon size={16} color="#0f172a" />
          <Text style={styles.actionBtnText}>Pick from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' }]} onPress={handleTakePhoto}>
          <Camera size={16} color="#f59e0b" />
          <Text style={[styles.actionBtnText, { color: '#ffffff' }]}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {[
          { key: 'all', label: `All Photos (${photos.length})` },
          { key: 'favourites', label: `Favourites ❤️ (${photos.filter((p) => p.isFavourite).length})` },
          { key: 'orders', label: `Used in Orders 📦 (${photos.filter((p) => p.category === 'used_in_order').length})` },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key as any)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Photos Grid */}
      <ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false}>
        {filteredPhotos.length === 0 ? (
          <View style={styles.emptyView}>
            <ImageIcon size={40} color="#64748b" />
            <Text style={styles.emptyTitle}>No Photos in this tab</Text>
            <Text style={styles.emptySub}>Upload photos from your device to easily customize frames & albums!</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredPhotos.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.photoItem}
                onPress={() => setPreviewPhoto(p)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: p.uri }} style={styles.photoImg} />
                <TouchableOpacity
                  style={[styles.favBadge, p.isFavourite && styles.favBadgeActive]}
                  onPress={() => toggleFavourite(p.id)}
                >
                  <Heart size={12} color={p.isFavourite ? '#ffffff' : '#f8fafc'} fill={p.isFavourite ? '#ffffff' : 'transparent'} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <Modal visible={!!previewPhoto} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Photo Vault Preview</Text>
                <TouchableOpacity onPress={() => setPreviewPhoto(null)}>
                  <X size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <Image source={{ uri: previewPhoto.uri }} style={styles.previewImage} resizeMode="contain" />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, previewPhoto.isFavourite && styles.modalBtnActive]}
                  onPress={() => toggleFavourite(previewPhoto.id)}
                >
                  <Heart size={14} color={previewPhoto.isFavourite ? '#ffffff' : '#cbd5e1'} fill={previewPhoto.isFavourite ? '#ffffff' : 'transparent'} />
                  <Text style={[styles.modalBtnText, previewPhoto.isFavourite && { color: '#ffffff' }]}>
                    {previewPhoto.isFavourite ? 'Favourited' : 'Favourite'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#e11d4820', borderColor: '#e11d4840' }]}
                  onPress={() => deletePhoto(previewPhoto.id)}
                >
                  <Trash2 size={14} color="#e11d48" />
                  <Text style={[styles.modalBtnText, { color: '#e11d48' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 14,
  },
  actionBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 4,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#f59e0b',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  gridScroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    width: '48%',
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1e293b',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  favBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 14,
  },
  favBadgeActive: {
    backgroundColor: '#e11d48',
  },
  emptyView: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalBtnActive: {
    backgroundColor: '#e11d48',
    borderColor: '#e11d48',
  },
  modalBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '800',
  },
});
