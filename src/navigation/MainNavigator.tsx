import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, TabBar as TabBarTheme } from '../theme/theme';
import { MainTabParamList } from '../types';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import LocationPickerScreen from '../screens/home/LocationPickerScreen';
import BlacklineRequestScreen from '../screens/home/BlacklineRequestScreen';
import BlacklineOverviewScreen from '../screens/home/BlacklineOverviewScreen';
import ArmedEPOverviewScreen from '../screens/home/ArmedEPOverviewScreen';
import UnarmedEPOverviewScreen from '../screens/home/UnarmedEPOverviewScreen';
import FamilyEPOverviewScreen from '../screens/home/FamilyEPOverviewScreen';
import BookProtectionScreen from '../screens/home/BookProtectionScreen';
import ScheduleProtectionScreen from '../screens/home/ScheduleProtectionScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import RequestNowScreen from '../screens/home/RequestNowScreen';
import SpecialEventOverviewScreen from '../screens/home/SpecialEventOverviewScreen';
import SpecialEventBookingScreen from '../screens/home/SpecialEventBookingScreen';
import BookingConfirmationScreen from '../screens/home/BookingConfirmationScreen';
import TripsScreen from '../screens/trips/TripsScreen';
import TripDetailScreen from '../screens/trips/TripDetailScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ThreadScreen from '../screens/messages/ThreadScreen';
import AccountScreen from '../screens/account/AccountScreen';
import SecuritySettingsScreen from '../screens/account/SecuritySettingsScreen';
import PersonalInformationScreen from '../screens/account/PersonalInformationScreen';
import SavedLocationsScreen from '../screens/account/SavedLocationsScreen';
import PaymentMethodsScreen from '../screens/account/PaymentMethodsScreen';
import NotificationPreferencesScreen from '../screens/account/NotificationPreferencesScreen';
import PrivacySettingsScreen from '../screens/account/PrivacySettingsScreen';
import ContactSupportScreen from '../screens/account/ContactSupportScreen';
import TermsOfServiceScreen from '../screens/account/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/account/PrivacyPolicyScreen';
import AppVersionScreen from '../screens/account/AppVersionScreen';

// Stack navigators for each tab
const HomeStack = createNativeStackNavigator();
function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <HomeStack.Screen name="BlacklineOverview" component={BlacklineOverviewScreen} />
      <HomeStack.Screen name="BlacklineRequest" component={BlacklineRequestScreen} />
      <HomeStack.Screen name="ArmedEPOverview" component={ArmedEPOverviewScreen} />
      <HomeStack.Screen name="UnarmedEPOverview" component={UnarmedEPOverviewScreen} />
      <HomeStack.Screen name="FamilyEPOverview" component={FamilyEPOverviewScreen} />
      <HomeStack.Screen name="BookProtection" component={BookProtectionScreen} />
      <HomeStack.Screen name="ScheduleProtection" component={ScheduleProtectionScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen name="RequestNow" component={RequestNowScreen} />
      <HomeStack.Screen name="SpecialEventOverview" component={SpecialEventOverviewScreen} />
      <HomeStack.Screen name="SpecialEventBooking" component={SpecialEventBookingScreen} />
      <HomeStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </HomeStack.Navigator>
  );
}

const BlacklineStack = createNativeStackNavigator();
function BlacklineStackNav() {
  return (
    <BlacklineStack.Navigator screenOptions={{ headerShown: false }}>
      <BlacklineStack.Screen name="BlacklineOverview" component={BlacklineOverviewScreen} />
      <BlacklineStack.Screen name="BlacklineRequest" component={BlacklineRequestScreen} />
      <BlacklineStack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </BlacklineStack.Navigator>
  );
}

const TripsStack = createNativeStackNavigator();
function TripsStackNav() {
  return (
    <TripsStack.Navigator screenOptions={{ headerShown: false }}>
      <TripsStack.Screen name="TripsMain" component={TripsScreen} />
      <TripsStack.Screen name="TripDetail" component={TripDetailScreen} />
    </TripsStack.Navigator>
  );
}

const MessagesStack = createNativeStackNavigator();
function MessagesStackNav() {
  return (
    <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
      <MessagesStack.Screen name="MessagesMain" component={MessagesScreen} />
      <MessagesStack.Screen name="Thread" component={ThreadScreen} />
    </MessagesStack.Navigator>
  );
}

const AccountStack = createNativeStackNavigator();
function AccountStackNav() {
  return (
    <AccountStack.Navigator screenOptions={{ headerShown: false }}>
      <AccountStack.Screen name="AccountMain" component={AccountScreen} />
      <AccountStack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
      <AccountStack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
      <AccountStack.Screen name="SavedLocations" component={SavedLocationsScreen} />
      <AccountStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <AccountStack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <AccountStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <AccountStack.Screen name="ContactSupport" component={ContactSupportScreen} />
      <AccountStack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <AccountStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <AccountStack.Screen name="AppVersion" component={AppVersionScreen} />
    </AccountStack.Navigator>
  );
}

// Bottom tab
const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: TabBarTheme.backgroundColor }]} />
          ),
        tabBarActiveTintColor: TabBarTheme.activeColor,
        tabBarInactiveTintColor: TabBarTheme.inactiveColor,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, { focused: keyof typeof Ionicons.glyphMap; outline: keyof typeof Ionicons.glyphMap }> = {
            Home: { focused: 'shield', outline: 'shield-outline' },
            Trips: { focused: 'map', outline: 'map-outline' },
            Messages: { focused: 'chatbubbles', outline: 'chatbubbles-outline' },
            Account: { focused: 'person-circle', outline: 'person-circle-outline' },
          };
          const icon = icons[route.name];
          if (!icon) return null;
          return (
            <Ionicons
              name={focused ? icon.focused : icon.outline}
              size={24}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNav} options={{ tabBarLabel: 'LOBO Home' }} />
      <Tab.Screen name="Trips" component={TripsStackNav} options={{ tabBarLabel: 'Bookings' }} />
      <Tab.Screen name="Messages" component={MessagesStackNav} options={{ tabBarLabel: 'Messages' }} />
      <Tab.Screen name="Account" component={AccountStackNav} options={{ tabBarLabel: 'Account' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: TabBarTheme.height,
    borderTopColor: TabBarTheme.borderTopColor,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
