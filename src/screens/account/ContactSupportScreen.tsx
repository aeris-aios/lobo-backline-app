import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Header from '../../components/common/Header';

interface ContactOption {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  subtitle: string;
  crimson?: boolean;
  onPress: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_CATEGORIES = ['All', 'Bookings', 'Agents', 'Billing', 'Safety', 'Account'];

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'Bookings',
    question: 'How do I book a protection detail?',
    answer: 'Select your service type on the home screen, enter your pickup and destination, then tap "Book Protection." You\'ll receive agent assignment confirmation within minutes for on-demand requests.',
  },
  {
    category: 'Bookings',
    question: 'How do I modify an active booking?',
    answer: 'Contact your assigned agent directly via the Messages tab or call the emergency line. Changes to active protection details require agent verification and may affect pricing.',
  },
  {
    category: 'Bookings',
    question: 'Can I schedule protection in advance?',
    answer: 'Yes. Toggle "Schedule" on the home screen to set a future date and time. Scheduled bookings can be placed up to 90 days in advance. You\'ll receive agent confirmation 2 hours before service.',
  },
  {
    category: 'Bookings',
    question: 'What happens if I need to cancel?',
    answer: 'Cancellations made 24+ hours before service start are fully refunded. Cancellations within 24 hours incur a 50% fee. Same-day cancellations within 2 hours of service are non-refundable.',
  },
  {
    category: 'Agents',
    question: 'How are LOBO agents vetted?',
    answer: 'All agents hold active law enforcement or military backgrounds, carry appropriate state licensing, and complete our proprietary 12-point screening process — including background checks, psychological evaluation, and tactical proficiency testing.',
  },
  {
    category: 'Agents',
    question: 'Can I request a specific agent?',
    answer: 'Yes. If you\'ve worked with an agent before, you can request them by name via the Messages tab or by contacting support. Repeat-client requests are honored subject to agent availability.',
  },
  {
    category: 'Agents',
    question: 'What attire will my agent wear?',
    answer: 'Attire depends on the service type selected: Armed EP and Event details default to executive suit or tactical gear. Unarmed EP and Family escort can be configured for low-profile or casual concealed dress.',
  },
  {
    category: 'Billing',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay. Corporate clients may request invoicing with NET-15 terms. Cards are never stored on-device — all payments are processed via PCI-compliant infrastructure.',
  },
  {
    category: 'Billing',
    question: 'How is pricing calculated?',
    answer: 'Pricing is based on service type, duration, number of agents, and any specialist requirements (armored vehicle, medical support, etc.). A full quote is shown before you confirm any booking.',
  },
  {
    category: 'Safety',
    question: 'What do I do in an active emergency?',
    answer: 'Call the Emergency Line (+1 214-555-LOBO) immediately. Your assigned agent will follow active threat protocols. If you cannot call, send your location via the Messages tab — all agents monitor messages during active details.',
  },
  {
    category: 'Safety',
    question: 'Is my location data private?',
    answer: 'Your location is only shared with your assigned protection agent during an active booking. It is never shared with third parties, sold, or retained beyond 30 days post-service. See our Privacy Policy for full details.',
  },
  {
    category: 'Account',
    question: 'How do I enable biometric login?',
    answer: 'Go to Account → Security Settings → Biometric Login and toggle it on. You\'ll need to authenticate once with your password to activate it. Face ID and Touch ID are both supported.',
  },
];

export default function ContactSupportScreen() {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFAQs = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(f => f.category === activeCategory);

  const contactOptions: ContactOption[] = [
    {
      key: 'emergency',
      icon: 'call-outline',
      title: 'Emergency Line',
      value: '+1 (214) 555-LOBO',
      subtitle: 'For active protection incidents',
      crimson: true,
      onPress: () => Linking.openURL('tel:+12145550626'),
    },
    {
      key: 'priority',
      icon: 'headset-outline',
      title: 'Priority Support',
      value: 'support@loboep.com',
      subtitle: 'Response within 1 hour',
      onPress: () => Linking.openURL('mailto:support@loboep.com'),
    },
    {
      key: 'chat',
      icon: 'chatbubble-outline',
      title: 'Live Chat',
      value: 'Start a conversation',
      subtitle: 'Available 24/7',
      onPress: () => Alert.alert('Coming Soon', 'Live chat will be available in a future update.'),
    },
    {
      key: 'schedule',
      icon: 'calendar-outline',
      title: 'Schedule a Call',
      value: 'Book a callback',
      subtitle: 'Choose your preferred time',
      onPress: () => Alert.alert('Coming Soon', 'Call scheduling will be available in a future update.'),
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setExpandedIndex(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Contact Support" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="shield-checkmark" size={28} color={Colors.crimson} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>24/7 Executive Protection Support</Text>
            <Text style={styles.heroSubtitle}>Our team is always available for active clients</Text>
          </View>
        </View>

        {/* Contact options */}
        <Text style={styles.sectionLabel}>Contact Options</Text>
        <View style={styles.sectionCard}>
          {contactOptions.map((option, index) => (
            <React.Fragment key={option.key}>
              {index > 0 && <View style={styles.divider} />}
              <TouchableOpacity
                style={styles.contactRow}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconWrap,
                    option.crimson && styles.iconWrapCrimson,
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={option.crimson ? Colors.crimsonLight : Colors.steel}
                  />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text
                    style={[
                      styles.contactValue,
                      option.crimson && styles.contactValueCrimson,
                    ]}
                  >
                    {option.value}
                  </Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* FAQ section */}
        <Text style={styles.sectionLabel}>Frequently Asked</Text>

        {/* Category filter strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          contentContainerStyle={styles.categoryStrip}
          style={styles.categoryStripWrap}
        >
          {FAQ_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => handleCategoryChange(cat)}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionCard}>
          {filteredFAQs.length === 0 ? (
            <View style={styles.emptyFAQ}>
              <Text style={styles.emptyFAQText}>No questions in this category yet.</Text>
            </View>
          ) : filteredFAQs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View style={styles.divider} />}
              <TouchableOpacity
                style={styles.faqRow}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons
                    name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={expandedIndex === index ? Colors.crimson : Colors.textMuted}
                  />
                </View>
                {expandedIndex === index && (
                  <View style={styles.faqAnswerWrap}>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  // Hero card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginTop: Spacing.lg,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.crimsonDark,
  },
  heroText: { flex: 1 },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    lineHeight: 18,
  },

  // Section label
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.base },

  // Contact rows
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapCrimson: {
    backgroundColor: Colors.crimsonDark,
    borderWidth: 1,
    borderColor: Colors.crimson,
  },
  contactContent: { flex: 1 },
  contactTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    marginBottom: 2,
  },
  contactValue: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.regular,
    marginBottom: 2,
  },
  contactValueCrimson: {
    color: Colors.crimsonLight,
    fontWeight: Typography.weight.semiBold,
  },
  contactSubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
  },

  // Category filter
  categoryStripWrap: {
    marginBottom: Spacing.sm,
    marginHorizontal: -Spacing.base,
  },
  categoryStrip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 2,
    gap: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 52,
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: Colors.crimsonDark,
    borderColor: Colors.crimson,
  },
  categoryChipText: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  categoryChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.weight.semiBold,
  },

  // FAQ rows
  faqRow: {
    padding: Spacing.base,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  faqQuestion: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    flex: 1,
    lineHeight: 22,
  },
  faqAnswerWrap: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  faqAnswer: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    lineHeight: 20,
  },
  emptyFAQ: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyFAQText: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
  },
});
