import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Headphones, MessageSquare, Phone, Mail, HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react-native';
import { CustomButton } from '../../components/common/CustomButton';

const FAQS = [
  {
    q: 'How does the 20% advance deposit photoshoot booking work?',
    a: 'You pay 20% online to confirm and block your photographer on the calendar. The remaining 80% is payable directly at the venue on shoot day.',
  },
  {
    q: 'Can I reschedule my photoshoot if rain or emergency occurs?',
    a: 'Yes! Free rescheduling is permitted up to 48 hours before the scheduled shoot time directly from your bookings screen.',
  },
  {
    q: 'What is the Digital Proof Approval process?',
    a: 'When your studio editor finishes color grading and retouches, you receive high-res draft proofs. You can approve with 1 click or request revisions before printing.',
  },
  {
    q: 'How long does physical frame/album delivery take across India?',
    a: 'Custom wooden frames and layflat panoramic albums are dispatched within 3-5 business days via express courier with insured packaging.',
  },
];

export const HelpSupportScreen: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Booking Issue' | 'Order / Delivery' | 'Proof Feedback' | 'Refund'>('Order / Delivery');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = () => {
    if (!subject || !message) {
      Alert.alert('Missing Info', 'Please describe your query.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject('');
      setMessage('');
      Alert.alert(
        'Ticket Created! 🎧',
        'Support Ticket #TK-8492 has been raised. A MEMORAA executive will respond within 2 hours.'
      );
    }, 800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Headphones size={12} color="#db2777" />
          <Text style={styles.badgeText}>24/7 CUSTOMER CONCIERGE</Text>
        </View>
        <Text style={styles.title}>Help & Customer Support</Text>
        <Text style={styles.subtitle}>We are here to ensure your photography & keepsake experience is perfect.</Text>
      </View>

      {/* Quick Direct Contacts */}
      <View style={styles.contactCardsRow}>
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Alert.alert('Call Support', 'Dialing MEMORAA toll-free: +91 1800 425 8899')}
        >
          <Phone size={18} color="#db2777" />
          <Text style={styles.contactTitle}>Call Us</Text>
          <Text style={styles.contactSub}>+91 1800 425 8899</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Alert.alert('WhatsApp Concierge', 'Opening WhatsApp chat with MEMORAA Studio Concierge...')}
        >
          <MessageSquare size={18} color="#10b981" />
          <Text style={styles.contactTitle}>WhatsApp</Text>
          <Text style={styles.contactSub}>Instant Chat 24/7</Text>
        </TouchableOpacity>
      </View>

      {/* FAQs Section */}
      <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
      <View style={styles.faqsList}>
        {FAQS.map((faq, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.faqCard}
            onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
            activeOpacity={0.8}
          >
            <View style={styles.faqQuestionRow}>
              <HelpCircle size={14} color="#db2777" />
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              {expandedFaq === idx ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
            </View>
            {expandedFaq === idx && <Text style={styles.faqAnswer}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Raise Ticket Form */}
      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Submit Support Request</Text>
      <View style={styles.ticketCard}>
        <Text style={styles.fieldLabel}>Issue Category</Text>
        <View style={styles.categoriesRow}>
          {(['Booking Issue', 'Order / Delivery', 'Proof Feedback', 'Refund'] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Subject / Headline *</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="e.g. Need to update delivery address"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.fieldLabel}>Detailed Message *</Text>
        <TextInput
          style={styles.multilineInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your question or concern in detail..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={3}
        />

        <CustomButton
          title="Send Support Request"
          onPress={handleSubmitTicket}
          loading={isSubmitting}
          icon={<Send size={14} color="#ffffff" />}
          style={{ marginTop: 14 }}
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#db277715',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    color: '#db2777',
    fontSize: 9,
    fontWeight: '800',
  },
  title: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  contactCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  contactTitle: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  contactSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeader: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  faqsList: {
    gap: 8,
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faqQuestion: {
    flex: 1,
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
  faqAnswer: {
    color: '#475569',
    fontSize: 11,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    lineHeight: 16,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fieldLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  catChipActive: {
    backgroundColor: '#db2777',
  },
  catChipText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  catChipTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#0f172a',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  multilineInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#0f172a',
    fontSize: 12,
    padding: 10,
    textAlignVertical: 'top',
  },
});
