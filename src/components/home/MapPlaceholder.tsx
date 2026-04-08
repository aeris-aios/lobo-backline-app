import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../theme/theme';

// Swap this View for a real MapView once you add a Google Maps API key
interface MapPlaceholderProps {
  style?: ViewStyle;
}

export default function MapPlaceholder({ style }: MapPlaceholderProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Grid overlay for map feel */}
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, row) => (
          <View key={`row-${row}`} style={styles.gridRow}>
            {Array.from({ length: 8 }).map((_, col) => (
              <View key={`cell-${col}`} style={styles.gridCell} />
            ))}
          </View>
        ))}
      </View>

      {/* Center pin */}
      <View style={styles.centerContent}>
        <View style={styles.pinOuter}>
          <View style={styles.pinInner} />
        </View>
        <Ionicons name="location" size={32} color={Colors.crimson} style={styles.pinIcon} />
      </View>

      {/* Corner label */}
      <View style={styles.mapLabel}>
        <Ionicons name="navigate-circle-outline" size={14} color={Colors.steel} />
        <Text style={styles.mapLabelText}>Map integration ready</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    opacity: 0.15,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.gunmetal,
  },
  gridCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.gunmetal,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 0, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 0, 0, 0.4)',
  },
  pinIcon: {
    position: 'absolute',
  },
  mapLabel: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapLabelText: {
    color: Colors.steel,
    fontSize: Typography.size.xs,
  },
});
