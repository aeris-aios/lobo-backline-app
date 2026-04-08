import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Header from '../../components/common/Header';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Toggle {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  critical?: boolean; // cannot be disabled
}
interface Group {
  title: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  items: Toggle[];
}

type DeliveryChannel = 'push' | 'sms' | 'email';
type QuietHour = 'off' | '10pm–7am' | '11pm–8am' | '12am–9am';
type AlertSound = 'default' | 'chime' | 'urgent' | 'silent';

// ─── Initial Data ────────────────────────────────────────────────────────────
const INITIAL_GROUPS: Group[] = [
  {
    title: 'Agent Alerts',
    description: 'Real-time updates from your assigned agent',
    icon: 'shield-checkmark-outline',
    color: Colors.crimson,
    items: [
      { key: 'agentEnRoute',   label: 'Agent En Route',      sub: 'Alert when your agent is heading to you',      icon: 'car-outline',              value: true,  critical: true },
      { key: 'agentArrived',   label: 'Agent Arrived',       sub: 'Push when agent reaches your pickup point',    icon: 'location-outline',         value: true,  critical: true },
      { key: 'detailStarted',  label: 'Detail Started',      sub: 'Confirm when active protection begins',        icon: 'shield-outline',           value: true  },
      { key: 'detailEnded',    label: 'Detail Completed',    sub: 'Summary alert when your detail concludes',     icon: 'checkmark-circle-outline', value: true  },
      { key: 'etaUpdates',     label: 'ETA Updates',         sub: 'Live arrival time changes from your agent',    icon: 'time-outline',             value: true  },
    ],
  },
  {
    title: 'Bookings',
    description: 'Confirmations, reminders, and changes',
    icon: 'calendar-outline',
    color: '#C9A84C',
    items: [
      { key: 'bookingConfirm',   label: 'Booking Confirmed',    sub: 'Receipt when a new booking is placed',         icon: 'checkmark-done-outline',   value: true  },
      { key: 'bookingReminder',  label: 'Upcoming Reminder',    sub: '30-min heads-up before your detail starts',    icon: 'alarm-outline',            value: true  },
      { key: 'bookingCancelled', label: 'Cancellations',        sub: 'Alert if a booking is cancelled or changed',   icon: 'close-circle-outline',     value: true  },
      { key: 'rebookPrompt',     label: 'Rebook Suggestions',   sub: 'Remind you to rebook a past route',            icon: 'repeat-outline',           value: false },
      { key: 'scheduleChanges',  label: 'Schedule Changes',     sub: 'Notify when a scheduled detail is modified',   icon: 'create-outline',           value: true  },
    ],
  },
  {
    title: 'Safety & Security',
    description: 'Account access and protection alerts',
    icon: 'lock-closed-outline',
    color: Colors.steel,
    items: [
      { key: 'loginAlert',    label: 'Sign-In Alerts',      sub: 'Every time your account is accessed',           icon: 'shield-outline',           value: true,  critical: true },
      { key: 'newDevice',     label: 'New Device Login',    sub: 'Unrecognized device access alert',             icon: 'phone-portrait-outline',   value: true,  critical: true },
      { key: 'passwordChange',label: 'Password Changes',    sub: 'Confirm when your password is updated',        icon: 'lock-closed-outline',      value: true,  critical: true },
      { key: 'twoFactor',     label: '2FA Code Alerts',     sub: 'Authentication code delivery alerts',          icon: 'key-outline',              value: true  },
      { key: 'biometric',     label: 'Biometric Login',     sub: 'Notify when Face ID or fingerprint is used',   icon: 'finger-print-outline',     value: false },
    ],
  },
  {
    title: 'Live Tracking',
    description: 'Real-time location and route updates',
    icon: 'navigate-outline',
    color: Colors.successLight,
    items: [
      { key: 'locationUpdates', label: 'Location Updates',   sub: 'Periodic position updates from your agent',   icon: 'location-outline',         value: true  },
      { key: 'routeChange',     label: 'Route Changes',      sub: 'Alert when route is modified mid-detail',     icon: 'git-branch-outline',       value: true  },
      { key: 'geofenceAlert',   label: 'Zone Alerts',        sub: 'Alert when leaving or entering safe zones',   icon: 'map-outline',              value: false },
    ],
  },
  {
    title: 'Messages',
    description: 'Coordinator and agent communications',
    icon: 'chatbubbles-outline',
    color: Colors.steelLight,
    items: [
      { key: 'coordinatorMsg', label: 'Coordinator Messages', sub: 'New messages from your LOBO coordinator',    icon: 'chatbubble-outline',       value: true  },
      { key: 'agentMsg',       label: 'Agent Messages',       sub: 'In-app messages from your assigned agent',   icon: 'chatbubbles-outline',      value: true  },
    ],
  },
  {
    title: 'Promotions & Updates',
    description: 'Offers, app news, and announcements',
    icon: 'megaphone-outline',
    color: Colors.textMuted,
    items: [
      { key: 'offers',      label: 'Exclusive Offers',   sub: 'Special rates and member-only promotions',    icon: 'pricetag-outline',         value: false },
      { key: 'newServices', label: 'New Services',       sub: 'Updates when new service types launch',       icon: 'star-outline',             value: true  },
      { key: 'appUpdates',  label: 'App Updates',        sub: 'Release notes and feature announcements',     icon: 'construct-outline',        value: true  },
      { key: 'newsletter',  label: 'Newsletter',         sub: 'Monthly LOBO EP security briefing',          icon: 'mail-outline',             value: false },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function NotificationPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const [groups, setGroups]               = useState<Group[]>(INITIAL_GROUPS);
  const [channels, setChannels]           = useState<Record<DeliveryChannel, boolean>>({ push: true, sms: true, email: false });
  const [quietHours, setQuietHours]       = useState<QuietHour>('10pm–7am');
  const [alertSound, setAlertSound]       = useState<AlertSound>('default');
  const [vibration, setVibration]         = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('Agent Alerts');

  const toggleItem = (groupTitle: string, key: string, val: boolean) => {
    setGroups(prev => prev.map(g =>
      g.title !== groupTitle ? g : {
        ...g,
        items: g.items.map(item => item.key === key ? { ...item, value: val } : item),
      }
    ));
  };

  const toggleAllInGroup = (groupTitle: string, val: boolean) => {
    setGroups(prev => prev.map(g =>
      g.title !== groupTitle ? g : {
        ...g,
        items: g.items.map(item => item.critical ? { ...item, value: true } : { ...item, value: val }),
      }
    ));
  };

  const groupEnabledCount = (g: Group) => g.items.filter(i => i.value).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Notification Preferences" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* ── System Permission Banner ── */}
        <View style={styles.permBanner}>
          <View style={styles.permBannerLeft}>
            <Ionicons name="notifications" size={20} color='#C9A84C' />
            <View>
              <Text style={styles.permTitle}>Push Notifications</Text>
              <Text style={styles.permSub}>
                {Platform.OS === 'ios' ? 'Manage in iOS Settings → LOBO EP → Notifications' : 'Manage in Android Settings → Apps → LOBO EP → Notifications'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.permOpenBtn} activeOpacity={0.8}>
            <Text style={styles.permOpenText}>Open Settings</Text>
          </TouchableOpacity>
        </View>

        {/* ── Delivery Channels ── */}
        <SectionLabel text="Delivery Channels" />
        <View style={styles.card}>
          {([
            { id: 'push' as DeliveryChannel, label: 'Push Notifications', sub: 'Alerts on your lock screen & notification center', icon: 'phone-portrait-outline' as const },
            { id: 'sms'  as DeliveryChannel, label: 'SMS Text Alerts',    sub: 'Critical alerts sent via text message',             icon: 'chatbubble-ellipses-outline' as const },
            { id: 'email'as DeliveryChannel, label: 'Email Alerts',       sub: 'Booking receipts and summaries via email',          icon: 'mail-outline' as const },
          ]).map((ch, i, arr) => (
            <React.Fragment key={ch.id}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.row}>
                <View style={styles.rowIcon}>
                  <Ionicons name={ch.icon} size={17} color={Colors.steel} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{ch.label}</Text>
                  <Text style={styles.rowSub}>{ch.sub}</Text>
                </View>
                <Switch
                  value={channels[ch.id]}
                  onValueChange={val => setChannels(prev => ({ ...prev, [ch.id]: val }))}
                  trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.surface3}
                />
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Sound & Vibration ── */}
        <SectionLabel text="Sound & Vibration" />
        <View style={styles.card}>
          {/* Critical Alerts (iOS always-on) */}
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: 'rgba(139,0,0,0.12)' }]}>
              <Ionicons name="alert-circle" size={17} color={Colors.crimson} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Critical Alerts</Text>
              <Text style={styles.rowSub}>Override silent mode for agent & security alerts</Text>
            </View>
            <Switch
              value={criticalAlerts}
              onValueChange={setCriticalAlerts}
              trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.surface3}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="phone-portrait-outline" size={17} color={Colors.steel} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Vibration</Text>
              <Text style={styles.rowSub}>Haptic feedback with notifications</Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.surface3}
            />
          </View>
          <View style={styles.divider} />
          {/* Alert Sound picker */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="volume-high-outline" size={17} color={Colors.steel} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Alert Sound</Text>
              <Text style={styles.rowSub}>Choose notification tone</Text>
            </View>
          </View>
          <View style={styles.soundRow}>
            {(['default', 'chime', 'urgent', 'silent'] as AlertSound[]).map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.soundChip, alertSound === s && styles.soundChipActive]}
                onPress={() => setAlertSound(s)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={s === 'silent' ? 'volume-mute-outline' : s === 'urgent' ? 'alert-circle-outline' : 'musical-note-outline'}
                  size={13}
                  color={alertSound === s ? Colors.crimsonLight : Colors.steel}
                />
                <Text style={[styles.soundChipText, alertSound === s && styles.soundChipTextActive]}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Quiet Hours ── */}
        <SectionLabel text="Quiet Hours" />
        <View style={styles.card}>
          <View style={styles.quietHeader}>
            <View style={styles.rowIcon}>
              <Ionicons name="moon-outline" size={17} color={Colors.steel} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Do Not Disturb</Text>
              <Text style={styles.rowSub}>Pause non-critical alerts during these hours</Text>
            </View>
          </View>
          <View style={styles.quietGrid}>
            {(['off', '10pm–7am', '11pm–8am', '12am–9am'] as QuietHour[]).map(q => (
              <TouchableOpacity
                key={q}
                style={[styles.quietChip, quietHours === q && styles.quietChipActive]}
                onPress={() => setQuietHours(q)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={q === 'off' ? 'close-outline' : 'moon-outline'}
                  size={13}
                  color={quietHours === q ? Colors.crimsonLight : Colors.steel}
                />
                <Text style={[styles.quietChipText, quietHours === q && styles.quietChipTextActive]}>
                  {q === 'off' ? 'Off' : q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {quietHours !== 'off' && (
            <View style={styles.quietNote}>
              <Ionicons name="information-circle-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.quietNoteText}>Critical agent and security alerts will still come through</Text>
            </View>
          )}
        </View>

        {/* ── Notification Groups ── */}
        <SectionLabel text="Alert Categories" />
        {groups.map(group => {
          const isExpanded = expandedGroup === group.title;
          const enabledCount = groupEnabledCount(group);
          const allOn = enabledCount === group.items.length;

          return (
            <View key={group.title} style={styles.groupCard}>
              {/* Group header row */}
              <TouchableOpacity
                style={styles.groupHeader}
                onPress={() => setExpandedGroup(isExpanded ? null : group.title)}
                activeOpacity={0.8}
              >
                <View style={[styles.groupIconWrap, { backgroundColor: `${group.color}18`, borderColor: `${group.color}30` }]}>
                  <Ionicons name={group.icon} size={18} color={group.color} />
                </View>
                <View style={styles.groupHeaderText}>
                  <Text style={styles.groupTitle}>{group.title}</Text>
                  <Text style={styles.groupCount}>{enabledCount} of {group.items.length} enabled</Text>
                </View>
                <Switch
                  value={allOn}
                  onValueChange={val => toggleAllInGroup(group.title, val)}
                  trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.surface3}
                />
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={Colors.textMuted}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>

              {/* Expanded items */}
              {isExpanded && (
                <View style={styles.groupItems}>
                  {group.description && (
                    <Text style={styles.groupDesc}>{group.description}</Text>
                  )}
                  {group.items.map((item, i) => (
                    <React.Fragment key={item.key}>
                      {i > 0 && <View style={styles.dividerIndent} />}
                      <View style={styles.row}>
                        <View style={styles.rowIcon}>
                          <Ionicons name={item.icon} size={15} color={item.value ? Colors.steel : Colors.textMuted} />
                        </View>
                        <View style={styles.rowText}>
                          <View style={styles.rowLabelRow}>
                            <Text style={styles.rowLabel}>{item.label}</Text>
                            {item.critical && (
                              <View style={styles.criticalPill}>
                                <Text style={styles.criticalText}>Required</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.rowSub}>{item.sub}</Text>
                        </View>
                        <Switch
                          value={item.value}
                          onValueChange={val => item.critical ? null : toggleItem(group.title, item.key, val)}
                          disabled={item.critical}
                          trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
                          thumbColor={Colors.white}
                          ios_backgroundColor={Colors.surface3}
                        />
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* ── Platform Note ── */}
        <View style={styles.platformNote}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'logo-apple' : 'logo-android'}
            size={15}
            color={Colors.textMuted}
          />
          <Text style={styles.platformText}>
            {Platform.OS === 'ios'
              ? 'Some alert types (Critical Alerts, Time Sensitive) are managed in iOS Settings. LOBO EP respects your system-level notification permissions.'
              : 'Notification behavior may vary by Android version. Battery optimization settings may affect delivery of some alerts.'}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={slStyles.label}>{text}</Text>
  );
}
const slStyles = StyleSheet.create({
  label: {
    color: Colors.textMuted, fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold, letterSpacing: 1.5,
    textTransform: 'uppercase', marginTop: Spacing.xl, marginBottom: Spacing.sm, paddingHorizontal: 4,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  // Permission banner
  permBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(201,168,76,0.08)', borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    padding: Spacing.base, marginHorizontal: Spacing.base, marginTop: Spacing.base, gap: Spacing.sm,
  },
  permBannerLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, flex: 1 },
  permTitle: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold },
  permSub: { color: Colors.textMuted, fontSize: 10, lineHeight: 14, marginTop: 2 },
  permOpenBtn: {
    backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
    paddingHorizontal: 12, paddingVertical: 6,
  },
  permOpenText: { color: '#C9A84C', fontSize: Typography.size.xs, fontWeight: Typography.weight.bold },

  card: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  rowIcon: {
    width: 34, height: 34, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowLabel: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  rowSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2, lineHeight: 15 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },
  dividerIndent: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },

  // Sound chips
  soundRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base, flexWrap: 'wrap' },
  soundChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface3, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 10, paddingVertical: 6,
  },
  soundChipActive: { borderColor: Colors.crimson, backgroundColor: 'rgba(139,0,0,0.12)' },
  soundChipText: { color: Colors.steel, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  soundChipTextActive: { color: Colors.crimsonLight },

  // Quiet hours
  quietHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  quietGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  quietChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface3, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 7,
  },
  quietChipActive: { borderColor: Colors.crimson, backgroundColor: 'rgba(139,0,0,0.12)' },
  quietChipText: { color: Colors.steel, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  quietChipTextActive: { color: Colors.crimsonLight },
  quietNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
  },
  quietNoteText: { color: Colors.textMuted, fontSize: 10, lineHeight: 14 },

  // Group cards
  groupCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.sm,
  },
  groupHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  groupIconWrap: {
    width: 38, height: 38, borderRadius: BorderRadius.md,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  groupHeaderText: { flex: 1 },
  groupTitle: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  groupCount: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 1 },
  groupItems: { borderTopWidth: 1, borderTopColor: Colors.border },
  groupDesc: {
    color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 16,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, paddingBottom: 0,
  },

  // Critical pill
  criticalPill: {
    backgroundColor: 'rgba(139,0,0,0.15)', borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 1,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.3)',
  },
  criticalText: { color: Colors.crimsonLight, fontSize: 9, fontWeight: Typography.weight.bold },

  // Platform note
  platformNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  platformText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },
});
