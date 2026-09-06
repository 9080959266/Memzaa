import React from 'react';
import {
  Bell,
  CheckCircle2,
  ShoppingBag,
  Calendar,
  CreditCard,
  Camera,
  Star,
  Info,
  Tag,
  Check,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const Notifications: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'order':
        return ShoppingBag;
      case 'payment':
        return CreditCard;
      case 'proof':
        return Camera;
      case 'review':
        return Star;
      case 'offer':
        return Tag;
      case 'system':
        return Info;
      default:
        return Bell;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            Your MEMORA
          </span>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Notifications
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Stay updated with your bookings, payments, photos and orders.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllAsRead()}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up'}
          </p>

          <p className="text-[11px] text-slate-500">
            {notifications.length} total notification
            {notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-base font-bold text-slate-900">
              You're all caught up
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              No new notifications right now.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);

            return (
              <button
                key={notification._id}
                type="button"
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification._id);
                  }
                }}
                className={`w-full text-left bg-white rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                  notification.isRead
                    ? 'border-slate-200'
                    : 'border-amber-300 bg-amber-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notification.isRead
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
  {notification.message}
</p>

                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};