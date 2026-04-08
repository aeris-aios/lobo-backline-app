import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
const VEHICLES = [
  {
    id: 'sedan',
    label: 'Sedan',
    icon: 'car-outline' as const,
    color: '#4A90D9',
    seats: '1–3 occupants',
    baseRate: '$125',
    desc: 'Low-profile executive sedans for discreet, efficient point-to-point movement.',
    examples: 'Mercedes E-Class · BMW 5 Series · Cadillac CT5',
  },
  {
    id: 'suv',
    label: 'SUV',
    icon: 'car-sport-outline' as const,
    color: '#7ED321',
    seats: '1–6 occupants',
    baseRate: '$175',
    desc: 'Commanding SUVs for group movement, event coverage, or elevated visibility.',
    examples: 'Cadillac Escalade · Lincoln Navigator · Suburban',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    icon: 'diamond-outline' as const,
    color: Colors.blacklineAccent,
    seats: '1–4 occupants',
    baseRate: '$250',
    desc: 'Top-tier executive vehicles for VIP principals requiring premium comfort.',
    examples: 'Mercedes S-Class · BMW 7 Series · Genesis G90',
  },
];

const PROTECTION_OPTIONS = [
  {
    id: 'unarmed',
    label: 'Unarmed Driver',
    icon: 'person-outline' as const,
    color: '#4A90D9',
    addOn: 'Included',
    points: [
      'Defensive driving certified',
      'Route surveillance & countersurveillance',
      'Low-profile, plain clothes or suited',
      'Vehicle sweep prior to movement',
    ],
  },
  {
    id: 'armed',
    label: 'Armed Driver',
    icon: 'shield-checkmark-outline' as const,
    color: Colors.crimsonLight,
    addOn: '+$150/hr',
    points: [
      'All unarmed capabilities included',
      'Licensed armed operator (LTC/LEOSA)',
      'Lethal & non-lethal equipped',
      'Active threat response trained',
    ],
  },
];

const RATE_FACTORS = [
  { icon: 'location-outline' as const, label: 'Location', desc: 'Rates vary by metro area and local market conditions.' },
  { icon: 'navigate-outline' as const, label: 'Distance', desc: 'Per-mile rate applies beyond the base hourly window.' },
  { icon: 'car-sport-outline' as const, label: 'Vehicle Class', desc: 'Sedan, SUV, and Luxury tiers carry different base rates.' },
  { icon: 'people-outline' as const, label: 'Occupants', desc: 'Larger groups may require additional vehicle or agent.' },
  { icon: 'time-outline' as const, label: 'Duration', desc: 'Multi-hour and full-day bookings qualify for reduced rates.' },
  { icon: 'globe-outline' as const, label: 'International', desc: 'Cross-border assignments include coordination surcharge.' },
];

const SERVICES_OFFERED = [
  { icon: 'navigate-outline' as const, label: 'Point-to-Point Transfer' },
  { icon: 'airplane-outline' as const, label: 'Airport Arrivals & Departures' },
  { icon: 'flag-outline' as const, label: 'Event & Venue Coverage' },
  { icon: 'shield-outline' as const, label: 'Extended Executive Escort' },
  { icon: 'globe-outline' as const, label: 'International Travel Coordination' },
  { icon: 'business-outline' as const, label: 'Corporate Movement Detail' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function BlacklineOverviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>('suv');
  const [selectedProtection, setSelectedProtection] = useState<'unarmed' | 'armed'>('unarmed');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>BLACKLINE</Text>
          <Text style={styles.headerSub}>Premium Transport Division</Text>
        </View>
        <View style={styles.silverBar} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >

        {/* ── Hero ── */}
        <LinearGradient colors={['#1A1A2E', '#0A0A1A', Colors.background]} style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="car-sport" size={36} color={Colors.blacklineAccent} />
          </View>
          <Text style={styles.heroTitle}>What is Blackline?</Text>
          <Text style={styles.heroBody}>
            Blackline is LOBO's elite ground transportation division — purpose-built for executives, high-profile individuals, and anyone requiring secure, discreet movement.
          </Text>
          <Text style={styles.heroBody}>
            Every Blackline operator is vetted, licensed, and trained in defensive driving, countersurveillance, and executive protection protocols. This is not rideshare — this is professional secure transport.
          </Text>
          <View style={styles.heroDivider} />
          <View style={styles.heroStats}>
            {[
              { value: '24/7', label: 'Availability' },
              { value: '< 15min', label: 'Avg Response' },
              { value: '100%', label: 'Vetted Operators' },
            ].map(stat => (
              <View key={stat.label} style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{stat.value}</Text>
                <Text style={styles.heroStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Services Offered ── */}
        <SectionLabel icon="checkmark-circle-outline" title="Services Offered" />
        <View style={styles.servicesGrid}>
          {SERVICES_OFFERED.map(s => (
            <View key={s.label} style={styles.serviceChip}>
              <Ionicons name={s.icon} size={16} color={Colors.blacklineAccent} />
              <Text style={styles.serviceChipText}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Vehicle Fleet ── */}
        <SectionLabel icon="car-sport-outline" title="Vehicle Fleet" />
        {VEHICLES.map(v => (
          <TouchableOpacity
            key={v.id}
            style={[styles.vehicleCard, expandedVehicle === v.id && styles.vehicleCardActive]}
            onPress={() => setExpandedVehicle(prev => prev === v.id ? null : v.id)}
            activeOpacity={0.75}
          >
            <View style={styles.vehicleCardHeader}>
              <View style={[styles.vehicleIconWrap, { backgroundColor: `${v.color}18` }]}>
                <Ionicons name={v.icon} size={22} color={expandedVehicle === v.id ? v.color : Colors.steel} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.vehicleLabel, expandedVehicle === v.id && { color: Colors.white }]}>
                  {v.label}
                </Text>
                <Text style={styles.vehicleSub}>{v.seats}</Text>
              </View>
              <View style={styles.vehicleRateWrap}>
                <Text style={[styles.vehicleRate, { color: v.color }]}>{v.baseRate}</Text>
                <Text style={styles.vehicleRateUnit}>/hr</Text>
              </View>
              <Ionicons
                name={expandedVehicle === v.id ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.textMuted}
                style={{ marginLeft: Spacing.sm }}
              />
            </View>
            {expandedVehicle === v.id && (
              <View style={styles.vehicleExpanded}>
                <View style={[styles.vehicleExpandedDivider, { backgroundColor: v.color + '33' }]} />
                <Text style={styles.vehicleDesc}>{v.desc}</Text>
                <View style={styles.vehicleExamplesWrap}>
                  <Ionicons name="car-outline" size={12} color={Colors.textMuted} />
                  <Text style={styles.vehicleExamples}>{v.examples}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* ── Protection Level ── */}
        <SectionLabel icon="shield-outline" title="Driver Protection Level" />
        <View style={styles.protectionToggleRow}>
          {(['unarmed', 'armed'] as const).map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.protectionTab, selectedProtection === opt && styles.protectionTabActive]}
              onPress={() => setSelectedProtection(opt)}
              activeOpacity={0.75}
            >
              <Text style={[styles.protectionTabText, selectedProtection === opt && styles.protectionTabTextActive]}>
                {opt === 'armed' ? 'Armed Driver' : 'Unarmed Driver'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {PROTECTION_OPTIONS.filter(p => p.id === selectedProtection).map(p => (
          <View key={p.id} style={[styles.protectionCard, { borderColor: p.color + '44' }]}>
            <LinearGradient colors={['#1A1A2E', Colors.surface2]} style={styles.protectionGradient}>
              <View style={styles.protectionHeader}>
                <View style={[styles.protectionIconWrap, { backgroundColor: p.color + '18' }]}>
                  <Ionicons name={p.icon} size={22} color={p.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.protectionLabel, { color: p.color }]}>{p.label}</Text>
                  <Text style={styles.protectionAddOn}>{p.addOn}</Text>
                </View>
              </View>
              <View style={styles.protectionPoints}>
                {p.points.map(point => (
                  <View key={point} style={styles.protectionPoint}>
                    <Ionicons name="checkmark" size={14} color={p.color} />
                    <Text style={styles.protectionPointText}>{point}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        ))}

        {/* ── Rate Factors ── */}
        <SectionLabel icon="pricetag-outline" title="How Rates Are Calculated" />
        <View style={styles.rateNotice}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.blacklineAccent} />
          <Text style={styles.rateNoticeText}>
            Rates may vary based on the following factors. Your final quote is shown before confirming any booking.
          </Text>
        </View>
        <View style={styles.sectionCard}>
          {RATE_FACTORS.map((f, i) => (
            <React.Fragment key={f.label}>
              {i > 0 && <View style={styles.rowDivider} />}
              <View style={styles.rateRow}>
                <View style={styles.rateIconWrap}>
                  <Ionicons name={f.icon} size={17} color={Colors.steel} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rateLabel}>{f.label}</Text>
                  <Text style={styles.rateDesc}>{f.desc}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Why Blackline ── */}
        <SectionLabel icon="star-outline" title="Why Choose Blackline" />
        <LinearGradient colors={['#1A1A2E', '#0A0A1A']} style={styles.whyCard}>
          {[
            { icon: 'shield-checkmark-outline' as const, text: 'All operators are background-checked, licensed, and EP-trained' },
            { icon: 'eye-off-outline' as const, text: 'Discreet operations — your movement stays private' },
            { icon: 'lock-closed-outline' as const, text: 'Encrypted booking and route data — never shared' },
            { icon: 'time-outline' as const, text: 'On-demand or scheduled — available around the clock' },
            { icon: 'globe-outline' as const, text: 'Domestic and international movement coordination' },
          ].map(item => (
            <View key={item.text} style={styles.whyRow}>
              <Ionicons name={item.icon} size={18} color={Colors.blacklineAccent} />
              <Text style={styles.whyText}>{item.text}</Text>
            </View>
          ))}
        </LinearGradient>

      </ScrollView>

      {/* ── Book CTA ── */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('BlacklineRequest')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#2D1B69', '#1A0E2E']} style={styles.ctaGradient}>
            <Ionicons name="car-sport" size={20} color='#C9A84C' />
            <Text style={styles.ctaText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={18} color='#C9A84C' />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section label
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={slStyles.row}>
      <Ionicons name={icon} size={13} color={Colors.textMuted} />
      <Text style={slStyles.text}>{title}</Text>
    </View>
  );
}
const slStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.xl, marginBottom: Spacing.sm, paddingHorizontal: 2 },
  text: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold, letterSpacing: 1.5, textTransform: 'uppercase' },
});

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

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
  headerTitle: { color: Colors.blacklineAccent, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy, letterSpacing: 3 },
  headerSub: { color: Colors.textMuted, fontSize: Typography.size.xs, letterSpacing: 0.5 },
  silverBar: { width: 3, height: 28, backgroundColor: Colors.blacklineAccent, borderRadius: 2, marginLeft: 'auto' },

  scroll: { paddingHorizontal: Spacing.base },

  // Hero
  hero: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.12)',
    gap: Spacing.sm,
  },
  heroIconWrap: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(192,192,192,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.2)',
  },
  heroTitle: { color: Colors.blacklineAccent, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold, letterSpacing: 1 },
  heroBody: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 20 },
  heroDivider: { height: 1, backgroundColor: 'rgba(192,192,192,0.15)', marginVertical: Spacing.md },
  heroStats: { flexDirection: 'row', justifyContent: 'space-around' },
  heroStat: { alignItems: 'center', gap: 2 },
  heroStatValue: { color: Colors.white, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  heroStatLabel: { color: Colors.textMuted, fontSize: Typography.size.xs, letterSpacing: 0.5 },

  // Services grid
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  serviceChipText: { color: Colors.textSecondary, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },

  // Vehicle cards
  vehicleCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  vehicleCardActive: { borderColor: Colors.blacklineAccent },
  vehicleCardHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  vehicleIconWrap: { width: 42, height: 42, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  vehicleLabel: { color: Colors.textSecondary, fontSize: Typography.size.base, fontWeight: Typography.weight.semiBold },
  vehicleSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  vehicleRateWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  vehicleRate: { fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  vehicleRateUnit: { color: Colors.textMuted, fontSize: Typography.size.xs, marginBottom: 3 },
  vehicleExpanded: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.base, gap: Spacing.sm },
  vehicleExpandedDivider: { height: 1, marginBottom: Spacing.sm },
  vehicleDesc: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 20 },
  vehicleExamplesWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleExamples: { color: Colors.textMuted, fontSize: Typography.size.xs },

  // Protection toggle
  protectionToggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface3,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  protectionTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center' },
  protectionTabActive: { backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: Colors.blacklineAccent },
  protectionTabText: { color: Colors.textMuted, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  protectionTabTextActive: { color: Colors.blacklineAccent, fontWeight: Typography.weight.semiBold },

  // Protection card
  protectionCard: { borderRadius: BorderRadius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.sm },
  protectionGradient: { padding: Spacing.base, gap: Spacing.md },
  protectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  protectionIconWrap: { width: 44, height: 44, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  protectionLabel: { fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  protectionAddOn: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  protectionPoints: { gap: Spacing.sm },
  protectionPoint: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  protectionPointText: { color: Colors.textSecondary, fontSize: Typography.size.sm, flex: 1, lineHeight: 18 },

  // Rate factors
  rateNotice: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: 'rgba(192,192,192,0.06)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.15)',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rateNoticeText: { flex: 1, color: Colors.textSecondary, fontSize: Typography.size.xs, lineHeight: 18 },
  sectionCard: { backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
  rateRow: { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.base, gap: Spacing.md },
  rateIconWrap: { width: 36, height: 36, borderRadius: BorderRadius.sm, backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center' },
  rateLabel: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold, marginBottom: 2 },
  rateDesc: { color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 16 },

  // Why Blackline
  whyCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: 'rgba(192,192,192,0.1)' },
  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  whyText: { color: Colors.textSecondary, fontSize: Typography.size.sm, flex: 1, lineHeight: 20 },

  // CTA
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  ctaBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(201,168,76,0.5)' },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.base, gap: Spacing.sm },
  ctaText: { color: '#C9A84C', fontSize: Typography.size.base, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },
});
