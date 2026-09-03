import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import { Sparkles, Camera, Image as ImageIcon, Check, X, ShieldCheck } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { IProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import { CustomButton } from '../common/CustomButton';

export const MobileCustomizer: React.FC<{
  visible: boolean;
  onClose: () => void;
  product: IProduct;
}> = ({ visible, onClose, product }) => {
  const { addToCart } = useCart();

  const [uploadedPhoto, setUploadedPhoto] = useState<string>(
    product.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
  );
  const [customName, setCustomName] = useState('Aarav & Diya');
  const [customDate, setCustomDate] = useState('14th Feb 2026');
  const [customText, setCustomText] = useState('Forever & Always');
  const [selectedFrame, setSelectedFrame] = useState('Natural Teak Wood');
  const [selectedSize, setSelectedSize] = useState('12x18 inches');
  const [isAdding, setIsAdding] = useState(false);

  const FRAME_OPTIONS = [
    { name: 'Natural Teak Wood', color: '#b45309', border: '#78350f' },
    { name: 'Matte Obsidian Black', color: '#18181b', border: '#09090b' },
    { name: 'Rich Walnut Finish', color: '#451a03', border: '#290e02' },
    { name: 'Rose Gold Metallic', color: '#fb7185', border: '#e11d48' },
  ];

  const SIZES = [
    { label: '8x10 in', priceExtra: 0 },
    { label: '12x18 in', priceExtra: 350 },
    { label: '16x24 in', priceExtra: 750 },
    { label: '20x30 in', priceExtra: 1200 },
  ];

  const basePrice = product.discountPrice || product.basePrice;
  const currentSizeObj = SIZES.find((s) => s.label === selectedSize) || SIZES[1];
  const totalPrice = basePrice + currentSizeObj.priceExtra;

  const currentFrameObj = FRAME_OPTIONS.find((f) => f.name === selectedFrame) || FRAME_OPTIONS[0];

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploadedPhoto(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Upload Error', 'Could not open image library');
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      const customization = {
        uploadedPhoto,
        customName,
        customDate,
        customText,
        frameColor: selectedFrame,
        size: selectedSize,
      };

      await addToCart(product._id, 1, customization);
      Alert.alert('Added to Cart! 🎁', 'Your custom photo keepsake is ready for checkout.', [
        { text: 'Continue Shopping', onPress: onClose },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add item');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Live 3D Customizer</Text>
              <Text style={styles.subtitle}>{product.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* LIVE 3D PHOTO MOCKUP */}
            <View style={styles.mockupContainer}>
              <View
                style={[
                  styles.frameBorder,
                  { backgroundColor: currentFrameObj.color, borderColor: currentFrameObj.border },
                ]}
              >
                <View style={styles.photoMatte}>
                  <Image source={{ uri: uploadedPhoto }} style={styles.mockupImage} resizeMode="cover" />

                  {/* Engraved Plaque Overlay */}
                  <View style={styles.engravedPlaque}>
                    <Text style={styles.plaqueNames} numberOfLines={1}>
                      {customName || 'Aarav & Diya'}
                    </Text>
                    {customDate && <Text style={styles.plaqueDate}>{customDate}</Text>}
                    {customText && <Text style={styles.plaqueText}>"{customText}"</Text>}
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickImage}>
                <Camera size={14} color="#0f172a" />
                <Text style={styles.changePhotoText}>Upload Your Photo</Text>
              </TouchableOpacity>
            </View>

            {/* 1. Frame Finish Selection */}
            <Text style={styles.sectionLabel}>1. Frame Material & Color Finish</Text>
            <View style={styles.framesGrid}>
              {FRAME_OPTIONS.map((f) => (
                <TouchableOpacity
                  key={f.name}
                  style={[
                    styles.frameOption,
                    selectedFrame === f.name && styles.frameOptionActive,
                  ]}
                  onPress={() => setSelectedFrame(f.name)}
                >
                  <View style={[styles.colorCircle, { backgroundColor: f.color }]} />
                  <Text style={[styles.frameName, selectedFrame === f.name && styles.frameNameActive]} numberOfLines={1}>
                    {f.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 2. Engraved Couple Names */}
            <Text style={styles.sectionLabel}>2. Engraved Names / Headline</Text>
            <TextInput
              style={styles.input}
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. Priya & Vignesh"
              placeholderTextColor="#64748b"
            />

            {/* 3. Anniversary / Event Date */}
            <Text style={styles.sectionLabel}>3. Special Event / Wedding Date</Text>
            <TextInput
              style={styles.input}
              value={customDate}
              onChangeText={setCustomDate}
              placeholder="e.g. 14th November 2026"
              placeholderTextColor="#64748b"
            />

            {/* 4. Custom Engraving Quote */}
            <Text style={styles.sectionLabel}>4. Personal Quote or Message</Text>
            <TextInput
              style={styles.input}
              value={customText}
              onChangeText={setCustomText}
              placeholder="e.g. Together forever, never apart."
              placeholderTextColor="#64748b"
            />

            {/* 5. Size Selection */}
            <Text style={styles.sectionLabel}>5. Select Size</Text>
            <View style={styles.sizesRow}>
              {SIZES.map((s) => (
                <TouchableOpacity
                  key={s.label}
                  style={[styles.sizePill, selectedSize === s.label && styles.sizePillActive]}
                  onPress={() => setSelectedSize(s.label)}
                >
                  <Text style={[styles.sizeLabel, selectedSize === s.label && styles.sizeLabelActive]}>
                    {s.label}
                  </Text>
                  {s.priceExtra > 0 && (
                    <Text style={[styles.sizeExtra, selectedSize === s.label && styles.sizeExtraActive]}>
                      +₹{s.priceExtra}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Total Price & Add to Cart */}
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.priceLabel}>Customized Total</Text>
                <Text style={styles.totalPrice}>₹{totalPrice.toLocaleString('en-IN')}</Text>
              </View>

              <CustomButton
                title="Add to Cart"
                onPress={handleAddToCart}
                loading={isAdding}
                icon={<Sparkles size={14} color="#0f172a" />}
                style={{ flex: 1, marginLeft: 16 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    color: '#f59e0b',
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingBottom: 20,
  },
  mockupContainer: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  frameBorder: {
    width: 220,
    height: 220,
    borderRadius: 14,
    borderWidth: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  photoMatte: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  mockupImage: {
    width: '100%',
    height: '100%',
  },
  engravedPlaque: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  plaqueNames: {
    color: '#fef08a',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  plaqueDate: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '600',
  },
  plaqueText: {
    color: '#cbd5e1',
    fontSize: 7,
    fontStyle: 'italic',
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
  },
  changePhotoText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  framesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frameOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  frameOptionActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#f59e0b15',
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  frameName: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  frameNameActive: {
    color: '#f59e0b',
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sizesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizePill: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sizePillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  sizeLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  sizeLabelActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  sizeExtra: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  sizeExtraActive: {
    color: '#0f172a',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 14,
  },
  priceLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  totalPrice: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
});
