import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { Camera, Sparkles, Clock, ArrowRight, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Discover Top Photography Studios',
    description: 'Book vetted studios for Weddings, Pre-Weddings, Baby Shoots, and Ceremonies across India with 20% advance protection.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    icon: <Camera size={24} color="#db2777" />,
  },
  {
    id: '2',
    title: 'Live 3D Customizer & Photo Keepsakes',
    description: 'Personalize solid teak wood frames, layflat velvet albums, and magic mugs with your photos and engraved names.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    icon: <Sparkles size={24} color="#db2777" />,
  },
  {
    id: '3',
    title: '10-Stage Live Production Tracking',
    description: 'Watch your memories move live through Photo Upload → Retouching → Proof Approval → Archival Print → Express Delivery.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    icon: <Clock size={24} color="#db2777" />,
  },
];

export const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = () => {
    if (currentIdx < SLIDES.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const slide = SLIDES[currentIdx];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Skip Button */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Camera size={14} color="#ffffff" />
          </View>
          <Text style={styles.brandText}>
            MEM<Text style={{ color: '#db2777' }}>ORAA</Text>
          </Text>
        </View>

        {currentIdx < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Slide Card */}
      <View style={styles.slideContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: slide.image }} style={styles.slideImage} resizeMode="cover" />
          <View style={styles.iconCircle}>{slide.icon}</View>
        </View>

        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>

        {/* Indicator Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                currentIdx === idx ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.88}>
          <Text style={styles.nextBtnText}>
            {currentIdx === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          {currentIdx === SLIDES.length - 1 ? (
            <Check size={18} color="#ffffff" />
          ) : (
            <ArrowRight size={18} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#db2777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  skipText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width - 48,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#f1f5f9',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  iconCircle: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  slideTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  slideDescription: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#db2777',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#cbd5e1',
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#db2777',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#db2777',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
