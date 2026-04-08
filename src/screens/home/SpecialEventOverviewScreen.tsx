import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

const RED = '#E02020';
const RED_DIM = 'rgba(200,20,20,0.22)';

// ─── Event types ────────────────────────────────────────────────────────────
const EVENT_TYPES: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  tag: string;
  body: string;
}[] = [
  {
    icon: 'musical-notes-outline',
    title: 'Party / Private Gathering',
    tag: 'HIGH DEMAND',
    body: 'LOBO agents provide discreet perimeter security, guest screening, and interior protection for private parties and social gatherings — from intimate gatherings to large-scale events. We integrate seamlessly with your event without disrupting the atmosphere.',
  },
  {
    icon: 'trophy-outline',
    title: 'Sporting Event',
    tag: '',
    body: 'High-traffic venues, VIP access, and crowd dynamics require specialist EP coverage. Our agents escort clients to and from stadiums, manage crowd interference, and maintain close-proximity protection throughout the event — visible where needed, invisible where not.',
  },
  {
    icon: 'star-outline',
    title: 'Gala & Black-Tie Event',
    tag: 'ELITE',
    body: 'LOBO agents assigned to gala events are specifically selected for executive presentation. Armed or unarmed, in evening attire or suited, they blend into high-profile environments while providing full close-protection coverage for your principal and guests.',
  },
  {
    icon: 'home-outline',
    title: 'House Party / Estate Event',
    tag: '',
    body: 'Residential events carry unique security considerations — known and unknown guests, open access points, and high-value environments. We deploy agents for access control, roving patrol, and principal protection throughout the event duration.',
  },
  {
    icon: 'heart-outline',
    title: 'Wedding',
    tag: 'POPULAR',
    body: 'Your wedding day demands both elegance and security. LOBO agents in formal attire manage venue perimeter, VIP access, and client movement throughout the ceremony and reception — fully coordinated with your event planner and venue staff.',
  },
  {
    icon: 'business-outline',
    title: 'Corporate Event',
    tag: '',
    body: 'Board meetings, product launches, and investor events all carry threat profiles that require professional EP coverage. LOBO provides executive escort, venue security, and executive close protection for your full team or a single principal.',
  },
];

// ─── What's included ─────────────────────────────────────────────────────────
const INCLUDED = [
  { icon: 'shield-checkmark-outline' as const, text: 'Dedicated lead agent assigned 24h before event for site assessment' },
  { icon: 'people-outline' as const,           text: 'Scalable agent count — from 1 agent to full team deployment' },
  { icon: 'eye-outline' as const,              text: 'Advance perimeter and access-point review before guests arrive' },
  { icon: 'call-outline' as const,             text: 'Direct radio/phone coordination with event coordinator and venue' },
  { icon: 'car-outline' as const,              text: 'Secure transport to and from event available on request' },
  { icon: 'lock-closed-outline' as const,      text: 'All event details, guest lists, and routes kept strictly confidential' },
];

// ─── How to request steps ────────────────────────────────────────────────────
const HOW_TO: { step: string; title: string; sub: string }[] = [
  { step: '01', title: 'Select Special Event',    sub: 'Tap "Book Protection" and choose your event type from the service menu' },
  { step: '02', title: 'Provide Event Details',   sub: 'Date, venue, expected guest count, duration, and any known threat concerns' },
  { step: '03', title: 'Agent Assignment',         sub: 'A LOBO coordinator confirms your agent team within 15 minutes' },
  { step: '04', title: 'Pre-Event Briefing',       sub: 'Your lead agent contacts you 24h before for a full site and detail briefing' },
  { step: '05', title: 'Day-Of Coverage',          sub: 'Agents on-site from setup through post-event departure — no gaps' },
];

export default function SpecialEventOverviewScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Special Events</Text>
          <Text style={styles.headerSub}>Elite event security & protection</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="star" size={11} color={RED} />
          <Text style={styles.headerBadgeText}>LOBO EP</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >

        {/* ── Hero banner ── */}
        <LinearGradient colors={['#3A0808', '#1A0000']} style={styles.heroBanner}>
          <View style={[styles.heroIcon, { backgroundColor: RED_DIM, borderColor: RED }]}>
            <Ionicons name="sparkles" size={32} color={RED} />
          </View>
          <Text style={styles.heroTitle}>Event Security, Elevated</Text>
          <Text style={styles.heroSub}>
            From intimate gatherings to high-profile galas — LOBO provides seamless, professional security that blends into your event and removes every threat before it reaches your guests.
          </Text>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>FBI-CLEARED AGENTS</Text></View>
            <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>ARMED AVAILABLE</Text></View>
          </View>
        </LinearGradient>

        {/* ── Event Types ── */}
        <SectionLabel icon="calendar-outline" text="Event Types We Cover" />
        {EVENT_TYPES.map(ev => {
          const open = expanded === ev.title;
          return (
            <TouchableOpacity
              key={ev.title}
              activeOpacity={0.85}
              onPress={() => setExpanded(open ? null : ev.title)}
              style={styles.eventCard}
            >
              <LinearGradient
                colors={open ? ['#3A0808', '#5C0E0E'] : ['#1C1C1C', '#141414']}
                style={styles.eventCardGrad}
              >
                <View style={styles.eventCardTop}>
                  <View style={[styles.eventIconWrap, { backgroundColor: RED_DIM, borderColor: open ? RED : 'rgba(200,20,20,0.2)' }]}>
                    <Ionicons name={ev.icon} size={20} color={open ? '#FF7070' : Colors.steel} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.eventTitleRow}>
                      <Text style={[styles.eventTitle, open && { color: Colors.textPrimary }]}>{ev.title}</Text>
                      {ev.tag !== '' && (
                        <View style={styles.eventTag}>
                          <Text style={styles.eventTagText}>{ev.tag}</Text>
                        </View>
                      )}
                    </View>
                    {!open && <Text style={styles.eventPreview} numberOfLines={1}>{ev.body}</Text>}
                  </View>
                  <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={open ? RED : Colors.steel}
                  />
                </View>
                {open && (
                  <View style={styles.eventBody}>
                    <View style={styles.eventDivider} />
                    <Text style={styles.eventBodyText}>{ev.body}</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}

        {/* ── What's Included ── */}
        <SectionLabel icon="checkmark-circle-outline" text="What's Included" />
        <View style={styles.includedCard}>
          {INCLUDED.map((item, i) => (
            <View key={item.text} style={[styles.includedRow, i < INCLUDED.length - 1 && styles.includedDivider]}>
              <View style={[styles.includedIcon, { backgroundColor: RED_DIM }]}>
                <Ionicons name={item.icon} size={15} color="#FF6B6B" />
              </View>
              <Text style={styles.includedText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* ── How to Request ── */}
        <SectionLabel icon="list-outline" text="How to Request" />
        <View style={styles.stepsCard}>
          {HOW_TO.map((s, i) => (
            <View key={s.step} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepNumWrap, { backgroundColor: RED_DIM, borderColor: RED }]}>
                  <Text style={styles.stepNum}>{s.step}</Text>
                </View>
                {i < HOW_TO.length - 1 && <View style={styles.stepConnector} />}
              </View>
              <View style={styles.stepRight}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepSub}>{s.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Coordinator note ── */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.noteText}>
            Special event details require a minimum 4-hour commitment. For events with 50+ guests or high-profile principals, we recommend booking 48–72 hours in advance. For same-day requests, call your LOBO coordinator directly.
          </Text>
        </View>

      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[styles.stickyBar, {
        paddingBottom: Math.max(insets.bottom, Spacing.md) + Spacing.sm,
        paddingLeft:  Math.max(Spacing.base, insets.left  + Spacing.base),
        paddingRight: Math.max(Spacing.base, insets.right + Spacing.base),
      }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('SpecialEventBooking')}
        >
          <LinearGradient
            colors={['#8B0000', RED]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGrad}
          >
            <Ionicons name="sparkles" size={20} color="#fff" />
            <View>
              <Text style={styles.ctaTitle}>Request Special Event Coverage</Text>
              <Text style={styles.ctaSub}>Book Protection → select your event type</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─── Section label ───────────────────────────────────────────────────────────
function SectionLabel({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={sl.row}>
      <Ionicons name={icon} size={13} color={Colors.textMuted} />
      <Text style={sl.text}>{text}</Text>
    </View>
  );
}
const sl = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.xl, marginBottom: Spacing.sm },
  text: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold, letterSpacing: 1.4, textTransform: 'uppercase' },
});

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy, letterSpacing: 0.5 },
  headerSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 1 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(139,0,0,0.12)', borderWidth: 1, borderColor: 'rgba(139,0,0,0.4)',
    borderRadius: BorderRadius.sm, paddingHorizontal: 10, paddingVertical: 4,
  },
  headerBadgeText: { color: '#FF6B6B', fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },

  scroll: { paddingHorizontal: Spacing.base },

  // Hero
  heroBanner: {
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(200,20,20,0.3)',
    marginTop: Spacing.base, ...Shadows.md,
  },
  heroIcon: {
    width: 68, height: 68, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, marginBottom: Spacing.md,
  },
  heroTitle: {
    color: Colors.textPrimary, fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold, textAlign: 'center', marginBottom: Spacing.sm,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.6)', fontSize: Typography.size.sm,
    lineHeight: 20, textAlign: 'center', marginBottom: Spacing.base,
  },
  heroBadgeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  heroBadge: {
    backgroundColor: RED_DIM, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: 'rgba(200,20,20,0.4)',
    paddingHorizontal: 12, paddingVertical: 4,
  },
  heroBadgeText: { color: '#FF7070', fontSize: 10, fontWeight: Typography.weight.bold, letterSpacing: 1 },

  // Event cards
  eventCard: { borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: Spacing.sm, borderWidth: 1, borderColor: 'rgba(200,20,20,0.2)' },
  eventCardGrad: { padding: Spacing.base },
  eventCardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  eventIconWrap: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0,
  },
  eventTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  eventTitle: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  eventPreview: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  eventTag: {
    backgroundColor: RED_DIM, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: 'rgba(200,20,20,0.4)',
    paddingHorizontal: 6, paddingVertical: 2,
  },
  eventTagText: { color: '#FF7070', fontSize: 8, fontWeight: Typography.weight.bold, letterSpacing: 0.8 },
  eventBody: { marginTop: Spacing.sm },
  eventDivider: { height: 1, backgroundColor: 'rgba(200,20,20,0.2)', marginBottom: Spacing.sm },
  eventBodyText: { color: 'rgba(255,255,255,0.65)', fontSize: Typography.size.sm, lineHeight: 20 },

  // Included
  includedCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  includedRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  includedDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  includedIcon: {
    width: 32, height: 32, borderRadius: BorderRadius.sm,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  includedText: { flex: 1, color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 18 },

  // Steps
  stepsCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
  },
  stepRow: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.sm },
  stepLeft: { alignItems: 'center', width: 36 },
  stepNumWrap: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  stepNum: { color: '#FF6B6B', fontSize: 11, fontWeight: Typography.weight.bold },
  stepConnector: { width: 1.5, flex: 1, backgroundColor: 'rgba(200,20,20,0.25)', marginVertical: 3 },
  stepRight: { flex: 1, paddingBottom: Spacing.sm },
  stepTitle: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, marginBottom: 2 },
  stepSub: { color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 16 },

  // Note
  noteCard: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  noteText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },

  // CTA
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingTop: Spacing.md, paddingHorizontal: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  ctaBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  ctaGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  ctaTitle: { color: '#fff', fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  ctaSub: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 1 },
});
