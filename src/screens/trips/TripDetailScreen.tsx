import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';
import { TripsStackParamList } from '../../types';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

type RouteType = RouteProp<TripsStackParamList, 'TripDetail'>;

export default function TripDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteType>();
  const { bookingId } = route.params;

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Cancellation fees may apply.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        { text: 'Cancel Booking', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Booking Details" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing['2xl'] }]}
      >
        {/* Status card */}
        <Card variant="crimson" style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <Text style={styles.bookingIdLabel}>Booking ID</Text>
              <Text style={styles.bookingId}>{bookingId.toUpperCase()}</Text>
            </View>
            <Badge label="Confirmed" variant="success" />
          </View>
          <View style={styles.statusMeta}>
            <Text style={styles.serviceType}>Armed Executive Protection</Text>
            <Text style={styles.serviceDate}>April 10, 2026 · 8:00 AM</Text>
          </View>
        </Card>

        {/* Route */}
        <Text style={styles.sectionLabel}>Route</Text>
        <Card variant="outlined">
          <View style={styles.routeRow}>
            <View style={styles.routeConnectorCol}>
              <View style={[styles.routeDot, { backgroundColor: Colors.successLight }]} />
              <View style={styles.routeLine} />
              <View style={[styles.routeDot, { backgroundColor: Colors.crimson }]} />
            </View>
            <View style={styles.routeAddresses}>
              <View style={styles.addressBlock}>
                <Text style={styles.addressLabel}>PICKUP</Text>
                <Text style={styles.addressValue}>Four Seasons Hotel, Dallas, TX</Text>
              </View>
              <View style={[styles.addressBlock, { marginTop: Spacing.xl }]}>
                <Text style={styles.addressLabel}>DESTINATION</Text>
                <Text style={styles.addressValue}>Dallas Love Field Airport, Dallas, TX</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Agent */}
        <Text style={styles.sectionLabel}>Assigned Agent</Text>
        <Card variant="outlined">
          <View style={styles.agentRow}>
            <View style={styles.agentAvatar}>
              <Ionicons name="person" size={28} color={Colors.steel} />
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>Pending Assignment</Text>
              <Text style={styles.agentSub}>Will be assigned 30 min before pickup</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.steel} />
            </View>
          </View>
        </Card>

        {/* Details */}
        <Text style={styles.sectionLabel}>Service Details</Text>
        <Card variant="outlined">
          {[
            { label: 'Service Type', value: 'Armed Executive Protection' },
            { label: 'Armed Status', value: 'Armed' },
            { label: 'Attire', value: 'Executive Suit' },
            { label: 'Detail Size', value: 'Single Agent' },
            { label: 'Vehicle Class', value: 'Executive SUV' },
          ].map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </Card>

        {/* Payment */}
        <Text style={styles.sectionLabel}>Payment</Text>
        <Card variant="outlined">
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Total</Text>
            <Text style={styles.detailValue}>$375.00</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <View style={styles.paymentMethod}>
              <Ionicons name="card-outline" size={14} color={Colors.steel} />
              <Text style={styles.detailValue}>•••• 4242</Text>
            </View>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Status</Text>
            <Badge label="Authorized" variant="success" size="sm" />
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Contact Support"
            variant="secondary"
            onPress={() => {}}
            leftIcon={<Ionicons name="chatbubble-outline" size={16} color={Colors.textPrimary} />}
            style={styles.actionBtn}
          />
          <Button
            title="Cancel Booking"
            variant="ghost"
            onPress={handleCancel}
            style={styles.cancelBtn}
            textStyle={{ color: Colors.errorLight }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  statusCard: { marginBottom: Spacing.lg },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  statusLeft: {},
  bookingIdLabel: { color: Colors.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 2 },
  bookingId: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.bold, letterSpacing: 1 },
  statusMeta: {},
  serviceType: { color: Colors.crimsonLight, fontSize: Typography.size.md, fontWeight: Typography.weight.semiBold },
  serviceDate: { color: Colors.textSecondary, fontSize: Typography.size.sm, marginTop: 2 },

  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  routeRow: { flexDirection: 'row', gap: Spacing.md },
  routeConnectorCol: { alignItems: 'center', paddingTop: 4 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: { width: 2, flex: 1, backgroundColor: Colors.border, marginVertical: 4 },
  routeAddresses: { flex: 1 },
  addressBlock: {},
  addressLabel: { color: Colors.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 2 },
  addressValue: { color: Colors.textPrimary, fontSize: Typography.size.base, lineHeight: 22 },

  agentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  agentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInfo: { flex: 1 },
  agentName: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.semiBold },
  agentSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },
  verifiedBadge: { padding: Spacing.xs },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  detailValue: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  actions: { marginTop: Spacing['2xl'], gap: Spacing.sm },
  actionBtn: {},
  cancelBtn: {},
});
