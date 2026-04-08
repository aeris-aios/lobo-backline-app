import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

// ─── Param types ────────────────────────────────────────────────────────────
export type RequestNowParams = {
  pickup:      string;
  destination: string;
  service:     string;
  serviceColor:string;
  hours:       string;
  agentCount:  number;
  attire:      string;
  rate:        number;
  estTotal:    number;
  requiresArmed: boolean;
};

type RouteType = RouteProp<{ RequestNow: RequestNowParams }, 'RequestNow'>;

// ─── Mission Steps (simulated dispatch flow) ─────────────────────────────────
const STEPS = [
  { icon: 'shield-checkmark-outline' as const, label: 'Mission brief verified' },
  { icon: 'locate-outline'           as const, label: 'Locating available agents' },
  { icon: 'person-outline'           as const, label: 'Assigning closest EP agent' },
  { icon: 'navigate-outline'         as const, label: 'Agent en route to pickup' },
];

export default function RequestNowScreen() {
  const insets      = useSafeAreaInsets();
  const navigation  = useNavigation<any>();
  const route       = useRoute<RouteType>();
  const tabBarHeight = useBottomTabBarHeight();

  const {
    pickup, destination, service, serviceColor,
    hours, agentCount, attire, rate, estTotal, requiresArmed,
  } = route.params ?? {
    pickup: '—', destination: '—', service: 'Armed EP', serviceColor: Colors.crimson,
    hours: '4', agentCount: 1, attire: 'Executive Suit', rate: 250, estTotal: 1000, requiresArmed: true,
  };

  const [confirmed, setConfirmed] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  // Pulse ring on confirm button
  const pulseScale  = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;
  // Card slide-in
  const cardY     = useRef(new Animated.Value(40)).current;
  const cardOpac  = useRef(new Animated.Value(0)).current;
  // Confirm button scale
  const btnScale  = useRef(new Animated.Value(1)).current;
  // Step check fade
  const stepAnims = STEPS.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardY,    { toValue: 0,  duration: 420, useNativeDriver: true }),
      Animated.timing(cardOpac, { toValue: 1,  duration: 420, useNativeDriver: true }),
    ]).start();

    // Idle pulse loop on CTA
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale,   { toValue: 1.12, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0,    duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale,   { toValue: 1,    duration: 0, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.6,  duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const handleConfirm = () => {
    Animated.spring(btnScale, { toValue: 0.94, useNativeDriver: true, speed: 50, bounciness: 8 }).start(() => {
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
    });

    setConfirmed(true);
    // Animate steps sequentially
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        Animated.timing(stepAnims[i], { toValue: 1, duration: 300, useNativeDriver: true }).start();
      }, i * 900);
    });
  };

  const isDispatched = activeStep >= STEPS.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Request Now</Text>
          <Text style={styles.headerSub}>Immediate EP dispatch</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 120 }]}
      >

        {/* ── Mission Brief Card ── */}
        <Animated.View style={{ opacity: cardOpac, transform: [{ translateY: cardY }] }}>
          <LinearGradient
            colors={['#1A0000', '#0E0E0E']}
            style={styles.briefCard}
          >
            <View style={styles.briefHeader}>
              <View style={[styles.briefIconWrap, { backgroundColor: `${serviceColor}22`, borderColor: `${serviceColor}44` }]}>
                <Ionicons name="shield-checkmark" size={24} color={serviceColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.briefService}>{service}</Text>
                <Text style={styles.briefLabel}>Active protection detail</Text>
              </View>
              {requiresArmed && (
                <View style={styles.armedBadge}>
                  <Text style={styles.armedBadgeText}>ARMED</Text>
                </View>
              )}
            </View>

            <View style={styles.routeBlock}>
              <View style={styles.routeRow}>
                <View style={styles.dotGreen} />
                <Text style={styles.routeText} numberOfLines={1}>{pickup || 'Pickup location'}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeRow}>
                <View style={styles.dotRed} />
                <Text style={styles.routeText} numberOfLines={1}>{destination || 'Destination'}</Text>
              </View>
            </View>

            <View style={styles.briefDivider} />

            <View style={styles.detailGrid}>
              {[
                { icon: 'time-outline'       as const, label: 'Duration',  value: `${hours} hour${parseInt(hours) > 1 ? 's' : ''}` },
                { icon: 'person-outline'     as const, label: 'Agents',    value: `${agentCount}` },
                { icon: 'briefcase-outline'  as const, label: 'Attire',    value: attire },
                { icon: 'pricetag-outline'   as const, label: 'Rate',      value: `$${rate}/hr` },
              ].map(item => (
                <View key={item.label} style={styles.detailItem}>
                  <Ionicons name={item.icon} size={14} color={Colors.textMuted} />
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={[styles.totalValue, { color: serviceColor }]}>${estTotal.toLocaleString()}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Dispatch Status ── */}
        {confirmed && (
          <View style={styles.dispatchCard}>
            <View style={styles.dispatchHeader}>
              <Ionicons name="radio-outline" size={16} color={Colors.crimson} />
              <Text style={styles.dispatchTitle}>Dispatching Agent</Text>
            </View>
            {STEPS.map((step, i) => (
              <Animated.View
                key={step.label}
                style={[styles.stepRow, { opacity: i <= activeStep ? 1 : 0.25 }]}
              >
                <Animated.View style={[
                  styles.stepCheck,
                  i <= activeStep && { backgroundColor: Colors.crimson, borderColor: Colors.crimson },
                  { opacity: stepAnims[i] },
                ]}>
                  <Ionicons
                    name={i <= activeStep ? 'checkmark' : 'ellipse-outline'}
                    size={12}
                    color={i <= activeStep ? '#fff' : Colors.steel}
                  />
                </Animated.View>
                <View style={styles.stepDash}>
                  <Ionicons name={step.icon} size={14} color={i <= activeStep ? Colors.crimsonLight : Colors.steel} />
                  <Text style={[styles.stepLabel, i <= activeStep && { color: Colors.textPrimary }]}>{step.label}</Text>
                </View>
              </Animated.View>
            ))}

            {isDispatched && (
              <View style={styles.etaCard}>
                <Ionicons name="navigate-circle" size={18} color={Colors.crimson} />
                <View>
                  <Text style={styles.etaTitle}>Agent Dispatched</Text>
                  <Text style={styles.etaSub}>ETA: 8–12 min · You'll receive a confirmation shortly</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── Safety Note ── */}
        <View style={styles.safetyNote}>
          <Ionicons name="shield-checkmark-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.safetyText}>
            All LOBO agents are FBI-cleared and licensed. A coordinator will contact you within 15 minutes to confirm your detail.
          </Text>
        </View>

      </ScrollView>

      {/* ── Sticky CTA ── */}
      {!isDispatched && (
        <View style={[styles.stickyBar, {
          bottom: tabBarHeight,
          paddingBottom: Spacing.md,
          paddingLeft:  Math.max(Spacing.base, insets.left  + Spacing.base),
          paddingRight: Math.max(Spacing.base, insets.right + Spacing.base),
        }]}>
          {!confirmed ? (
            <View style={styles.ctaWrap}>
              {/* Pulse ring */}
              <Animated.View
                pointerEvents="none"
                style={[styles.pulseRing, {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                  borderColor: Colors.crimson,
                }]}
              />
              <Animated.View style={{ transform: [{ scale: btnScale }], width: '100%' }}>
                <TouchableOpacity onPress={handleConfirm} activeOpacity={0.88} style={styles.confirmBtn}>
                  <LinearGradient
                    colors={[Colors.crimsonDark, Colors.crimson]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmGrad}
                  >
                    <Ionicons name="flash" size={22} color="#fff" />
                    <View>
                      <Text style={styles.confirmTitle}>Confirm & Dispatch Agent</Text>
                      <Text style={styles.confirmSub}>{service} · {hours}h · {agentCount} agent{agentCount > 1 ? 's' : ''} · ${estTotal.toLocaleString()} est.</Text>
                    </View>
                    <Ionicons name="arrow-forward-circle" size={26} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.dispatchingBar}>
              <Ionicons name="radio" size={16} color={Colors.crimson} />
              <Text style={styles.dispatchingText}>
                {isDispatched ? 'Agent dispatched — stand by' : 'Dispatching your agent...'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Done button when dispatched */}
      {isDispatched && (
        <View style={[styles.stickyBar, {
          bottom: tabBarHeight,
          paddingBottom: Spacing.md,
          paddingLeft:  Math.max(Spacing.base, insets.left  + Spacing.base),
          paddingRight: Math.max(Spacing.base, insets.right + Spacing.base),
        }]}>
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('HomeMain')}
          >
            <LinearGradient
              colors={['#0A3A0A', '#1A5C1A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.doneGrad}
            >
              <Ionicons name="checkmark-circle" size={22} color="#4ADE80" />
              <Text style={styles.doneText}>Agent On The Way — Return Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

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
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(139,0,0,0.15)', borderWidth: 1, borderColor: Colors.crimsonDark,
    borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.crimson },
  liveBadgeText: { color: Colors.crimsonLight, fontSize: 10, fontWeight: Typography.weight.bold, letterSpacing: 1.5 },

  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.lg },

  // Brief card
  briefCard: {
    borderRadius: BorderRadius.lg, padding: Spacing.base,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.25)', ...Shadows.md,
  },
  briefHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.base },
  briefIconWrap: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  briefService: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  briefLabel: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  armedBadge: {
    borderWidth: 1.5, borderColor: '#fff', borderRadius: BorderRadius.sm,
    paddingHorizontal: 7, paddingVertical: 3, backgroundColor: 'rgba(255,255,255,0.12)',
  },
  armedBadgeText: { color: '#fff', fontSize: 9, fontWeight: Typography.weight.bold, letterSpacing: 1 },

  routeBlock: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md,
    gap: 6, marginBottom: Spacing.base,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ADE80' },
  dotRed:   { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.crimson },
  routeLine: { width: 1.5, height: 14, backgroundColor: Colors.border, marginLeft: 4 },
  routeText: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.sm },

  briefDivider: { height: 1, backgroundColor: 'rgba(139,0,0,0.15)', marginBottom: Spacing.base },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base },
  detailItem: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.surface3,
    borderRadius: BorderRadius.md, padding: Spacing.sm, gap: 3,
    borderWidth: 1, borderColor: Colors.border,
  },
  detailLabel: { color: Colors.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },
  detailValue: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.semiBold },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(139,0,0,0.15)',
  },
  totalLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  totalValue: { fontSize: Typography.size.xl, fontWeight: Typography.weight.bold },

  // Dispatch
  dispatchCard: {
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.base, marginTop: Spacing.lg, gap: Spacing.sm,
  },
  dispatchHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  dispatchTitle: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepCheck: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface3,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDash: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepLabel: { color: Colors.steel, fontSize: Typography.size.sm },

  etaCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: 'rgba(139,0,0,0.1)', borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.25)',
    padding: Spacing.md, marginTop: Spacing.sm,
  },
  etaTitle: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  etaSub:   { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },

  // Safety
  safetyNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.surface2, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginTop: Spacing.lg,
  },
  safetyText: { flex: 1, color: Colors.textMuted, fontSize: Typography.size.xs, lineHeight: 17 },

  // Sticky
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingTop: Spacing.md, paddingHorizontal: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  ctaWrap: { alignItems: 'center', width: '100%' },
  pulseRing: {
    position: 'absolute', top: -6, left: -6, right: -6, bottom: -6,
    borderRadius: BorderRadius.lg + 6,
    borderWidth: 2,
  },
  confirmBtn: { width: '100%', borderRadius: BorderRadius.lg, overflow: 'hidden' },
  confirmGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  confirmTitle: { color: '#fff', fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  confirmSub:   { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 1 },

  dispatchingBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: 'rgba(139,0,0,0.1)', borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: 'rgba(139,0,0,0.25)',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  dispatchingText: { color: Colors.crimsonLight, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },

  doneBtn: { width: '100%', borderRadius: BorderRadius.lg, overflow: 'hidden' },
  doneGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  doneText: { flex: 1, color: '#4ADE80', fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
});
