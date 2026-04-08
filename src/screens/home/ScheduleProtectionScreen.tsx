import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

// ─── Types ─────────────────────────────────────────────────────────────────
type ServiceId = 'armed_ep' | 'unarmed_ep' | 'blackline' | 'family_ep';
type AttireId  = 'suited' | 'plain_clothes' | 'tactical';

// ─── Static Data ───────────────────────────────────────────────────────────
const SERVICES: {
  id: ServiceId; label: string; sub: string;
  icon: keyof typeof Ionicons.glyphMap; rate: number; color: string; desc: string;
}[] = [
  { id: 'armed_ep',   label: 'Armed EP',   sub: '$250/hr', icon: 'shield-checkmark', rate: 250, color: Colors.crimson,  desc: 'Armed close protection specialist' },
  { id: 'unarmed_ep', label: 'Unarmed EP', sub: '$175/hr', icon: 'person',           rate: 175, color: Colors.steel,    desc: 'Unarmed professional EP agent' },
  { id: 'blackline',  label: 'Blackline',  sub: '$150/hr', icon: 'car-sport',        rate: 150, color: '#C9A84C',       desc: 'Premium secure transport driver' },
  { id: 'family_ep',  label: 'Family EP',  sub: '$200/hr', icon: 'people',           rate: 200, color: '#C9A84C',       desc: 'Family escort & school runs' },
];

const ATTIRE: { id: AttireId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'suited',        label: 'Executive Suit', icon: 'briefcase-outline' },
  { id: 'plain_clothes', label: 'Plain Clothes',  icon: 'person-outline' },
  { id: 'tactical',      label: 'Tactical',       icon: 'shield-outline' },
];

const HOURS = ['1', '2', '3', '4', '6', '8', '12'];

const TIME_SLOTS = [
  '12:00 AM','1:00 AM','2:00 AM','3:00 AM','4:00 AM','5:00 AM',
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM',
];

// Build calendar: current month + next
function buildCalendar() {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth();
  const days: { date: Date; label: string; day: string; disabled: boolean }[] = [];
  // Show next 35 days
  for (let i = 0; i < 35; i++) {
    const d = new Date(year, month, today.getDate() + i);
    days.push({
      date: d,
      label: d.getDate().toString(),
      day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
      disabled: false,
    });
  }
  return days;
}

const CALENDAR_DAYS = buildCalendar();

// ─── Component ─────────────────────────────────────────────────────────────
export default function ScheduleProtectionScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [pickup, setPickup]               = useState('');
  const [destination, setDestination]     = useState('');
  const [selectedDate, setSelectedDate]   = useState(CALENDAR_DAYS[0]);
  const [selectedTime, setSelectedTime]   = useState('9:00 AM');
  const [activeService, setActiveService] = useState<ServiceId>('armed_ep');
  const [attire, setAttire]               = useState<AttireId>('suited');
  const [agentCount, setAgentCount]       = useState(1);
  const [hours, setHours]                 = useState('4');
  const [notes, setNotes]                 = useState('');

  const service    = SERVICES.find(s => s.id === activeService)!;
  const isReady    = pickup.length > 0 && destination.length > 0;
  const estTotal   = parseInt(hours) * service.rate * agentCount;
  const estMiles   = isReady ? '6.4' : null;

  // Month label for calendar header
  const monthLabel = selectedDate.date.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Schedule Protection</Text>
          <Text style={styles.headerSub}>Plan your security detail in advance</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="calendar" size={12} color={Colors.crimson} />
          <Text style={styles.headerBadgeText}>SCHEDULE</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 140 }]}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >

        {/* ── Location Inputs ── */}
        <SectionLabel icon="navigate-outline" text="Coverage Location" />
        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.dotGreen} />
            <TextInput
              style={styles.locationInput}
              placeholder="Pickup / Start location"
              placeholderTextColor={Colors.textMuted}
              value={pickup}
              onChangeText={setPickup}
              returnKeyType="next"
            />
            {pickup.length > 0
              ? <TouchableOpacity onPress={() => setPickup('')}><Ionicons name="close-circle" size={18} color={Colors.steel} /></TouchableOpacity>
              : <TouchableOpacity><Ionicons name="locate-outline" size={18} color={Colors.crimson} /></TouchableOpacity>
            }
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationRow}>
            <View style={styles.dotRed} />
            <TextInput
              style={styles.locationInput}
              placeholder="Destination / End location"
              placeholderTextColor={Colors.textMuted}
              value={destination}
              onChangeText={setDestination}
              returnKeyType="done"
            />
            {destination.length > 0
              ? <TouchableOpacity onPress={() => setDestination('')}><Ionicons name="close-circle" size={18} color={Colors.steel} /></TouchableOpacity>
              : <TouchableOpacity><Ionicons name="search-outline" size={18} color={Colors.steel} /></TouchableOpacity>
            }
          </View>
          {isReady && (
            <View style={styles.distanceRow}>
              <Ionicons name="navigate" size={13} color={Colors.crimson} />
              <Text style={styles.distanceText}>Estimated distance: <Text style={styles.distanceVal}>{estMiles} miles</Text></Text>
            </View>
          )}
        </View>

        {/* ── Date Picker (calendar strip) ── */}
        <SectionLabel icon="calendar-outline" text="Select Date" />
        <View style={styles.calendarWrap}>
          <View style={styles.calMonthRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.calMonthText}>{monthLabel}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            decelerationRate="fast"
            style={styles.hScroll}
            contentContainerStyle={styles.calScrollContent}
          >
            {CALENDAR_DAYS.map((d, i) => {
              const isSelected = d.date.toDateString() === selectedDate.date.toDateString();
              const isToday    = i === 0;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.calDay, isSelected && styles.calDaySelected]}
                  onPress={() => setSelectedDate(d)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.calDayName, isSelected && styles.calDayNameSel]}>{d.day}</Text>
                  <Text style={[styles.calDayNum, isSelected && styles.calDayNumSel]}>{d.label}</Text>
                  {isToday && !isSelected && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.selectedDateBanner}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.crimson} />
            <Text style={styles.selectedDateText}>
              {selectedDate.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* ── Time Picker ── */}
        <SectionLabel icon="time-outline" text="Select Time" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          style={styles.hScroll}
          contentContainerStyle={styles.hScrollContent}
        >
          {TIME_SLOTS.map(t => {
            const active = selectedTime === t;
            const isAM   = t.includes('AM');
            return (
              <TouchableOpacity
                key={t}
                style={[styles.timeChip, active && styles.timeChipActive]}
                onPress={() => setSelectedTime(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeText, active && styles.timeTextActive]}>{t.replace(' AM','').replace(' PM','')}</Text>
                <Text style={[styles.timePeriod, active && styles.timePeriodActive, !isAM && styles.timePeriodPM]}>{isAM ? 'AM' : 'PM'}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected time banner */}
        <View style={styles.selectedTimeBanner}>
          <Ionicons name="time" size={14} color={Colors.crimson} />
          <Text style={styles.selectedTimeText}>
            Detail starts at <Text style={styles.selectedTimeVal}>{selectedTime}</Text> on{' '}
            {selectedDate.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {/* ── Coverage Duration ── */}
        <SectionLabel icon="hourglass-outline" text="Coverage Duration" />
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

        {/* ── Agent Type ── */}
        <SectionLabel icon="shield-outline" text="Type of Agent" />
        <View style={styles.agentGrid}>
          {SERVICES.map(svc => {
            const active = activeService === svc.id;
            return (
              <TouchableOpacity
                key={svc.id}
                style={[styles.agentCard, active && { borderColor: svc.color }]}
                onPress={() => setActiveService(svc.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={active ? [`${svc.color}20`, `${svc.color}08`] : ['#1C1C1C', '#161616']}
                  style={styles.agentCardGrad}
                >
                  <View style={styles.agentCardTop}>
                    <View style={[styles.agentIconWrap, active && { backgroundColor: `${svc.color}20`, borderColor: `${svc.color}40` }]}>
                      <Ionicons name={svc.icon} size={20} color={active ? svc.color : Colors.steel} />
                    </View>
                    {active && (
                      <View style={[styles.agentCheck, { backgroundColor: svc.color }]}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.agentLabel, active && { color: svc.color }]}>{svc.label}</Text>
                  <Text style={styles.agentDesc}>{svc.desc}</Text>
                  <Text style={[styles.agentRate, active && { color: svc.color }]}>{svc.sub}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Number of Agents + Attire ── */}
        <View style={styles.configRow}>
          <View style={styles.configBox}>
            <Text style={styles.configLabel}>Agents</Text>
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

          <View style={[styles.configBox, { flex: 1.8 }]}>
            <Text style={styles.configLabel}>Attire</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
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

        {/* ── Special Instructions ── */}
        <SectionLabel icon="create-outline" text="Special Instructions (Optional)" />
        <View style={styles.notesCard}>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. VIP client, meet at lobby, armed required due to threat level..."
            placeholderTextColor={Colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* ── Full Booking Summary ── */}
        <LinearGradient colors={['#1C0000', '#0E0E0E']} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="document-text-outline" size={16} color={Colors.crimson} />
            <Text style={styles.summaryTitle}>Booking Summary</Text>
          </View>
          <View style={styles.summaryDivider} />
          {[
            { icon: 'calendar-outline' as const,   label: 'Date',     value: selectedDate.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
            { icon: 'time-outline' as const,        label: 'Time',     value: selectedTime },
            { icon: 'hourglass-outline' as const,   label: 'Duration', value: `${hours} hour${parseInt(hours) > 1 ? 's' : ''}` },
            { icon: 'navigate-outline' as const,    label: 'Distance', value: estMiles ? `${estMiles} mi` : 'Enter locations' },
            { icon: 'shield-outline' as const,      label: 'Service',  value: service.label },
            { icon: 'person-outline' as const,      label: 'Agents',   value: `${agentCount}` },
            { icon: 'briefcase-outline' as const,   label: 'Attire',   value: ATTIRE.find(a => a.id === attire)?.label ?? '' },
            { icon: 'pricetag-outline' as const,    label: 'Rate',     value: `$${service.rate}/hr per agent` },
          ].map(row => (
            <View key={row.label} style={styles.summaryRow}>
              <View style={styles.summaryRowLeft}>
                <Ionicons name={row.icon} size={14} color={Colors.textMuted} />
                <Text style={styles.summaryLabel}>{row.label}</Text>
              </View>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Estimated Total</Text>
            <Text style={styles.summaryTotalValue}>${estTotal.toLocaleString()}</Text>
          </View>
        </LinearGradient>

        {/* ── FBI Cleared note ── */}
        <View style={styles.safetyNote}>
          <Ionicons name="shield-checkmark-outline" size={15} color={Colors.textMuted} />
          <Text style={styles.safetyText}>
            All LOBO agents are FBI-cleared and licensed. A coordinator will contact you within 15 minutes to confirm your scheduled detail.
          </Text>
        </View>

      </ScrollView>

      {/* ── Sticky Schedule CTA ── */}
      <View style={[styles.stickyBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <View style={styles.stickyInfo}>
          <View style={styles.stickyDateChip}>
            <Ionicons name="calendar" size={13} color={Colors.crimson} />
            <Text style={styles.stickyDateText}>
              {selectedDate.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {selectedTime}
            </Text>
          </View>
          <Text style={styles.stickyPrice}>${estTotal.toLocaleString()} <Text style={styles.stickyPriceSub}>est.</Text></Text>
        </View>
        <TouchableOpacity style={styles.scheduleBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={isReady ? [Colors.crimsonDark, Colors.crimson] : ['#333', '#2A2A2A']}
            style={styles.scheduleBtnGrad}
          >
            <Ionicons name="calendar-sharp" size={18} color={isReady ? Colors.white : Colors.steel} />
            <View>
              <Text style={[styles.scheduleBtnTitle, !isReady && { color: Colors.steel }]}>Schedule Detail</Text>
              <Text style={styles.scheduleBtnSub}>{isReady ? `${service.label} · ${hours}h` : 'Add locations to confirm'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─── Section Label ──────────────────────────────────────────────────────────
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

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.size.md, fontWeight: Typography.weight.heavy, letterSpacing: 0.5 },
  headerSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 1 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(139,0,0,0.12)', borderWidth: 1, borderColor: Colors.crimsonDark,
    borderRadius: BorderRadius.sm, paddingHorizontal: 10, paddingVertical: 4,
  },
  headerBadgeText: { color: Colors.crimsonLight, fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },

  scroll: { paddingHorizontal: Spacing.base },

  // Location
  locationCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', ...Shadows.sm,
  },
  locationRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: 13, gap: Spacing.sm,
  },
  locationDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.base },
  dotGreen: { width: 11, height: 11, borderRadius: 6, backgroundColor: Colors.successLight },
  dotRed: { width: 11, height: 11, borderRadius: 6, backgroundColor: Colors.crimson },
  locationInput: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base, paddingVertical: 0 },
  distanceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.base, paddingVertical: 9,
    backgroundColor: 'rgba(139,0,0,0.06)',
    borderTopWidth: 1, borderTopColor: 'rgba(139,0,0,0.15)',
  },
  distanceText: { color: Colors.textMuted, fontSize: Typography.size.xs },
  distanceVal: { color: Colors.crimsonLight, fontWeight: Typography.weight.semiBold },

  // Calendar
  calendarWrap: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  calMonthRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  calMonthText: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold },
  hScroll: { marginHorizontal: 0 },
  calScrollContent: { paddingHorizontal: Spacing.base, gap: 8, paddingBottom: Spacing.md, paddingRight: Spacing.xl },
  calDay: {
    width: 52, alignItems: 'center', paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface3, gap: 4,
  },
  calDaySelected: { backgroundColor: 'rgba(139,0,0,0.2)', borderColor: Colors.crimson },
  calDayName: { color: Colors.textMuted, fontSize: 10, fontWeight: Typography.weight.semiBold, textTransform: 'uppercase' },
  calDayNameSel: { color: Colors.crimsonLight },
  calDayNum: { color: Colors.textSecondary, fontSize: Typography.size.lg, fontWeight: Typography.weight.bold },
  calDayNumSel: { color: Colors.textPrimary },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.crimson },
  selectedDateBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(139,0,0,0.06)',
    borderTopWidth: 1, borderTopColor: 'rgba(139,0,0,0.15)',
  },
  selectedDateText: { color: Colors.textSecondary, fontSize: Typography.size.xs },

  // Shared horizontal scroll
  hScrollContent: { paddingHorizontal: Spacing.base, gap: Spacing.sm, paddingRight: Spacing.xl },

  // Time chips
  timeChip: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
    minWidth: 64, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface2,
  },
  timeChipActive: { backgroundColor: 'rgba(139,0,0,0.18)', borderColor: Colors.crimson },
  timeText: { color: Colors.steel, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  timeTextActive: { color: Colors.textPrimary },
  timePeriod: { color: Colors.textMuted, fontSize: 9, marginTop: 1 },
  timePeriodActive: { color: Colors.crimsonLight },
  timePeriodPM: { color: Colors.steel },

  // Selected time banner
  selectedTimeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(139,0,0,0.06)', borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.2)',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, marginTop: Spacing.sm,
  },
  selectedTimeText: { color: Colors.textSecondary, fontSize: Typography.size.xs },
  selectedTimeVal: { color: Colors.crimsonLight, fontWeight: Typography.weight.bold },

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

  // Agent type grid
  agentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  agentCard: {
    width: '47.5%', borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.border, overflow: 'hidden',
  },
  agentCardGrad: { padding: Spacing.base, gap: 4, minHeight: 110 },
  agentCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  agentIconWrap: {
    width: 38, height: 38, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  agentCheck: {
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  agentLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  agentDesc: { color: Colors.textMuted, fontSize: 10, lineHeight: 14, marginTop: 2 },
  agentRate: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold, marginTop: 4 },

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
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  stepCount: { color: Colors.textPrimary, fontSize: Typography.size.xl, fontWeight: Typography.weight.bold, minWidth: 26, textAlign: 'center' },
  attireRow: { flexDirection: 'row', gap: 7 },
  attireChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface3, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 10, paddingVertical: 7,
  },
  attireChipActive: { borderColor: Colors.textPrimary, backgroundColor: 'rgba(255,255,255,0.08)' },
  attireText: { color: Colors.steel, fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  attireTextActive: { color: Colors.textPrimary },

  // Notes
  notesCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.base,
  },
  notesInput: {
    color: Colors.textPrimary, fontSize: Typography.size.sm,
    lineHeight: 20, minHeight: 64, textAlignVertical: 'top',
  },

  // Summary card
  summaryCard: {
    borderRadius: BorderRadius.lg, padding: Spacing.base,
    marginTop: Spacing.lg, borderWidth: 1, borderColor: 'rgba(139,0,0,0.2)',
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryTitle: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  summaryDivider: { height: 1, backgroundColor: 'rgba(139,0,0,0.15)', marginVertical: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  summaryRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  summaryLabel: { color: Colors.textMuted, fontSize: Typography.size.sm },
  summaryValue: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  summaryTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing.sm, paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(139,0,0,0.2)',
  },
  summaryTotalLabel: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  summaryTotalValue: { color: Colors.crimsonLight, fontSize: Typography.size.xl, fontWeight: Typography.weight.bold },

  // Safety note
  safetyNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginTop: Spacing.lg,
  },
  safetyText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },

  // Sticky bar
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.sm,
    ...Shadows.lg,
  },
  stickyInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  stickyDateChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(139,0,0,0.1)', borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.25)',
  },
  stickyDateText: { color: Colors.crimsonLight, fontSize: Typography.size.xs, fontWeight: Typography.weight.semiBold },
  stickyPrice: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  stickyPriceSub: { color: Colors.textMuted, fontSize: Typography.size.xs, fontWeight: Typography.weight.normal },
  scheduleBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadows.crimson },
  scheduleBtnGrad: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, gap: Spacing.md },
  scheduleBtnTitle: { color: Colors.white, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  scheduleBtnSub: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 1 },
});
