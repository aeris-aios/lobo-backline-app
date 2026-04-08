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
    title: 'Information We Collect',
    body: 'We collect location data during active bookings, device information, booking history, and biometric authentication data. Biometric data is stored locally on your device only and is never transmitted to our servers.',
  },
  {
    title: 'How We Use Your Information',
    body: 'Your information is used exclusively for service delivery, safety coordination with your assigned protection detail, account management, and legal compliance. We do not use your data for advertising or profiling.',
  },
  {
    title: 'Data Security',
    body: 'All data is protected using AES-256 encryption in transit and at rest. Our infrastructure is SOC 2 Type II compliant. Biometric data uses zero-knowledge storage — your biometrics never leave your device.',
  },
  {
    title: 'Location Data',
    body: 'Location is only tracked during active bookings. Background location is used solely to coordinate your protection detail and is never stored beyond 30 days.',
  },
  {
    title: 'Third-Party Services',
    body: 'We use Firebase for authentication (Google). No personal data is sold or shared with advertising networks. All third-party integrations are evaluated against our strict data handling standards.',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to access, correct, or delete your personal data at any time. California residents are protected under CCPA. EU clients are covered under GDPR. Contact us to exercise your rights.',
  },
  {
    title: 'Contact Us',
    body: 'privacy@loboep.com | LOBO Executive Protection LLC | Dallas, TX 75201',
  },
];

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Privacy Policy" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <Text style={styles.effectiveDate}>Effective: January 1, 2025</Text>

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
          onPress={() => Linking.openURL('mailto:privacy@loboep.com')}
          activeOpacity={0.7}
        >
          <Ionicons name="mail-outline" size={16} color={Colors.steel} />
          <Text style={styles.contactText}>
            Privacy inquiries:{' '}
            <Text style={styles.contactLink}>privacy@loboep.com</Text>
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

  effectiveDate: {
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
