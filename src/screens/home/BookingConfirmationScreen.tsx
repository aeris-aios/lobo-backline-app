import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

export type BookingConfirmationParams = {
  service:    string;
  date:       string;
  time:       string;
  hours:      string;
  agentCount: number;
  attire:     string;
  estTotal:   number;
};

type RouteType = RouteProp<{ BookingConfirmation: BookingConfirmationParams }, 'BookingConfirmation'>;

const STEPS = [
  { icon: 'document-text-outline'   as const, text: 'Booking request received' },
  { icon: 'shield-checkmark-outline'as const, text: 'Agent assignment in progress' },
  { icon: 'call-outline'            as const, text: 'Agent will contact you to finalize' },
  { icon: 'lock-closed-outline'     as const, text: 'Mission details secured & confidential' },
];

export default function BookingConfirmationScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route      = useRoute<RouteType>();

  const {
    service = 'Armed EP', date = '', time = '', hours = '4',
    agentCount = 1, attire = 'Executive Suit', estTotal = 1000,
  } = route.params ?? {};

  // Animations
  const shieldScale   = useRef(new Animated.Value(0.4)).current;
  const shieldOpac    = useRef(new Animated.Value(0)).current;
  const ringScale     = useRef(new Animated.Value(0.6)).current;
  const ringOpac      = useRef(new Animated.Value(0.8)).current;
  const cardY         = useRef(new Animated.Value(50)).current;
  const cardOpac      = useRef(new Animated.Value(0)).current;
  const stepAnims     = STEPS.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    // Shield pop-in
    Animated.sequence([
      Animated.parallel([
        Animated.spring(shieldScale, { toValue: 1.1, useNativeDriver: true, speed: 14, bounciness: 10 }),
        Animated.timing(shieldOpac,  { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
      Animated.spring(shieldScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
    ]).start();

    // Ring pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.4, duration: 1100, useNativeDriver: true }),
          Animated.timing(ringOpac,  { toValue: 0,   duration: 1100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpac,  { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Card slide up
    Animated.parallel([
      Animated.timing(cardY,    { toValue: 0, duration: 500, useNativeDriver: true, delay: 200 }),
      Animated.timing(cardOpac, { toValue: 1, duration: 500, useNativeDriver: true, delay: 200 }),
    ]).start();

    // Steps stagger in
    STEPS.forEach((_, i) => {
      Animated.timing(stepAnims[i], {
        toValue: 1, duration: 340, useNativeDriver: true, delay: 500 + i * 180,
      }).start();
    });
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >
        {/* ── Hero ── */}
        <View style={styles.heroWrap}>
          {/* Pulse ring */}
          <Animated.View
            pointerEvents="none"
            style={[styles.pulseRing, { transform: [{ scale: ringScale }], opacity: ringOpac }]}
          />
          {/* Shield icon */}
          <Animated.View style={[styles.shieldWrap, { transform: [{ scale: shieldScale }], opacity: shieldOpac }]}>
            <LinearGradient colors={['#8B0000', Colors.crimson]} style={styles.shieldGrad}>
              <Ionicons name="shield-checkmark" size={48} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* ── Message ── */}
        <Text style={styles.thankTitle}>Thank You for Booking</Text>
        <Text style={styles.thankBrand}>with LOBO EP</Text>
        <Text style={styles.thankBody}>
          An agent will contact you shortly with further details to finalize the mission. All communication is secure and confidential.
        </Text>

        {/* ── Booking Summary ── */}
        <Animated.View style={{ opacity: cardOpac, transform: [{ translateY: cardY }] }}>
          <LinearGradient colors={['#1C0000', '#0E0E0E']} style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="document-text" size={16} color={Colors.crimson} />
              <Text style={styles.summaryTitle}>Mission Brief</Text>
              <View style={styles.confirmedBadge}>
                <View style={styles.confirmedDot} />
                <Text style={styles.confirmedBadgeText}>CONFIRMED</Text>
              </View>
            </View>
            <View style={styles.divider} />
            {[
              { icon: 'shield-outline'    as const, label: 'Service',  value: service },
              { icon: 'calendar-outline'  as const, label: 'Date',     value: date },
              { icon: 'time-outline'      as const, label: 'Time',     value: time },
              { icon: 'hourglass-outline' as const, label: 'Duration', value: `${hours} hours` },
              { icon: 'person-outline'    as const, label: 'Agents',   value: `${agentCount}` },
              { icon: 'briefcase-outline' as const, label: 'Attire',   value: attire },
            ].map(row => (
              <View key={row.label} style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <Ionicons name={row.icon} size={13} color={Colors.textMuted} />
                  <Text style={styles.summaryLabel}>{row.label}</Text>
                </View>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>${estTotal.toLocaleString()}</Text>
            </View>
          </LinearGradient>

          {/* ── What Happens Next ── */}
          <Text style={styles.nextTitle}>What Happens Next</Text>
          <View style={styles.stepsCard}>
            {STEPS.map((step, i) => (
              <Animated.View
                key={step.text}
                style={[styles.stepRow, { opacity: stepAnims[i], transform: [{ translateX: stepAnims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
              >
                <View style={styles.stepIconWrap}>
                  <Ionicons name={step.icon} size={16} color={Colors.crimson} />
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </Animated.View>
            ))}
          </View>

          {/* ── Discretion note ── */}
          <View style={styles.noteCard}>
            <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.noteText}>
              LOBO EP maintains strict operational security. Your booking details, agent assignment, and mission plan are never shared with unauthorized parties.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Sticky Return CTA ── */}
      <View style={[styles.stickyBar, {
        paddingBottom: Math.max(insets.bottom, Spacing.md) + Spacing.sm,
        paddingLeft:   Math.max(Spacing.base, insets.left  + Spacing.base),
        paddingRight:  Math.max(Spacing.base, insets.right + Spacing.base),
      }]}>
        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('HomeMain')}
        >
          <LinearGradient
            colors={[Colors.crimsonDark, Colors.crimson]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.homeBtnGrad}
          >
            <Ionicons name="shield" size={20} color="#fff" />
            <Text style={styles.homeBtnText}>Return to LOBO Home</Text>
            <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  scroll: { paddingHorizontal: Spacing.base, alignItems: 'center' },

  // Hero
  heroWrap: { alignItems: 'center', justifyContent: 'center', marginTop: Spacing['2xl'], marginBottom: Spacing.lg, height: 130 },
  pulseRing: {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 2, borderColor: Colors.crimson,
  },
  shieldWrap: { borderRadius: 32, overflow: 'hidden', ...Shadows.crimson },
  shieldGrad: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },

  // Message
  thankTitle: {
    color: Colors.textPrimary, fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.heavy, textAlign: 'center', letterSpacing: 0.3,
  },
  thankBrand: {
    color: Colors.crimson, fontSize: Typography.size.xl,
    fontWeight: Typography.weight.heavy, textAlign: 'center',
    letterSpacing: 1, marginBottom: Spacing.base,
  },
  thankBody: {
    color: 'rgba(255,255,255,0.6)', fontSize: Typography.size.sm,
    lineHeight: 22, textAlign: 'center', marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },

  // Summary
  summaryCard: {
    width: '100%', borderRadius: BorderRadius.lg, padding: Spacing.base,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.3)', ...Shadows.md,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryTitle:  { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  confirmedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(139,0,0,0.15)', borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.4)',
    paddingHorizontal: 8, paddingVertical: 3,
  },
  confirmedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.crimson },
  confirmedBadgeText: { color: Colors.crimsonLight, fontSize: 9, fontWeight: Typography.weight.bold, letterSpacing: 1 },
  divider: { height: 1, backgroundColor: 'rgba(139,0,0,0.2)', marginVertical: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  summaryLabel: { color: Colors.textMuted, fontSize: Typography.size.sm },
  summaryValue: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing.sm, paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(139,0,0,0.2)',
  },
  totalLabel: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  totalValue: { color: Colors.crimsonLight, fontSize: Typography.size.xl, fontWeight: Typography.weight.bold },

  // Steps
  nextTitle: {
    color: Colors.textPrimary, fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold, marginTop: Spacing.xl, marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  stepsCard: {
    width: '100%', backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: 2,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  stepIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(139,0,0,0.12)', borderWidth: 1, borderColor: 'rgba(139,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepText: { flex: 1, color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 18 },

  // Note
  noteCard: {
    width: '100%', flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  noteText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },

  // Sticky
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingTop: Spacing.md, paddingHorizontal: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  homeBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  homeBtnGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  homeBtnText: { flex: 1, color: '#fff', fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
});
