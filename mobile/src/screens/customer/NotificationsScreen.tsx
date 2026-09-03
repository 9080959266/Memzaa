import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, CheckCircle2, Clock, Image, Tag, Sparkles } from 'lucide-react-native';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Notifications & Updates</Text>
          <Text style={styles.subtitle}>Order status, proof reviews, and special offers</Text>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyView}>
          <Bell size={40} color="#64748b" />
          <Text style={styles.emptyTitle}>No New Notifications</Text>
          <Text style={styles.emptySub}>You are all caught up!</Text>
        </View>
      ) : (
        notifications.map((n) => {
          const getIcon = () => {
            switch (n.type) {
              case 'order_update':
                return <Clock size={16} color="#f59e0b" />;
              case 'proof_ready':
                return <Image size={16} color="#06b6d4" />;
              case 'booking_confirmed':
                return <CheckCircle2 size={16} color="#10b981" />;
              default:
                return <Tag size={16} color="#a855f7" />;
            }
          };

          return (
            <TouchableOpacity
              key={n._id}
              style={[styles.notifCard, !n.isRead && styles.notifCardUnread]}
              onPress={() => {
                markAsRead(n._id);
                if (n.link) {
                  if (n.link.includes('orders')) navigation.navigate('OrdersTab');
                  else if (n.link.includes('proofs')) navigation.navigate('Proofs');
                  else if (n.link.includes('bookings')) navigation.navigate('Bookings');
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>{getIcon()}</View>

              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifMessage}>{n.message}</Text>
                <Text style={styles.notifTime}>
                  {new Date(n.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              {!n.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  },
  markAll: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
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
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  notifCardUnread: {
    borderColor: '#f59e0b40',
    backgroundColor: '#1e293b',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  notifMessage: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  notifTime: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
});
