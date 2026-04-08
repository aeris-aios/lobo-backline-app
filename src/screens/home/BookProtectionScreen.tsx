import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';
import MapPlaceholder from '../../components/home/MapPlaceholder';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.32;

type ServiceId = 'armed_ep' | 'unarmed_ep' | 'blackline' | 'family_ep';
type ScheduleMode = 'now' | 'schedule';
type AttireId = 'suited' | 'plain_clothes' | 'tactical';

const SERVICES: {
  id: ServiceId; label: string; sub: string;
  icon: keyof typeof Ionicons.glyphMap; rate: number; color: string;
}[] = [
  { id: 'armed_ep',   label: 'Armed EP',   sub: '$250/hr', icon: 'shield-checkmark', rate: 250, color: Colors.crimson },
  { id: 'unarmed_ep', label: 'Unarmed EP', sub: '$175/hr', icon: 'person',           rate: 175, color: Colors.steel },
  { id: 'blackline',  label: 'Blackline',  sub: '$150/hr', icon: 'car-sport',        rate: 150, color: '#C9A84C' },
  { id: 'family_ep',  label: 'Family EP',  sub: '$200/hr', icon: 'people',           rate: 200, color: '#C9A84C' },
];

const ATTIRE: { id: AttireId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'suited',        label: 'Executive Suit', icon: 'briefcase-outline' },
  { id: 'plain_clothes', label: 'Plain Clothes',  icon: 'person-outline' },
  { id: 'tactical',      label: 'Tactical',       icon: 'shield-outline' },
];

const HOURS = ['1', '2', '3', '4', '6', '8', '12'];

const SAVED_LOCATIONS = [
  { id: 'home',        icon: 'home-outline' as const,              label: 'Home',         address: '4821 Westlake Dr, Dallas TX' },
  { id: 'office',      icon: 'business-outline' as const,          label: 'Office',        address: '2100 McKinney Ave, Dallas TX' },
  { id: 'four_seasons',icon: 'bed-outline' as const,               label: 'Four Seasons',  address: '2917 Maple Ave, Dallas TX' },
  { id: 'att',         icon: 'american-football-outline' as const,  label: 'AT&T Stadium',  address: 'One AT&T Way, Arlington TX' },
];

const RECENT_TRIPS = [
  { id: '1', service: 'Armed EP',   from: 'Four Seasons Hotel', to: 'Dallas Love Field',  date: 'Apr 5',  miles: '8.2',  rate: 250 },
  { id: '2', service: 'Blackline',  from: 'Home',               to: 'AT&T Stadium',        date: 'Apr 2',  miles: '22.4', rate: 150 },
  { id: '3', service: 'Unarmed EP', from: 'Office',             to: 'Ritz-Carlton Dallas', date: 'Mar 28', miles: '3.1',  rate: 175 },
];

export default function BookProtectionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [pickup, setPickup]           = useState('');
  const [destination, setDestination] = useState('');
  const [activeService, setActiveService] = useState<ServiceId>('armed_ep');
  const [scheduleMode, setScheduleMode]   = useState<ScheduleMode>('now');
  const [attire, setAttire]           = useState<AttireId>('suited');
  const [agentCount, setAgentCount]   = useState(1);
  const [hours, setHours]             = useState('4');
  const [activeTab, setActiveTab]     = useState<'saved' | 'recent'>('saved');

  const service      = SERVICES.find(s => s.id === activeService)!;
  const isReady      = pickup.length > 0 && destination.length > 0;
  const estMiles     = isReady ? '6.4' : null;
  const estTotal     = parseInt(hours) * service.rate * agentCount;

  const fillFromSaved = (loc: typeof SAVED_LOCATIONS[0]) => {
    if (!pickup) setPickup(loc.label);
    else setDestination(loc.label);
  };

  const fillFromRecent = (trip: typeof RECENT_TRIPS[0]) => {
    setPickup(trip.from);
    setDestination(trip.to);
    const svc = SERVICES.find(s => s.label === trip.service);
    if (svc) setActiveService(svc.id);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Protection</Text>
        <View style={styles.headerBadge}>
          <Ionicons name="shield" size={12} color={Colors.crimson} />
          <Text style={styles.headerBadgeText}>LOBO EP</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 140 }]}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {/* Map */}
        <View style={styles.mapWrap}>
          <MapPlaceholder style={{ height: MAP_HEIGHT }} />
          {isReady && (
            <View style={styles.routeOverlay}>
              <View style={styles.routePill}>
                <Ionicons name="navigate" size={12} color={Colors.crimson} />
                <Text style={styles.routePillText}>{estMiles} mi · {hours}h coverage</Text>
              </View>
            </View>
          )}
          <View style={styles.agentBadge}>
            <Ionicons name="person" size={11} color={Colors.crimson} />
            <Text style={styles.agentBadgeText}>{agentCount} Agent{agentCount > 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Location Inputs */}
        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.dotGreen} />
            <TextInput
              style={styles.locationInput}
              placeholder="Pickup location"
              placeholderTextColor={Colors.textMuted}
              value={pickup}
              onChangeText={setPickup}
              returnKeyType="next"
            />
            {pickup.length > 0
              ? <TouchableOpacity onPress={() => setPickup('')} activeOpacity={0.7}><Ionicons name="close-circle" size={18} color={Colors.steel} /></TouchableOpacity>
              : <TouchableOpacity activeOpacity={0.7}><Ionicons name="locate-outline" size={18} color={Colors.crimson} /></TouchableOpacity>
            }
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationRow}>
            <View style={styles.dotRed} />
            <TextInput
              style={styles.locationInput}
              placeholder="Where do you need coverage?"
              placeholderTextColor={Colors.textMuted}
              value={destination}
              onChangeText={setDestination}
              returnKeyType="done"
            />
            {destination.length > 0
              ? <TouchableOpacity onPress={() => setDestination('')} activeOpacity={0.7}><Ionicons name="close-circle" size={18} color={Colors.steel} /></TouchableOpacity>
              : <TouchableOpacity activeOpacity={0.7}><Ionicons name="search-outline" size={18} color={Colors.steel} /></TouchableOpacity>
            }
          </View>
        </View>

        {/* Now / Schedule */}
        <View style={styles.scheduleToggle}>
          {(['now', 'schedule'] as ScheduleMode[]).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[styles.toggleBtn, scheduleMode === mode && styles.toggleBtnActive]}
              onPress={() => {
                setScheduleMode(mode);
                if (mode === 'schedule') navigation.navigate('ScheduleProtection');
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={mode === 'now' ? 'flash' : 'calendar-outline'}
                size={15}
                color={scheduleMode === mode ? Colors.textPrimary : Colors.steel}
              />
              <Text style={[styles.toggleText, scheduleMode === mode && styles.toggleTextActive]}>
                {mode === 'now' ? 'Request Now' : 'Schedule Later'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Service Type — horizontal slide ── */}
        <SectionLabel icon="shield-outline" text="Service Type" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          style={styles.hScroll}
          contentContainerStyle={styles.hScrollContent}
        >
          {SERVICES.map(svc => {
            const active = activeService === svc.id;
            return (
              <TouchableOpacity
                key={svc.id}
                style={[styles.serviceCard, active && { borderColor: svc.color }]}
                onPress={() => setActiveService(svc.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={active ? [`${svc.color}22`, `${svc.color}08`] : ['#1C1C1C', '#161616']}
                  style={styles.serviceCardGrad}
                >
                  <View style={[styles.serviceIconWrap, active && { backgroundColor: `${svc.color}20`, borderColor: `${svc.color}40` }]}>
                    <Ionicons name={svc.icon} size={22} color={active ? svc.color : Colors.steel} />
                  </View>
                  <Text style={[styles.serviceCardLabel, active && { color: svc.color }]}>{svc.label}</Text>
                  <Text style={styles.serviceCardRate}>{svc.sub}</Text>
                  {active && (
                    <View style={[styles.serviceCheck, { backgroundColor: svc.color }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Coverage Duration — horizontal slide ── */}
        <SectionLabel icon="time-outline" text="Coverage Duration" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          style={styles.hScroll}
          contentContainerStyle={styles.hScrollContent}
        >
          {HOURS.map(h => (
            <TouchableOpacity
              key={h}
              style={[styles.hourChip, hours === h && styles.hourChipActive]}
              onPress={() => setHours(h)}
              activeOpacity={0.8}
            >
              <Text style={[styles.hourNum, hours === h && styles.hourNumActive]}>{h}</Text>
              <Text style={[styles.hourUnit, hours === h && styles.hourUnitActive]}>hr{parseInt(h) > 1 ? 's' : ''}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Agents + Attire ── */}
        <View style={styles.configRow}>
          {/* Stepper */}
          <View style={styles.configBox}>
            <Text style={styles.configBoxLabel}>Agents</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setAgentCount(c => Math.max(1, c - 1))} activeOpacity={0.7}>
                <Ionicons name="remove" size={18} color={agentCount === 1 ? Colors.surface3 : Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepCount}>{agentCount}</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setAgentCount(c => Math.min(6, c + 1))} activeOpacity={0.7}>
                <Ionicons name="add" size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Attire — horizontal slide */}
          <View style={[styles.configBox, { flex: 1.8 }]}>
            <Text style={styles.configBoxLabel}>Attire</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled decelerationRate="fast">
              <View style={styles.attireRow}>
                {ATTIRE.map(a => (
                  <TouchableOpacity
                    key={a.id}
                    style={[styles.attireChip, attire === a.id && styles.attireChipActive]}
                    onPress={() => setAttire(a.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={a.icon} size={13} color={attire === a.id ? Colors.textPrimary : Colors.steel} />
                    <Text style={[styles.attireText, attire === a.id && styles.attireTextActive]}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* ── Saved / Past Trips tabs ── */}
        <View style={styles.tabToggle}>
          {(['saved', 'recent'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab === 'saved' ? 'bookmark-outline' : 'time-outline'}
                size={14}
                color={activeTab === tab ? Colors.textPrimary : Colors.steel}
              />
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                {tab === 'saved' ? 'Saved Places' : 'Past Trips'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'saved' ? (
          <View style={styles.listCard}>
            {SAVED_LOCATIONS.map((loc, i) => (
              <React.Fragment key={loc.id}>
                {i > 0 && <View style={styles.listDivider} />}
                <TouchableOpacity style={styles.listRow} onPress={() => fillFromSaved(loc)} activeOpacity={0.7}>
                  <View style={styles.listIcon}>
                    <Ionicons name={loc.icon} size={16} color={Colors.steel} />
                  </View>
                  <View style={styles.listText}>
                    <Text style={styles.listLabel}>{loc.label}</Text>
                    <Text style={styles.listSub} numberOfLines={1}>{loc.address}</Text>
                  </View>
                  <View style={styles.addPill}>
                    <Ionicons name="add" size={14} color={Colors.textMuted} />
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View style={styles.listCard}>
            {RECENT_TRIPS.map((trip, i) => (
              <React.Fragment key={trip.id}>
                {i > 0 && <View style={styles.listDivider} />}
                <TouchableOpacity style={styles.listRow} onPress={() => fillFromRecent(trip)} activeOpacity={0.7}>
                  <View style={styles.listIconRed}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={Colors.crimson} />
                  </View>
                  <View style={styles.listText}>
                    <View style={styles.recentHead}>
                      <Text style={styles.listLabel}>{trip.service}</Text>
                      <Text style={styles.milesTag}>{trip.miles} mi</Text>
                    </View>
                    <Text style={styles.listSub} numberOfLines={1}>{trip.from} → {trip.to}</Text>
                    <Text style={styles.listMeta}>{trip.date} · ${trip.rate}/hr</Text>
                  </View>
                  <TouchableOpacity style={styles.rebookPill} onPress={() => fillFromRecent(trip)} activeOpacity={0.8}>
                    <Text style={styles.rebookText}>Rebook</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        )}

        {/* ── Quote Summary — always visible ── */}
        <LinearGradient colors={['#1C0000', '#0E0E0E']} style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <View style={styles.quoteHeaderLeft}>
              <Ionicons name="navigate-circle-outline" size={18} color={Colors.crimson} />
              <View>
                <Text style={styles.quoteHeaderLabel}>Route Summary</Text>
                {isReady
                  ? <Text style={styles.quoteRoute} numberOfLines={1}>{pickup} → {destination}</Text>
                  : <Text style={styles.quoteRoutePlaceholder}>Enter locations above</Text>
                }
              </View>
            </View>
            {estMiles && (
              <View style={styles.milesBadge}>
                <Text style={styles.milesText}>{estMiles} mi</Text>
              </View>
            )}
          </View>

          <View style={styles.quoteDivider} />

          <View style={styles.quoteRows}>
            {[
              { label: 'Service',  value: service.label },
              { label: 'Duration', value: `${hours} hour${parseInt(hours) > 1 ? 's' : ''}` },
              { label: 'Agents',   value: `${agentCount}` },
              { label: 'Attire',   value: ATTIRE.find(a => a.id === attire)?.label ?? '' },
              { label: 'Rate',     value: `$${service.rate}/hr per agent` },
            ].map(row => (
              <View key={row.label} style={styles.quoteRow}>
                <Text style={styles.quoteRowLabel}>{row.label}</Text>
                <Text style={styles.quoteRowValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.quoteTotalRow}>
            <Text style={styles.quoteTotalLabel}>Estimated Total</Text>
            <Text style={styles.quoteTotalValue}>${estTotal.toLocaleString()}</Text>
          </View>
        </LinearGradient>

        {/* ── Safety Note ── */}
        <View style={styles.safetyNote}>
          <Ionicons name="checkmark-shield-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.safetyText}>
            A LOBO coordinator confirms your detail within 15 min. All agents are FBI-cleared, licensed, and professionally trained.
          </Text>
        </View>

        {/* ── Inline Request Now Button ── */}
        <TouchableOpacity style={styles.inlineRequestBtn} activeOpacity={0.88}>
          <LinearGradient
            colors={isReady ? [Colors.crimsonDark, Colors.crimson] : ['#2A2A2A', '#222222']}
            style={styles.inlineRequestGrad}
          >
            <Ionicons name="shield-checkmark" size={22} color={isReady ? Colors.white : Colors.steel} />
            <View style={styles.inlineRequestText}>
              <Text style={[styles.inlineRequestTitle, !isReady && { color: Colors.steel }]}>
                {isReady ? `Request ${service.label}` : 'Request Now'}
              </Text>
              <Text style={styles.inlineRequestSub}>
                {isReady
                  ? `$${estTotal.toLocaleString()} est. · ${hours}h · ${agentCount} agent${agentCount > 1 ? 's' : ''}`
                  : 'Add pickup & destination to confirm'}
              </Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={26} color={isReady ? Colors.white : Colors.steel} />
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      {/* ── Sticky Bottom CTA ── */}
      <View style={[styles.stickyBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <View style={styles.stickyLeft}>
          <Text style={styles.stickyPrice}>${estTotal.toLocaleString()}</Text>
          <Text style={styles.stickyMeta}>{service.label} · {hours}h · {agentCount} agent{agentCount > 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={styles.stickyBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={isReady ? [Colors.crimsonDark, Colors.crimson] : ['#333', '#2A2A2A']}
            style={styles.stickyBtnGrad}
          >
            <Ionicons name="shield" size={16} color={isReady ? Colors.white : Colors.steel} />
            <Text style={[styles.stickyBtnText, !isReady && { color: Colors.steel }]}>Request Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}

function SectionLabel({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={slStyles.row}>
      <Ionicons name={icon} size={13} color={Colors.textMuted} />
      <Text style={slStyles.text}>{text}</Text>
    </View>
  );
}
const slStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  text: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold, letterSpacing: 1.4, textTransform: 'uppercase' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy, letterSpacing: 0.5 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(139,0,0,0.12)', borderWidth: 1, borderColor: Colors.crimsonDark,
    borderRadius: BorderRadius.sm, paddingHorizontal: 10, paddingVertical: 4,
  },
  headerBadgeText: { color: Colors.crimsonLight, fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },

  scroll: { paddingHorizontal: Spacing.base },

  // Map
  mapWrap: { marginHorizontal: -Spacing.base, position: 'relative' },
  routeOverlay: { position: 'absolute', bottom: Spacing.sm, left: 0, right: 0, alignItems: 'center' },
  routePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.4)',
  },
  routePillText: { color: Colors.textPrimary, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  agentBadge: {
    position: 'absolute', top: Spacing.md, right: Spacing.base,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.border,
  },
  agentBadgeText: { color: Colors.textPrimary, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold },

  // Location
  locationCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    marginTop: Spacing.base, overflow: 'hidden', ...Shadows.sm,
  },
  locationRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: 13, gap: Spacing.sm,
  },
  locationDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.base },
  dotGreen: { width: 11, height: 11, borderRadius: 6, backgroundColor: Colors.successLight },
  dotRed: { width: 11, height: 11, borderRadius: 6, backgroundColor: Colors.crimson },
  locationInput: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base, paddingVertical: 0 },

  // Schedule toggle
  scheduleToggle: {
    flexDirection: 'row', backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.md, padding: 3,
    marginTop: Spacing.base, borderWidth: 1, borderColor: Colors.border,
  },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 10, borderRadius: BorderRadius.sm,
  },
  toggleBtnActive: { backgroundColor: Colors.surface3 },
  toggleText: { color: Colors.steel, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  toggleTextActive: { color: Colors.textPrimary },

  // Horizontal scroll shared
  hScroll: { marginHorizontal: -Spacing.base },
  hScrollContent: { paddingHorizontal: Spacing.base, gap: Spacing.sm, paddingRight: Spacing.xl },

  // Service cards
  serviceCard: {
    width: 110, borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.border, overflow: 'hidden',
  },
  serviceCardGrad: { padding: Spacing.md, gap: 6, minHeight: 100, justifyContent: 'center' },
  serviceIconWrap: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  serviceCardLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  serviceCardRate: { color: Colors.textMuted, fontSize: 11 },
  serviceCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },

  // Hour chips
  hourChip: {
    width: 62, height: 56, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  hourChipActive: { backgroundColor: 'rgba(139,0,0,0.15)', borderColor: Colors.crimson },
  hourNum: { color: Colors.steel, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold, lineHeight: 22 },
  hourNumActive: { color: Colors.crimsonLight },
  hourUnit: { color: Colors.textMuted, fontSize: 10 },
  hourUnitActive: { color: Colors.crimson },

  // Config row
  configRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  configBox: {
    flex: 1, backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm,
  },
  configBoxLabel: {
    color: Colors.textMuted, fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold, letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  stepCount: {
    color: Colors.textPrimary, fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold, minWidth: 26, textAlign: 'center',
  },
  attireRow: { flexDirection: 'row', gap: 7 },
  attireChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface3, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 10, paddingVertical: 7,
  },
  attireChipActive: { borderColor: Colors.textPrimary, backgroundColor: 'rgba(255,255,255,0.08)' },
  attireText: { color: Colors.steel, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  attireTextActive: { color: Colors.textPrimary },

  // Tab toggle
  tabToggle: {
    flexDirection: 'row', marginTop: Spacing.xl,
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    padding: 3, borderWidth: 1, borderColor: Colors.border,
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: BorderRadius.sm,
  },
  tabBtnActive: { backgroundColor: Colors.surface3 },
  tabBtnText: { color: Colors.steel, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  tabBtnTextActive: { color: Colors.textPrimary },

  // List card
  listCard: {
    marginTop: Spacing.sm, backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  listDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
  listRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  listIcon: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.surface3,
    alignItems: 'center', justifyContent: 'center',
  },
  listIconRed: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(139,0,0,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  listText: { flex: 1 },
  listLabel: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold },
  listSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  listMeta: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 1 },
  recentHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  milesTag: { color: Colors.textMuted, fontSize: Typography.size.xs },
  addPill: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surface3,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  rebookPill: {
    backgroundColor: 'rgba(139,0,0,0.12)', borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.crimsonDark,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  rebookText: { color: Colors.crimsonLight, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold },

  // Quote card
  quoteCard: {
    borderRadius: BorderRadius.lg, padding: Spacing.base,
    marginTop: Spacing.lg, borderWidth: 1, borderColor: 'rgba(139,0,0,0.2)',
  },
  quoteHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md },
  quoteHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  quoteHeaderLabel: { color: Colors.textMuted, fontSize: Typography.size.xs, marginBottom: 2 },
  quoteRoute: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  quoteRoutePlaceholder: { color: Colors.textMuted, fontSize: Typography.size.sm, fontStyle: 'italic' },
  milesBadge: {
    backgroundColor: 'rgba(139,0,0,0.15)', borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4,
  },
  milesText: { color: Colors.crimsonLight, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  quoteDivider: { height: 1, backgroundColor: 'rgba(139,0,0,0.15)', marginVertical: Spacing.md },
  quoteRows: { gap: 9 },
  quoteRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quoteRowLabel: { color: Colors.textMuted, fontSize: Typography.size.sm },
  quoteRowValue: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  quoteTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing.sm, paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(139,0,0,0.2)',
  },
  quoteTotalLabel: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  quoteTotalValue: { color: Colors.crimsonLight, fontSize: Typography.size.xl, fontWeight: Typography.weight.bold },

  // Safety note
  safetyNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginTop: Spacing.lg,
  },
  safetyText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },

  // Inline Request Now button (at bottom of scroll)
  inlineRequestBtn: {
    borderRadius: BorderRadius.xl, overflow: 'hidden',
    marginTop: Spacing.lg,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.35)',
    ...Shadows.crimson,
  },
  inlineRequestGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.base, gap: Spacing.md,
  },
  inlineRequestText: { flex: 1 },
  inlineRequestTitle: { color: Colors.white, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  inlineRequestSub: { color: 'rgba(255,255,255,0.55)', fontSize: Typography.size.xs, marginTop: 2 },

  // Sticky bottom bar
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.base,
    ...Shadows.lg,
  },
  stickyLeft: { flex: 1 },
  stickyPrice: { color: Colors.textPrimary, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  stickyMeta: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 1 },
  stickyBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  stickyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl,
  },
  stickyBtnText: { color: Colors.white, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
});
