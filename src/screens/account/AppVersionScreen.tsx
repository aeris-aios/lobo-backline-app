import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Header from '../../components/common/Header';

const VERSION_ROWS = [
  { label: 'Version', value: '1.0.0' },
  { label: 'Build', value: '2025.04.07' },
  { label: 'Platform', value: Platform.OS === 'ios' ? 'iOS' : 'Android' },
  { label: 'Environment', value: __DEV__ ? 'Development' : 'Production' },
];

const WHATS_NEW = [
  'Initial release of LOBO EP platform',
  'Real-time executive protection booking',
  'Biometric secure authentication',
  'Blackline premium transport service',
  'End-to-end encrypted communications',
];

interface LinkRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

function LinkRow({ icon, label, onPress }: LinkRowProps) {
  return (
    <TouchableOpacity style={styles.linkRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.linkIconWrap}>
        <Ionicons name={icon} size={18} color={Colors.steel} />
      </View>
      <Text style={styles.linkLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function AppVersionScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="App Info" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Centered logo + branding */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../../assets/logo-mark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>LOBO EP</Text>
          <Text style={styles.appSubtitle}>Executive Protection Platform</Text>
        </View>

        {/* Version info card */}
        <Text style={styles.sectionLabel}>Build Information</Text>
        <View style={styles.sectionCard}>
          {VERSION_ROWS.map((row, index) => (
            <React.Fragment key={row.label}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.versionRow}>
                <Text style={styles.versionLabel}>{row.label}</Text>
                <Text style={styles.versionValue}>{row.value}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* What's new section */}
        <Text style={styles.sectionLabel}>What's New in 1.0.0</Text>
        <View style={styles.sectionCard}>
          <View style={styles.whatsNewBlock}>
            {WHATS_NEW.map((item, index) => (
              <View key={index} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Links section */}
        <Text style={styles.sectionLabel}>More</Text>
        <View style={styles.sectionCard}>
          <LinkRow
            icon="star-outline"
            label="Rate the App"
            onPress={() => Alert.alert('Coming Soon', 'App rating will be available once published to the App Store.')}
          />
          <View style={styles.divider} />
          <LinkRow
            icon="share-outline"
            label="Share App"
            onPress={() => Alert.alert('Coming Soon', 'App sharing will be available in a future update.')}
          />
        </View>

        {/* Legal */}
        <Text style={styles.legalText}>
          © 2025 LOBO Executive Protection LLC. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  // Logo / branding
  logoSection: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.base,
  },
  appName: {
    color: Colors.crimson,
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.wider,
    marginBottom: Spacing.xs,
  },
  appSubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    letterSpacing: Typography.letterSpacing.wide,
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

  // Version rows
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  versionLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.regular,
  },
  versionValue: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
  },

  // What's new
  whatsNewBlock: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.crimson,
    marginTop: 7,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    lineHeight: 20,
  },

  // Links
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  linkIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.regular,
  },

  // Legal
  legalText: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    textAlign: 'center',
    marginTop: Spacing['2xl'],
    lineHeight: 18,
  },
});
