import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';
import { VehicleClass } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Header from '../../components/common/Header';

type VehicleOption = { id: VehicleClass; label: string; sub: string; icon: string; price: string };

const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: 'sedan', label: 'Executive Sedan', sub: 'Mercedes S-Class or equiv.', icon: 'car-outline', price: '$95/hr' },
  { id: 'suv', label: 'Executive SUV', sub: 'Cadillac Escalade or equiv.', icon: 'car-sport-outline', price: '$125/hr' },
  { id: 'armored_suv', label: 'Armored SUV', sub: 'B6+ rated armoring', icon: 'shield-outline', price: '$275/hr' },
  { id: 'blackline', label: 'Blackline Select', sub: 'Best available in fleet', icon: 'star-outline', price: '$150/hr' },
];

export default function BlacklineBookingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleClass>('blackline');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');

  const selectedVehicleObj = VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Blackline Transport" showBack />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        >
          {/* Schedule mode */}
          <View style={styles.scheduleToggle}>
            {(['now', 'schedule'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setScheduleMode(mode)}
                style={[styles.toggleBtn, scheduleMode === mode && styles.toggleActive]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={mode === 'now' ? 'flash-outline' : 'calendar-outline'}
                  size={15}
                  color={scheduleMode === mode ? Colors.blacklineAccent : Colors.steel}
                />
                <Text style={[styles.toggleText, scheduleMode === mode && styles.toggleTextActive]}>
                  {mode === 'now' ? 'Request Now' : 'Schedule Later'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Locations */}
          <Text style={styles.sectionLabel}>Route</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <View style={[styles.locDot, { backgroundColor: Colors.successLight }]} />
              <View style={styles.locTextWrapper}>
                <Text style={styles.locLabel}>Pickup</Text>
                <Text style={pickup ? styles.locValue : styles.locPlaceholder} numberOfLines={1}>
                  {pickup || 'Enter pickup address'}
                </Text>
              </View>
              <Ionicons name="create-outline" size={16} color={Colors.steel} />
            </View>
            <View style={styles.routeLine} />
            <View style={styles.locationRow}>
              <View style={[styles.locDot, { backgroundColor: Colors.blacklineAccent }]} />
              <View style={styles.locTextWrapper}>
                <Text style={styles.locLabel}>Destination</Text>
                <Text style={destination ? styles.locValue : styles.locPlaceholder} numberOfLines={1}>
                  {destination || 'Enter destination'}
                </Text>
              </View>
              <Ionicons name="create-outline" size={16} color={Colors.steel} />
            </View>
          </View>

          {/* Vehicle selector */}
          <Text style={styles.sectionLabel}>Vehicle Class</Text>
          <View style={styles.vehicleGrid}>
            {VEHICLE_OPTIONS.map((v) => {
              const isSelected = selectedVehicle === v.id;
              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setSelectedVehicle(v.id)}
                  activeOpacity={0.8}
                  style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
                >
                  <View style={[styles.vehicleIcon, isSelected && styles.vehicleIconSelected]}>
                    <Ionicons
                      name={v.icon as any}
                      size={20}
                      color={isSelected ? Colors.black : Colors.steel}
                    />
                  </View>
                  <Text style={[styles.vehicleLabel, isSelected && styles.vehicleLabelSelected]}>
                    {v.label}
                  </Text>
                  <Text style={styles.vehicleSub}>{v.sub}</Text>
                  <Text style={[styles.vehiclePrice, isSelected && styles.vehiclePriceSelected]}>
                    {v.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Special instructions */}
          <Text style={styles.sectionLabel}>Special Instructions</Text>
          <Input
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            placeholder="Luggage, access codes, specific requirements..."
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top', paddingTop: Spacing.sm }}
          />

          {/* Estimate bar */}
          <View style={styles.estimateCard}>
            <View style={styles.estimateRow}>
              <Ionicons name="time-outline" size={16} color={Colors.steel} />
              <Text style={styles.estimateLabel}>Estimated arrival</Text>
              <Text style={styles.estimateValue}>12–18 min</Text>
            </View>
            <View style={styles.estimateDivider} />
            <View style={styles.estimateRow}>
              <Ionicons name="card-outline" size={16} color={Colors.steel} />
              <Text style={styles.estimateLabel}>Estimated cost</Text>
              <Text style={styles.estimateValue}>{selectedVehicleObj?.price}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <LinearGradient
          colors={['transparent', Colors.background]}
          style={[styles.bottomGradient, { paddingBottom: insets.bottom + Spacing.base }]}
        >
          <Button
            title="Confirm Blackline Request"
            onPress={() => {}}
            variant="blackline"
            size="lg"
            leftIcon={<Ionicons name="car-sport" size={18} color={Colors.black} />}
          />
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  scheduleToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.lg,
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
  toggleActive: { backgroundColor: '#1A1A2E' },
  toggleText: { color: Colors.steel, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  toggleTextActive: { color: Colors.blacklineAccent },

  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },

  locationCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
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
  locDot: { width: 10, height: 10, borderRadius: 5 },
  locTextWrapper: { flex: 1 },
  locLabel: { color: Colors.textMuted, fontSize: 10, letterSpacing: 0.5, marginBottom: 2 },
  locValue: { color: Colors.textPrimary, fontSize: Typography.size.base },
  locPlaceholder: { color: Colors.textMuted, fontSize: Typography.size.base },
  routeLine: { height: 1, backgroundColor: Colors.border, marginLeft: 42 },

  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  vehicleCard: {
    width: '48%',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  vehicleCardSelected: {
    backgroundColor: Colors.blacklineAccent,
    borderColor: Colors.blacklineAccent,
  },
  vehicleIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  vehicleIconSelected: { backgroundColor: 'rgba(0,0,0,0.15)' },
  vehicleLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    marginBottom: 2,
  },
  vehicleLabelSelected: { color: Colors.black },
  vehicleSub: { color: Colors.textMuted, fontSize: 10, marginBottom: Spacing.sm },
  vehiclePrice: {
    color: Colors.steel,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  vehiclePriceSelected: { color: Colors.black },

  estimateCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  estimateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  estimateLabel: { flex: 1, color: Colors.textSecondary, fontSize: Typography.size.sm },
  estimateValue: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  estimateDivider: { height: 1, backgroundColor: Colors.border },

  bottomGradient: {
    padding: Spacing.base,
    paddingTop: Spacing['2xl'],
  },
});
