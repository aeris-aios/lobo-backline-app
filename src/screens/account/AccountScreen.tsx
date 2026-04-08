import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress: () => void;
  badge?: string;
  destructive?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { firebaseUser, logout, logoutEverywhere } = useAuth();

  const displayName = firebaseUser?.displayName ?? 'LOBO Member';
  const email = firebaseUser?.email ?? '';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleLogoutEverywhere = () => {
    Alert.alert(
      'Sign Out Everywhere',
      'This will sign you out of all devices. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out All Devices', style: 'destructive', onPress: () => logoutEverywhere() },
      ]
    );
  };

  const sections: MenuSection[] = [
    {
      title: 'Profile',
      items: [
        { icon: 'person-outline', label: 'Personal Information', onPress: () => navigation.navigate('PersonalInformation') },
        { icon: 'location-outline', label: 'Saved Locations', onPress: () => navigation.navigate('SavedLocations') },
        { icon: 'card-outline', label: 'Payment Methods', onPress: () => navigation.navigate('PaymentMethods') },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: 'shield-checkmark-outline', label: 'Security Settings', sub: 'Password, 2FA, biometrics', onPress: () => navigation.navigate('SecuritySettings') },
        { icon: 'notifications-outline', label: 'Notification Preferences', onPress: () => navigation.navigate('NotificationPreferences') },
        { icon: 'eye-off-outline', label: 'Privacy Settings', onPress: () => navigation.navigate('PrivacySettings') },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'headset-outline', label: 'Contact Support', onPress: () => navigation.navigate('ContactSupport') },
        { icon: 'document-text-outline', label: 'Terms of Service', onPress: () => navigation.navigate('TermsOfService') },
        { icon: 'lock-closed-outline', label: 'Privacy Policy', onPress: () => navigation.navigate('PrivacyPolicy') },
        { icon: 'information-circle-outline', label: 'App Version', sub: '1.0.0', onPress: () => navigation.navigate('AppVersion') },
      ],
    },
    {
      title: 'Session',
      items: [
        { icon: 'log-out-outline', label: 'Sign Out', onPress: handleLogout, destructive: true },
        { icon: 'globe-outline', label: 'Sign Out All Devices', onPress: handleLogoutEverywhere, destructive: true },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarInitials}>
              {displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            <Badge label="EP Member" variant="crimson" style={styles.memberBadge} size="sm" />
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={18} color={Colors.steel} />
          </TouchableOpacity>
        </View>

        {/* Menu sections */}
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIcon, item.destructive && styles.menuIconDestructive]}>
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={item.destructive ? Colors.errorLight : Colors.steel}
                      />
                    </View>
                    <View style={styles.menuContent}>
                      <Text style={[styles.menuLabel, item.destructive && styles.menuLabelDestructive]}>
                        {item.label}
                      </Text>
                      {item.sub && <Text style={styles.menuSub}>{item.sub}</Text>}
                    </View>
                    {item.badge && <Badge label={item.badge} variant="crimson" size="sm" />}
                    {!item.destructive && (
                      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    )}
                  </TouchableOpacity>
                  {index < section.items.length - 1 && <View style={styles.itemDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.size.xl, fontWeight: Typography.weight.bold },
  scroll: { padding: Spacing.base },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: Colors.white,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.semiBold },
  profileEmail: { color: Colors.textMuted, fontSize: Typography.size.sm, marginTop: 2 },
  memberBadge: { marginTop: Spacing.xs },
  editBtn: { padding: Spacing.sm },

  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
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
  menuIconDestructive: { backgroundColor: 'rgba(198,40,40,0.1)' },
  menuContent: { flex: 1 },
  menuLabel: { color: Colors.textPrimary, fontSize: Typography.size.base },
  menuLabelDestructive: { color: Colors.errorLight },
  menuSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  itemDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },
});
