import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Camera, Phone, Mail, User } from 'lucide-react-native';
import api from '../../api/client';
import { IStudio, IPackage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';

export const PhotoshootBookingScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { user } = useAuth();

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Photoshoot Type
  const [selectedType, setSelectedType] = useState(route.params?.selectedType || 'Wedding Photoshoot');

  // Step 2: Selected Studio & Package
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<IStudio | null>(null);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<IPackage | null>(null);

  // Step 3: Event Scheduling
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 01:00 PM (Morning Ritual)');
  const [venueType, setVenueType] = useState('Traditional Mandapam / Hall');
  const [venueAddress, setVenueAddress] = useState('Sri Sankara Hall, TTK Road, Alwarpet, Chennai');
  const [peopleCount, setPeopleCount] = useState('50-100 People');

  // Step 4: Customer Contact Info
  const [clientName, setClientName] = useState(user?.name || 'Aarav Sharma');
  const [clientPhone, setClientPhone] = useState(user?.phone || '+91 98401 23456');
  const [clientEmail, setClientEmail] = useState(user?.email || 'customer@memora.com');
  const [specialNotes, setSpecialNotes] = useState('Need drone aerial coverage for traditional muhurtham rituals.');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PHOTOSHOOT_TYPES = [
    { id: 'wedding', label: '💍 Wedding Ceremony', icon: '💍' },
    { id: 'pre_wedding', label: '💕 Pre-Wedding Shoot', icon: '💕' },
    { id: 'baby', label: '👶 Baby & Newborn', icon: '👶' },
    { id: 'birthday', label: '🎂 Birthday Party', icon: '🎂' },
    { id: 'puberty', label: '🌸 Puberty Ceremony', icon: '🌸' },
    { id: 'family', label: '👨‍👩‍👧 Family Portrait', icon: '👨‍👩‍👧' },
    { id: 'graduation', label: '🎓 Graduation', icon: '🎓' },
    { id: 'outdoor', label: '🌲 Outdoor Nature / Beach', icon: '🌲' },
    { id: 'indoor', label: '🏛️ Indoor Set / Mandapam', icon: '🏛️' },
    { id: 'custom', label: '🎨 Custom Concept Shoot', icon: '🎨' },
  ];

  const TIME_SLOTS = [
    '06:00 AM - 10:00 AM (Golden Hour Sunrise)',
    '09:00 AM - 01:00 PM (Morning Ritual / Muhurtham)',
    '03:00 PM - 07:00 PM (Evening Reception)',
    '06:00 AM - 06:00 PM (Full Day Grand Shoot)',
  ];

  const PEOPLE_RANGES = ['1-5 People', '5-20 People', '20-50 People', '50-100 People', '100+ Guests'];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/studios?limit=10');
        if (res.data.success && res.data.studios.length > 0) {
          setStudios(res.data.studios);
          const first = res.data.studios[0];
          setSelectedStudio(first);

          const pkgRes = await api.get(`/studios/${first._id}`);
          if (pkgRes.data.success) {
            setPackages(pkgRes.data.packages || []);
            if (pkgRes.data.packages?.length > 0) {
              setSelectedPackage(pkgRes.data.packages[0]);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching studios for booking', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectStudio = async (studio: IStudio) => {
    setSelectedStudio(studio);
    try {
      const res = await api.get(`/studios/${studio._id}`);
      if (res.data.success) {
        setPackages(res.data.packages || []);
        if (res.data.packages?.length > 0) {
          setSelectedPackage(res.data.packages[0]);
        }
      }
    } catch (e) {}
  };

  const finalPrice = selectedPackage ? selectedPackage.discountPrice || selectedPackage.price : 25000;
  const advancePercentage = selectedPackage?.advancePercentage || 20;
  const advanceAmount = Math.round((finalPrice * advancePercentage) / 100);
  const remainingAmount = finalPrice - advanceAmount;

  const handleConfirmBooking = async () => {
    if (!selectedStudio || !selectedPackage) {
      Alert.alert('Missing Studio', 'Please select a studio and package.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        studioId: selectedStudio._id,
        packageId: selectedPackage._id,
        eventDate,
        timeSlot,
        venue: {
          venueType,
          address: venueAddress,
          city: selectedStudio.city || 'Chennai',
        },
        notes: `${specialNotes} (People: ${peopleCount})`,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        Alert.alert(
          '🎉 Photoshoot Reserved!',
          `Booking ID #${res.data.booking.bookingId} confirmed with 20% advance (₹${advanceAmount}). Studio will contact you!`,
          [
            {
              text: 'View My Bookings',
              onPress: () => {
                setCurrentStep(1);
                navigation.navigate('Bookings');
              },
            },
          ]
        );
      }
    } catch (e: any) {
      Alert.alert('Booking Error', e.message || 'Failed to confirm photoshoot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 5-Step Progress Stepper Header */}
      <View style={styles.stepperHeader}>
        <Text style={styles.stepperTitle}>Photoshoot Booking Flow</Text>
        <View style={styles.stepsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View key={s} style={styles.stepIndicatorCol}>
              <View
                style={[
                  styles.stepCircle,
                  currentStep === s && styles.stepCircleActive,
                  currentStep > s && styles.stepCircleDone,
                ]}
              >
                <Text
                  style={[
                    styles.stepNum,
                    (currentStep === s || currentStep > s) && styles.stepNumActive,
                  ]}
                >
                  {currentStep > s ? '✓' : s}
                </Text>
              </View>
              <Text style={styles.stepLabel}>
                {s === 1 ? 'Type' : s === 2 ? 'Package' : s === 3 ? 'Schedule' : s === 4 ? 'Client' : 'Review'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STEP 1: SELECT PHOTOSHOOT TYPE */}
        {currentStep === 1 && (
          <View>
            <Text style={styles.stepHeading}>1. Select Photoshoot Type</Text>
            <Text style={styles.stepSub}>Choose the occasion or event style for your photography session</Text>

            <View style={styles.typesGrid}>
              {PHOTOSHOOT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeCard, selectedType === t.label && styles.typeCardActive]}
                  onPress={() => setSelectedType(t.label)}
                >
                  <Text style={styles.typeIcon}>{t.icon}</Text>
                  <Text style={[styles.typeTitle, selectedType === t.label && styles.typeTitleActive]}>
                    {t.label}
                  </Text>
                  {selectedType === t.label && (
                    <View style={styles.checkBadge}>
                      <CheckCircle2 size={12} color="#0f172a" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <CustomButton
              title="Next: Choose Package & Studio →"
              onPress={() => setCurrentStep(2)}
              style={{ marginTop: 20, marginBottom: 40 }}
            />
          </View>
        )}

        {/* STEP 2: SELECT STUDIO & PACKAGE */}
        {currentStep === 2 && (
          <View>
            <Text style={styles.stepHeading}>2. Choose Studio & Package</Text>
            <Text style={styles.stepSub}>Select from vetted photography studios in your city</Text>

            {/* Studio selector scroll */}
            <Text style={styles.subHeading}>Select Studio:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studioSelectScroll}>
              {studios.map((s) => (
                <TouchableOpacity
                  key={s._id}
                  style={[
                    styles.studioPill,
                    selectedStudio?._id === s._id && styles.studioPillActive,
                  ]}
                  onPress={() => handleSelectStudio(s)}
                >
                  <Text style={[styles.studioPillName, selectedStudio?._id === s._id && styles.studioPillNameActive]}>
                    {s.name}
                  </Text>
                  <Text style={styles.studioPillSub}>⭐ {s.rating.toFixed(1)} • {s.city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Packages list */}
            <Text style={[styles.subHeading, { marginTop: 14 }]}>Select Tier Package:</Text>
            {packages.map((pkg) => {
              const isSelected = selectedPackage?._id === pkg._id;
              const pkgPrice = pkg.discountPrice || pkg.price;

              return (
                <TouchableOpacity
                  key={pkg._id}
                  style={[styles.packageCard, isSelected && styles.packageCardActive]}
                  onPress={() => setSelectedPackage(pkg)}
                  activeOpacity={0.8}
                >
                  <View style={styles.pkgTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pkgTitle}>{pkg.title}</Text>
                      <Text style={styles.pkgDesc}>{pkg.description}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.pkgPriceText}>₹{pkgPrice.toLocaleString('en-IN')}</Text>
                      <Text style={styles.pkgAdvanceText}>{pkg.advancePercentage}% Advance</Text>
                    </View>
                  </View>

                  <View style={styles.pkgSpecsRow}>
                    <Text style={styles.pkgSpec}>⏱️ {pkg.durationHours} Hours</Text>
                    <Text style={styles.pkgSpec}>✨ {pkg.editedPhotosCount} Retouches</Text>
                    <Text style={styles.pkgSpec}>📷 {pkg.rawPhotosCount}+ Raw</Text>
                  </View>

                  <View style={styles.deliverablesBox}>
                    {pkg.deliverables?.map((d, idx) => (
                      <View key={idx} style={styles.deliverableItem}>
                        <CheckCircle2 size={11} color="#10b981" />
                        <Text style={styles.deliverableText}>{d}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={styles.navButtonsRow}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(1)}>
                <ArrowLeft size={16} color="#ffffff" />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <CustomButton
                title="Next: Schedule Shoot →"
                onPress={() => setCurrentStep(3)}
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
          </View>
        )}

        {/* STEP 3: SCHEDULE & VENUE */}
        {currentStep === 3 && (
          <View>
            <Text style={styles.stepHeading}>3. Date, Time & Venue</Text>
            <Text style={styles.stepSub}>Select when and where the photographer should arrive</Text>

            {/* Shoot Date */}
            <Text style={styles.fieldLabel}>Shoot Date (YYYY-MM-DD) *</Text>
            <View style={styles.inputBox}>
              <Calendar size={16} color="#f59e0b" />
              <TextInput style={styles.textInput} value={eventDate} onChangeText={setEventDate} />
            </View>

            {/* Time Slot */}
            <Text style={styles.fieldLabel}>Session Time Slot *</Text>
            <View style={styles.pillsList}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotPill, timeSlot === slot && styles.slotPillActive]}
                  onPress={() => setTimeSlot(slot)}
                >
                  <Clock size={12} color={timeSlot === slot ? '#0f172a' : '#94a3b8'} />
                  <Text style={[styles.slotText, timeSlot === slot && styles.slotTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Venue Address */}
            <Text style={styles.fieldLabel}>Venue Address *</Text>
            <TextInput
              style={styles.multilineInput}
              value={venueAddress}
              onChangeText={setVenueAddress}
              placeholder="Hall / Mandapam name, Street, Landmark"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={2}
            />

            {/* Number of People */}
            <Text style={styles.fieldLabel}>Expected Group / Guests</Text>
            <View style={styles.pillsList}>
              {PEOPLE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[styles.slotPill, peopleCount === range && styles.slotPillActive]}
                  onPress={() => setPeopleCount(range)}
                >
                  <Users size={12} color={peopleCount === range ? '#0f172a' : '#94a3b8'} />
                  <Text style={[styles.slotText, peopleCount === range && styles.slotTextActive]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.navButtonsRow}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(2)}>
                <ArrowLeft size={16} color="#ffffff" />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <CustomButton
                title="Next: Customer Details →"
                onPress={() => setCurrentStep(4)}
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
          </View>
        )}

        {/* STEP 4: CUSTOMER DETAILS */}
        {currentStep === 4 && (
          <View>
            <Text style={styles.stepHeading}>4. Client Contact Details</Text>
            <Text style={styles.stepSub}>Your contact details for photography team coordination</Text>

            <Text style={styles.fieldLabel}>Full Name *</Text>
            <View style={styles.inputBox}>
              <User size={16} color="#64748b" />
              <TextInput style={styles.textInput} value={clientName} onChangeText={setClientName} />
            </View>

            <Text style={styles.fieldLabel}>Phone Number *</Text>
            <View style={styles.inputBox}>
              <Phone size={16} color="#64748b" />
              <TextInput
                style={styles.textInput}
                value={clientPhone}
                onChangeText={setClientPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.fieldLabel}>Email Address *</Text>
            <View style={styles.inputBox}>
              <Mail size={16} color="#64748b" />
              <TextInput
                style={styles.textInput}
                value={clientEmail}
                onChangeText={setClientEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.fieldLabel}>Special Requirements / Notes</Text>
            <TextInput
              style={styles.multilineInput}
              value={specialNotes}
              onChangeText={setSpecialNotes}
              placeholder="e.g. Traditional temple attire, drone entry, family photo list"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={2}
            />

            <View style={styles.navButtonsRow}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(3)}>
                <ArrowLeft size={16} color="#ffffff" />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <CustomButton
                title="Next: Review & Summary →"
                onPress={() => setCurrentStep(5)}
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
          </View>
        )}

        {/* STEP 5: BOOKING SUMMARY & CONFIRMATION */}
        {currentStep === 5 && (
          <View>
            <Text style={styles.stepHeading}>5. Booking Summary & 20% Advance</Text>
            <Text style={styles.stepSub}>Review your photoshoot booking before placing deposit</Text>

            <View style={styles.summaryCard}>
              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Photoshoot Type</Text>
                <Text style={styles.sumValue}>{selectedType}</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Selected Studio</Text>
                <Text style={[styles.sumValue, { color: '#f59e0b' }]}>{selectedStudio?.name}</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Package Tier</Text>
                <Text style={styles.sumValue}>{selectedPackage?.title}</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Event Date & Slot</Text>
                <Text style={styles.sumValue}>{eventDate} ({timeSlot.split(' ')[0]})</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Venue</Text>
                <Text style={styles.sumValue} numberOfLines={1}>{venueAddress}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Total Package Price</Text>
                <Text style={styles.sumValue}>₹{finalPrice.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={[styles.sumLabel, { color: '#10b981', fontWeight: '800' }]}>
                  {advancePercentage}% Advance Deposit (Payable Now)
                </Text>
                <Text style={[styles.sumValue, { color: '#10b981', fontSize: 16, fontWeight: '900' }]}>
                  ₹{advanceAmount.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Balance Due on Shoot Day</Text>
                <Text style={styles.sumValue}>₹{remainingAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View style={styles.guaranteeStrip}>
              <ShieldCheck size={16} color="#10b981" />
              <Text style={styles.guaranteeText}>
                100% Booking Protection • Free Reschedule up to 48h before shoot
              </Text>
            </View>

            <View style={styles.navButtonsRow}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(4)}>
                <ArrowLeft size={16} color="#ffffff" />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <CustomButton
                title={`Pay ₹${advanceAmount} & Reserve`}
                onPress={handleConfirmBooking}
                loading={isSubmitting}
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  stepperHeader: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  stepperTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepIndicatorCol: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  stepCircleDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  stepNum: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
  },
  stepNumActive: {
    color: '#0f172a',
  },
  stepLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  stepHeading: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  stepSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 16,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  typeCardActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#f59e0b15',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  typeTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  typeTitleActive: {
    color: '#f59e0b',
    fontWeight: '900',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    padding: 2,
  },
  subHeading: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  studioSelectScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  studioPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  studioPillActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#f59e0b15',
  },
  studioPillName: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  studioPillNameActive: {
    color: '#f59e0b',
  },
  studioPillSub: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 2,
  },
  packageCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  packageCardActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#f59e0b10',
  },
  pkgTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pkgTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  pkgDesc: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  pkgPriceText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  pkgAdvanceText: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  pkgSpecsRow: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#0f172a',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  pkgSpec: {
    color: '#cbd5e1',
    fontSize: 9,
    fontWeight: '600',
  },
  deliverablesBox: {
    gap: 4,
  },
  deliverableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliverableText: {
    color: '#cbd5e1',
    fontSize: 10,
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
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
    fontSize: 12,
    paddingVertical: 10,
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
  pillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  slotPillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  slotText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  slotTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
    marginBottom: 14,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  sumValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  guaranteeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b98140',
    marginBottom: 16,
  },
  guaranteeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  navButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 30,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  prevBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
