import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Header from '../../components/common/Header';

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const INITIAL_LOCATIONS: SavedLocation[] = [
  {
    id: '1',
    name: 'Home',
    address: '4821 Oak Lawn Ave, Dallas TX',
    icon: 'home-outline',
  },
  {
    id: '2',
    name: 'Office',
    address: '2100 McKinney Ave, Dallas TX',
    icon: 'briefcase-outline',
  },
  {
    id: '3',
    name: 'Four Seasons',
    address: '2800 Routh St, Dallas TX',
    icon: 'star-outline',
  },
  {
    id: '4',
    name: "AT&T Stadium",
    address: '1 AT&T Way, Arlington TX',
    icon: 'flag-outline',
  },
];

export default function SavedLocationsScreen() {
  const insets = useSafeAreaInsets();
  const [locations, setLocations] = useState<SavedLocation[]>(INITIAL_LOCATIONS);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Remove Location',
      `Remove "${name}" from your saved locations?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setLocations(prev => prev.filter(l => l.id !== id)),
        },
      ]
    );
  };

  const handleAddLocation = () => {
    Alert.alert('Add Location', 'Location picker coming soon.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Saved Locations"
        showBack
        rightAction={{ icon: 'add', onPress: handleAddLocation }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {locations.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="location-outline" size={36} color={Colors.steel} />
            </View>
            <Text style={styles.emptyTitle}>No Saved Locations</Text>
            <Text style={styles.emptySubtitle}>
              Add your frequently visited locations for faster booking.
            </Text>
            <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddLocation} activeOpacity={0.8}>
              <Ionicons name="add" size={18} color={Colors.white} style={{ marginRight: Spacing.sm }} />
              <Text style={styles.emptyAddText}>Add Location</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Your Locations</Text>
            <View style={styles.sectionCard}>
              {locations.map((location, index) => (
                <React.Fragment key={location.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <LocationRow
                    location={location}
                    onDelete={() => handleDelete(location.id, location.name)}
                  />
                </React.Fragment>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.steel} />
              <Text style={styles.infoText}>
                Saved locations are encrypted and only shared with your assigned detail during active bookings.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function LocationRow({
  location,
  onDelete,
}: {
  location: SavedLocation;
  onDelete: () => void;
}) {
  return (
    <View style={styles.locationRow}>
      <View style={styles.locationIcon}>
        <Ionicons name={location.icon} size={18} color={Colors.steel} />
      </View>
      <View style={styles.locationContent}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationAddress}>{location.address}</Text>
      </View>
      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteBtn}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base },

  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContent: { flex: 1 },
  locationName: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
  },
  locationAddress: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    paddingHorizontal: Spacing['2xl'],
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.crimson,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyAddText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
  },

  infoCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginTop: Spacing.xl,
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    lineHeight: 20,
    flex: 1,
  },
});
