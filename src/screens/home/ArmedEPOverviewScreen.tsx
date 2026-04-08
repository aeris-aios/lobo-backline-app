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
    body: 'Every LOBO Armed EP agent undergoes a full federal background investigation conducted through the FBI. No exceptions. Criminal history, financial records, and prior conduct are all reviewed before any agent is cleared to operate.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Licensed & Certified',
    body: 'All armed agents carry active state-issued License to Carry (LTC) credentials and meet LEOSA requirements where applicable. Firearms qualifications are re-certified on a recurring basis — not just at hire.',
  },
  {
    icon: 'chatbubbles-outline' as const,
    title: 'Conflict De-Escalation Experts',
    body: 'Force is always the last option. Our agents are trained in advanced verbal de-escalation, threat recognition, and situational awareness. The objective is always to resolve situations peacefully, professionally, and without incident.',
  },
  {
    icon: 'briefcase-outline' as const,
    title: 'Professional Conduct',
    body: 'LOBO agents operate with executive-level professionalism at all times. Suited or plain-clothes, every agent maintains discretion, composure, and presence — whether at a board meeting, public event, or high-risk movement.',
  },
  {
    icon: 'medkit-outline' as const,
    title: 'Tactical Medical Trained',
    body: 'Armed agents are trained in Tactical Combat Casualty Care (TCCC) and carry basic medical kits. In the event of an incident, they are equipped to provide immediate life-safety response while awaiting emergency services.',
  },
  {
    icon: 'eye-outline' as const,
    title: 'Threat Assessment & Intelligence',
    body: 'Prior to any engagement, agents conduct a pre-operation threat assessment of routes, venues, and known risks. Ongoing situational intelligence is maintained throughout the detail.',
  },
];

const ATTIRE_OPTIONS = [
  {
    id: 'suited',
    label: 'Executive Suit',
    icon: 'shirt-outline' as const,
    desc: 'Professional business attire. Ideal for corporate environments, high-profile events, and executive movement where a visible security presence is appropriate.',
  },
  {
    id: 'plain',
    label: 'Plain Clothes',
    icon: 'person-outline' as const,
    desc: 'Discreet civilian attire with concealed carry. Ideal when low-profile presence is preferred — social events, travel, or situations requiring blended security coverage.',
  },
];

export default function ArmedEPOverviewScreen() {
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
          <Text style={styles.headerTitle}>ARMED EP</Text>
          <Text style={styles.headerSub}>Executive Protection Detail</Text>
        </View>
        <View style={styles.armedBadge}>
          <Text style={styles.armedBadgeText}>ARMED</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >

        {/* Hero */}
        <LinearGradient colors={[Colors.crimsonDark, '#1A0000', Colors.background]} style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="shield-checkmark" size={36} color={Colors.crimsonLight} />
          </View>
          <Text style={styles.heroTitle}>Armed Executive Protection</Text>
          <Text style={styles.heroBody}>
            LOBO Armed EP agents are among the most thoroughly vetted security professionals in the industry. Each agent brings military, law enforcement, or federal agency experience — combined with the professionalism required to operate at the executive level.
          </Text>
          <View style={styles.heroDivider} />
          <View style={styles.heroStats}>
            {[
              { value: 'FBI', label: 'Cleared' },
              { value: '100%', label: 'Licensed' },
              { value: 'Zero', label: 'Tolerance Policy' },
            ].map(stat => (
              <View key={stat.label} style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{stat.value}</Text>
                <Text style={styles.heroStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Agent Standards */}
        <SectionLabel icon="checkmark-circle-outline" title="Agent Standards" />
        <View style={styles.sectionCard}>
          {AGENT_STANDARDS.map((item, i) => (
            <React.Fragment key={item.title}>
              {i > 0 && <View style={styles.rowDivider} />}
              <View style={styles.standardRow}>
                <View style={styles.standardIconWrap}>
                  <Ionicons name={item.icon} size={20} color={Colors.crimsonLight} />
                </View>
                <View style={styles.standardText}>
                  <Text style={styles.standardTitle}>{item.title}</Text>
                  <Text style={styles.standardBody}>{item.body}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Attire Options */}
        <SectionLabel icon="shirt-outline" title="Attire Options" />
        <View style={styles.attireGrid}>
          {ATTIRE_OPTIONS.map(opt => (
            <View key={opt.id} style={styles.attireCard}>
              <LinearGradient colors={['#1C0000', '#161616']} style={styles.attireGradient}>
                <View style={styles.attireIconWrap}>
                  <Ionicons name={opt.icon} size={24} color={Colors.crimsonLight} />
                </View>
                <Text style={styles.attireLabel}>{opt.label}</Text>
                <Text style={styles.attireDesc}>{opt.desc}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* What to Expect */}
        <SectionLabel icon="information-circle-outline" title="What to Expect" />
        <LinearGradient colors={['#1C0000', '#0A0A0A']} style={styles.expectCard}>
          {[
            { icon: 'call-outline' as const, text: 'Pre-detail briefing call to discuss your specific needs, route, and threat environment' },
            { icon: 'navigate-outline' as const, text: 'Agent arrives early to conduct a venue and route assessment before your arrival' },
            { icon: 'eye-outline' as const, text: 'Continuous 360° situational awareness maintained throughout the detail' },
            { icon: 'car-outline' as const, text: 'Coordinated vehicle movement with driver if Blackline transport is paired' },
            { icon: 'document-text-outline' as const, text: 'Post-detail incident report provided for all engagements upon request' },
          ].map(item => (
            <View key={item.text} style={styles.expectRow}>
              <Ionicons name={item.icon} size={16} color={Colors.crimsonLight} />
              <Text style={styles.expectText}>{item.text}</Text>
            </View>
          ))}
        </LinearGradient>

        {/* Rate note */}
        <View style={styles.rateNote}>
          <Ionicons name="pricetag-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.rateNoteText}>
            Armed EP starts at <Text style={styles.rateHighlight}>$250/hr</Text>. Final rate depends on number of agents, duration, attire, and location. Full quote shown before booking.
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
          <LinearGradient colors={[Colors.crimsonDark, Colors.crimson]} style={styles.ctaGradient}>
            <Ionicons name="shield" size={20} color={Colors.white} />
            <Text style={styles.ctaText}>Book Armed EP</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.crimsonLight, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy, letterSpacing: 3 },
  headerSub: { color: Colors.textMuted, fontSize: Typography.size.xs, letterSpacing: 0.5 },
  armedBadge: {
    backgroundColor: 'rgba(139,0,0,0.25)',
    borderWidth: 1,
    borderColor: Colors.crimson,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  armedBadgeText: { color: Colors.crimsonLight, fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },

  scroll: { paddingHorizontal: Spacing.base },

  hero: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.3)',
    gap: Spacing.sm,
  },
  heroIconWrap: {
    width: 60, height: 60, borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(139,0,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.4)',
  },
  heroTitle: { color: Colors.textPrimary, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  heroBody: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 20 },
  heroDivider: { height: 1, backgroundColor: 'rgba(139,0,0,0.25)', marginVertical: Spacing.md },
  heroStats: { flexDirection: 'row', justifyContent: 'space-around' },
  heroStat: { alignItems: 'center', gap: 2 },
  heroStatValue: { color: Colors.crimsonLight, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  heroStatLabel: { color: Colors.textMuted, fontSize: Typography.size.xs },

  sectionCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
  standardRow: { flexDirection: 'row', padding: Spacing.base, gap: Spacing.md, alignItems: 'flex-start' },
  standardIconWrap: {
    width: 38, height: 38, borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(139,0,0,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  },
  standardText: { flex: 1 },
  standardTitle: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.semiBold, marginBottom: 4 },
  standardBody: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 19 },

  attireGrid: { flexDirection: 'row', gap: Spacing.sm },
  attireCard: { flex: 1, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(139,0,0,0.25)' },
  attireGradient: { padding: Spacing.base, gap: 6 },
  attireIconWrap: {
    width: 44, height: 44, borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(139,0,0,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  attireLabel: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  attireDesc: { color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 16 },

  expectCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: 'rgba(139,0,0,0.2)' },
  expectRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  expectText: { color: Colors.textSecondary, fontSize: Typography.size.sm, flex: 1, lineHeight: 19 },

  rateNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  rateNoteText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },
  rateHighlight: { color: Colors.crimsonLight, fontWeight: Typography.weight.semiBold },

  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  ctaBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadows.crimson },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.base, gap: Spacing.sm },
  ctaText: { color: Colors.white, fontSize: Typography.size.base, fontWeight: Typography.weight.bold, letterSpacing: 0.5 },
});
