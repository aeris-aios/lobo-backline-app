import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';
import { ServiceType, ServiceOption, BookingStatus } from '../../types';
import HeroCarousel from '../../components/home/HeroCarousel';
import ServiceCard from '../../components/home/ServiceCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.42;

const SERVICES: ServiceOption[] = [
  {
    id: 'blackline_transport',
    title: 'Blackline',
    subtitle: 'Premium transport',
    description: 'High-end secure transport with trained drivers',
    icon: 'car-sport-outline',
    baseRate: 150,
    requiresArmed: false,
    availableAttire: ['suit_executive', 'low_profile'],
  },
  {
    id: 'armed_executive',
    title: 'Armed EP',
    subtitle: 'Armed protection',
    description: 'Armed executive protection detail',
    icon: 'shield-outline',
    baseRate: 250,
    requiresArmed: true,
    availableAttire: ['suit_executive', 'tactical'],
  },
  {
    id: 'unarmed_executive',
    title: 'Unarmed EP',
    subtitle: 'Close protection',
    description: 'Unarmed close protection specialist',
    icon: 'person-outline',
    baseRate: 175,
    requiresArmed: false,
    availableAttire: ['suit_executive', 'low_profile', 'casual_concealed'],
  },
  {
    id: 'school_family_escort',
    title: 'Family',
    subtitle: 'Family escort',
    description: 'School run and family movement',
    icon: 'people-outline',
    baseRate: 200,
    requiresArmed: false,
    availableAttire: ['low_profile', 'casual_concealed'],
  },
  {
    id: 'special_event',
    title: 'Special Event',
    subtitle: 'Event security',
    description: 'Galas, weddings, parties & sporting events',
    icon: 'sparkles-outline',
    baseRate: 275,
    requiresArmed: false,
    availableAttire: ['suit_executive', 'low_profile'],
  },
];

const MOCK_RECENT = [
  { id: '1', service: 'Armed EP', from: 'Four Seasons Hotel', to: 'Dallas Love Field', date: 'Apr 5', status: 'completed' as BookingStatus },
  { id: '2', service: 'Blackline', from: 'Home', to: 'AT&T Stadium', date: 'Apr 2', status: 'completed' as BookingStatus },
];

// ─── Bell button with shake + pulse animations ─────────────────────────────
function BellButton({ onPress, unreadCount }: { onPress: () => void; unreadCount: number }) {
  const shakeAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const scaleAnim  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Bell shake — triggers every 6s
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue:  8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue:  6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue:  3, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue:  0, duration: 50, useNativeDriver: true }),
      ]).start();
    };
    shake();
    const interval = setInterval(shake, 6000);

    // Notification dot pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.delay(1200),
      ])
    );
    pulse.start();

    return () => { clearInterval(interval); pulse.stop(); };
  }, []);

  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 8 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 40, bounciness: 10 }).start();

  return (
    <TouchableOpacity
      style={styles.notifBtn}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate: shakeAnim.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] }) }] }}>
        <Ionicons name="notifications" size={22} color={Colors.textPrimary} />
      </Animated.View>

      {/* Pulsing dot with count */}
      {unreadCount > 0 && (
        <View style={styles.notifBadgeWrap}>
          {/* Outer pulse ring */}
          <Animated.View style={[styles.notifPulseRing, { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [1, 1.5], outputRange: [0.5, 0] }) }]} />
          {/* Badge */}
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Card height + gap (paddingVertical ~12*2 + icon 42 = ~66, gap 8)
const CARD_H   = 70;
const CARD_GAP = 8;
const CARD_POSITIONS = SERVICES.map((_, i) => i * (CARD_H + CARD_GAP) + CARD_H / 2 - 14);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selectedService, setSelectedService] = useState<ServiceType>('armed_executive');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollY  = useRef(new Animated.Value(0)).current;
  const cursorY  = useRef(new Animated.Value(CARD_POSITIONS[0])).current;
  const cursorOp = useRef(new Animated.Value(0)).current;

  // Animated cursor that hovers over each service card in sequence
  useEffect(() => {
    let cancelled = false;
    let idx = 0;

    const fade = (to: number, dur: number) =>
      Animated.timing(cursorOp, { toValue: to, duration: dur, useNativeDriver: true });

    const moveTo = (i: number) =>
      Animated.spring(cursorY, {
        toValue: CARD_POSITIONS[i],
        speed: 10,
        bounciness: 0,
        useNativeDriver: true,
      });

    const cycle = () => {
      if (cancelled) return;
      setHoveredIndex(idx);

      Animated.sequence([
        fade(1, 200),          // fade in cursor on card
        moveTo(idx),           // spring to card centre
        Animated.delay(1400),  // dwell
        fade(0.3, 180),        // dim briefly as moving
      ]).start(() => {
        if (cancelled) return;
        idx = (idx + 1) % SERVICES.length;
        cycle();
      });
    };

    // Small initial delay then start
    const t = setTimeout(cycle, 800);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleBook = () => {
    navigation.navigate('BookProtection');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated sticky header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
        <Image
          source={require('../../../assets/logo-mark.png')}
          style={styles.stickyLogo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero carousel */}
        <HeroCarousel style={{ height: MAP_HEIGHT }} />

        {/* Header overlay on map */}
        <View style={[
          styles.mapOverlayHeader,
          {
            top: insets.top,
            paddingLeft:  Math.max(Spacing.base, insets.left  + Spacing.base),
            paddingRight: Math.max(Spacing.base, insets.right + Spacing.base),
          },
        ]}>
          <View style={styles.logoChip}>
            <Image
              source={require('../../../assets/logo-mark.png')}
              style={styles.logoChipImg}
              resizeMode="contain"
            />
          </View>
          <BellButton onPress={() => navigation.navigate('Notifications')} unreadCount={6} />
        </View>

        {/* Booking sheet */}
        <View style={[
          styles.sheet,
          {
            paddingLeft:  Math.max(Spacing['2xl'], insets.left  + Spacing.base),
            paddingRight: Math.max(Spacing['2xl'], insets.right + Spacing.base),
          },
        ]}>
          {/* EP Verified Banner — above greeting */}
          <View style={styles.epVerifiedBar}>
            <View style={styles.epVerifiedLeft}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.crimson} />
              <Text style={styles.epVerifiedText}>EP Member</Text>
              <View style={styles.epVerifiedDot} />
              <Text style={styles.epVerifiedStatus}>Verified</Text>
            </View>
            <View style={styles.epVerifiedRight}>
              <View style={styles.epActiveDot} />
              <Text style={styles.epActiveText}>Active</Text>
            </View>
          </View>

          {/* Greeting */}
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greeting}>Good afternoon</Text>
              <Text style={styles.greetingName}>Where do you need coverage?</Text>
            </View>
          </View>

          {/* Schedule toggle */}
          <View style={styles.scheduleToggle}>
            {(['now', 'schedule'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => {
                  setScheduleMode(mode);
                  if (mode === 'schedule') navigation.navigate('ScheduleProtection');
                }}
                style={[styles.toggleBtn, scheduleMode === mode && styles.toggleActive]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={mode === 'now' ? 'flash-outline' : 'calendar-outline'}
                  size={14}
                  color={scheduleMode === mode ? Colors.white : Colors.steel}
                />
                <Text style={[styles.toggleText, scheduleMode === mode && styles.toggleTextActive]}>
                  {mode === 'now' ? 'Now' : 'Schedule'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location inputs */}
          <View style={styles.locationCard}>
            <TouchableOpacity
              style={styles.locationRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LocationPicker', {
                field: 'pickup',
                onSelect: (loc: { name: string; address: string }) =>
                  setPickup(loc.name || loc.address),
              })}
            >
              <View style={styles.dotGreen} />
              <Text style={pickup ? styles.locationText : styles.locationPlaceholder} numberOfLines={1}>
                {pickup || 'Pickup location'}
              </Text>
              <Ionicons name="locate-outline" size={18} color={Colors.steel} />
            </TouchableOpacity>

            <View style={styles.locationDivider} />

            <TouchableOpacity
              style={styles.locationRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LocationPicker', {
                field: 'destination',
                onSelect: (loc: { name: string; address: string }) =>
                  setDestination(loc.name || loc.address),
              })}
            >
              <View style={styles.dotRed} />
              <Text style={destination ? styles.locationText : styles.locationPlaceholder} numberOfLines={1}>
                {destination || 'Destination'}
              </Text>
              <Ionicons name="search-outline" size={18} color={Colors.steel} />
            </TouchableOpacity>
          </View>

          {/* Service selector */}
          <Text style={styles.sectionLabel}>Service Type</Text>
          <View style={styles.serviceList}>
            {SERVICES.map((s, i) => (
              <ServiceCard
                key={s.id}
                service={s}
                selected={selectedService === s.id}
                isHovered={hoveredIndex === i}
                onPress={() => {
                  setHoveredIndex(null);
                  setSelectedService(s.id);
                  if (s.id === 'blackline_transport') {
                    navigation.navigate('BlacklineOverview');
                  } else if (s.id === 'armed_executive') {
                    navigation.navigate('ArmedEPOverview');
                  } else if (s.id === 'unarmed_executive') {
                    navigation.navigate('UnarmedEPOverview');
                  } else if (s.id === 'school_family_escort') {
                    navigation.navigate('FamilyEPOverview');
                  } else if (s.id === 'special_event') {
                    navigation.navigate('SpecialEventOverview');
                  }
                }}
                fullWidth
              />
            ))}

          </View>

          {/* Quick CTA */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.bookCta}
              activeOpacity={0.85}
              onPress={handleBook}
            >
              <LinearGradient colors={[Colors.crimsonDark, Colors.crimson]} style={styles.bookGradient}>
                <Ionicons name="shield" size={20} color={Colors.white} />
                <Text style={styles.bookCtaText}>Book Protection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Recent bookings */}
          <Text style={styles.sectionLabel}>Recent Bookings</Text>
          {MOCK_RECENT.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.recentTrip}
              activeOpacity={0.7}
            >
              <View style={styles.recentLeft}>
                <View style={styles.recentIcon}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={Colors.crimson} />
                </View>
                <View>
                  <Text style={styles.recentService}>{trip.service}</Text>
                  <Text style={styles.recentRoute} numberOfLines={1}>
                    {trip.from} → {trip.to}
                  </Text>
                </View>
              </View>
              <View style={styles.recentRight}>
                <Text style={styles.recentDate}>{trip.date}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: Colors.background,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  stickyLogo: {
    width: 44,
    height: 40,
  },

  mapOverlayHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  logoChip: {
    backgroundColor: 'rgba(10,10,10,0.85)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  logoChipImg: {
    width: 40,
    height: 36,
  },
  notifBtn: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(10,10,10,0.88)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifBadgeWrap: {
    position: 'absolute',
    top: 4,
    right: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifPulseRing: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.crimson,
  },
  notifBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(10,10,10,0.88)',
  },
  notifBadgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: Typography.weight.heavy,
    lineHeight: 10,
  },

  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: Spacing['2xl'],
    paddingTop: Spacing.xl,
    ...Shadows.lg,
  },

  // EP Verified Banner
  epVerifiedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(139,0,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.35)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    marginBottom: Spacing.md,
  },
  epVerifiedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  epVerifiedText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.3,
  },
  epVerifiedDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  epVerifiedStatus: {
    color: Colors.crimsonLight,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 0.5,
  },
  epVerifiedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  epActiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  epActiveText: {
    color: '#4ADE80',
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 0.5,
  },

  greetingRow: {
    marginBottom: Spacing.base,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    marginBottom: 2,
  },
  greetingName: {
    color: Colors.textPrimary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(139,0,0,0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.crimsonDark,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  memberText: {
    color: Colors.crimsonLight,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
  },

  scheduleToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.base,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  toggleActive: { backgroundColor: Colors.surface3 },
  toggleText: {
    color: Colors.steel,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  toggleTextActive: { color: Colors.textPrimary },

  locationCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.successLight,
  },
  dotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.crimson,
  },
  locationText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
  },
  locationPlaceholder: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: Typography.size.base,
  },
  locationDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 42,
  },

  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  serviceList: {
    gap: Spacing.sm,
  },

  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  primaryCta: { flex: 1 },
  bookCta: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.crimson,
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    minHeight: 54,
  },
  bookCtaText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.5,
  },

  recentTrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(139,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentService: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  recentRoute: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: 2,
    maxWidth: 200,
  },
  recentRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  recentDate: { color: Colors.textMuted, fontSize: Typography.size.xs },
});
