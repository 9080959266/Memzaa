import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { ArrowRight, CheckCircle2, Upload, Sparkles, X, Layers } from 'lucide-react-native';
import api from '../../api/client';
import { OrderWorkflowStatus } from '../../types';
import { CustomButton } from '../common/CustomButton';

const STAGES: Array<{ key: OrderWorkflowStatus; label: string; color: string }> = [
  { key: 'ORDER_PLACED', label: '1. New Orders', color: '#3b82f6' },
  { key: 'PHOTOS_UPLOADED', label: '2. Raw Photos In', color: '#8b5cf6' },
  { key: 'EDITING', label: '3. Retouching', color: '#f59e0b' },
  { key: 'PROOF_READY', label: '4. Proof Ready', color: '#06b6d4' },
  { key: 'CUSTOMER_APPROVED', label: '5. Client Approved', color: '#10b981' },
  { key: 'PRINTING', label: '6. Archival Print', color: '#f97316' },
  { key: 'QUALITY_CHECK', label: '7. 5-Point QC', color: '#ec4899' },
  { key: 'READY', label: '8. Packaged', color: '#10b981' },
  { key: 'OUT_FOR_DELIVERY', label: '9. Express Courier', color: '#14b8a6' },
  { key: 'DELIVERED', label: '10. Completed', color: '#22c55e' },
];

export const MobileKanbanBoard: React.FC<{
  columns: Record<string, any[]>;
  onJobUpdated?: () => void;
}> = ({ columns, onJobUpdated }) => {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAdvanceStage = async (jobId: string, currentStage: OrderWorkflowStatus) => {
    const currentIndex = STAGES.findIndex((s) => s.key === currentStage);
    if (currentIndex >= STAGES.length - 1) {
      Alert.alert('Completed', 'This photo project has already completed all 10 stages.');
      return;
    }

    const nextStage = STAGES[currentIndex + 1].key;
    try {
      setIsUpdating(true);
      const res = await api.put(`/photo-jobs/${jobId}/stage`, { newStage: nextStage });
      if (res.data.success) {
        Alert.alert('Stage Advanced! 🚀', `Project moved to "${STAGES[currentIndex + 1].label}"`);
        if (onJobUpdated) onJobUpdated();
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to advance stage');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Horizontal Scroll for 10 Columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boardScroll}>
        {STAGES.map((stage) => {
          const jobsInStage = columns[stage.key] || [];

          return (
            <View key={stage.key} style={styles.columnCard}>
              {/* Column Header */}
              <View style={[styles.columnHeader, { borderLeftColor: stage.color }]}>
                <Text style={styles.columnTitle}>{stage.label}</Text>
                <View style={[styles.countBadge, { backgroundColor: stage.color + '20' }]}>
                  <Text style={[styles.countText, { color: stage.color }]}>{jobsInStage.length}</Text>
                </View>
              </View>

              {/* Jobs List */}
              <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
                {jobsInStage.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No active jobs</Text>
                  </View>
                ) : (
                  jobsInStage.map((job) => (
                    <View key={job._id} style={styles.jobItemCard}>
                      <View style={styles.jobTopRow}>
                        <Text style={styles.jobId}>#{job.jobId}</Text>
                        <Text style={styles.jobDate}>{new Date(job.createdAt).toLocaleDateString('en-IN')}</Text>
                      </View>

                      <Text style={styles.jobTitle} numberOfLines={2}>
                        {job.title}
                      </Text>

                      <Text style={styles.clientText}>Client: {job.customerId?.name || 'Customer'}</Text>

                      {/* Advance Stage Trigger */}
                      <TouchableOpacity
                        style={[styles.advanceBtn, { backgroundColor: stage.color }]}
                        onPress={() => handleAdvanceStage(job._id, stage.key)}
                        disabled={isUpdating}
                      >
                        <Text style={styles.advanceBtnText}>Advance Stage</Text>
                        <ArrowRight size={12} color="#0f172a" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boardScroll: {
    paddingVertical: 10,
  },
  columnCard: {
    width: 250,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#334155',
    maxHeight: 520,
    overflow: 'hidden',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    borderLeftWidth: 4,
  },
  columnTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countText: {
    fontSize: 11,
    fontWeight: '900',
  },
  jobsList: {
    padding: 10,
  },
  emptyCard: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 11,
    fontStyle: 'italic',
  },
  jobItemCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobId: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  jobDate: {
    color: '#64748b',
    fontSize: 9,
  },
  jobTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  clientText: {
    color: '#94a3b8',
    fontSize: 10,
    marginBottom: 10,
  },
  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 8,
  },
  advanceBtnText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '900',
  },
});
