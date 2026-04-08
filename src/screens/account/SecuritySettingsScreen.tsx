import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import { SecureStorage } from '../../utils/storage';
import Header from '../../components/common/Header';

export default function SecuritySettingsScreen() {
  const insets = useSafeAreaInsets();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionAlerts, setSessionAlerts] = useState(true);

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Biometric Login',
        'Use Face ID or Touch ID to quickly access your account after your first sign in.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: async () => {
              await SecureStorage.setBiometricEnabled(true);
              setBiometricEnabled(true);
            },
          },
        ]
      );
    } else {
      await SecureStorage.setBiometricEnabled(false);
      setBiometricEnabled(false);
    }
  };

  const handle2FAToggle = (value: boolean) => {
    Alert.alert(
      value ? 'Enable 2FA' : 'Disable 2FA',
      value
        ? 'Two-factor authentication adds an extra layer of security. You will need an authenticator app.'
        : 'Disabling 2FA reduces your account security. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: value ? 'Set Up 2FA' : 'Disable',
          style: value ? 'default' : 'destructive',
          onPress: () => setTwoFactorEnabled(value),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Security Settings" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing['2xl'] }]}
      >
        {/* Security status */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name={twoFactorEnabled && biometricEnabled ? 'shield-checkmark' : 'shield-outline'}
              size={32}
              color={twoFactorEnabled ? Colors.successLight : Colors.warning}
            />
          </View>
          <View>
            <Text style={styles.statusTitle}>
              {twoFactorEnabled ? 'Account Secured' : 'Improve Your Security'}
            </Text>
            <Text style={styles.statusSub}>
              {twoFactorEnabled
                ? '2FA is active on your account'
                : 'Enable 2FA for stronger protection'}
            </Text>
          </View>
        </View>

        {/* Authentication */}
        <Text style={styles.sectionLabel}>Authentication</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="finger-print-outline"
            label="Biometric Login"
            sub="Face ID / Touch ID"
            value={biometricEnabled}
            onToggle={handleBiometricToggle}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="keypad-outline"
            label="Two-Factor Authentication"
            sub="TOTP authenticator app"
            value={twoFactorEnabled}
            onToggle={handle2FAToggle}
          />
        </View>

        {/* Password */}
        <Text style={styles.sectionLabel}>Password</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIcon}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Change Password</Text>
              <Text style={styles.menuSub}>Minimum 8 chars with uppercase, number, symbol</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Session */}
        <Text style={styles.sectionLabel}>Sessions & Alerts</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="notifications-outline"
            label="New Sign-In Alerts"
            sub="Get notified of new device logins"
            value={sessionAlerts}
            onToggle={setSessionAlerts}
          />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIcon}>
              <Ionicons name="phone-portrait-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Active Sessions</Text>
              <Text style={styles.menuSub}>View and revoke active sessions</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Privacy */}
        <Text style={styles.sectionLabel}>Privacy</Text>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.steel} />
          <Text style={styles.infoText}>
            LOBO EP uses end-to-end encrypted communication for all booking and payment data.
            Biometric data never leaves your device. We do not sell personal data to third parties.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  sub,
  value,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={18} color={Colors.steel} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
        thumbColor={value ? Colors.crimsonLight : Colors.steel}
        ios_backgroundColor={Colors.surface3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.semiBold },
  statusSub: { color: Colors.textSecondary, fontSize: Typography.size.sm, marginTop: 2 },

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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { color: Colors.textPrimary, fontSize: Typography.size.base },
  menuSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },

  infoCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    lineHeight: 20,
    flex: 1,
  },
});
