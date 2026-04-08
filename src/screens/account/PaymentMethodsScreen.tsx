import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/theme';
import Header from '../../components/common/Header';

interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const INITIAL_CARDS: PaymentCard[] = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '04/27', isDefault: true },
  { id: '2', brand: 'Amex', last4: '1001', expiry: '11/25', isDefault: false },
];

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState<PaymentCard[]>(INITIAL_CARDS);
  const [applePayEnabled, setApplePayEnabled] = useState(false);

  const handleSetDefault = (id: string) => {
    setCards(prev =>
      prev.map(c => ({ ...c, isDefault: c.id === id }))
    );
  };

  const handleRemoveCard = (id: string, brand: string, last4: string) => {
    const card = cards.find(c => c.id === id);
    if (card?.isDefault) {
      Alert.alert('Cannot Remove', 'Please set another card as default before removing this one.');
      return;
    }
    Alert.alert(
      'Remove Card',
      `Remove ${brand} ••••${last4} from your account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setCards(prev => prev.filter(c => c.id !== id)),
        },
      ]
    );
  };

  const handleAddPayment = () => {
    Alert.alert('Add Payment Method', 'Secure card entry coming soon.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Payment Methods" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Digital Wallets */}
        <Text style={styles.sectionLabel}>Digital Wallets</Text>
        <View style={styles.sectionCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="phone-portrait-outline" size={18} color={Colors.steel} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Apple Pay</Text>
              <Text style={styles.menuSub}>Pay with Touch ID or Face ID</Text>
            </View>
            <Switch
              value={applePayEnabled}
              onValueChange={setApplePayEnabled}
              trackColor={{ false: Colors.surface3, true: Colors.crimsonDark }}
              thumbColor={applePayEnabled ? Colors.crimsonLight : Colors.steel}
              ios_backgroundColor={Colors.surface3}
            />
          </View>
        </View>

        {/* Saved Cards */}
        <Text style={styles.sectionLabel}>Saved Cards</Text>
        {cards.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="card-outline" size={28} color={Colors.steel} />
            <Text style={styles.emptyText}>No saved cards</Text>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            {cards.map((card, index) => (
              <React.Fragment key={card.id}>
                {index > 0 && <View style={styles.divider} />}
                <CardRow
                  card={card}
                  onSetDefault={() => handleSetDefault(card.id)}
                  onRemove={() => handleRemoveCard(card.id, card.brand, card.last4)}
                />
              </React.Fragment>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={16} color={Colors.steel} />
          <Text style={styles.infoText}>
            All payment data is encrypted with PCI-DSS Level 1 compliance.
            Card numbers are never stored on our servers.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddPayment} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function CardRow({
  card,
  onSetDefault,
  onRemove,
}: {
  card: PaymentCard;
  onSetDefault: () => void;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity style={styles.cardRow} onPress={onSetDefault} activeOpacity={0.7}>
      <View style={styles.menuIcon}>
        <Ionicons name="card-outline" size={18} color={Colors.steel} />
      </View>
      <View style={styles.menuContent}>
        <View style={styles.cardTopRow}>
          <Text style={styles.menuLabel}>
            {card.brand} ••••{card.last4}
          </Text>
          {card.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuSub}>Expires {card.expiry}</Text>
      </View>
      <TouchableOpacity
        onPress={onRemove}
        style={styles.removeBtn}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
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

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { color: Colors.textPrimary, fontSize: Typography.size.base },
  menuSub: { color: Colors.textMuted, fontSize: Typography.size.xs, marginTop: 2 },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  defaultBadge: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.wider,
  },
  removeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface3,
  },

  emptyCard: {
    backgroundColor: Colors.surface2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing['2xl'],
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
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

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.crimson,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    marginTop: Spacing.xl,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
