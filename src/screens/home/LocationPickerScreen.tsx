import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type LocationPickerField = 'pickup' | 'destination';

type LocationPickerRouteParams = {
  LocationPicker: {
    field: LocationPickerField;
    onSelect: (location: { name: string; address: string; placeId?: string }) => void;
  };
};

interface PlaceSuggestion {
  placeId: string;
  name: string;
  address: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const SAVED_PLACES = [
  { id: 'home', icon: 'home', label: 'Home', address: '4821 Oak Lawn Ave, Dallas TX', color: Colors.crimson },
  { id: 'office', icon: 'briefcase', label: 'Office', address: '2100 McKinney Ave, Dallas TX', color: '#4A90D9' },
  { id: 'four_seasons', icon: 'star', label: 'Four Seasons', address: '2800 Routh St, Dallas TX', color: '#F5A623' },
  { id: 'att_stadium', icon: 'flag', label: "AT&T Stadium", address: '1 AT&T Way, Arlington TX', color: '#7ED321' },
];

const RECENT_LOCATIONS = [
  { id: 'r1', name: 'Dallas Love Field', address: '8008 Herb Kelleher Way, Dallas TX' },
  { id: 'r2', name: 'Four Seasons Hotel', address: '2800 Routh St, Dallas TX' },
  { id: 'r3', name: 'AT&T Stadium', address: '1 AT&T Way, Arlington TX' },
  { id: 'r4', name: 'The Ritz-Carlton Dallas', address: '2121 McKinney Ave, Dallas TX' },
  { id: 'r5', name: 'Dallas Executive Airport', address: '5303 Challenger Dr, Dallas TX' },
];

// Google Places API key — set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your .env
const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LocationPickerScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<LocationPickerRouteParams, 'LocationPicker'>>();
  const { field, onSelect } = route.params;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityMode, setCityMode] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDestination = field === 'destination';
  const placeholderText = isDestination ? 'Where to?' : 'Enter pickup address';

  // Auto-focus input on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  // Debounced Google Places autocomplete
  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setSuggestions([]);
      return;
    }
    if (!PLACES_API_KEY) {
      // No API key — show mock results
      setSuggestions(
        RECENT_LOCATIONS.filter(l =>
          l.name.toLowerCase().includes(text.toLowerCase()) ||
          l.address.toLowerCase().includes(text.toLowerCase())
        ).map(l => ({ placeId: l.id, name: l.name, address: l.address }))
      );
      return;
    }
    setLoading(true);
    try {
      const components = cityMode ? '' : 'country:us';
      const url =
        `${PLACES_BASE}/autocomplete/json?input=${encodeURIComponent(text)}` +
        `&key=${PLACES_API_KEY}&language=en&types=geocode|establishment` +
        (components ? `&components=${components}` : '');
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === 'OK') {
        setSuggestions(
          json.predictions.slice(0, 6).map((p: any) => ({
            placeId: p.place_id,
            name: p.structured_formatting?.main_text ?? p.description,
            address: p.structured_formatting?.secondary_text ?? '',
          }))
        );
      }
    } catch {
      // Network failure — fall through to empty
    } finally {
      setLoading(false);
    }
  }, [cityMode]);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(text), 320);
  };

  const handleSelect = (location: { name: string; address: string; placeId?: string }) => {
    Keyboard.dismiss();
    onSelect(location);
    navigation.goBack();
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const showSuggestions = query.length >= 2 && suggestions.length > 0;
  const showDefault = query.length < 2;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <View style={[styles.fieldDot, isDestination ? styles.dotRed : styles.dotGreen]} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={placeholderText}
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={handleQueryChange}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="words"
            clearButtonMode="never"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
          {loading && <ActivityIndicator size="small" color={Colors.crimson} style={{ marginLeft: 6 }} />}
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Quick Actions ── */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('MapPicker', { field, onSelect })}
        >
          <View style={[styles.quickIcon, { backgroundColor: 'rgba(139,0,0,0.15)' }]}>
            <Ionicons name="map-outline" size={20} color={Colors.crimson} />
          </View>
          <Text style={styles.quickLabel}>Set on Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SavedLocations')}
        >
          <View style={[styles.quickIcon, { backgroundColor: 'rgba(74,144,217,0.15)' }]}>
            <Ionicons name="bookmark-outline" size={20} color="#4A90D9" />
          </View>
          <Text style={styles.quickLabel}>Saved Places</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickBtn, cityMode && styles.quickBtnActive]}
          activeOpacity={0.7}
          onPress={() => { setCityMode(c => !c); setSuggestions([]); }}
        >
          <View style={[styles.quickIcon, { backgroundColor: cityMode ? 'rgba(245,166,35,0.25)' : 'rgba(245,166,35,0.12)' }]}>
            <Ionicons name="globe-outline" size={20} color="#F5A623" />
          </View>
          <Text style={[styles.quickLabel, cityMode && styles.quickLabelActive]}>
            {cityMode ? 'US Only Off' : 'Different City'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* ── Results ── */}
      <FlatList
        data={showSuggestions ? suggestions : showDefault ? [] : []}
        keyExtractor={item => item.placeId}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          showDefault ? (
            <DefaultContent
              field={field}
              onSelect={handleSelect}
              savedPlaces={SAVED_PLACES}
              recentLocations={RECENT_LOCATIONS}
            />
          ) : null
        }
        ListEmptyComponent={
          !showDefault && query.length >= 2 && !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No results for "{query}"</Text>
              <Text style={styles.emptySubText}>Try a street address or landmark</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() => handleSelect({ name: item.name, address: item.address, placeId: item.placeId })}
            activeOpacity={0.7}
          >
            <View style={styles.suggestionIconWrap}>
              <Ionicons name="location-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.suggestionText}>
              <Text style={styles.suggestionName} numberOfLines={1}>{item.name}</Text>
              {!!item.address && (
                <Text style={styles.suggestionAddress} numberOfLines={1}>{item.address}</Text>
              )}
            </View>
            <Ionicons name="arrow-forward-outline" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Default content (saved places + recents)
// ---------------------------------------------------------------------------
function DefaultContent({
  field,
  onSelect,
  savedPlaces,
  recentLocations,
}: {
  field: LocationPickerField;
  onSelect: (loc: { name: string; address: string }) => void;
  savedPlaces: typeof SAVED_PLACES;
  recentLocations: typeof RECENT_LOCATIONS;
}) {
  return (
    <View>
      {/* Saved places */}
      <Text style={styles.sectionLabel}>Saved Places</Text>
      <View style={styles.savedGrid}>
        {savedPlaces.map(place => (
          <TouchableOpacity
            key={place.id}
            style={styles.savedChip}
            onPress={() => onSelect({ name: place.label, address: place.address })}
            activeOpacity={0.7}
          >
            <View style={[styles.savedChipIcon, { backgroundColor: `${place.color}22` }]}>
              <Ionicons name={place.icon as any} size={18} color={place.color} />
            </View>
            <Text style={styles.savedChipLabel} numberOfLines={1}>{place.label}</Text>
            <Text style={styles.savedChipAddr} numberOfLines={1}>{place.address.split(',')[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent locations */}
      <Text style={styles.sectionLabel}>
        {field === 'destination' ? 'Recent Destinations' : 'Recent Pickups'}
      </Text>
      {recentLocations.map((loc, i) => (
        <React.Fragment key={loc.id}>
          {i > 0 && <View style={styles.rowDivider} />}
          <TouchableOpacity
            style={styles.recentRow}
            onPress={() => onSelect({ name: loc.name, address: loc.address })}
            activeOpacity={0.7}
          >
            <View style={styles.recentIcon}>
              <Ionicons name="time-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.recentText}>
              <Text style={styles.recentName}>{loc.name}</Text>
              <Text style={styles.recentAddress} numberOfLines={1}>{loc.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface3,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: Spacing.sm,
  },
  fieldDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotGreen: { backgroundColor: '#4CAF50' },
  dotRed: { backgroundColor: Colors.crimson },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    paddingVertical: 0,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  quickBtnActive: {
    borderColor: '#F5A623',
    backgroundColor: 'rgba(245,166,35,0.08)',
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    textAlign: 'center',
  },
  quickLabelActive: {
    color: '#F5A623',
  },

  // Section label
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  // Saved places grid
  savedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  savedChip: {
    width: '47%',
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 4,
  },
  savedChipIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  savedChipLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  savedChipAddr: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
  },

  // Recent rows
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: { flex: 1 },
  recentName: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
  },
  recentAddress: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: 2,
  },

  // Suggestion rows
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  suggestionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: { flex: 1 },
  suggestionName: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
  },
  suggestionAddress: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: 2,
  },

  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    textAlign: 'center',
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    textAlign: 'center',
  },
});
