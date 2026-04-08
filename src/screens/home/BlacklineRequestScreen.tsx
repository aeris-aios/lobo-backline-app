import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type VehicleType = 'sedan' | 'suv' | 'luxury';
type AgentArmed  = 'armed' | 'unarmed';
type AgentAttire = 'plain_clothes' | 'suited';
type TripPurpose = 'pickup' | 'event' | 'airport' | 'escort' | 'international';

interface Vehicle {
  id: VehicleType;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  seats: string;
  color: string;
}

interface Purpose {
  id: TripPurpose;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────
const VEHICLES: Vehicle[] = [
  {
    id: 'sedan',
    label: 'Sedan',
    subtitle: 'Discreet transport',
    icon: 'car-outline',
    seats: 'Up to 3',
    color: '#4A90D9',
  },
  {
    id: 'suv',
    label: 'SUV',
    subtitle: 'Group movement',
    icon: 'car-sport-outline',
    seats: 'Up to 6',
    color: '#7ED321',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    subtitle: 'Executive class',
    icon: 'diamond-outline',
    seats: 'Up to 4',
    color: Colors.blacklineAccent,
  },
];

const PURPOSES: Purpose[] = [
  {
    id: 'pickup',
    label: 'Point-to-Point',
    icon: 'navigate-outline',
    description: 'Standard secure pickup & drop-off',
  },
  {
    id: 'airport',
    label: 'Airport Transfer',
    icon: 'airplane-outline',
    description: 'Flight-tracked arrivals & departures',
  },
  {
    id: 'event',
    label: 'Event Coverage',
    icon: 'flag-outline',
    description: 'Venue arrival, wait & return',
  },
  {
    id: 'escort',
    label: 'Extended Escort',
    icon: 'shield-outline',
    description: 'Full-day or multi-stop movement',
  },
  {
    id: 'international',
    label: 'International Travel',
    icon: 'globe-outline',
    description: 'Cross-border escort & coordination',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function BlacklineRequestScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [vehicle, setVehicle]       = useState<VehicleType>('suv');
  const [armed, setArmed]           = useState<AgentArmed>('unarmed');
  const [attire, setAttire]         = useState<AgentAttire>('plain_clothes');
  const [purpose, setPurpose]       = useState<TripPurpose>('pickup');
  const [occupants, setOccupants]   = useState(1);
  const [pickup, setPickup]         = useState('');
  const [destination, setDestination] = useState('');
  const [international, setInternational] = useState(false);

  const selectedVehicle = VEHICLES.find(v => v.id === vehicle)!;
  const isInternational = purpose === 'international';

  const estimatedRate = () => {
    let base = vehicle === 'luxury' ? 250 : vehicle === 'suv' ? 175 : 125;
    if (armed === 'armed') base += 150;
    if (isInternational) base += 500;
    return base;
  };

  const handleBook = () => {
    if (!pickup || !destination) {
      Alert.alert('Missing Information', 'Please enter both a pickup location and destination.');
      return;
    }
    Alert.alert(
      'Blackline Request Submitted',
      `Your ${selectedVehicle.label} has been requested.\nEstimated rate: $${estimatedRate()}/hr\n\nA coordinator will confirm within 5 minutes.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>BLACKLINE</Text>
          <Text style={styles.headerSub}>Premium Transport Service</Text>
        </View>
        <View style={styles.blacklineDot} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >

        {/* ── Locations ── */}
        <SectionLabel icon="location-outline" title="Route" />
        <View style={styles.locationCard}>
          <TouchableOpacity
            style={styles.locationRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('LocationPicker', {
              field: 'pickup',
              onSelect: (loc: { name: string; address: string }) => setPickup(loc.name || loc.address),
            })}
          >
            <View style={styles.dotGreen} />
            <Text style={pickup ? styles.locationText : styles.locationPlaceholder} numberOfLines={1}>
              {pickup || 'Pickup location'}
            </Text>
            <Ionicons name="locate-outline" size={16} color={Colors.steel} />
          </TouchableOpacity>

          <View style={styles.locationDivider} />

          <TouchableOpacity
            style={styles.locationRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('LocationPicker', {
              field: 'destination',
              onSelect: (loc: { name: string; address: string }) => setDestination(loc.name || loc.address),
            })}
          >
            <View style={styles.dotSilver} />
            <Text style={destination ? styles.locationText : styles.locationPlaceholder} numberOfLines={1}>
              {destination || 'Destination'}
            </Text>
            <Ionicons name="search-outline" size={16} color={Colors.steel} />
          </TouchableOpacity>
        </View>

        {/* ── Vehicle Type ── */}
        <SectionLabel icon="car-sport-outline" title="Vehicle Type" />
        <View style={styles.vehicleGrid}>
          {VEHICLES.map(v => (
            <TouchableOpacity
              key={v.id}
              style={[styles.vehicleCard, vehicle === v.id && styles.vehicleCardActive]}
              onPress={() => setVehicle(v.id)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={vehicle === v.id ? ['#1A1A2E', '#0D0D1A'] : ['#1C1C1C', '#161616']}
                style={styles.vehicleGradient}
              >
                <View style={[styles.vehicleIconWrap, { backgroundColor: `${v.color}22` }]}>
                  <Ionicons name={v.icon} size={26} color={vehicle === v.id ? v.color : Colors.steel} />
                </View>
                <Text style={[styles.vehicleLabel, vehicle === v.id && { color: Colors.white }]}>{v.label}</Text>
                <Text style={styles.vehicleSub}>{v.subtitle}</Text>
                <View style={styles.vehicleSeats}>
                  <Ionicons name="people-outline" size={11} color={Colors.textMuted} />
                  <Text style={styles.vehicleSeatsText}>{v.seats}</Text>
                </View>
                {vehicle === v.id && (
                  <View style={styles.vehicleCheck}>
                    <Ionicons name="checkmark-circle" size={16} color={v.color} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Agent Configuration ── */}
        <SectionLabel icon="person-outline" title="Agent Configuration" />
        <View style={styles.sectionCard}>

          {/* Armed / Unarmed */}
          <View style={styles.configRow}>
            <View style={styles.configLeft}>
              <View style={styles.configIconWrap}>
                <Ionicons name="shield-outline" size={18} color={Colors.steel} />
              </View>
              <View>
                <Text style={styles.configLabel}>Protection Level</Text>
                <Text style={styles.configSub}>Agent carry status</Text>
              </View>
            </View>
            <View style={styles.togglePill}>
              {(['unarmed', 'armed'] as AgentArmed[]).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pillOption, armed === opt && styles.pillOptionActive]}
                  onPress={() => setArmed(opt)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, armed === opt && styles.pillTextActive]}>
                    {opt === 'armed' ? 'Armed' : 'Unarmed'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Attire */}
          <View style={styles.configRow}>
            <View style={styles.configLeft}>
              <View style={styles.configIconWrap}>
                <Ionicons name="shirt-outline" size={18} color={Colors.steel} />
              </View>
              <View>
                <Text style={styles.configLabel}>Agent Attire</Text>
                <Text style={styles.configSub}>Visible presence level</Text>
              </View>
            </View>
            <View style={styles.togglePill}>
              {(['plain_clothes', 'suited'] as AgentAttire[]).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pillOption, attire === opt && styles.pillOptionActive]}
                  onPress={() => setAttire(opt)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, attire === opt && styles.pillTextActive]}>
                    {opt === 'suited' ? 'Suited' : 'Plain Clothes'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Occupants */}
          <View style={styles.configRow}>
            <View style={styles.configLeft}>
              <View style={styles.configIconWrap}>
                <Ionicons name="people-outline" size={18} color={Colors.steel} />
              </View>
              <View>
                <Text style={styles.configLabel}>Occupants</Text>
                <Text style={styles.configSub}>
                  Max {vehicle === 'suv' ? 6 : vehicle === 'luxury' ? 4 : 3} for {selectedVehicle.label}
                </Text>
              </View>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepperBtn, occupants <= 1 && styles.stepperBtnDisabled]}
                onPress={() => setOccupants(o => Math.max(1, o - 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color={occupants <= 1 ? Colors.textMuted : Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{occupants}</Text>
              <TouchableOpacity
                style={[styles.stepperBtn, occupants >= (vehicle === 'suv' ? 6 : vehicle === 'luxury' ? 4 : 3) && styles.stepperBtnDisabled]}
                onPress={() => setOccupants(o => Math.min(vehicle === 'suv' ? 6 : vehicle === 'luxury' ? 4 : 3, o + 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Purpose ── */}
        <SectionLabel icon="flag-outline" title="Trip Purpose" />
        <View style={styles.purposeGrid}>
          {PURPOSES.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.purposeCard, purpose === p.id && styles.purposeCardActive]}
              onPress={() => {
                setPurpose(p.id);
                if (p.id === 'international') setInternational(true);
                else setInternational(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={p.icon}
                size={22}
                color={purpose === p.id ? Colors.blacklineAccent : Colors.steel}
              />
              <Text style={[styles.purposeLabel, purpose === p.id && styles.purposeLabelActive]}>
                {p.label}
              </Text>
              <Text style={styles.purposeDesc} numberOfLines={2}>{p.description}</Text>
              {purpose === p.id && <View style={styles.purposeActiveDot} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── International Notice ── */}
        {isInternational && (
          <View style={styles.intlBanner}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.blacklineAccent} />
            <Text style={styles.intlBannerText}>
              International escort service includes pre-departure security briefing, border coordination, and in-country agent linkup. A coordinator will contact you within 30 minutes to discuss logistics.
            </Text>
          </View>
        )}

        {/* ── Rate Estimate ── */}
        <View style={styles.rateCard}>
          <LinearGradient colors={['#1A1A2E', '#0D0D1A']} style={styles.rateGradient}>
            <View style={styles.rateLeft}>
              <Text style={styles.rateLabel}>Estimated Rate</Text>
              <Text style={styles.rateSub}>
                {selectedVehicle.label} · {armed === 'armed' ? 'Armed' : 'Unarmed'} · {attire === 'suited' ? 'Suited' : 'Plain Clothes'}
              </Text>
            </View>
            <View style={styles.rateRight}>
              <Text style={styles.rateAmount}>${estimatedRate()}</Text>
              <Text style={styles.rateUnit}>/hr</Text>
            </View>
          </LinearGradient>
        </View>

      </ScrollView>

      {/* ── Book CTA ── */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleBook} activeOpacity={0.85}>
          <LinearGradient colors={['#1A1A2E', '#0A0A1A']} style={styles.ctaGradient}>
            <Ionicons name="car-sport" size={20} color={Colors.blacklineAccent} />
            <Text style={styles.ctaText}>Request Blackline</Text>
            <View style={styles.ctaBadge}>
              <Text style={styles.ctaBadgeText}>${estimatedRate()}/hr</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section label helper
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={sectionLabelStyles.row}>
      <Ionicons name={icon} size={13} color={Colors.textMuted} />
      <Text style={sectionLabelStyles.text}>{title}</Text>
    </View>
  );
}
const sectionLabelStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.xl, marginBottom: Spacing.sm, paddingHorizontal: 2 },
  text: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold, letterSpacing: 1.5, textTransform: 'uppercase' },
});

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    color: Colors.blacklineAccent,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.heavy,
    letterSpacing: 3,
  },
  headerSub: { color: Colors.textMuted, fontSize: Typography.size.xs, letterSpacing: 0.5 },
  blacklineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.blacklineAccent,
    marginLeft: 'auto',
  },

  scroll: { paddingHorizontal: Spacing.base },

  // Location card
  locationCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  locationDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 44 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50' },
  dotSilver: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.blacklineAccent },
  locationText: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base },
  locationPlaceholder: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.base },

  // Vehicle cards
  vehicleGrid: { flexDirection: 'row', gap: Spacing.sm },
  vehicleCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  vehicleCardActive: { borderColor: Colors.blacklineAccent },
  vehicleGradient: { padding: Spacing.md, alignItems: 'center', gap: 4, minHeight: 130 },
  vehicleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  vehicleLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold, textAlign: 'center' },
  vehicleSub: { color: Colors.textMuted, fontSize: 10, textAlign: 'center' },
  vehicleSeats: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  vehicleSeatsText: { color: Colors.textMuted, fontSize: 10 },
  vehicleCheck: { position: 'absolute', top: 8, right: 8 },

  // Section card
  sectionCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  configLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  configIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  configLabel: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  configSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },

  // Toggle pill
  togglePill: {
    flexDirection: 'row',
    backgroundColor: Colors.surface3,
    borderRadius: BorderRadius.full,
    padding: 3,
    gap: 2,
  },
  pillOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  pillOptionActive: { backgroundColor: Colors.blacklineDark, borderWidth: 1, borderColor: Colors.blacklineAccent },
  pillText: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  pillTextActive: { color: Colors.blacklineAccent },

  // Stepper
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface3,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: { opacity: 0.35 },
  stepperValue: { color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.semiBold, minWidth: 24, textAlign: 'center' },

  // Purpose grid
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  purposeCard: {
    width: '47%',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 4,
    position: 'relative',
  },
  purposeCardActive: { borderColor: Colors.blacklineAccent, backgroundColor: '#1A1A2E' },
  purposeLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold, marginTop: 4 },
  purposeLabelActive: { color: Colors.blacklineAccent },
  purposeDesc: { color: Colors.textMuted, fontSize: 11, lineHeight: 15 },
  purposeActiveDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.blacklineAccent,
  },

  // International banner
  intlBanner: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: 'rgba(192,192,192,0.08)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.2)',
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  intlBannerText: { flex: 1, color: Colors.textSecondary, fontSize: Typography.size.xs, lineHeight: 18 },

  // Rate card
  rateCard: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.2)',
  },
  rateGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.base },
  rateLeft: {},
  rateLabel: { color: Colors.blacklineAccent, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold, letterSpacing: 1 },
  rateSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 3 },
  rateRight: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  rateAmount: { color: Colors.white, fontSize: Typography.size['2xl'], fontWeight: Typography.weight.heavy },
  rateUnit: { color: Colors.textMuted, fontSize: Typography.size.sm, marginBottom: 4 },

  // CTA
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  ctaBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(192,192,192,0.25)' },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  ctaText: { color: Colors.blacklineAccent, fontSize: Typography.size.base, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },
  ctaBadge: {
    backgroundColor: 'rgba(192,192,192,0.15)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: Spacing.sm,
  },
  ctaBadgeText: { color: Colors.blacklineAccent, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold },
});
