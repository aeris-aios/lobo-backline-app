import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'crimson';
  padding?: keyof typeof Spacing;
}

export default function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'base',
}: CardProps) {
  const content = (
    <View style={[styles.card, styles[variant], { padding: Spacing[padding] }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface2,
  },
  default: {},
  elevated: {
    ...Shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  crimson: {
    borderWidth: 1,
    borderColor: Colors.crimsonDark,
    ...Shadows.crimson,
  },
});
