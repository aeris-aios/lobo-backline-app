import { SecureStorage } from '../utils/storage';
import { Booking, BookingRequest, User, MessageThread, Message, AppNotification } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.loboexecutiveprotection.com/v1';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await SecureStorage.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-App-Version': '1.0.0',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await SecureStorage.clearAll();
    throw new Error('SESSION_EXPIRED');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message ?? `Request failed with status ${response.status}`);
  }

  return response.json();
}

// -----------------------------------------------------------
// User
// -----------------------------------------------------------
export const UserAPI = {
  getProfile(): Promise<User> {
    return request<User>('/user/profile');
  },

  updateProfile(data: Partial<User>): Promise<User> {
    return request<User>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// -----------------------------------------------------------
// Bookings
// -----------------------------------------------------------
export const BookingAPI = {
  create(req: BookingRequest): Promise<Booking> {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  list(filter?: 'upcoming' | 'active' | 'completed'): Promise<Booking[]> {
    const qs = filter ? `?status=${filter}` : '';
    return request<Booking[]>(`/bookings${qs}`);
  },

  getById(bookingId: string): Promise<Booking> {
    return request<Booking>(`/bookings/${bookingId}`);
  },

  cancel(bookingId: string, reason?: string): Promise<void> {
    return request<void>(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  getEstimate(req: Omit<BookingRequest, 'paymentMethodId'>): Promise<{ estimatedCost: number; estimatedArrival: number }> {
    return request('/bookings/estimate', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },
};

// -----------------------------------------------------------
// Messages
// -----------------------------------------------------------
export const MessagingAPI = {
  getThreads(): Promise<MessageThread[]> {
    return request<MessageThread[]>('/messages/threads');
  },

  getMessages(threadId: string): Promise<Message[]> {
    return request<Message[]>(`/messages/threads/${threadId}`);
  },

  sendMessage(threadId: string, body: string): Promise<Message> {
    return request<Message>(`/messages/threads/${threadId}`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  },

  markRead(threadId: string): Promise<void> {
    return request<void>(`/messages/threads/${threadId}/read`, { method: 'POST' });
  },
};

// -----------------------------------------------------------
// Notifications
// -----------------------------------------------------------
export const NotificationsAPI = {
  list(): Promise<AppNotification[]> {
    return request<AppNotification[]>('/notifications');
  },

  markRead(notificationId: string): Promise<void> {
    return request<void>(`/notifications/${notificationId}/read`, { method: 'POST' });
  },
};
