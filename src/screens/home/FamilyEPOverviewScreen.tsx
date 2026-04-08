import React from 'react';
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

const GOLD = '#C9A84C';

const SERVICES = [
  {
    icon: 'airplane-outline' as const,
    title: 'Airport Escorts',
    body: 'LOBO agents escort family members to and from airports with full close protection coverage. From curbside departure to terminal entry, or arrival pickup through baggage claim — your family is never unaccompanied in a high-traffic environment.',
  },
  {
    icon: 'school-outline' as const,
    title: 'Children School Drop-Off & Pickup',
    body: 'Daily or scheduled school runs conducted by screened, professional agents. Children are escorted door-to-door with discreet, non-intrusive protection. Agents remain in communication with parents throughout the movement.',
  },
  {
    icon: 'flag-outline' as const,
    title: 'Family Event Escorts',
    body: "Whether it's a birthday, gala, sporting event, or social gathering — LOBO agents escort family members to and from venues and remain present throughout to provide immediate protective response if needed.",
  },
  {
    icon: 'time-outline' as const,
    title: 'Standby at Events & Schools',
    body: 'Agents can be posted on standby at schools, private events, or recurring locations. They remain on-site, alert, and ready for immediate response — a visible deterrent and an invisible safety net.',
  },
  {
    icon: 'car-outline' as const,
    title: 'Secure Family Movement',
    body: 'Coordinated ground movement for the entire family unit — multiple vehicles, multiple agents, or a single low-profile escort. Every route is assessed and every contingency is planned before departure.',
  },
  {
    icon: 'call-outline' as const,
    title: 'Direct Parent Communication',
    body: 'Agents maintain real-time communication with parents or guardians throughout every family detail. Location updates, arrival confirmations, and situational developments are communicated promptly and professionally.',
  },
];

const WHY_FAMILY = [
  { icon: 'heart-outline' as const, text: 'Agents trained to work around children — calm, patient, and professional at all times' },
  { icon: 'eye-off-outline' as const, text: 'Low-profile presence that does not draw attention or create anxiety for children or family members' },
  { icon: 'finger-print-outline' as const, text: 'Every family EP agent passes a full FBI background check — no exceptions' },
  { icon: 'shield-checkmark-outline' as const, text: 'Same close protection protocols as executive details, adapted for family environments' },
  { icon: 'lock-closed-outline' as const, text: 'All movement information, routes, and schedules are kept strictly confidential' },
];

export default function FamilyEPOverviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>FAMILY EP</Text>
          <Text style={styles.headerSub}>Family & School Escort Services</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="people-outline" size={12} color={GOLD} />
          <Text style={styles.badgeText}>FAMILY</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >

        {/* Hero */}
        <LinearGradient colors={['#1A1200', '#111111', Colors.background]} style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="people" size={36} color={GOLD} />
          </View>
          <Text style={styles.heroTitle}>Protecting What Matters Most</Text>
          <Text style={styles.heroBody}>
            LOBO Family EP is designed for principals who require security coverage not just for themselves — but for their entire family. School runs, airport transfers, event coverage, and standing-by at locations where your family gathers are all part of what we do.
          </Text>
          <Text style={styles.heroBody}>
            Our family agents bring the same professionalism and FBI-cleared standards as every LOBO detail — adapted for the unique needs of family environments and children.
          </Text>
          <View style={styles.heroDivider} />
          <View style={styles.heroStats}>
            {[
              { value: 'FBI', label: 'Cleared' },
              { value: '24/7', label: 'Available' },
              { value: '100%', label: 'Confidential' },
            ].map(stat => (
              <View key={stat.label} style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{stat.value}</Text>
                <Text style={styles.heroStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Services */}
        <SectionLabel icon="shield-outline" title="What We Cover" />
        <View style={styles.sectionCard}>
          {SERVICES.map((item, i) => (
            <React.Fragment key={item.title}>
              {i > 0 && <View style={styles.rowDivider} />}
              <View style={styles.serviceRow}>
                <View style={styles.serviceIconWrap}>
                  <Ionicons name={item.icon} size={20} color={GOLD} />
                </View>
                <View style={styles.serviceText}>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <Text style={styles.serviceBody}>{item.body}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Why LOBO for Family */}
        <SectionLabel icon="heart-outline" title="Why LOBO for Family" />
        <LinearGradient colors={['#1A1200', '#0A0A0A']} style={styles.whyCard}>
          {WHY_FAMILY.map(item => (
            <View key={item.text} style={styles.whyRow}>
              <Ionicons name={item.icon} size={16} color={GOLD} />
              <Text style={styles.whyText}>{item.text}</Text>
            </View>
          ))}
        </LinearGradient>

        {/* Rate note */}
        <View style={styles.rateNote}>
          <Ionicons name="pricetag-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.rateNoteText}>
            Family EP starts at{' '}
            <Text style={styles.rateHighlight}>$200/hr</Text>
            . Standby and recurring school run packages available at reduced rates. Full quote provided before booking.
          </Text>
        </View>

      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#2D2200', '#1A1400']} style={styles.ctaGradient}>
            <Ionicons name="people" size={20} color={GOLD} />
            <Text style={styles.ctaText}>Book Family EP</Text>
            <Ionicons name="arrow-forward" size={18} color={GOLD} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionLabel({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={slStyles.row}>
      <Ionicons name={icon} size={13} color={Colors.textMuted} />
      <Text style={slStyles.text}>{title}</Text>
    </View>
  );
}

const slStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: Spacing.xl, marginBottom: Spacing.sm, paddingHorizontal: 2,
  },
  text: {
    color: Colors.textMuted, fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold, letterSpacing: 1.5, textTransform: 'uppercase',
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    color: GOLD, fontSize: Typography.size.md,
    fontWeight: Typography.weight.heavy, letterSpacing: 3,
  },
  headerSub: { color: Colors.textMuted, fontSize: Typography.size.xs, letterSpacing: 0.5 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeText: {
    color: GOLD, fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold, letterSpacing: 1.5,
  },

  scroll: { paddingHorizontal: Spacing.base },

  hero: {
    borderRadius: BorderRadius.xl, padding: Spacing.xl,
    marginTop: Spacing.base,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)', gap: Spacing.sm,
  },
  heroIconWrap: {
    width: 60, height: 60, borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(201,168,76,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
  },
  heroTitle: {
    color: Colors.textPrimary, fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
  heroBody: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 20 },
  heroDivider: { height: 1, backgroundColor: 'rgba(201,168,76,0.15)', marginVertical: Spacing.md },
  heroStats: { flexDirection: 'row', justifyContent: 'space-around' },
  heroStat: { alignItems: 'center', gap: 2 },
  heroStatValue: { color: GOLD, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  heroStatLabel: { color: Colors.textMuted, fontSize: Typography.size.xs },

  sectionCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
  serviceRow: { flexDirection: 'row', padding: Spacing.base, gap: Spacing.md, alignItems: 'flex-start' },
  serviceIconWrap: {
    width: 38, height: 38, borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(201,168,76,0.1)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  serviceText: { flex: 1 },
  serviceTitle: {
    color: Colors.textPrimary, fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold, marginBottom: 4,
  },
  serviceBody: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 19 },

  whyCard: {
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    gap: Spacing.md, borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)',
  },
  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  whyText: { color: Colors.textSecondary, fontSize: Typography.size.sm, flex: 1, lineHeight: 19 },

  rateNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  rateNoteText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },
  rateHighlight: { color: GOLD, fontWeight: Typography.weight.semiBold },

  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  ctaBtn: {
    borderRadius: BorderRadius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.35)',
  },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.base, gap: Spacing.sm,
  },
  ctaText: {
    color: GOLD, fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold, letterSpacing: 0.5,
  },
});
