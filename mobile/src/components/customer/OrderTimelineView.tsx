import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Circle, Clock } from 'lucide-react-native';
import { OrderWorkflowStatus } from '../../types';

export const OrderTimelineView: React.FC<{
  timeline: Array<{
    stage: OrderWorkflowStatus;
    title: string;
    description: string;
    completedAt?: string;
    isCompleted: boolean;
  }>;
  currentStatus: OrderWorkflowStatus;
}> = ({ timeline, currentStatus }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>10-Stage Production Progress</Text>
      <Text style={styles.headerSub}>Live progress from order placement to doorstep courier</Text>

      <View style={styles.timelineList}>
        {timeline.map((step, idx) => {
          const isCurrent = step.stage === currentStatus;
          const isDone = step.isCompleted;

          return (
            <View key={step.stage} style={styles.stepRow}>
              {/* Vertical connector line */}
              <View style={styles.indicatorCol}>
                <View
                  style={[
                    styles.nodeCircle,
                    isDone && styles.nodeDone,
                    isCurrent && styles.nodeCurrent,
                  ]}
                >
                  {isDone ? (
                    <CheckCircle2 size={12} color="#0f172a" />
                  ) : isCurrent ? (
                    <Clock size={12} color="#0f172a" />
                  ) : (
                    <Circle size={8} color="#64748b" />
                  )}
                </View>

                {idx < timeline.length - 1 && (
                  <View style={[styles.connectorLine, isDone && styles.connectorLineDone]} />
                )}
              </View>

              {/* Step info */}
              <View style={[styles.stepContent, isCurrent && styles.stepContentCurrent]}>
                <View style={styles.titleRow}>
                  <Text style={[styles.stepTitle, (isDone || isCurrent) && styles.stepTitleActive]}>
                    {idx + 1}. {step.title}
                  </Text>
                  {isCurrent && (
                    <View style={styles.inProgressBadge}>
                      <Text style={styles.inProgressText}>CURRENT STAGE</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.stepDesc}>{step.description}</Text>
                {step.completedAt && (
                  <Text style={styles.completedDate}>
                    ✓ {new Date(step.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 16,
  },
  timelineList: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 24,
  },
  nodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  nodeCurrent: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  connectorLine: {
    width: 2,
    height: 48,
    backgroundColor: '#334155',
    marginVertical: -2,
  },
  connectorLineDone: {
    backgroundColor: '#10b981',
  },
  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  stepContentCurrent: {
    backgroundColor: '#1e293b50',
    borderRadius: 8,
    padding: 8,
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  stepTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  stepTitleActive: {
    color: '#ffffff',
  },
  inProgressBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inProgressText: {
    color: '#0f172a',
    fontSize: 8,
    fontWeight: '900',
  },
  stepDesc: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  completedDate: {
    color: '#10b981',
    fontSize: 9,
    marginTop: 3,
    fontWeight: '600',
  },
});
