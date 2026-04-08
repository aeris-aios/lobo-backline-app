import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';
import { Booking, BookingStatus } from '../../types';

type TabFilter = 'upcoming' | 'active' | 'completed';

const TAB_LABELS: { key: TabFilter; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Past' },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: Colors.warning, bg: '#3E2000' },
  confirmed: { label: 'Confirmed', color: Colors.successLight, bg: '#1B4D1E' },
  agent_assigned: { label: 'Agent Assigned', color: Colors.successLight, bg: '#1B4D1E' },
  en_route: { label: 'En Route', color: Colors.blacklineAccent, bg: '#1E1E2E' },
  active: { label: 'Active', color: Colors.crimsonLight, bg: Colors.crimsonDark },
  completed: { label: 'Completed', color: Colors.steel, bg: Colors.gunmetal },
  cancelled: { label: 'Cancelled', color: Colors.error, bg: '#1C0A0A' },
};

const MOCK_BOOKINGS: (Booking & { _filter: TabFilter })[] = [
  {
    id: 'bk_001',
    userId: 'u1',
    serviceType: 'armed_executive',
    status: 'confirmed',
    pickup: { address: 'Four Seasons Hotel, Dallas', city: 'Dallas', state: 'TX', coordinates: { latitude: 32.79, longitude: -96.80 } },
    destination: { address: 'Dallas Love Field Airport', city: 'Dallas', state: 'TX', coordinates: { latitude: 32.84, longitude: -96.85 } },
    scheduledAt: '2026-04-10T08:00:00Z',
    isNow: false,
    armedStatus: 'armed',
    attireType: 'suit_executive',
    detailSize: 'single_agent',
    vehicleClass: 'suv',
    estimatedCost: 375,
    paymentMethodId: 'pm_001',
    paymentStatus: 'authorized',
    createdAt: '2026-04-07T10:00:00Z',
    updatedAt: '2026-04-07T10:00:00Z',
    _filter: 'upcoming',
  },
  {
    id: 'bk_002',
    userId: 'u1',
    serviceType: 'blackline_transport',
    status: 'completed',
    pickup: { address: '1234 Main St, Dallas', city: 'Dallas', state: 'TX', coordinates: { latitude: 32.78, longitude: -96.79 } },
    destination: { address: 'AT&T Stadium, Arlington', city: 'Arlington', state: 'TX', coordinates: { latitude: 32.74, longitude: -97.09 } },
    scheduledAt: '2026-04-02T18:00:00Z',
    isNow: false,
    armedStatus: 'unarmed',
    attireType: 'suit_executive',
    detailSize: 'single_agent',
    vehicleClass: 'blackline',
    estimatedCost: 220,
    actualCost: 215,
    paymentMethodId: 'pm_001',
    paymentStatus: 'captured',
    createdAt: '2026-04-02T17:00:00Z',
    updatedAt: '2026-04-02T21:00:00Z',
    completedAt: '2026-04-02T21:00:00Z',
    _filter: 'completed',
  },
];

const SERVICE_LABELS: Record<string, string> = {
  blackline_transport: 'Blackline Transport',
  armed_executive: 'Armed Executive Protection',
  unarmed_executive: 'Unarmed Executive Protection',
  school_family_escort: 'Family Escort',
  event_security: 'Event Security',
  corporate_vip: 'Corporate VIP',
};

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabFilter>('upcoming');

  const filtered = MOCK_BOOKINGS.filter((b) => b._filter === activeTab);

  const renderItem = ({ item }: { item: typeof MOCK_BOOKINGS[0] }) => {
    const status = STATUS_CONFIG[item.status];
    const date = new Date(item.scheduledAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const time = new Date(item.scheduledAt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('TripDetail', { bookingId: item.id })}
      >
        <View style={styles.cardTop}>
          <View style={styles.serviceRow}>
            <View style={styles.serviceIcon}>
              <Ionicons name="shield-outline" size={18} color={Colors.crimson} />
            </View>
            <View style={styles.serviceMeta}>
              <Text style={styles.serviceLabel}>{SERVICE_LABELS[item.serviceType]}</Text>
              <Text style={styles.dateText}>{date} · {time}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.routeSection}>
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: Colors.successLight }]} />
            <Text style={styles.routeText} numberOfLines={1}>{item.pickup.address}</Text>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: Colors.crimson }]} />
            <Text style={styles.routeText} numberOfLines={1}>{item.destination.address}</Text>
          </View>
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.costText}>${item.actualCost ?? item.estimatedCost}</Text>
          <View style={styles.armedBadge}>
            <Ionicons
              name={item.armedStatus === 'armed' ? 'shield-checkmark-outline' : 'shield-outline'}
              size={12}
              color={Colors.steel}
            />
            <Text style={styles.armedText}>{item.armedStatus === 'armed' ? 'Armed' : 'Unarmed'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabs}>
        {TAB_LABELS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No bookings</Text>
            <Text style={styles.emptyBody}>Your {activeTab} bookings will appear here.</Text>
          </View>
        }
      />
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
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  tabActive: { backgroundColor: Colors.surface2 },
  tabText: { color: Colors.textMuted, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  tabTextActive: { color: Colors.textPrimary },
  list: { padding: Spacing.base, gap: Spacing.md },

  card: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(139,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceMeta: { flex: 1 },
  serviceLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
  },
  dateText: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusText: { fontSize: 10, fontWeight: Typography.weight.semiBold, letterSpacing: 0.5 },

  routeSection: { marginBottom: Spacing.md },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeConnector: { width: 1, height: 12, backgroundColor: Colors.border, marginLeft: 4, marginVertical: 2 },
  routeText: { color: Colors.textSecondary, fontSize: Typography.size.sm, flex: 1 },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  costText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    flex: 1,
  },
  armedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  armedText: { color: Colors.steel, fontSize: Typography.size.xs },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: Spacing.md },
  emptyTitle: { color: Colors.textSecondary, fontSize: Typography.size.lg, fontWeight: Typography.weight.semiBold },
  emptyBody: { color: Colors.textMuted, fontSize: Typography.size.sm, textAlign: 'center' },
});
