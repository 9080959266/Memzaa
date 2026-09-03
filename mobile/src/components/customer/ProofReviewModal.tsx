import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { CheckCircle2, MessageSquare, X, Eye, ShieldCheck } from 'lucide-react-native';
import api from '../../api/client';
import { IProof } from '../../types';
import { CustomButton } from '../common/CustomButton';

export const ProofReviewModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  proof: IProof;
  onProofReviewed?: () => void;
}> = ({ visible, onClose, proof, onProofReviewed }) => {
  const [selectedImage, setSelectedImage] = useState(proof.previewUrls[0] || '');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.put(`/proofs/${proof._id}/review`, {
        action: 'approve',
        feedback: feedback || 'Approved for archival print and dispatch!',
      });
      if (res.data.success) {
        Alert.alert('Proof Approved! ✅', 'Your studio editor will proceed with archival printing.');
        if (onProofReviewed) onProofReviewed();
        onClose();
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to approve proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      Alert.alert('Feedback Required', 'Please enter your requested adjustments for the studio editor.');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await api.put(`/proofs/${proof._id}/review`, {
        action: 'request_changes',
        feedback,
      });
      if (res.data.success) {
        Alert.alert('Revisions Sent 📝', 'The studio editor will update retouches and upload Version 2.');
        if (onProofReviewed) onProofReviewed();
        onClose();
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to request changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Proof Review (v{proof.version})</Text>
              <Text style={styles.subtitle}>{proof.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Main Preview Photo */}
            <View style={styles.mainPreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
            </View>

            {/* Thumbnail Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
              {proof.previewUrls.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.thumb, selectedImage === url && styles.thumbActive]}
                  onPress={() => setSelectedImage(url)}
                >
                  <Image source={{ uri: url }} style={styles.thumbImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Revision Comments */}
            <Text style={styles.sectionLabel}>Comments or Adjustments</Text>
            <TextInput
              style={styles.commentInput}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="e.g. Please brighten skin tones slightly and soften the vignette"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={3}
            />

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <CustomButton
                title="Request Changes"
                variant="secondary"
                onPress={handleRequestChanges}
                loading={isSubmitting}
                style={{ flex: 1 }}
              />
              <CustomButton
                title="Approve & Print"
                onPress={handleApprove}
                loading={isSubmitting}
                icon={<CheckCircle2 size={14} color="#0f172a" />}
                style={{ flex: 1.2 }}
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
    fontSize: 16,
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
  mainPreview: {
    height: 240,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  thumbScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: '#f59e0b',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  commentInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    fontSize: 12,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
});
