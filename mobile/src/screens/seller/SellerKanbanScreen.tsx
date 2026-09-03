import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCw, Sparkles } from 'lucide-react-native';
import api from '../../api/client';
import { MobileKanbanBoard } from '../../components/seller/MobileKanbanBoard';

export const SellerKanbanScreen: React.FC = () => {
  const [columns, setColumns] = useState<Record<string, any[]>>({});
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKanban = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/photo-jobs/kanban');
      if (res.data.success) {
        setColumns(res.data.kanbanColumns || {});
        setTotalJobs(res.data.totalJobs || 0);
      }
    } catch (e) {
      console.error('Kanban error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKanban();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Photo Job Kanban Board</Text>
          <Text style={styles.subtitle}>{totalJobs} Active Projects • Swipe Horizontal</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={fetchKanban}>
          <RefreshCw size={14} color="#f59e0b" />
          <Text style={styles.refreshText}>Sync</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      ) : (
        <MobileKanbanBoard columns={columns} onJobUpdated={fetchKanban} />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 1,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  refreshText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
});
