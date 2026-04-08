import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Header from '../../components/common/Header';

interface Section {
  title: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using the LOBO Executive Protection mobile application, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the application or any services offered through it.',
  },
  {
    title: '2. Service Description',
    body: 'LOBO EP provides executive protection, secure transportation, and personal security consulting services. All services are subject to availability and agent certification requirements.',
  },
  {
    title: '3. Client Responsibilities',
    body: 'Clients must provide accurate location and itinerary information. Misrepresentation of threat level or circumstances may result in service termination without refund.',
  },
  {
    title: '4. Booking & Cancellation',
    body: 'Bookings are confirmed upon receipt of payment authorization. Cancellations within 24 hours of service commencement are subject to a 50% cancellation fee.',
  },
  {
    title: '5. Confidentiality',
    body: 'LOBO EP maintains strict confidentiality of all client information, itineraries, and security protocols. Client information is never shared with third parties without explicit consent.',
  },
  {
    title: '6. Liability Limitation',
    body: "LOBO EP's liability is limited to the value of the booked service. We are not liable for indirect damages arising from service disruptions beyond our control.",
  },
  {
    title: '7. Governing Law',
    body: 'These terms are governed by the laws of the State of Texas. Disputes shall be resolved through binding arbitration in Dallas County, Texas.',
  },
];

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Terms of Service" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <Text style={styles.lastUpdated}>Last updated: January 1, 2025</Text>

        <View style={styles.sectionsCard}>
          {SECTIONS.map((section, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Contact row */}
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => Linking.openURL('mailto:legal@loboep.com')}
          activeOpacity={0.7}
        >
          <Ionicons name="mail-outline" size={16} color={Colors.steel} />
          <Text style={styles.contactText}>
            Questions?{' '}
            <Text style={styles.contactLink}>legal@loboep.com</Text>
          </Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  lastUpdated: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: 4,
  },

  sectionsCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: Colors.border },

  sectionBlock: {
    padding: Spacing.base,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    marginBottom: Spacing.sm,
    letterSpacing: Typography.letterSpacing.tight,
  },
  sectionBody: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    lineHeight: 20,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginTop: Spacing.xl,
  },
  contactText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
  },
  contactLink: {
    color: Colors.crimsonLight,
    fontWeight: Typography.weight.medium,
  },
});
