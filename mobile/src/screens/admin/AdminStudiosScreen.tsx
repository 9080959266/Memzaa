import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Store, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react-native';
import api from '../../api/client';
import { IStudio } from '../../types';

export const AdminStudiosScreen: React.FC = () => {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudios = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/studios?limit=50');
      if (res.data.success) {
        setStudios(res.data.studios || []);
      }
    } catch (e) {
      console.error('Studios error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/studios/${id}/moderate`, { status });
      fetchStudios();
      Alert.alert('Updated', `Studio status set to ${status}.`);
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Studio Verification & Moderation</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {studios.map((s) => (
            <View key={s._id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.studioName}>{s.name}</Text>
                <View
                  style={[
                    styles.badge,
                    s.verifiedStatus === 'approved' ? styles.badgeApproved : styles.badgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      s.verifiedStatus === 'approved' ? styles.textApproved : styles.textPending,
                    ]}
                  >
                    {s.verifiedStatus}
                  </Text>
                </View>
              </View>

              <Text style={styles.cityText}>{s.city} • Rating: ⭐ {s.rating.toFixed(1)} ({s.reviewCount})</Text>

              <View style={styles.actionRow}>
                {s.verifiedStatus !== 'approved' ? (
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleModerate(s._id, 'approved')}
                  >
                    <CheckCircle2 size={13} color="#ffffff" />
                    <Text style={styles.btnText}>Approve Studio</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.suspendBtn}
                    onPress={() => handleModerate(s._id, 'rejected')}
                  >
                    <XCircle size={13} color="#ffffff" />
                    <Text style={styles.btnText}>Suspend</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
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
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studioName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  cityText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeApproved: {
    backgroundColor: '#10b98120',
  },
  badgePending: {
    backgroundColor: '#f59e0b20',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  textApproved: {
    color: '#10b981',
  },
  textPending: {
    color: '#f59e0b',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  suspendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e11d48',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
});
