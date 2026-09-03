import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Calendar, Clock, MapPin, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react-native';
import api from '../../api/client';
import { IPackage, IStudio } from '../../types';
import { CustomButton } from '../common/CustomButton';

export const BookingModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  pkg: IPackage;
  studio: IStudio;
  onBookingSuccess?: (bookingId: string) => void;
}> = ({ visible, onClose, pkg, studio, onBookingSuccess }) => {
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 01:00 PM');
  const [venueType, setVenueType] = useState('Traditional Hall / Temple');
  const [venueAddress, setVenueAddress] = useState('Sri Sankara Hall, TTK Road, Chennai');
  const [city, setCity] = useState(studio.city || 'Chennai');
  const [notes, setNotes] = useState('Please bring drone camera for grand entry.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalPrice = pkg.discountPrice || pkg.price;
  const advancePercentage = pkg.advancePercentage || 20;
  const advanceAmount = Math.round((finalPrice * advancePercentage) / 100);
  const remainingAmount = finalPrice - advanceAmount;

  const TIME_SLOTS = [
    '06:00 AM - 10:00 AM (Golden Hour)',
    '09:00 AM - 01:00 PM (Morning Ritual)',
    '03:00 PM - 07:00 PM (Evening Reception)',
    '06:00 AM - 06:00 PM (Full Day Grand Shoot)',
  ];

  const VENUE_TYPES = [
    'Studio Indoor Set',
    'Traditional Hall / Temple',
    'Outdoor Lawn / Beach',
    'Private Residence',
  ];

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        studioId: studio._id,
        packageId: pkg._id,
        eventDate,
        timeSlot,
        venue: {
          venueType,
          address: venueAddress,
          city,
        },
        notes,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        Alert.alert(
          '🎉 Shoot Reserved!',
          `Booking ID #${res.data.booking.bookingId} confirmed with 20% advance (₹${advanceAmount}). Studio will contact you!`,
          [
            {
              text: 'View Bookings',
              onPress: () => {
                onClose();
                if (onBookingSuccess) onBookingSuccess(res.data.booking._id);
              },
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Failed to reserve shoot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Reserve Photoshoot</Text>
              <Text style={styles.subtitle}>{studio.name} • {pkg.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Event Date Picker Input */}
            <Text style={styles.sectionLabel}>1. Shoot Date (YYYY-MM-DD) *</Text>
            <View style={styles.inputBox}>
              <Calendar size={16} color="#f59e0b" />
              <TextInput
                style={styles.textInput}
                value={eventDate}
                onChangeText={setEventDate}
                placeholder="2026-10-15"
                placeholderTextColor="#64748b"
              />
            </View>

            {/* Time Slot Selector */}
            <Text style={styles.sectionLabel}>2. Select Session Time Slot *</Text>
            <View style={styles.pillsContainer}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.pill, timeSlot === slot && styles.pillActive]}
                  onPress={() => setTimeSlot(slot)}
                >
                  <Clock size={12} color={timeSlot === slot ? '#0f172a' : '#94a3b8'} />
                  <Text style={[styles.pillText, timeSlot === slot && styles.pillTextActive]}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Venue Type */}
            <Text style={styles.sectionLabel}>3. Venue Type</Text>
            <View style={styles.pillsContainer}>
              {VENUE_TYPES.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.pill, venueType === v && styles.pillActive]}
                  onPress={() => setVenueType(v)}
                >
                  <MapPin size={12} color={venueType === v ? '#0f172a' : '#94a3b8'} />
                  <Text style={[styles.pillText, venueType === v && styles.pillTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Venue Address */}
            <Text style={styles.sectionLabel}>4. Venue Address Details *</Text>
            <TextInput
              style={styles.multilineInput}
              value={venueAddress}
              onChangeText={setVenueAddress}
              placeholder="Hall Name, Street, Landmark"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={2}
            />

            {/* Special Instructions */}
            <Text style={styles.sectionLabel}>5. Client Notes for Photographer</Text>
            <TextInput
              style={styles.multilineInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Traditional temple attire, special family members"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={2}
            />

            {/* Advance Deposit Breakdown Card */}
            <View style={styles.priceBreakdownCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Package Price</Text>
                <Text style={styles.priceValue}>₹{finalPrice.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: '#f59e0b' }]}>{advancePercentage}% Advance Deposit (Payable Now)</Text>
                <Text style={[styles.priceValue, { color: '#f59e0b' }]}>₹{advanceAmount.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Balance Due on Shoot Day</Text>
                <Text style={styles.priceValue}>₹{remainingAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View style={styles.guaranteeRow}>
              <ShieldCheck size={14} color="#10b981" />
              <Text style={styles.guaranteeText}>100% Booking Protection • Free Reschedule up to 48 hrs</Text>
            </View>

            <CustomButton
              title={`Pay ₹${advanceAmount} Advance & Confirm`}
              onPress={handleConfirmBooking}
              loading={isSubmitting}
              style={{ marginTop: 16, marginBottom: 40 }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    color: '#f59e0b',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingBottom: 20,
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
    paddingVertical: 10,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  pillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  multilineInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    fontSize: 12,
    padding: 10,
    textAlignVertical: 'top',
  },
  priceBreakdownCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  priceValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    justifyContent: 'center',
  },
  guaranteeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '600',
  },
});
