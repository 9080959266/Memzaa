import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Eye, Image as ImageIcon, CheckCircle2 } from 'lucide-react-native';
import api from '../../api/client';
import { IProof } from '../../types';
import { ProofReviewModal } from '../../components/customer/ProofReviewModal';

export const ProofsScreen: React.FC = () => {
  const [proofs, setProofs] = useState<IProof[]>([]);
  const [selectedProof, setSelectedProof] = useState<IProof | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProofs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/proofs/my-proofs');
      if (res.data.success) {
        setProofs(res.data.proofs || []);
      }
    } catch (e) {
      console.error('Proofs error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Photo Proof Approvals</Text>
      <Text style={styles.headerSub}>Review retouched digital drafts before final printing</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
      ) : proofs.length === 0 ? (
        <View style={styles.emptyView}>
          <ImageIcon size={40} color="#f59e0b" />
          <Text style={styles.emptyTitle}>No Proofs Pending</Text>
          <Text style={styles.emptySub}>When your studio editor finishes color grading, draft proofs appear here!</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {proofs.map((proof) => {
            const isApproved = proof.status === 'approved';

            return (
              <View key={proof._id} style={styles.card}>
                <View style={styles.topRow}>
                  <Text style={styles.proofId}>#{proof.proofId} (v{proof.version})</Text>
                  <View style={[styles.statusBadge, isApproved && styles.statusBadgeApproved]}>
                    <Text style={[styles.statusText, isApproved && styles.statusTextApproved]}>
                      {isApproved ? 'Approved by You' : 'Pending Your Review'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.title}>{proof.title}</Text>
                <Text style={styles.studio}>{proof.studioId?.name}</Text>

                {/* Preview thumbnails */}
                <View style={styles.thumbsGrid}>
                  {proof.previewUrls?.slice(0, 3).map((url, idx) => (
                    <Image key={idx} source={{ uri: url }} style={styles.thumb} />
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.reviewBtn, isApproved && styles.reviewBtnApproved]}
                  onPress={() => setSelectedProof(proof)}
                >
                  <Eye size={14} color={isApproved ? '#cbd5e1' : '#0f172a'} />
                  <Text style={[styles.reviewBtnText, isApproved && { color: '#cbd5e1' }]}>
                    {isApproved ? 'View Approved Proof' : 'Review & Approve'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {selectedProof && (
        <ProofReviewModal
          visible={!!selectedProof}
          onClose={() => setSelectedProof(null)}
          proof={selectedProof}
          onProofReviewed={fetchProofs}
        />
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
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },
  list: {
    flex: 1,
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
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  proofId: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusBadge: {
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeApproved: {
    backgroundColor: '#10b98120',
  },
  statusText: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusTextApproved: {
    color: '#10b981',
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  studio: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
  },
  thumbsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  thumb: {
    flex: 1,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#0f172a',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 12,
  },
  reviewBtnApproved: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  reviewBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
});
