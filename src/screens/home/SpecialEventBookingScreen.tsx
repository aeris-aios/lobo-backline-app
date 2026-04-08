import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

const RED        = '#E02020';
const RED_DIM    = 'rgba(200,20,20,0.22)';
const RED_BORDER = 'rgba(200,20,20,0.5)';

// ─── Event types ─────────────────────────────────────────────────────────────
const EVENT_TYPES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap; guests: string }[] = [
  { id: 'party',         label: 'Private Party',   icon: 'musical-notes-outline', guests: '10–200'  },
  { id: 'sporting',      label: 'Sporting Event',  icon: 'trophy-outline',        guests: '50–5k+'  },
  { id: 'gala',          label: 'Gala / Black-Tie',icon: 'star-outline',          guests: '50–500'  },
  { id: 'house_party',   label: 'House Party',     icon: 'home-outline',          guests: '10–150'  },
  { id: 'wedding',       label: 'Wedding',         icon: 'heart-outline',         guests: '20–400'  },
  { id: 'corporate',     label: 'Corporate Event', icon: 'business-outline',      guests: '10–1k+'  },
];

// ─── Agent types ─────────────────────────────────────────────────────────────
const AGENT_TYPES: { id: string; label: string; sub: string; icon: keyof typeof Ionicons.glyphMap; rate: number }[] = [
  { id: 'armed',   label: 'Armed EP',    sub: 'Full close protection', icon: 'shield-checkmark', rate: 275 },
  { id: 'unarmed', label: 'Unarmed EP',  sub: 'Discreet protection',   icon: 'person',           rate: 200 },
  { id: 'both',    label: 'Mixed Team',  sub: 'Armed + unarmed agents',icon: 'people',           rate: 240 },
];

// ─── Duration options ─────────────────────────────────────────────────────────
const DURATIONS = ['2', '3', '4', '5', '6', '8', '10', '12'];

// ─── Attire ──────────────────────────────────────────────────────────────────
const ATTIRE: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'suited',       label: 'Executive Suit', icon: 'briefcase-outline' },
  { id: 'formal',       label: 'Black Tie',      icon: 'star-outline'      },
  { id: 'plain',        label: 'Plain Clothes',  icon: 'person-outline'    },
  { id: 'tactical',     label: 'Tactical',       icon: 'shield-outline'    },
];

function buildCalendar() {
  const today = new Date();
  const days: { date: Date; label: string; day: string }[] = [];
  for (let i = 0; i < 60; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    days.push({
      date: d,
      label: d.getDate().toString(),
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
    });
  }
  return days;
}
const CALENDAR = buildCalendar();

export default function SpecialEventBookingScreen() {
  const insets       = useSafeAreaInsets();
  const navigation   = useNavigation<any>();
  const tabBarHeight = useBottomTabBarHeight();

  const [eventType, setEventType]   = useState('gala');
  const [agentType, setAgentType]   = useState('unarmed');
  const [agentCount, setAgentCount] = useState(2);
  const [duration, setDuration]     = useState('4');
  const [attire, setAttire]         = useState('suited');
  const [venue, setVenue]           = useState('');
  const [notes, setNotes]           = useState('');
  const [selectedDate, setSelectedDate] = useState(CALENDAR[0]);
  const [submitted, setSubmitted]   = useState(false);

  const agent    = AGENT_TYPES.find(a => a.id === agentType)!;
  const estTotal = parseInt(duration) * agent.rate * agentCount;
  const isReady  = venue.length > 0;

  // Slide-in animation
  const cardY   = useRef(new Animated.Value(30)).current;
  const cardOp  = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardY,  { toValue: 0, duration: 380, useNativeDriver: true }),
      Animated.timing(cardOp, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.93, useNativeDriver: true, speed: 50, bounciness: 8 }),
      Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 40, bounciness: 6 }),
    ]).start();
    setSubmitted(true);
  };

  const monthLabel = selectedDate.date.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Book Special Event</Text>
          <Text style={styles.headerSub}>Elite event security request</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="sparkles" size={11} color={RED} />
          <Text style={styles.headerBadgeText}>EVENT</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 110 }]}
      >
        <Animated.View style={{ opacity: cardOp, transform: [{ translateY: cardY }] }}>

          {/* ── Event Type ── */}
          <SectionLabel icon="calendar-outline" text="Event Type" />
          <View style={styles.eventGrid}>
            {EVENT_TYPES.map(ev => {
              const active = eventType === ev.id;
              return (
                <TouchableOpacity
                  key={ev.id}
                  style={[styles.eventCard, active && styles.eventCardActive]}
                  onPress={() => setEventType(ev.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={active ? ['#3A0808', '#5C0E0E'] : ['#1C1C1C', '#161616']}
                    style={styles.eventCardGrad}
                  >
                    <View style={[styles.eventIcon, { backgroundColor: active ? RED_DIM : Colors.surface3, borderColor: active ? RED : Colors.border }]}>
                      <Ionicons name={ev.icon} size={18} color={active ? '#FF7070' : Colors.steel} />
                    </View>
                    <Text style={[styles.eventLabel, active && styles.eventLabelActive]}>{ev.label}</Text>
                    <Text style={styles.eventGuests}>{ev.guests} guests</Text>
                    {active && (
                      <View style={styles.eventCheck}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Venue / Location ── */}
          <SectionLabel icon="location-outline" text="Venue / Location" />
          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <Ionicons name="business-outline" size={18} color={Colors.steel} />
              <TextInput
                style={styles.input}
                placeholder="Venue name or full address"
                placeholderTextColor={Colors.textMuted}
                value={venue}
                onChangeText={setVenue}
                returnKeyType="done"
              />
              {venue.length > 0 && (
                <TouchableOpacity onPress={() => setVenue('')} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={18} color={Colors.steel} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Event Date ── */}
          <SectionLabel icon="calendar-outline" text="Event Date" />
          <View style={styles.calCard}>
            <View style={styles.calMonthRow}>
              <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.calMonth}>{monthLabel}</Text>
            </View>
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              nestedScrollEnabled decelerationRate="fast"
              contentContainerStyle={styles.calContent}
            >
              {CALENDAR.map((d, i) => {
                const sel = d.date.toDateString() === selectedDate.date.toDateString();
                return (
                  <TouchableOpacity key={i} style={[styles.calDay, sel && styles.calDaySel]}
                    onPress={() => setSelectedDate(d)} activeOpacity={0.8}>
                    <Text style={[styles.calDayName, sel && styles.calDayNameSel]}>{d.day}</Text>
                    <Text style={[styles.calDayNum,  sel && styles.calDayNumSel]}>{d.label}</Text>
                    {i === 0 && !sel && <View style={styles.todayDot} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.calBanner}>
              <Ionicons name="checkmark-circle" size={13} color={RED} />
              <Text style={styles.calBannerText}>
                {selectedDate.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          </View>

          {/* ── Duration ── */}
          <SectionLabel icon="hourglass-outline" text="Event Duration" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled
            decelerationRate="fast" snapToInterval={54} snapToAlignment="start"
            contentContainerStyle={styles.chipRow}>
            {DURATIONS.map(h => {
              const active = duration === h;
              return (
                <TouchableOpacity key={h} style={[styles.durationChip, active && styles.durationChipActive]}
                  onPress={() => setDuration(h)} activeOpacity={0.8}>
                  <Text style={[styles.durationNum, active && styles.durationNumActive]}>{h}</Text>
                  <Text style={[styles.durationUnit, active && styles.durationUnitActive]}>hr{parseInt(h) > 1 ? 's' : ''}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Agent Type ── */}
          <SectionLabel icon="shield-outline" text="Agent Type" />
          {AGENT_TYPES.map(ag => {
            const active = agentType === ag.id;
            return (
              <TouchableOpacity key={ag.id} style={[styles.agentRow, active && styles.agentRowActive]}
                onPress={() => setAgentType(ag.id)} activeOpacity={0.85}>
                <LinearGradient colors={active ? ['#3A0808', '#5C0E0E'] : ['#1C1C1C', '#161616']} style={styles.agentRowGrad}>
                  <View style={[styles.agentIcon, { backgroundColor: active ? RED_DIM : Colors.surface3, borderColor: active ? RED : Colors.border }]}>
                    <Ionicons name={ag.icon} size={18} color={active ? '#FF7070' : Colors.steel} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.agentLabel, active && { color: Colors.textPrimary }]}>{ag.label}</Text>
                    <Text style={styles.agentSub}>{ag.sub}</Text>
                  </View>
                  <Text style={[styles.agentRate, active && { color: '#FF7070' }]}>${ag.rate}/hr</Text>
                  {active && <Ionicons name="checkmark-circle" size={18} color={RED} />}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {/* ── Number of Agents + Attire ── */}
          <View style={styles.configRow}>
            <View style={styles.configBox}>
              <Text style={styles.configLabel}>Agents</Text>
              <View style={styles.stepper}>
                <TouchableOpacity style={styles.stepBtn}
                  onPress={() => setAgentCount(c => Math.max(1, c - 1))} activeOpacity={0.7}>
                  <Ionicons name="remove" size={18} color={agentCount === 1 ? Colors.surface3 : Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.stepCount}>{agentCount}</Text>
                <TouchableOpacity style={styles.stepBtn}
                  onPress={() => setAgentCount(c => Math.min(20, c + 1))} activeOpacity={0.7}>
                  <Ionicons name="add" size={18} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.configBox, { flex: 1.8 }]}>
              <Text style={styles.configLabel}>Attire</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                <View style={styles.attireRow}>
                  {ATTIRE.map(a => (
                    <TouchableOpacity key={a.id}
                      style={[styles.attireChip, attire === a.id && styles.attireChipActive]}
                      onPress={() => setAttire(a.id)} activeOpacity={0.8}>
                      <Ionicons name={a.icon} size={13} color={attire === a.id ? Colors.textPrimary : Colors.steel} />
                      <Text style={[styles.attireText, attire === a.id && styles.attireTextActive]}>{a.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* ── Special Instructions ── */}
          <SectionLabel icon="create-outline" text="Special Instructions (Optional)" />
          <View style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              placeholder="VIP guests, threat concerns, venue access notes, specific agent requests..."
              placeholderTextColor={Colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* ── Summary ── */}
          <LinearGradient colors={['#1C0000', '#0E0E0E']} style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="document-text-outline" size={16} color={RED} />
              <Text style={styles.summaryTitle}>Event Brief Summary</Text>
            </View>
            <View style={styles.summaryDivider} />
            {[
              { label: 'Event',    value: EVENT_TYPES.find(e => e.id === eventType)?.label ?? '' },
              { label: 'Date',     value: selectedDate.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
              { label: 'Duration', value: `${duration} hours` },
              { label: 'Venue',    value: venue || 'Not entered' },
              { label: 'Agents',   value: `${agentCount} × ${agent.label}` },
              { label: 'Attire',   value: ATTIRE.find(a => a.id === attire)?.label ?? '' },
            ].map(row => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={[styles.summaryValue, !venue && row.label === 'Venue' && { color: Colors.textMuted }]}>
                  {row.value}
                </Text>
              </View>
            ))}
            <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalLabel}>Estimated Total</Text>
              <Text style={styles.summaryTotalValue}>${estTotal.toLocaleString()}</Text>
            </View>
          </LinearGradient>

          {/* Submitted confirmation */}
          {submitted && (
            <View style={styles.confirmedCard}>
              <Ionicons name="checkmark-circle" size={28} color="#4ADE80" />
              <View style={{ flex: 1 }}>
                <Text style={styles.confirmedTitle}>Request Submitted</Text>
                <Text style={styles.confirmedSub}>A LOBO coordinator will contact you within 15 minutes to confirm your event detail.</Text>
              </View>
            </View>
          )}

        </Animated.View>
      </ScrollView>

      {/* ── Sticky CTA ── */}
      {!submitted && (
        <View style={[styles.stickyBar, {
          bottom: tabBarHeight,
          paddingLeft:  Math.max(Spacing.base, insets.left  + Spacing.base),
          paddingRight: Math.max(Spacing.base, insets.right + Spacing.base),
        }]}>
          <View style={styles.stickyInfo}>
            <View style={styles.stickyChip}>
              <Ionicons name="sparkles" size={12} color={RED} />
              <Text style={styles.stickyChipText}>{EVENT_TYPES.find(e => e.id === eventType)?.label} · {duration}h</Text>
            </View>
            <Text style={styles.stickyPrice}>${estTotal.toLocaleString()} <Text style={styles.stickyPriceSub}>est.</Text></Text>
          </View>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.ctaBtn}
              activeOpacity={0.88}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={isReady ? ['#8B0000', RED] : ['#2A2A2A', '#222']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.ctaGrad}
              >
                <Ionicons name="sparkles" size={20} color={isReady ? '#fff' : Colors.steel} />
                <View>
                  <Text style={[styles.ctaTitle, !isReady && { color: Colors.steel }]}>
                    {isReady ? 'Submit Event Request' : 'Add venue to continue'}
                  </Text>
                  <Text style={styles.ctaSub}>
                    {isReady
                      ? `${agentCount} agent${agentCount > 1 ? 's' : ''} · ${agent.label} · $${estTotal.toLocaleString()} est.`
                      : 'Enter your venue / event location above'}
                  </Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={24} color={isReady ? '#fff' : Colors.steel} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {submitted && (
        <View style={[styles.stickyBar, {
          bottom: tabBarHeight,
          paddingLeft:  Math.max(Spacing.base, insets.left  + Spacing.base),
          paddingRight: Math.max(Spacing.base, insets.right + Spacing.base),
        }]}>
          <TouchableOpacity style={styles.doneBtn} activeOpacity={0.85}
            onPress={() => navigation.navigate('HomeMain')}>
            <LinearGradient colors={['#0A3A0A', '#1A5C1A']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGrad}>
              <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
              <Text style={styles.doneText}>Confirmed — Return Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

function SectionLabel({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={sl.row}>
      <Ionicons name={icon} size={13} color={Colors.textMuted} />
      <Text style={sl.text}>{text}</Text>
    </View>
  );
}
const sl = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.xl, marginBottom: Spacing.sm },
  text: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold, letterSpacing: 1.4, textTransform: 'uppercase' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy, letterSpacing: 0.5 },
  headerSub:   { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 1 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: RED_DIM, borderWidth: 1, borderColor: RED_BORDER,
    borderRadius: BorderRadius.sm, paddingHorizontal: 10, paddingVertical: 4,
  },
  headerBadgeText: { color: '#FF6B6B', fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },

  scroll: { paddingHorizontal: Spacing.base },

  // Event type grid
  eventGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  eventCard: {
    width: '30.5%', borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.border, overflow: 'hidden',
  },
  eventCardActive: { borderColor: RED },
  eventCardGrad: { padding: Spacing.sm, alignItems: 'center', gap: 5, minHeight: 90, justifyContent: 'center' },
  eventIcon: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  eventLabel:       { color: Colors.textMuted, fontSize: 10, fontWeight: Typography.weight.bold, textAlign: 'center' },
  eventLabelActive: { color: Colors.textPrimary },
  eventGuests:      { color: Colors.textMuted, fontSize: 9, textAlign: 'center' },
  eventCheck: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: RED, alignItems: 'center', justifyContent: 'center',
  },

  // Venue input
  inputCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: 13, gap: Spacing.sm,
  },
  input: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base, paddingVertical: 0 },

  // Calendar
  calCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  calMonthRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  calMonth: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold },
  calContent: { paddingHorizontal: Spacing.base, gap: 8, paddingBottom: Spacing.md, paddingRight: Spacing.xl },
  calDay: {
    width: 52, alignItems: 'center', paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface3, gap: 4,
  },
  calDaySel:     { backgroundColor: RED_DIM, borderColor: RED },
  calDayName:    { color: Colors.textMuted, fontSize: 10, fontWeight: Typography.weight.semiBold, textTransform: 'uppercase' },
  calDayNameSel: { color: '#FF7070' },
  calDayNum:     { color: Colors.textSecondary, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  calDayNumSel:  { color: Colors.textPrimary },
  todayDot:      { width: 5, height: 5, borderRadius: 3, backgroundColor: RED },
  calBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: RED_DIM, borderTopWidth: 1, borderTopColor: RED_BORDER,
  },
  calBannerText: { color: Colors.textSecondary, fontSize: Typography.size.xs },

  // Duration chips
  chipRow: { paddingHorizontal: Spacing.base, gap: 8, paddingRight: Spacing.base },
  durationChip: {
    width: 52, height: 52, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  durationChipActive: { backgroundColor: RED_DIM, borderColor: RED },
  durationNum:        { color: Colors.steel, fontSize: Typography.size.md, fontWeight: Typography.weight.bold, lineHeight: 20 },
  durationNumActive:  { color: Colors.textPrimary },
  durationUnit:       { color: Colors.textMuted, fontSize: 9 },
  durationUnitActive: { color: '#FF7070' },

  // Agent type rows
  agentRow: {
    borderRadius: BorderRadius.lg, overflow: 'hidden',
    borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  agentRowActive: { borderColor: RED },
  agentRowGrad: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base, gap: Spacing.md,
  },
  agentIcon: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0,
  },
  agentLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  agentSub:   { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  agentRate:  { color: Colors.steel, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold },

  // Config row
  configRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  configBox: {
    flex: 1, backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm,
  },
  configLabel: {
    color: Colors.textMuted, fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold, letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm,
  },
  stepper:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepBtn:  {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  stepCount: { color: Colors.textPrimary, fontSize: Typography.size.xl, fontWeight: Typography.weight.bold, minWidth: 26, textAlign: 'center' },
  attireRow:  { flexDirection: 'row', gap: 7 },
  attireChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface3, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 10, paddingVertical: 7,
  },
  attireChipActive: { borderColor: Colors.textPrimary, backgroundColor: 'rgba(255,255,255,0.08)' },
  attireText:       { color: Colors.steel, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  attireTextActive: { color: Colors.textPrimary },

  // Notes
  notesCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.base,
  },
  notesInput: { color: Colors.textPrimary, fontSize: Typography.size.sm, lineHeight: 20, minHeight: 64, textAlignVertical: 'top' },

  // Summary
  summaryCard: {
    borderRadius: BorderRadius.lg, padding: Spacing.base,
    marginTop: Spacing.lg, borderWidth: 1, borderColor: RED_BORDER,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryTitle:  { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  summaryDivider: { height: 1, backgroundColor: RED_BORDER, marginVertical: Spacing.md },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 5,
  },
  summaryLabel: { color: Colors.textMuted, fontSize: Typography.size.sm },
  summaryValue: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  summaryTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing.sm, paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: RED_BORDER,
  },
  summaryTotalLabel: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  summaryTotalValue: { color: '#FF6B6B', fontSize: Typography.size.xl, fontWeight: Typography.weight.bold },

  // Confirmed
  confirmedCard: {
    flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start',
    backgroundColor: 'rgba(10,58,10,0.4)', borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)',
    padding: Spacing.base, marginTop: Spacing.lg,
  },
  confirmedTitle: { color: '#4ADE80', fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  confirmedSub:   { color: 'rgba(255,255,255,0.55)', fontSize: Typography.size.xs, lineHeight: 16, marginTop: 3 },

  // Sticky
  stickyBar: {
    position: 'absolute', left: 0, right: 0,
    paddingTop: Spacing.md, paddingBottom: Spacing.md, paddingHorizontal: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  stickyInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  stickyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: RED_DIM, borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: RED_BORDER,
  },
  stickyChipText: { color: '#FF7070', fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold },
  stickyPrice:    { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  stickyPriceSub: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.normal },
  ctaBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  ctaGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  ctaTitle: { color: '#fff', fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  ctaSub:   { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 1 },
  doneBtn:  { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  doneText: { flex: 1, color: '#4ADE80', fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
});
