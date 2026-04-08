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

// ─── Per-service permanent accent styles ──────────────────────────────────────
const ACCENT: Record<string, {
  border:      string;
  bgGradient:  [string, string];
  bgWash:      string;
  iconBg:      string;
  iconColor:   string;
  accentColor: string;
}> = {
  blackline_transport: {
    border:      '#E8C86A',
    bgGradient:  ['#1E0A38', '#2E155A'],  // vivid dark purple
    bgWash:      'rgba(110,60,200,0.35)',
    iconBg:      'rgba(201,168,76,0.25)',
    iconColor:   '#E8C86A',
    accentColor: '#E8C86A',
  },
  armed_executive: {
    border:      '#E02020',
    bgGradient:  ['#3A0808', '#5C0E0E'],  // vivid deep red
    bgWash:      'rgba(200,20,20,0.40)',
    iconBg:      'rgba(255,80,80,0.25)',
    iconColor:   '#FF7070',
    accentColor: '#FF5050',
  },
  unarmed_executive: {
    border:      '#E02020',
    bgGradient:  ['#3A0808', '#5C0E0E'],
    bgWash:      'rgba(200,20,20,0.40)',
    iconBg:      'rgba(255,80,80,0.25)',
    iconColor:   '#FF7070',
    accentColor: '#FF5050',
  },
  school_family_escort: {
    border:      '#E02020',
    bgGradient:  ['#3A0808', '#5C0E0E'],
    bgWash:      'rgba(200,20,20,0.40)',
    iconBg:      'rgba(255,80,80,0.25)',
    iconColor:   '#FF7070',
    accentColor: '#FF5050',
  },
  special_event: {
    border:      '#E02020',
    bgGradient:  ['#3A0808', '#5C0E0E'],
    bgWash:      'rgba(200,20,20,0.40)',
    iconBg:      'rgba(255,80,80,0.25)',
    iconColor:   '#FF7070',
    accentColor: '#FF5050',
  },
};

const DEFAULT_ACCENT = ACCENT.armed_executive;

export default function ServiceCard({ service, selected, onPress, fullWidth, isHovered }: ServiceCardProps) {
  const acc = ACCENT[service.id] || DEFAULT_ACCENT;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const arrowX    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isHovered ? 1.025 : 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 5,
    }).start();
  }, [isHovered]);

  const onPressIn = () => Animated.parallel([
    Animated.spring(scaleAnim, { toValue: 1.03, useNativeDriver: true, speed: 50, bounciness: 8 }),
    Animated.timing(arrowX,    { toValue: 8, duration: 140, useNativeDriver: true }),
  ]).start();

  const onPressOut = () => Animated.parallel([
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }),
    Animated.timing(arrowX,    { toValue: 0, duration: 280, useNativeDriver: true }),
  ]).start();

  if (fullWidth) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={acc.bgGradient}
            style={styles.rowCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Permanent border */}
            <View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.borderOverlay, { borderColor: acc.border }]}
            />

            {/* Permanent color wash */}
            <View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { backgroundColor: acc.bgWash, borderRadius: BorderRadius.lg }]}
            />

            {/* Left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: acc.accentColor }]} />

            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: acc.iconBg }]}>
              <Ionicons
                name={service.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={acc.iconColor}
              />
            </View>

            {/* Text */}
            <View style={styles.rowText}>
              <Text style={styles.cardTitle}>{service.title}</Text>
              <Text style={styles.cardSub}>{service.description}</Text>
            </View>

            {/* Right — badge + arrow */}
            <View style={styles.rowRight}>
              {service.requiresArmed && (
                <View style={styles.armedBadge}>
                  <Text style={styles.armedBadgeText}>ARMED</Text>
                </View>
              )}
              <View style={styles.arrowWrap}>
                {selected && (
                  <Ionicons name="checkmark-circle" size={16} color={acc.accentColor} />
                )}
                <Animated.View style={{ transform: [{ translateX: arrowX }] }}>
                  <Ionicons name="chevron-forward" size={20} color={acc.accentColor} />
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Compact variant
  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}>
        <LinearGradient colors={acc.bgGradient} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.borderOverlay, { borderColor: acc.border }]}
          />
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: acc.bgWash, borderRadius: BorderRadius.lg }]}
          />
          <View style={[styles.iconContainer, { backgroundColor: acc.iconBg, marginBottom: Spacing.sm }]}>
            <Ionicons name={service.icon as keyof typeof Ionicons.glyphMap} size={22} color={acc.iconColor} />
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>{service.title}</Text>
          <Text style={styles.cardSub} numberOfLines={1}>{service.subtitle}</Text>
          <Animated.View style={[styles.compactArrow, { transform: [{ translateX: arrowX }] }]}>
            <Ionicons name="chevron-forward" size={14} color={acc.accentColor} />
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
  },
  accentBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  cardTitle: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  cardSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    lineHeight: 14,
  },
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
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  armedBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    letterSpacing: 1,
    color: '#FFFFFF',
  },

  // Compact
  wrapper: { width: 120, marginRight: Spacing.sm },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  compactArrow: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
  },
});
