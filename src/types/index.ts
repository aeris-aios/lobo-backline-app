// ============================================================
// LOBO Executive Protection — Core Data Models & Types
// ============================================================

// -----------------------------------------------------------
// Auth
// -----------------------------------------------------------
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  memberSince: string;        // ISO date
  membershipTier: 'standard' | 'executive' | 'blackline';
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  savedLocations: SavedLocation[];
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  defaultServiceType?: ServiceType;
  defaultVehicleClass?: VehicleClass;
}

export interface NotificationPreferences {
  bookingConfirmed: boolean;
  agentAssigned: boolean;
  agentArriving: boolean;
  tripStarted: boolean;
  tripCompleted: boolean;
  paymentReceipt: boolean;
  blacklineAlerts: boolean;
  marketing: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// -----------------------------------------------------------
// Services & Booking
// -----------------------------------------------------------
export type ServiceType =
  | 'blackline_transport'
  | 'armed_executive'
  | 'unarmed_executive'
  | 'school_family_escort'
  | 'event_security'
  | 'corporate_vip';

export type AttireType = 'suit_executive' | 'tactical' | 'low_profile' | 'casual_concealed';
export type ArmedStatus = 'armed' | 'unarmed';
export type DetailSize = 'single_agent' | 'two_agent' | 'full_team';
export type BookingStatus = 'pending' | 'confirmed' | 'agent_assigned' | 'en_route' | 'active' | 'completed' | 'cancelled';
export type VehicleClass = 'sedan' | 'suv' | 'armored_suv' | 'van' | 'blackline';

export interface ServiceOption {
  id: ServiceType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  baseRate: number;         // per hour USD
  requiresArmed: boolean;
  availableAttire: AttireType[];
}

export interface Location {
  id?: string;
  label?: string;
  address: string;
  city: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface SavedLocation extends Location {
  id: string;
  label: 'home' | 'office' | 'custom';
  customLabel?: string;
}

export interface Booking {
  id: string;
  userId: string;
  serviceType: ServiceType;
  status: BookingStatus;
  pickup: Location;
  destination: Location;
  scheduledAt: string;        // ISO datetime
  isNow: boolean;
  armedStatus: ArmedStatus;
  attireType: AttireType;
  detailSize: DetailSize;
  vehicleClass: VehicleClass;
  specialInstructions?: string;
  agentProfile?: AgentProfile;
  vehicle?: Vehicle;
  estimatedArrival?: number;  // minutes
  estimatedDuration?: number; // minutes
  estimatedCost: number;      // USD
  actualCost?: number;
  paymentMethodId: string;
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'refunded';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  receiptUrl?: string;
}

export interface BookingRequest {
  serviceType: ServiceType;
  pickup: Location;
  destination: Location;
  scheduledAt?: string;
  isNow: boolean;
  armedStatus: ArmedStatus;
  attireType: AttireType;
  detailSize: DetailSize;
  vehicleClass: VehicleClass;
  specialInstructions?: string;
  paymentMethodId: string;
}

// -----------------------------------------------------------
// Agent / Driver
// -----------------------------------------------------------
export interface AgentProfile {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  rating: number;            // 0–5
  totalAssignments: number;
  armedCertified: boolean;
  licenseVerified: boolean;
  backgroundCleared: boolean;
  vehicleAssigned?: Vehicle;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  etaMinutes?: number;
  badgeNumber?: string;
  specializations: ServiceType[];
}

// -----------------------------------------------------------
// Vehicle
// -----------------------------------------------------------
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vehicleClass: VehicleClass;
  isArmored: boolean;
  photoUrl?: string;
}

// -----------------------------------------------------------
// Payment
// -----------------------------------------------------------
export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  brand?: string;            // visa, mastercard, amex
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

// -----------------------------------------------------------
// Messaging
// -----------------------------------------------------------
export interface MessageThread {
  id: string;
  bookingId?: string;
  participants: string[];    // user IDs
  subject: string;
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'agent' | 'dispatch' | 'support';
  body: string;
  attachmentUrl?: string;
  readAt?: string;
  createdAt: string;
}

// -----------------------------------------------------------
// Notifications
// -----------------------------------------------------------
export interface AppNotification {
  id: string;
  userId: string;
  type:
    | 'booking_confirmed'
    | 'agent_assigned'
    | 'agent_arriving'
    | 'trip_started'
    | 'trip_completed'
    | 'payment_receipt'
    | 'blackline_alert'
    | 'system';
  title: string;
  body: string;
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
}

// -----------------------------------------------------------
// Navigation param lists
// -----------------------------------------------------------
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Trips: undefined;
  Messages: undefined;
  Account: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  BookingConfirm: { request: BookingRequest };
  ActiveBooking: { bookingId: string };
  LocationPicker: {
    field: 'pickup' | 'destination';
    onSelect: (location: { name: string; address: string; placeId?: string }) => void;
  };
};

export type BlacklineStackParamList = {
  BlacklineMain: undefined;
  BlacklineBooking: undefined;
};

export type TripsStackParamList = {
  TripsMain: undefined;
  TripDetail: { bookingId: string };
};

export type MessagesStackParamList = {
  MessagesMain: undefined;
  Thread: { threadId: string };
};

export type AccountStackParamList = {
  AccountMain: undefined;
  SecuritySettings: undefined;
  PersonalInformation: undefined;
  SavedLocations: undefined;
  PaymentMethods: undefined;
  NotificationPreferences: undefined;
  PrivacySettings: undefined;
  ContactSupport: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  AppVersion: undefined;
};
