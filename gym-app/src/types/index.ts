// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'user' | 'admin' | 'trainer';
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

// Gym Types
export interface Gym {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  facilities: string[];
  openingTime: string;
  closingTime: string;
  status: 'active' | 'inactive' | 'maintenance';
  pricing: {
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  images: string[];
  rating: number;
  reviews: number;
  owner: string | User;
  createdAt: string;
  updatedAt: string;
}

// Slot Types
export interface Slot {
  _id: string;
  gym: string | Gym;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  isBooked: boolean;
  price: {
    day: number;
    week: number;
    month: number;
  };
  trainer?: string | User;
  status: 'available' | 'booked' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Status and Role Types
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type GymStatus = 'active' | 'inactive' | 'maintenance';
export type UserRole = 'user' | 'admin' | 'trainer';

// Booking Types
export interface Booking {
  _id: string;
  user: string | User;
  gym: string | Gym;
  slot: string | Slot;
  plan: 'day' | 'week' | 'month';
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethodId?: string;
  amount: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt: string;
  additionalNotes?: string;
  discountApplied?: {
    code?: string;
    amount?: number;
  };
  receiptUrl?: string;
}

// Booking Request Types
export interface BookingRequest {
  gymId: string;
  slotId: string;
  startDate: string;
  paymentMethodId: string;
  plan: 'perDay' | 'perWeek' | 'perMonth';
}

// Review Types
export interface Review {
  _id: string;
  user: string | User;
  gym: string | Gym;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  _id: string;
  booking: string | Booking;
  amount: number;
  method: 'credit_card' | 'debit_card' | 'paypal' | 'stripe';
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Membership Types
export interface Membership {
  _id: string;
  user: string | User;
  type: 'basic' | 'premium' | 'elite';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  price: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  user: string | User;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  error?: string;
  data: T;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

// Auth Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  clearError: () => void;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: File;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  healthInformation?: {
    medicalConditions?: string[];
    allergies?: string[];
    medications?: string[];
  };
  fitnessGoals?: string[];
  preferredWorkoutTime?: 'morning' | 'afternoon' | 'evening';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ThemePreference {
  darkMode: boolean;
  language: string;
  notifications: {
    push: boolean;
    email: boolean;
  };
}

// API Types
export interface NotificationAPI {
  getNotifications: () => Promise<ApiResponse<Notification[]>>;
  markAsRead: (id: string) => Promise<ApiResponse<Notification>>;
  deleteNotification: (id: string) => Promise<ApiResponse<void>>;
}
