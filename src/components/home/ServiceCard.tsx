import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';
import { ServiceOption } from '../../types';

interface ServiceCardProps {
  service:    ServiceOption;
  selected:   boolean;
  onPress:    () => void;
  fullWidth?:  boolean;
  isHovered?: boolean;
}

// ─── Per-service accent palette ────────────────────────────────────────────
const ACCENT: Record<string, { primary: string; dark: string; bg: string; gradient: [string, string] }> = {
  blackline_transport: {
    primary:  '#7B4FBF',
    dark:     '#4A1D8A',
    bg:       'rgba(123,79,191,0.18)',
    gradient: ['#1A0A2E', '#2D1B52'],
  },
  armed_executive: {
    primary:  Colors.crimson,
    dark:     Colors.crimsonDark,
    bg:       'rgba(139,0,0,0.18)',
    gradient: [Colors.crimsonDark, Colors.crimson],
  },
  unarmed_executive: {
    primary:  '#8B96A8',
    dark:     '#5A6475',
    bg:       'rgba(139,150,168,0.15)',
    gradient: ['#1A1E24', '#1E2530'],
  },
  school_family_escort: {
    primary:  Colors.border,
    dark:     Colors.surface3,
    bg:       'rgba(255,255,255,0.04)',
    gradient: ['#1C1C1C', '#161616'],
  },
};
const DEFAULT_ACCENT = ACCENT.armed_executive;

export default function ServiceCard({ service, selected, onPress, fullWidth, isHovered }: ServiceCardProps) {
  const accent = ACCENT[service.id] || DEFAULT_ACCENT;

  // Animation values
  const scaleAnim    = useRef(new Animated.Value(1)).current;
  const bgOpacity    = useRef(new Animated.Value(0)).current;
  const borderAnim   = useRef(new Animated.Value(0)).current;
  const arrowX       = useRef(new Animated.Value(0)).current;
  const arrowOpacity = useRef(new Animated.Value(0.3)).current;

  // React to isHovered changes from the parent cursor
  useEffect(() => {
    if (isHovered) {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1.025, useNativeDriver: true, speed: 30, bounciness: 5 }),
        Animated.timing(bgOpacity,   { toValue: 1,     duration: 200, useNativeDriver: false }),
        Animated.timing(borderAnim,  { toValue: 1,     duration: 200, useNativeDriver: false }),
        Animated.timing(arrowX,      { toValue: 6,     duration: 200, useNativeDriver: true }),
        Animated.timing(arrowOpacity,{ toValue: 1,     duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 3 }),
        Animated.timing(bgOpacity,   { toValue: 0,    duration: 250, useNativeDriver: false }),
        Animated.timing(borderAnim,  { toValue: 0,    duration: 250, useNativeDriver: false }),
        Animated.timing(arrowX,      { toValue: 0,    duration: 280, useNativeDriver: true }),
        Animated.timing(arrowOpacity,{ toValue: 0.3,  duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [isHovered]);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim,  { toValue: 1.03, useNativeDriver: true, speed: 50, bounciness: 8 }),
      Animated.timing(bgOpacity,  { toValue: 1,    duration: 150, useNativeDriver: false }),
      Animated.timing(borderAnim, { toValue: 1,    duration: 150, useNativeDriver: false }),
      Animated.timing(arrowX,     { toValue: 8,    duration: 150, useNativeDriver: true }),
      Animated.timing(arrowOpacity,{ toValue: 1,   duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim,  { toValue: 1,    useNativeDriver: true, speed: 40, bounciness: 4 }),
      Animated.timing(bgOpacity,  { toValue: 0,    duration: 250, useNativeDriver: false }),
      Animated.timing(borderAnim, { toValue: 0,    duration: 250, useNativeDriver: false }),
      Animated.timing(arrowX,     { toValue: 0,    duration: 300, useNativeDriver: true }),
      Animated.timing(arrowOpacity,{ toValue: 0.45, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [selected ? accent.primary : Colors.border, accent.primary],
  });
  const highlightBg = bgOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', accent.bg],
  });

  if (fullWidth) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
        >
          {/* Base gradient */}
          <LinearGradient
            colors={selected ? accent.gradient : ['#1C1C1C', '#161616']}
            style={[styles.rowCard]}
          >
            {/* Animated border overlay */}
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.borderOverlay, { borderColor }]}
            />

            {/* Press highlight wash */}
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { backgroundColor: highlightBg, borderRadius: BorderRadius.lg }]}
            />

            {/* Left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: selected ? accent.primary : 'transparent' }]} />

            {/* Icon */}
            <View style={[
              styles.iconContainer,
              { backgroundColor: selected ? accent.bg : Colors.surface3 },
              selected && { borderWidth: 1, borderColor: `${accent.primary}50` },
            ]}>
              <Ionicons
                name={service.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={selected ? accent.primary : Colors.steel}
              />
            </View>

            {/* Text */}
            <View style={styles.rowText}>
              <Text style={[styles.title, { color: selected ? accent.primary : Colors.textSecondary }]}>
                {service.title}
              </Text>
              <Text style={styles.subtitle}>{service.description}</Text>
            </View>

            {/* Right — badge + animated arrow */}
            <View style={styles.rowRight}>
              {service.requiresArmed && (
                <View style={[styles.armedBadge, {
                  borderColor: accent.dark,
                  backgroundColor: accent.bg,
                }]}>
                  <Text style={[styles.armedBadgeText, { color: accent.primary }]}>ARMED</Text>
                </View>
              )}
              <View style={styles.arrowWrap}>
                {selected && (
                  <Ionicons name="checkmark-circle" size={17} color={accent.primary} />
                )}
                <Animated.View style={{ transform: [{ translateX: arrowX }], opacity: arrowOpacity }}>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={accent.primary}
                  />
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // ── Compact variant ────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={selected ? accent.gradient : ['#1C1C1C', '#161616']}
          style={[styles.card, selected && { borderColor: accent.primary }]}
        >
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.borderOverlay, { borderColor }]}
          />
          <View style={[
            styles.iconContainer,
            { marginBottom: Spacing.sm, backgroundColor: selected ? accent.bg : Colors.surface3 },
          ]}>
            <Ionicons
              name={service.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color={selected ? accent.primary : Colors.steel}
            />
          </View>
          <Text style={[styles.title, selected && { color: accent.primary }]} numberOfLines={1}>
            {service.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>{service.subtitle}</Text>
          <Animated.View style={[styles.compactArrow, { transform: [{ translateX: arrowX }], opacity: arrowOpacity }]}>
            <Ionicons name="chevron-forward" size={14} color={selected ? accent.primary : Colors.steel} />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  borderOverlay: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    pointerEvents: 'none',
  },
  accentBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  rowText: { flex: 1 },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  armedBadge: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  armedBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  wrapper: { width: 120, marginRight: Spacing.sm },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  compactArrow: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
  },
});
