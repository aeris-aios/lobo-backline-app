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
import Header from '../../components/common/Header';

export default function PrivacySettingsScreen() {
  const insets = useSafeAreaInsets();

  const [shareLocationActive, setShareLocationActive] = useState(true);
  const [locationHistory, setLocationHistory] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [personalizedExp, setPersonalizedExp] = useState(false);

  const handleDownloadData = () => {
    Alert.alert(
      'Download My Data',
      'We will compile your account data and send a download link to alex@loboep.com within 48 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Download', onPress: () => Alert.alert('Request Submitted', 'You will receive an email with your data within 48 hours.') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account, all booking history, and personal data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Are You Sure?',
              'Final confirmation: your account and all associated data will be permanently erased.',
              [
                { text: 'Keep Account', style: 'cancel' },
                {
                  text: 'Yes, Delete',
                  style: 'destructive',
                  onPress: () => Alert.alert('Request Received', 'Account deletion has been initiated. You will receive a confirmation email.'),
                },
              ]
            ),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Privacy Settings" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Location */}
        <Text style={styles.sectionLabel}>Location</Text>
        <View style={styles.sectionCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="location-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Share Location While Active</Text>
              <Text style={styles.menuSub}>Required for real-time detail coordination</Text>
            </View>
            <Switch
              value={shareLocationActive}
              onValueChange={setShareLocationActive}
              trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.surface3}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="time-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Location History</Text>
              <Text style={styles.menuSub}>Store past routes to improve service recommendations</Text>
            </View>
            <Switch
              value={locationHistory}
              onValueChange={setLocationHistory}
              trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.surface3}
            />
          </View>
        </View>
        <Text style={styles.helperText}>
          Location data is end-to-end encrypted and never sold to third parties. Disabling active location sharing may affect service quality.
        </Text>

        {/* Data & Personalization */}
        <Text style={styles.sectionLabel}>Data & Personalization</Text>
        <View style={styles.sectionCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="bar-chart-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Analytics & Crash Reports</Text>
              <Text style={styles.menuSub}>Help us improve app stability and performance</Text>
            </View>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.surface3}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="sparkles-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Personalized Experience</Text>
              <Text style={styles.menuSub}>Tailor content and recommendations based on your usage</Text>
            </View>
            <Switch
              value={personalizedExp}
              onValueChange={setPersonalizedExp}
              trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.surface3}
            />
          </View>
        </View>
        <Text style={styles.helperText}>
          Analytics data is anonymized and aggregated. We do not build individual profiles for advertising purposes.
        </Text>

        {/* Your Data */}
        <Text style={styles.sectionLabel}>Your Data</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleDownloadData} activeOpacity={0.7}>
            <View style={styles.menuIcon}>
              <Ionicons name="cloud-download-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Download My Data</Text>
              <Text style={styles.menuSub}>Receive a copy of all your account data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>
          In compliance with applicable data protection regulations, you may request a full export of all data associated with your account.
        </Text>

        {/* Danger Zone */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount} activeOpacity={0.7}>
            <View style={[styles.menuIcon, styles.menuIconDestructive]}>
              <Ionicons name="trash-outline" size={18} color={Colors.errorLight} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabelDestructive}>Delete Account</Text>
              <Text style={styles.menuSub}>Permanently remove your account and all data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>
          Account deletion is irreversible. All bookings, payment methods, and personal data will be permanently erased within 30 days.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

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
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },

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
  menuIconDestructive: {
    backgroundColor: '#2C1010',
  },
  menuContent: { flex: 1 },
  menuLabel: { color: Colors.textPrimary, fontSize: Typography.size.base },
  menuLabelDestructive: {
    color: Colors.errorLight,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
  },
  menuSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },

  helperText: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
});
