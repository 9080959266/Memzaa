import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Heart, Trash2, Calendar, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useWishlist } from '../../context/WishlistContext';
import { IStudio, IProduct } from '../../types';

export const WishlistScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { studios, products, toggleStudio, toggleProduct } = useWishlist();

  const isEmpty = studios.length === 0 && products.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Saved Wishlist ❤️</Text>
      <Text style={styles.subtitle}>Keep track of your favorite photography studios and customizable keepsakes</Text>

      {isEmpty ? (
        <View style={styles.emptyView}>
          <Heart size={44} color="#f59e0b" />
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySub}>
            Tap the heart icon on any studio or photo product to save it here for quick access!
          </Text>
        </View>
      ) : (
        <View>
          {/* Saved Studios */}
          {studios.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Photo Studios ({studios.length})</Text>
              {studios.map((s: IStudio) => (
                <View key={s._id} style={styles.card}>
                  <Image source={{ uri: s.logoImage }} style={styles.thumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{s.name}</Text>
                    <Text style={styles.itemSub}>📍 {s.city} • ⭐ {s.rating?.toFixed(1) || '4.8'}</Text>
                    <Text style={styles.itemPrice}>Starts ₹{s.startingPrice?.toLocaleString('en-IN') || '5,000'}</Text>
                  </View>

                  <View style={styles.actionCol}>
                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() => navigation.navigate('StudioDetail', { id: s._id })}
                    >
                      <Text style={styles.bookText}>Book</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => toggleStudio(s._id)}
                    >
                      <Trash2 size={14} color="#e11d48" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Saved Products */}
          {products.length > 0 && (
            <View style={[styles.section, { marginTop: 16 }]}>
              <Text style={styles.sectionTitle}>Saved Photo Keepsakes ({products.length})</Text>
              {products.map((p: IProduct) => (
                <View key={p._id} style={styles.card}>
                  <Image source={{ uri: p.thumbnail }} style={styles.thumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{p.title}</Text>
                    <Text style={styles.itemSub}>{p.category}</Text>
                    <Text style={styles.itemPrice}>
                      ₹{(p.discountPrice || p.basePrice)?.toLocaleString('en-IN') || '499'}
                    </Text>
                  </View>

                  <View style={styles.actionCol}>
                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() => navigation.navigate('ProductDetail', { slug: p.slug })}
                    >
                      <Text style={styles.bookText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => toggleProduct(p._id)}
                    >
                      <Trash2 size={14} color="#e11d48" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 16,
  },
  emptyView: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  itemTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  itemSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  itemPrice: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  actionCol: {
    alignItems: 'center',
    gap: 8,
  },
  bookBtn: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '900',
  },
  removeBtn: {
    padding: 4,
  },
});
