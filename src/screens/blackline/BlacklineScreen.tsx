import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../theme/theme';
import Button from '../../components/common/Button';

const BLACKLINE_URL = 'https://www.loboexecutiveprotection.com/blackline';

export default function BlacklineScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const webviewRef = useRef<WebView>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setHasError(false);
    setIsLoading(true);
    setKey((k) => k + 1);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Native header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.blacklineDot} />
          <View>
            <Text style={styles.headerTitle}>BLACKLINE</Text>
            <Text style={styles.headerSub}>Premium Transport Division</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn} activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={20} color={Colors.steel} />
        </TouchableOpacity>
      </View>

      {/* WebView area */}
      <View style={styles.webviewContainer}>
        {hasError || Platform.OS === 'web' ? (
          <BlacklineOffline
            onRetry={Platform.OS === 'web' ? () => Linking.openURL(BLACKLINE_URL) : handleRefresh}
            onBookNative={() => navigation.navigate('BlacklineBooking')}
            isWeb={Platform.OS === 'web'}
          />
        ) : (
          <>
            <WebView
              key={key}
              ref={webviewRef}
              source={{ uri: BLACKLINE_URL }}
              style={styles.webview}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={handleError}
              onHttpError={handleError}
              pullToRefreshEnabled
              allowsBackForwardNavigationGestures
              contentInsetAdjustmentBehavior="automatic"
              injectedJavaScript={`
                (function() {
                  const meta = document.createElement('meta');
                  meta.name = 'viewport';
                  meta.content = 'width=device-width, initial-scale=1.0';
                  document.head.appendChild(meta);
                  const cookieBanners = document.querySelectorAll('[id*="cookie"], [class*="cookie"], [id*="gdpr"], [class*="gdpr"]');
                  cookieBanners.forEach(el => { el.style.display = 'none'; });
                })();
                true;
              `}
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={Colors.blacklineAccent} size="large" />
                <Text style={styles.loadingText}>Loading Blackline...</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Native CTA overlay — always visible */}
      <View style={[styles.ctaOverlay, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <View style={styles.ctaContent}>
          <View style={styles.ctaTextGroup}>
            <Text style={styles.ctaLabel}>Blackline Transport</Text>
            <Text style={styles.ctaSubLabel}>Premium secure transport</Text>
          </View>
          <Button
            title="Request Service"
            onPress={() => navigation.navigate('BlacklineBooking')}
            variant="blackline"
            size="sm"
            style={styles.ctaBtn}
          />
        </View>
      </View>
    </View>
  );
}

// Offline fallback component
function BlacklineOffline({
  onRetry,
  onBookNative,
  isWeb = false,
}: {
  onRetry: () => void;
  onBookNative: () => void;
  isWeb?: boolean;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.offlineContainer}
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRetry} tintColor={Colors.crimson} />}
    >
      <LinearGradient
        colors={[Colors.blacklineDark, '#0A0A0A']}
        style={styles.offlineGradient}
      >
        <Ionicons name="car-sport-outline" size={64} color={Colors.blacklineAccent} style={styles.offlineIcon} />
        <Text style={styles.offlineTitle}>BLACKLINE</Text>
        <Text style={styles.offlineSubtitle}>Premium Transport Division</Text>

        <View style={styles.offlineDivider} />

        <Text style={styles.offlineBody}>
          Blackline is LOBO's elite ground transportation division — armored or unarmored, executive-ready vehicles with vetted operators.
        </Text>

        <View style={styles.offlineFeatures}>
          {[
            { icon: 'shield-checkmark-outline', text: 'Vetted & licensed operators' },
            { icon: 'car-sport-outline', text: 'Fleet: Sedan · SUV · Armored SUV' },
            { icon: 'time-outline', text: 'On-demand & scheduled pickups' },
            { icon: 'lock-closed-outline', text: 'Discreet, low-profile movement' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={item.icon as any} size={18} color={Colors.blacklineAccent} />
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Button
          title="Book Blackline Now"
          onPress={onBookNative}
          variant="blackline"
          size="lg"
          style={styles.offlineBookBtn}
        />

        <TouchableOpacity onPress={onRetry} style={styles.retryLink} activeOpacity={0.7}>
          <Ionicons name={isWeb ? 'open-outline' : 'refresh-outline'} size={14} color={Colors.steel} />
          <Text style={styles.retryText}>{isWeb ? 'Open in browser' : 'Retry loading webpage'}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  blacklineDot: {
    width: 8,
    height: 28,
    backgroundColor: Colors.blacklineAccent,
    borderRadius: 2,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.heavy,
    letterSpacing: Typography.letterSpacing.widest,
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    letterSpacing: Typography.letterSpacing.wide,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.steel,
    fontSize: Typography.size.sm,
  },
  ctaOverlay: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    ...Shadows.lg,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaTextGroup: {},
  ctaLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
  },
  ctaSubLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  ctaBtn: {
    minWidth: 140,
  },

  // Offline styles
  offlineContainer: { flexGrow: 1 },
  offlineGradient: {
    flex: 1,
    padding: Spacing['2xl'],
    paddingTop: Spacing['3xl'],
    alignItems: 'center',
  },
  offlineIcon: { marginBottom: Spacing.lg },
  offlineTitle: {
    color: Colors.blacklineAccent,
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.heavy,
    letterSpacing: Typography.letterSpacing.widest,
  },
  offlineSubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.size.sm,
    letterSpacing: Typography.letterSpacing.wide,
    marginTop: 4,
  },
  offlineDivider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.blacklineAccent,
    marginVertical: Spacing.xl,
    borderRadius: 1,
  },
  offlineBody: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  offlineFeatures: {
    width: '100%',
    marginBottom: Spacing['2xl'],
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(192,192,192,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
  },
  offlineBookBtn: { width: '100%', marginBottom: Spacing.lg },
  retryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  retryText: {
    color: Colors.steel,
    fontSize: Typography.size.sm,
  },
});
