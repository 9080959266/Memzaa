import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Sparkles, Eye } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const BeforeAfterSlider: React.FC<{
  beforeUrl?: string;
  afterUrl?: string;
  title?: string;
}> = ({
  beforeUrl = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  afterUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  title = 'Professional Skin Retouching & Color Grading',
}) => {
  const [activeView, setActiveView] = useState<'after' | 'before'>('after');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Sparkles size={12} color="#db2777" />
          <Text style={styles.badgeText}>STUDIO RETOUCHING QUALITY</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Image Display */}
      <View style={styles.imageBox}>
        <Image
          source={{ uri: activeView === 'after' ? afterUrl : beforeUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Floating Toggle Pill */}
        <View style={styles.floatingPill}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeView === 'before' && styles.toggleBtnActive]}
            onPress={() => setActiveView('before')}
          >
            <Text style={[styles.toggleText, activeView === 'before' && styles.toggleTextActive]}>
              Raw Unedited
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeView === 'after' && styles.toggleBtnActive]}
            onPress={() => setActiveView('after')}
          >
            <Text style={[styles.toggleText, activeView === 'after' && styles.toggleTextActive]}>
              ✨ Retouched
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footerNote}>
        Tap to toggle between camera sensor RAW and final archival print grade.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#db277715',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    color: '#db2777',
    fontSize: 9,
    fontWeight: '800',
  },
  title: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  imageBox: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  floatingPill: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 20,
    padding: 3,
    gap: 4,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleBtnActive: {
    backgroundColor: '#db2777',
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  footerNote: {
    color: '#64748b',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  },
});
