# LOBO EP Mobile App — Setup & Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for builds): `npm install -g eas-cli`
- Xcode 15+ (for iOS, Mac only)
- Android Studio (for Android)

---

## 1. Install Dependencies

```bash
cd lobo-ep-app
npm install
```

---

## 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your keys (see sections below).

---

## 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project: `lobo-ep-app`
3. Add an iOS app (bundle ID: `com.loboep.app`) and Android app (package: `com.loboep.app`)
4. Enable **Authentication → Email/Password**
5. Download `google-services.json` (Android) → place in `/android/app/`
6. Download `GoogleService-Info.plist` (iOS) → place in `/ios/`
7. Copy your Firebase config values into `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

---

## 4. Google Maps (for live map)

1. Enable **Maps SDK for iOS** and **Maps SDK for Android** in [Google Cloud Console](https://console.cloud.google.com)
2. Create an API key with app restrictions
3. Add to `.env`:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```
4. Replace `MapPlaceholder` component with `react-native-maps`:

```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={{ flex: 1 }}
  initialRegion={{ latitude: 32.7767, longitude: -96.7970, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
/>
```

---

## 5. Run Locally

```bash
# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on physical device
# Scan QR code in Expo Go app
```

---

## 6. Production Builds (EAS)

```bash
# Login to EAS
eas login

# Configure project
eas build:configure

# iOS build (requires Apple Developer account)
eas build --platform ios

# Android build
eas build --platform android

# Both platforms
eas build --platform all
```

---

## 7. Apple Developer Setup (iOS App Store)

When you're ready to submit:

1. Log in at [developer.apple.com](https://developer.apple.com)
2. Create App ID: `com.loboep.app`
3. Enable capabilities: Push Notifications, Face ID
4. Create provisioning profile
5. In `app.json`, set `ios.bundleIdentifier: "com.loboep.app"`
6. Build with EAS: `eas build --platform ios --profile production`
7. Submit: `eas submit --platform ios`

**App Store metadata needed:**
- App name: `LOBO EP`
- Category: Business / Lifestyle
- Age rating: 4+
- Privacy policy URL (required)
- Screenshots: 6.7", 6.1", iPad (if supported)
- Description (see bottom of this doc)

---

## 8. Google Play Setup (Android)

1. Log in at [play.google.com/console](https://play.google.com/console)
2. Create new app: `LOBO EP`
3. Package name: `com.loboep.app`
4. Set up signing key in EAS: `eas credentials`
5. Build: `eas build --platform android --profile production`
6. Submit: `eas submit --platform android`

**Play Store metadata needed:**
- App name: `LOBO EP`
- Category: Business
- Content rating questionnaire
- Privacy policy URL
- Feature graphic (1024×500)
- Screenshots (phone + tablet)

---

## 9. Push Notifications

For production push notifications, add `expo-notifications`:

```bash
npx expo install expo-notifications
```

Then register for push tokens in your auth flow and send to your backend.

Firebase Cloud Messaging (FCM) is already included via Firebase SDK.

---

## 10. Stripe Payment Integration

```bash
npx expo install @stripe/stripe-react-native
```

Wrap your app with `StripeProvider`:

```tsx
import { StripeProvider } from '@stripe/stripe-react-native';

<StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}>
  <App />
</StripeProvider>
```

Payment intents should be created server-side and the client secret returned to the app.

---

## 11. Recommended Backend Structure

### Stack suggestion: Node.js + Express + Supabase or Firebase Firestore

```
/api
  /auth       → Firebase Auth admin SDK, session management
  /users      → Profile CRUD
  /bookings   → Create, list, update, cancel, estimate
  /payments   → Stripe PaymentIntent creation/capture
  /messages   → Thread CRUD, real-time via Firestore
  /notifications → FCM push dispatch
  /agents     → Agent profiles, assignments
  /audit      → Immutable audit log (all actions)
```

### Firestore collections:
```
users/{userId}
bookings/{bookingId}
agents/{agentId}
messageThreads/{threadId}/messages/{messageId}
notifications/{notificationId}
auditLog/{logId}
```

---

## App Store Description (draft)

```
LOBO EP — Executive Protection & Secure Transport

Request armed or unarmed executive protection, Blackline premium transport, family escorts, event security, and corporate VIP movement — all from one secure, discreet mobile platform.

FEATURES:
• Book protection details in seconds
• Blackline premium transport division — on-demand or scheduled
• Armed and unarmed options
• Attire selection: executive suit, tactical, low-profile
• Secure in-app messaging with dispatch
• Full booking history and status tracking
• Biometric login (Face ID / Touch ID)
• End-to-end encrypted communications
• Real-time agent tracking (coming soon)

LOBO Executive Protection operates in Dallas/Fort Worth and surrounding regions.

Built for executives, families, and corporations that require discreet, trustworthy security movement.
```

---

## File Structure Summary

```
lobo-ep-app/
├── App.tsx                         ← Entry point
├── app.json                        ← Expo config
├── package.json
├── tsconfig.json
├── babel.config.js
├── .env.example                    ← Copy to .env
├── assets/                         ← App icons + splash (add your own)
└── src/
    ├── theme/
    │   └── theme.ts                ← All brand colors, typography, spacing
    ├── types/
    │   └── index.ts                ← All TypeScript interfaces
    ├── context/
    │   └── AuthContext.tsx         ← Auth state, biometric, session
    ├── services/
    │   ├── firebase.ts             ← Firebase init
    │   ├── auth.service.ts         ← Login, register, biometric, lockout
    │   └── api.ts                  ← REST API layer (bookings, messages, etc.)
    ├── utils/
    │   ├── storage.ts              ← SecureStore wrapper
    │   └── validators.ts           ← Form validation
    ├── navigation/
    │   ├── RootNavigator.tsx       ← Auth/Main split
    │   ├── AuthNavigator.tsx       ← Login, SignUp, ForgotPassword
    │   └── MainNavigator.tsx       ← Bottom tabs + stacks
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   ├── SignUpScreen.tsx
    │   │   └── ForgotPasswordScreen.tsx
    │   ├── home/
    │   │   └── HomeScreen.tsx      ← Map, booking, services, recent trips
    │   ├── blackline/
    │   │   ├── BlacklineScreen.tsx        ← WebView + native fallback
    │   │   └── BlacklineBookingScreen.tsx ← Native Blackline booking
    │   ├── trips/
    │   │   ├── TripsScreen.tsx
    │   │   └── TripDetailScreen.tsx
    │   ├── messages/
    │   │   ├── MessagesScreen.tsx
    │   │   └── ThreadScreen.tsx
    │   └── account/
    │       ├── AccountScreen.tsx
    │       └── SecuritySettingsScreen.tsx
    └── components/
        ├── common/
        │   ├── Button.tsx
        │   ├── Input.tsx
        │   ├── Card.tsx
        │   ├── Badge.tsx
        │   ├── Header.tsx
        │   └── LoadingScreen.tsx
        └── home/
            ├── MapPlaceholder.tsx
            └── ServiceCard.tsx
```

---

## Next Phase Recommendations

1. **Live agent tracking** — integrate Firestore real-time updates + Google Maps
2. **Push notifications** — expo-notifications + FCM + backend webhook
3. **Stripe payment flow** — full PaymentSheet integration
4. **Admin portal** — web dashboard for dispatch, bookings, agent assignment
5. **Agent app** — separate Expo app for agent-side workflow
6. **ID verification** — Stripe Identity or Persona for client onboarding
7. **In-app reviews** — expo-store-review post-trip prompt
8. **Analytics** — Segment or Firebase Analytics for funnel tracking
9. **Offline support** — React Query + AsyncStorage for optimistic updates
10. **Deep linking** — booking confirmation emails that open the app
