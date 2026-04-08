import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  TextInput,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

type FilterId   = 'all' | 'bookings' | 'agent' | 'security' | 'updates';
type AlertLevel = 'info' | 'success' | 'warning' | 'critical';
type Section    = 'today' | 'yesterday' | 'earlier';

interface NotifItem {
  id:            string;
  filter:        FilterId;
  level:         AlertLevel;
  section:       Section;
  icon:          keyof typeof Ionicons.glyphMap;
  title:         string;
  body:          string;
  time:          string;
  read:          boolean;
  agentInitials?: string;
  agentName?:    string;
  agentRating?:  number;
  actions?:      { label: string; icon: keyof typeof Ionicons.glyphMap; color?: string }[];
  statusSteps?:  { label: string; done: boolean; active: boolean }[];
}

// ─── constants ─────────────────────────────────────────────────────────────
const GOLD = '#C9A84C';

const LVL_COLOR: Record<AlertLevel, string> = {
  info:     Colors.steel,
  success:  Colors.successLight,
  warning:  GOLD,
  critical: Colors.crimson,
};
const LVL_BG: Record<AlertLevel, string> = {
  info:    'rgba(120,130,150,0.10)',
  success: 'rgba(76,175,80,0.10)',
  warning: 'rgba(201,168,76,0.10)',
  critical:'rgba(139,0,0,0.10)',
};

const FILTERS: { id: FilterId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all',      label: 'All',       icon: 'notifications-outline' },
  { id: 'bookings', label: 'Bookings',  icon: 'calendar-outline' },
  { id: 'agent',    label: 'My Agent',  icon: 'shield-outline' },
  { id: 'security', label: 'Security',  icon: 'lock-closed-outline' },
  { id: 'updates',  label: 'Updates',   icon: 'megaphone-outline' },
];

const SECTION_LABEL: Record<Section, string> = {
  today:     'Today',
  yesterday: 'Yesterday',
  earlier:   'Earlier',
};

const ALL_NOTIFS: NotifItem[] = [
  // TODAY — agent
  {
    id: 'a1', filter: 'agent', section: 'today', level: 'critical',
    icon: 'shield-checkmark', title: 'Agent En Route',
    body: 'Agent Marcus T. is 8 minutes away. Stand by at your pickup.',
    time: '2 min ago', read: false,
    agentInitials: 'MT', agentName: 'Marcus T.', agentRating: 4.97,
    actions: [
      { label: 'Track Live',  icon: 'navigate-outline',   color: Colors.crimson },
      { label: 'Call Agent',  icon: 'call-outline' },
      { label: 'Message',     icon: 'chatbubble-outline' },
    ],
  },
  {
    id: 'a2', filter: 'agent', section: 'today', level: 'warning',
    icon: 'time-outline', title: 'Detail Starts in 30 Min',
    body: 'Your Armed EP detail with Agent D. Brooks begins at 2:00 PM. Review your route.',
    time: '25 min ago', read: false,
    agentInitials: 'DB', agentName: 'D. Brooks', agentRating: 4.91,
    actions: [
      { label: 'View Detail', icon: 'eye-outline' },
      { label: 'Message',     icon: 'chatbubble-outline' },
    ],
  },
  // TODAY — bookings
  {
    id: 'b1', filter: 'bookings', section: 'today', level: 'success',
    icon: 'calendar-outline', title: 'Booking Confirmed — BK_0042',
    body: 'Armed EP on Apr 10, 2026 at 9:00 AM · Dallas Love Field pickup.',
    time: '5h ago', read: false,
    actions: [
      { label: 'View Booking', icon: 'document-text-outline' },
      { label: 'Rebook',       icon: 'repeat-outline' },
    ],
    statusSteps: [
      { label: 'Requested',     done: true,  active: false },
      { label: 'Confirmed',     done: true,  active: true  },
      { label: 'Agent Assigned',done: false, active: false },
      { label: 'En Route',      done: false, active: false },
      { label: 'Active',        done: false, active: false },
    ],
  },
  {
    id: 'b2', filter: 'bookings', section: 'today', level: 'warning',
    icon: 'alert-circle-outline', title: 'Reminder: Detail Tomorrow',
    body: 'Blackline transport scheduled for Apr 9, 6:00 AM. Confirm or reschedule by midnight.',
    time: '8h ago', read: false,
    actions: [
      { label: 'Confirm',     icon: 'checkmark-circle-outline', color: Colors.successLight },
      { label: 'Reschedule',  icon: 'calendar-outline' },
    ],
  },
  // TODAY — security
  {
    id: 's1', filter: 'security', section: 'today', level: 'critical',
    icon: 'shield-outline', title: 'New Device Sign-In Detected',
    body: "Your account was accessed from an iPhone in Houston, TX at 10:14 AM. If this wasn't you, secure your account now.",
    time: '1h ago', read: false,
    actions: [
      { label: 'Secure Account', icon: 'lock-closed-outline', color: Colors.crimson },
      { label: 'It was me',      icon: 'checkmark-outline' },
    ],
  },
  // YESTERDAY — agent
  {
    id: 'a3', filter: 'agent', section: 'yesterday', level: 'success',
    icon: 'checkmark-circle', title: 'Detail Completed',
    body: 'Your Armed EP detail with Agent J. Reyes concluded successfully. Duration: 4 hrs 12 min.',
    time: 'Yesterday 6:30 PM', read: true,
    agentInitials: 'JR', agentName: 'J. Reyes', agentRating: 4.99,
    actions: [
      { label: 'View Summary', icon: 'document-text-outline' },
      { label: 'Rate Agent',   icon: 'star-outline', color: GOLD },
    ],
  },
  {
    id: 'a4', filter: 'agent', section: 'yesterday', level: 'info',
    icon: 'person', title: 'Agent Assigned to Apr 10 Detail',
    body: 'Agent D. Brooks (FBI-cleared, Armed EP) is assigned to your upcoming booking.',
    time: 'Yesterday 2:00 PM', read: true,
    agentInitials: 'DB', agentName: 'D. Brooks', agentRating: 4.91,
    actions: [{ label: 'View Profile', icon: 'person-circle-outline' }],
  },
  // YESTERDAY — bookings
  {
    id: 'b3', filter: 'bookings', section: 'yesterday', level: 'info',
    icon: 'close-circle-outline', title: 'Booking Cancelled — BK_0039',
    body: 'Unarmed EP, Apr 3 — cancelled per your request. No charge applied.',
    time: 'Yesterday 10:00 AM', read: true,
  },
  // YESTERDAY — security
  {
    id: 's2', filter: 'security', section: 'yesterday', level: 'info',
    icon: 'lock-closed-outline', title: 'Password Updated',
    body: 'Your account password was changed successfully on Apr 7, 2026 at 9:41 AM.',
    time: 'Yesterday 9:41 AM', read: true,
  },
  // EARLIER — agent
  {
    id: 'a5', filter: 'agent', section: 'earlier', level: 'info',
    icon: 'star', title: 'Agent Rating Submitted',
    body: 'You gave Agent Marcus T. a 5-star rating. Thank you for your feedback.',
    time: 'Apr 4', read: true,
  },
  // EARLIER — bookings
  {
    id: 'b4', filter: 'bookings', section: 'earlier', level: 'success',
    icon: 'repeat-outline', title: 'Saved Route Available',
    body: 'Your Armed EP route (Home → AT&T Stadium) is saved. Rebook in one tap.',
    time: 'Apr 3', read: true,
    actions: [{ label: 'Rebook Now', icon: 'repeat-outline', color: Colors.crimson }],
  },
  // EARLIER — security
  {
    id: 's3', filter: 'security', section: 'earlier', level: 'success',
    icon: 'finger-print-outline', title: 'Face ID Login',
    body: `Face ID was used to sign in on Apr 5 at 11:42 AM on your ${Platform.OS === 'ios' ? 'iPhone' : 'Android'}.`,
    time: 'Apr 5', read: true,
  },
  {
    id: 's4', filter: 'security', section: 'earlier', level: 'info',
    icon: 'phone-portrait-outline', title: 'Two-Factor Auth Enabled',
    body: '2FA is active on your account. Your account is protected.',
    time: 'Apr 2', read: true,
  },
  // EARLIER — updates
  {
    id: 'u1', filter: 'updates', section: 'earlier', level: 'info',
    icon: 'megaphone-outline', title: 'Family EP Now Available',
    body: 'Book school escorts, airport runs, and standby coverage for your family from the Home screen.',
    time: 'Apr 2', read: false,
    actions: [{ label: 'Learn More', icon: 'arrow-forward-outline' }],
  },
  {
    id: 'u2', filter: 'updates', section: 'earlier', level: 'warning',
    icon: 'pricetag-outline', title: 'Limited Offer — Priority Dispatch',
    body: 'Book 8+ hours of Blackline and receive priority dispatch at no extra charge. Offer ends Apr 15.',
    time: 'Apr 1', read: true,
    actions: [{ label: 'Book Now', icon: 'arrow-forward-outline', color: GOLD }],
  },
  {
    id: 'u3', filter: 'updates', section: 'earlier', level: 'info',
    icon: 'construct-outline', title: 'App Updated to v1.3',
    body: 'Schedule Protection, live agent tracking, improved alerts, and performance improvements.',
    time: 'Mar 30', read: true,
  },
];

// ─── helpers ───────────────────────────────────────────────────────────────
type ListRow =
  | { type: 'live' }
  | { type: 'sectionHeader'; section: Section }
  | { type: 'notif'; item: NotifItem };

function rowKey(row: ListRow, i: number): string {
  if (row.type === 'live') return 'live-card';
  if (row.type === 'sectionHeader') return `hdr-${row.section}`;
  return row.item.id;
}

// ─── main screen ───────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [activeFilter,   setActiveFilter]   = useState<FilterId>('all');
  const [notifs,         setNotifs]          = useState<NotifItem[]>(ALL_NOTIFS);
  const [search,         setSearch]          = useState('');
  const [searchVisible,  setSearchVisible]   = useState(false);
  const [refreshing,     setRefreshing]      = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 650, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 650, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const unreadCount = (f: FilterId) =>
    f === 'all'
      ? notifs.filter(n => !n.read).length
      : notifs.filter(n => n.filter === f && !n.read).length;

  const markRead    = (id: string) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = ()            => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const dismiss     = (id: string) => setNotifs(p => p.filter(n => n.id !== id));

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const searchLower  = search.toLowerCase();
  const baseFiltered = activeFilter === 'all' ? notifs : notifs.filter(n => n.filter === activeFilter);
  const filtered     = search
    ? baseFiltered.filter(n => n.title.toLowerCase().includes(searchLower) || n.body.toLowerCase().includes(searchLower))
    : baseFiltered;

  // Build flat list rows with section headers
  const liveNotif = notifs.find(n => n.id === 'a1');
  const showLive  = !!liveNotif && !liveNotif.read && (activeFilter === 'all' || activeFilter === 'agent') && !search;

  const rows: ListRow[] = [];
  if (showLive) rows.push({ type: 'live' });

  (['today', 'yesterday', 'earlier'] as Section[]).forEach(sec => {
    const items = filtered.filter(n => n.section === sec && n.id !== 'a1');
    if (!items.length) return;
    rows.push({ type: 'sectionHeader', section: sec });
    items.forEach(item => rows.push({ type: 'notif', item }));
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Alerts</Text>
          {unreadCount('all') > 0 && (
            <Text style={styles.headerSub}>{unreadCount('all')} new</Text>
          )}
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchVisible(v => !v)} activeOpacity={0.7}>
          <Ionicons name={searchVisible ? 'close-outline' : 'search-outline'} size={20} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={markAllRead} activeOpacity={0.7}>
          <Ionicons name="checkmark-done-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Account')} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      {searchVisible && (
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={Colors.steel} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search alerts…"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={16} color={Colors.steel} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Filter tabs */}
      <View style={styles.tabBar}>
        {FILTERS.map(f => {
          const active = activeFilter === f.id;
          const count  = unreadCount(f.id);
          const iconName = active
            ? (f.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap)
            : f.icon;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.tabItem, active && styles.tabItemActive]}
              onPress={() => setActiveFilter(f.id)}
              activeOpacity={0.75}
              hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
            >
              <Ionicons name={iconName} size={13} color={active ? Colors.crimson : Colors.steel} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{f.label}</Text>
              {count > 0 && (
                <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                  <Text style={styles.tabBadgeText}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.tabUnderlineTrack}>
        {FILTERS.map(f => (
          <View key={f.id} style={[styles.tabUnderlineSegment, activeFilter === f.id && styles.tabUnderlineActive]} />
        ))}
      </View>

      {/* List */}
      <FlatList
        data={rows}
        keyExtractor={rowKey}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 60 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.crimson} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={52} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptySub}>
              {search ? `No results for "${search}"` : 'No alerts in this category.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          rows.length > 0 ? (
            <TouchableOpacity style={styles.manageRow} onPress={() => navigation.navigate('Account')} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.manageText}>Manage notification preferences</Text>
              <Ionicons name="chevron-forward" size={13} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item: row }) => {
          if (row.type === 'live') {
            return (
              <LiveDetailCard
                pulseAnim={pulseAnim}
                onDismiss={() => markRead('a1')}
              />
            );
          }
          if (row.type === 'sectionHeader') {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{SECTION_LABEL[row.section]}</Text>
                <View style={styles.sectionLine} />
              </View>
            );
          }
          return (
            <NotifCard
              item={row.item}
              onPress={() => markRead(row.item.id)}
              onDismiss={() => dismiss(row.item.id)}
            />
          );
        }}
      />
    </View>
  );
}

// ─── Live Active Detail Card ───────────────────────────────────────────────
function LiveDetailCard({ pulseAnim, onDismiss }: {
  pulseAnim: Animated.Value;
  onDismiss: () => void;
}) {
  return (
    <View style={live.card}>
      <LinearGradient
        colors={['rgba(139,0,0,0.18)', 'rgba(10,10,10,0)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      />

      {/* Top row */}
      <View style={live.topRow}>
        <View style={live.liveChip}>
          <Animated.View style={[live.liveDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={live.liveText}>LIVE</Text>
        </View>
        <Text style={live.etaLabel}>ETA <Text style={live.etaTime}>8 min</Text></Text>
        <TouchableOpacity onPress={onDismiss} style={live.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={16} color={Colors.steel} />
        </TouchableOpacity>
      </View>

      {/* Agent row */}
      <View style={live.agentRow}>
        <View style={live.avatar}>
          <Text style={live.avatarText}>MT</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={live.agentName}>Agent Marcus T.</Text>
          <View style={live.ratingRow}>
            <Ionicons name="star" size={11} color={GOLD} />
            <Text style={live.rating}>4.97 · Armed EP · FBI Cleared</Text>
          </View>
        </View>
        <View style={live.statusBadge}>
          <Text style={live.statusText}>En Route</Text>
        </View>
      </View>

      {/* Status timeline */}
      <View style={live.timeline}>
        {['Confirmed', 'Assigned', 'En Route', 'Active', 'Done'].map((step, i) => (
          <View key={step} style={live.timelineItem}>
            <View style={[
              live.timelineDot,
              i <= 2 && live.timelineDotDone,
              i === 2 && live.timelineDotActive,
            ]} />
            {i < 4 && <View style={[live.timelineLine, i < 2 && live.timelineLineDone]} />}
            <Text style={[live.timelineLabel, i <= 2 && live.timelineLabelDone]}>{step}</Text>
          </View>
        ))}
      </View>

      {/* Quick actions */}
      <View style={live.actions}>
        <TouchableOpacity style={live.iconBtn} activeOpacity={0.8}>
          <Ionicons name="call-outline" size={18} color={Colors.crimson} />
        </TouchableOpacity>
        <TouchableOpacity style={live.iconBtn} activeOpacity={0.8}>
          <Ionicons name="chatbubble-outline" size={18} color={Colors.crimson} />
        </TouchableOpacity>
        <TouchableOpacity style={live.iconBtn} activeOpacity={0.8}>
          <Ionicons name="shield-outline" size={18} color={Colors.crimson} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Notification Card ─────────────────────────────────────────────────────
function NotifCard({ item, onPress, onDismiss }: {
  item:      NotifItem;
  onPress:   () => void;
  onDismiss: () => void;
}) {
  const lvlColor = LVL_COLOR[item.level];
  const lvlBg    = LVL_BG[item.level];

  return (
    <TouchableOpacity
      style={[styles.card, item.read && styles.cardRead]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {!item.read && <View style={[styles.unreadStripe, { backgroundColor: lvlColor }]} />}

      <View style={styles.cardInner}>
        {/* Icon / avatar */}
        {item.agentInitials ? (
          <View style={[styles.avatar, { backgroundColor: lvlBg, borderColor: `${lvlColor}40` }]}>
            <Text style={[styles.avatarText, { color: lvlColor }]}>{item.agentInitials}</Text>
          </View>
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: lvlBg }]}>
            <Ionicons name={item.icon} size={20} color={lvlColor} />
          </View>
        )}

        <View style={styles.cardBody}>
          {/* Title row */}
          <View style={styles.cardTop}>
            <View style={styles.titleRow}>
              <Text style={[styles.cardTitle, item.read && styles.cardTitleRead]} numberOfLines={1}>
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
              <Ionicons name="close-outline" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Agent rating */}
          {item.agentName && (
            <View style={styles.agentMini}>
              <Ionicons name="star" size={10} color={GOLD} />
              <Text style={styles.agentMiniText}>{item.agentRating} · {item.agentName}</Text>
            </View>
          )}

          <Text style={styles.cardTime}>{item.time}</Text>
          <Text style={[styles.cardText, item.read && styles.cardTextRead]}>{item.body}</Text>

          {/* Booking status timeline */}
          {item.statusSteps && (
            <View style={styles.miniTimeline}>
              {item.statusSteps.map((step, i) => (
                <View key={step.label} style={styles.miniTimelineItem}>
                  <View style={[
                    styles.miniDot,
                    step.done   && styles.miniDotDone,
                    step.active && styles.miniDotActive,
                  ]} />
                  {i < item.statusSteps!.length - 1 && (
                    <View style={[styles.miniConnector, step.done && styles.miniConnectorDone]} />
                  )}
                  <Text style={[styles.miniLabel, step.active && styles.miniLabelActive]}>
                    {step.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Action buttons */}
          {item.actions && item.actions.length > 0 && (
            <View style={styles.actionsRow}>
              {item.actions.map((a, idx) => (
                <TouchableOpacity
                  key={a.label}
                  style={[
                    styles.actionBtn,
                    idx === 0 && {
                      borderColor: `${a.color || lvlColor}50`,
                      backgroundColor: `${a.color || lvlColor}10`,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={onPress}
                >
                  <Ionicons name={a.icon} size={12} color={idx === 0 ? (a.color || lvlColor) : Colors.textMuted} />
                  <Text style={[styles.actionBtnText, { color: idx === 0 ? (a.color || lvlColor) : Colors.textMuted }]}>
                    {a.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.xs, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy },
  headerSub: { color: Colors.crimsonLight, fontSize: Typography.size.xs, marginTop: 1 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.base, marginVertical: Spacing.sm,
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.base, paddingVertical: 10,
  },
  searchInput: {
    flex: 1, color: Colors.textPrimary, fontSize: Typography.size.sm,
    ...Platform.select({ android: { padding: 0 } }),
  },

  // Tabs
  tabBar: { flexDirection: 'row', paddingHorizontal: Spacing.xs, paddingTop: 2 },
  tabItem: {
    flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 9, paddingHorizontal: 2, gap: 3, minHeight: 50,
  },
  tabItemActive: {},
  tabText: { color: Colors.steel, fontSize: 10, fontWeight: Typography.weight.semiBold, textAlign: 'center' },
  tabTextActive: { color: Colors.crimson },
  tabBadge: {
    backgroundColor: Colors.surface3, borderRadius: 8,
    paddingHorizontal: 4, paddingVertical: 1, minWidth: 14, alignItems: 'center',
  },
  tabBadgeActive: { backgroundColor: Colors.crimson },
  tabBadgeText: { color: Colors.white, fontSize: 9, fontWeight: Typography.weight.bold },
  tabUnderlineTrack: { flexDirection: 'row', height: 2, backgroundColor: Colors.border },
  tabUnderlineSegment: { flex: 1, backgroundColor: 'transparent' },
  tabUnderlineActive: { backgroundColor: Colors.crimson },

  listContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textMuted, fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold, letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 0,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: Colors.border },

  card: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.sm, overflow: 'hidden',
    ...Shadows.sm,
  },
  cardRead: { opacity: 0.58 },
  unreadStripe: { height: 3, width: '100%' },
  cardInner: { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.base },

  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, marginRight: Spacing.md, flexShrink: 0,
  },
  avatarText: { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md, flexShrink: 0,
  },

  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, flex: 1 },
  cardTitleRead: { fontWeight: Typography.weight.medium, color: Colors.textSecondary },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.crimson, flexShrink: 0 },

  agentMini: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
  agentMiniText: { color: GOLD, fontSize: 10, fontWeight: Typography.weight.semiBold },

  cardTime: { color: Colors.textMuted, fontSize: 10, marginBottom: 4 },
  cardText: { color: Colors.textSecondary, fontSize: Typography.size.xs, lineHeight: 17 },
  cardTextRead: { color: Colors.textMuted },

  // Mini booking timeline
  miniTimeline: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 },
  miniTimelineItem: { flex: 1, alignItems: 'center', position: 'relative' },
  miniDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border, marginBottom: 4 },
  miniDotDone: { backgroundColor: Colors.successLight },
  miniDotActive: { backgroundColor: Colors.crimson, width: 10, height: 10, borderRadius: 5 },
  miniConnector: {
    position: 'absolute', top: 3, left: '50%', right: '-50%', height: 2, backgroundColor: Colors.border,
  },
  miniConnectorDone: { backgroundColor: Colors.successLight },
  miniLabel: { color: Colors.textMuted, fontSize: 8.5, textAlign: 'center' },
  miniLabelActive: { color: Colors.crimson, fontWeight: Typography.weight.bold },

  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.sm,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  actionBtnText: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold },

  emptyState: { alignItems: 'center', paddingVertical: 70, gap: Spacing.md },
  emptyTitle: { color: Colors.textSecondary, fontSize: Typography.size.base, fontWeight: Typography.weight.semiBold },
  emptySub: { color: Colors.textMuted, fontSize: Typography.size.sm, textAlign: 'center' },

  manageRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.xl, justifyContent: 'center',
  },
  manageText: { color: Colors.textMuted, fontSize: Typography.size.xs },
});

// ─── Live card styles ──────────────────────────────────────────────────────
const live = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg, borderWidth: 1.5,
    borderColor: 'rgba(139,0,0,0.35)', backgroundColor: Colors.surface2,
    marginBottom: Spacing.base, padding: Spacing.base, overflow: 'hidden',
    ...Shadows.crimson,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(139,0,0,0.18)', borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.4)',
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.crimson },
  liveText: { color: Colors.crimson, fontSize: 10, fontWeight: Typography.weight.heavy, letterSpacing: 1 },
  etaLabel: { flex: 1, color: Colors.textSecondary, fontSize: Typography.size.sm },
  etaTime: { color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  closeBtn: { padding: 4 },

  agentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(139,0,0,0.18)', borderWidth: 2, borderColor: Colors.crimson,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.crimson, fontSize: Typography.size.base, fontWeight: Typography.weight.heavy },
  agentName: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  rating: { color: Colors.textMuted, fontSize: Typography.size.xs },
  statusBadge: {
    backgroundColor: 'rgba(139,0,0,0.15)', borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.35)',
  },
  statusText: { color: Colors.crimson, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold },

  timeline: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.md,
  },
  timelineItem: { flex: 1, alignItems: 'center', position: 'relative' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border, marginBottom: 4 },
  timelineDotDone: { backgroundColor: Colors.successLight },
  timelineDotActive: { backgroundColor: Colors.crimson, width: 12, height: 12, borderRadius: 6 },
  timelineLine: {
    position: 'absolute', top: 4, left: '50%', right: '-50%', height: 2, backgroundColor: Colors.border,
  },
  timelineLineDone: { backgroundColor: Colors.successLight },
  timelineLabel: { color: Colors.textMuted, fontSize: 9, textAlign: 'center' },
  timelineLabelDone: { color: Colors.textSecondary },

  actions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(139,0,0,0.12)', borderWidth: 1, borderColor: 'rgba(139,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
});
