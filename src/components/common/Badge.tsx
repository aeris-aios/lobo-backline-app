import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../theme/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'crimson' | 'steel';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export default function Badge({ label, variant = 'default', style, size = 'md' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], size === 'sm' && styles.small, style]}>
      <Text style={[styles.text, styles[`text_${variant}` as keyof typeof styles], size === 'sm' && styles.smallText]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
  },
  text: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  smallText: { fontSize: 9 },

  // Variants
  default: { backgroundColor: Colors.surface3 },
  success: { backgroundColor: '#1B4D1E' },
  warning: { backgroundColor: '#3E2000' },
  error: { backgroundColor: '#3C0A0A' },
  crimson: { backgroundColor: Colors.crimsonDark },
  steel: { backgroundColor: Colors.gunmetal },

  // Text colors
  text_default: { color: Colors.steel },
  text_success: { color: Colors.successLight },
  text_warning: { color: Colors.warningLight },
  text_error: { color: Colors.errorLight },
  text_crimson: { color: Colors.crimsonLight },
  text_steel: { color: Colors.steelLight },
});
