// User Types
export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  name?: string; 
  email: string;
  phoneNumber: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'admin' | 'owner';

// Gym Types
export interface Gym {
  _id: string;
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  ownerId: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviews: Review[];
  slots: Slot[];
  createdAt: string;
  updatedAt: string;
  pricing: {
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  email: string;
  facilities: string[];
  openingTime: string;
  closingTime: string;
  openingHours: string;
  closingHours: string;
  reviewCount: number;
  pricePerMonth: number;
}

// Review Types
export interface Review {
  _id: string;
  id: string;
  userId: string;
  gymId: string;
  rating: number;
  comment: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

// Slot Types
export interface Slot {
  _id: string;
  id: string;
  gymId: string;
  name: string;
  startTime: string;
  endTime: string;
  capacity: number;
  price: {
    day: number;
    week: number;
    month: number;
  };
  daysAvailable: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlotDTO {
  gymId: string;
  name: string;
  startTime: string;
  endTime: string;
  capacity: number;
  price: {
    day: number;
    week: number;
    month: number;
  };
  daysAvailable?: string[];
  isActive?: boolean;
}

export interface UpdateSlotDTO {
  name?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  price?: {
    day?: number;
    week?: number;
    month?: number;
  };
  daysAvailable?: string[];
  isActive?: boolean;
}

export interface SlotData {
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  price: {
    day: number;
    week: number;
    month: number;
  };
}

// Booking Types
export interface BookingQueryParams {
  gymId?: string;
  userId?: string;
  ownerId?: string;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export interface BookingRequest {
  gymId: string;
  slotId: string;
  startDate: string;
  plan: 'perDay' | 'perWeek' | 'perMonth';
  paymentMethodId?: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface Booking {
  _id: string;
  id: string;
  userId: string;
  gymId: string;
  slotId: string;
  date: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  plan: 'perDay' | 'perWeek' | 'perMonth';
  gym: Gym;
  slot: Slot;
  user: User;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

// Login Types
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: 'user' | 'owner' | 'admin';
}

// Auth Types
export interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  verifyToken?: () => Promise<void>;
  clearError?: () => void;
}

// Update Profile Types
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}

// Change Password Type
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Membership Types
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'booking' | 'membership';
  description: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  totalSessions: number;
  remainingSessions: number;
  nextPaymentDate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsData {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    total: number;
    history: {
      date: string;
      amount: number;
    }[];
  };
  bookings: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    history: {
      date: string;
      count: number;
    }[];
  };
  users: {
    total: number;
    active: number;
    new: number;
    history: {
      date: string;
      count: number;
    }[];
  };
  classes: {
    total: number;
    active: number;
    popular: {
      name: string;
      bookings: number;
    }[];
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showBookingHistory: boolean;
  showReviews: boolean;
}

export interface UserSettings {
  _id: string;
  userId: string;
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  updatedAt: string;
}
