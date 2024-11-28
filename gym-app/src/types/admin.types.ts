export type UserRole = 'user' | 'owner' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'inactive';
export type GymStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface GymOwner {
  id: string;
  name: string;
  email: string;
}

export interface Gym {
  id: string;
  name: string;
  owner: GymOwner;
  location: string;
  status: GymStatus;
  rating: number;
  reviewCount: number;
  memberCount: number;
  images: string[];
  openingHours: string;
  closingHours: string;
  facilities: string[];
}

export interface FitnessClass {
  id: string;
  name: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    specialization: string;
  };
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  enrolled: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: string;
  description: string;
}
