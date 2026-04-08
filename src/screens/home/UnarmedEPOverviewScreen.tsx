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

const AGENT_STANDARDS = [
  {
    icon: 'finger-print-outline' as const,
    title: 'FBI Background Check',
    body: 'Every LOBO Unarmed EP agent is fully cleared through an FBI background investigation — the same federal standard as our armed agents. Criminal history, conduct, and references are all verified before any agent is deployed.',
  },
  {
    icon: 'ban-outline' as const,
    title: 'This Is Not Rideshare',
    body: 'LOBO Unarmed EP is not a taxi, not a rideshare, and not a driver service. Our agents are trained close protection specialists who happen to be unarmed. Their mission is your safety — not a star rating.',
  },
  {
    icon: 'chatbubbles-outline' as const,
    title: 'Conflict De-Escalation',
    body: 'Unarmed agents are trained in professional verbal de-escalation, physical positioning, and threat avoidance. The goal is always to prevent confrontation before it begins — through awareness, communication, and controlled presence.',
  },
  {
    icon: 'eye-outline' as const,
    title: 'Situational Awareness',
    body: 'Agents maintain constant 360° awareness of the environment, identifying threats before they materialize. Countersurveillance, route assessment, and crowd reading are standard operating procedures on every detail.',
  },
  {
    icon: 'shield-outline' as const,
    title: 'Close Protection Protocol',
    body: 'Unarmed agents follow the same close protection structure as armed details — protective positioning, advance work, and emergency extraction planning. The absence of a firearm does not reduce operational standards.',
  },
  {
    icon: 'briefcase-outline' as const,
    title: 'Executive Professionalism',
    body: 'Our unarmed agents carry themselves with the same discretion and composure expected in boardrooms, private events, and public-facing environments. Low profile, high competence.',
  },
];

export default function UnarmedEPOverviewScreen() {
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
          <Text style={styles.headerTitle}>UNARMED EP</Text>
          <Text style={styles.headerSub}>Close Protection Specialist</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="shield-outline" size={12} color={Colors.steel} />
          <Text style={styles.badgeText}>UNARMED</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >

        {/* Hero */}
        <LinearGradient colors={['#1A1A1A', '#111111', Colors.background]} style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="person-outline" size={36} color={Colors.steel} />
          </View>
          <Text style={styles.heroTitle}>Unarmed Close Protection</Text>
          <Text style={styles.heroBody}>
            LOBO Unarmed EP agents deliver the full standard of executive protection — without a firearm. FBI-cleared, professionally trained, and highly capable, these agents are ideal for environments where discretion and low-profile presence are the priority.
          </Text>
          <View style={styles.heroDivider} />
          <View style={styles.heroStats}>
            {[
              { value: 'FBI', label: 'Cleared' },
              { value: '100%', label: 'EP Trained' },
              { value: 'Not', label: 'Rideshare' },
            ].map(stat => (
              <View key={stat.label} style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{stat.value}</Text>
                <Text style={styles.heroStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Not Rideshare Banner */}
        <View style={styles.notRideshareBanner}>
          <Ionicons name="ban-outline" size={20} color={Colors.errorLight} />
          <View style={{ flex: 1 }}>
            <Text style={styles.notRideshareTitle}>Not a Rideshare Service</Text>
            <Text style={styles.notRideshareBody}>
              LOBO agents are close protection professionals. They are not Uber, Lyft, or any form of transportation service. Every engagement is a security operation, not a trip request.
            </Text>
          </View>
        </View>

        {/* Agent Standards */}
        <SectionLabel icon="checkmark-circle-outline" title="Agent Standards" />
        <View style={styles.sectionCard}>
          {AGENT_STANDARDS.map((item, i) => (
            <React.Fragment key={item.title}>
              {i > 0 && <View style={styles.rowDivider} />}
              <View style={styles.standardRow}>
                <View style={styles.standardIconWrap}>
                  <Ionicons name={item.icon} size={20} color={Colors.steel} />
                </View>
                <View style={styles.standardText}>
                  <Text style={styles.standardTitle}>{item.title}</Text>
                  <Text style={styles.standardBody}>{item.body}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Best For */}
        <SectionLabel icon="star-outline" title="Best For" />
        <View style={styles.bestForGrid}>
          {[
            { icon: 'business-outline' as const, label: 'Corporate Events' },
            { icon: 'airplane-outline' as const, label: 'Airport Movement' },
            { icon: 'people-outline' as const, label: 'Family Escort' },
            { icon: 'walk-outline' as const, label: 'Public Outings' },
            { icon: 'storefront-outline' as const, label: 'Retail & Hotels' },
            { icon: 'globe-outline' as const, label: 'Travel Support' },
          ].map(item => (
            <View key={item.label} style={styles.bestForChip}>
              <Ionicons name={item.icon} size={15} color={Colors.steel} />
              <Text style={styles.bestForText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Rate note */}
        <View style={styles.rateNote}>
          <Ionicons name="pricetag-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.rateNoteText}>
            Unarmed EP starts at <Text style={styles.rateHighlight}>$175/hr</Text>. Final rate depends on duration, attire preference, and location. Full quote shown before booking.
          </Text>
        </View>

      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('HomeMain')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#2A2A2A', '#1A1A1A']} style={styles.ctaGradient}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textPrimary} />
            <Text style={styles.ctaText}>Book Unarmed EP</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.steel} />
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.xl, marginBottom: Spacing.sm, paddingHorizontal: 2 },
  text: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold, letterSpacing: 1.5, textTransform: 'uppercase' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy, letterSpacing: 3 },
  headerSub: { color: Colors.textMuted, fontSize: Typography.size.xs, letterSpacing: 0.5 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface3,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeText: { color: Colors.steel, fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },

  scroll: { paddingHorizontal: Spacing.base },

  hero: {
    borderRadius: BorderRadius.xl, padding: Spacing.xl,
    marginTop: Spacing.base,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  heroIconWrap: {
    width: 60, height: 60, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface3,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  heroTitle: { color: Colors.textPrimary, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  heroBody: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 20 },
  heroDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  heroStats: { flexDirection: 'row', justifyContent: 'space-around' },
  heroStat: { alignItems: 'center', gap: 2 },
  heroStatValue: { color: Colors.textPrimary, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  heroStatLabel: { color: Colors.textMuted, fontSize: Typography.size.xs },

  notRideshareBanner: {
    flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start',
    backgroundColor: 'rgba(198,40,40,0.08)',
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: 'rgba(198,40,40,0.25)',
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  notRideshareTitle: { color: Colors.errorLight, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, marginBottom: 4 },
  notRideshareBody: { color: Colors.textSecondary, fontSize: Typography.size.xs, lineHeight: 17 },

  sectionCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
  standardRow: { flexDirection: 'row', padding: Spacing.base, gap: Spacing.md, alignItems: 'flex-start' },
  standardIconWrap: {
    width: 38, height: 38, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  standardText: { flex: 1 },
  standardTitle: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.semiBold, marginBottom: 4 },
  standardBody: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 19 },

  bestForGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  bestForChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: 7,
  },
  bestForText: { color: Colors.textSecondary, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },

  rateNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  rateNoteText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },
  rateHighlight: { color: Colors.steelLight, fontWeight: Typography.weight.semiBold },

  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  ctaBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.base, gap: Spacing.sm },
  ctaText: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold, letterSpacing: 0.5 },
});
