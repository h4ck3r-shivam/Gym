import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Schedule {
  day: string;
  openTime: string;
  closeTime: string;
}

export interface Gym {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  memberCount: number;
  facilities: Facility[];
  schedule: Schedule[];
  amenities: string[];
  pricing: {
    monthly: number;
    annual: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface GymFilters {
  location?: string;
  facilities?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
}

interface GymContextType {
  gyms: Gym[];
  isLoading: boolean;
  error: string | null;
  filters: GymFilters;
  fetchGyms: () => Promise<void>;
  fetchGymById: (id: string) => Promise<Gym | null>;
  setFilters: (filters: GymFilters) => void;
  getFilteredGyms: () => Gym[];
  getPopularGyms: () => Gym[];
  getNearbyGyms: (lat: number, lng: number) => Gym[];
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GymFilters>({});

  // Fetch all gyms
  const fetchGyms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gyms', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gyms');
      }

      const data = await response.json();
      setGyms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a specific gym by ID
  const fetchGymById = async (id: string): Promise<Gym | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gyms/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gym');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get filtered gyms based on current filters
  const getFilteredGyms = () => {
    return gyms.filter((gym) => {
      const matchesLocation =
        !filters.location ||
        gym.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesFacilities =
        !filters.facilities ||
        filters.facilities.every((facility) =>
          gym.facilities.some((f) => f.name === facility)
        );
      
      const matchesPriceRange =
        !filters.priceRange ||
        (gym.pricing.monthly >= filters.priceRange.min &&
          gym.pricing.monthly <= filters.priceRange.max);
      
      const matchesRating =
        !filters.rating || gym.rating >= filters.rating;

      return (
        matchesLocation &&
        matchesFacilities &&
        matchesPriceRange &&
        matchesRating
      );
    });
  };

  // Get popular gyms (based on member count and rating)
  const getPopularGyms = () => {
    return [...gyms]
      .sort((a, b) => {
        const scoreA = a.rating * 0.7 + (a.memberCount / 1000) * 0.3;
        const scoreB = b.rating * 0.7 + (b.memberCount / 1000) * 0.3;
        return scoreB - scoreA;
      })
      .slice(0, 5);
  };

  // Get nearby gyms based on coordinates
  const getNearbyGyms = (lat: number, lng: number) => {
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return [...gyms]
      .map((gym) => ({
        ...gym,
        distance: calculateDistance(
          lat,
          lng,
          gym.coordinates.lat,
          gym.coordinates.lng
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 10);
  };

  // Fetch gyms on mount
  useEffect(() => {
    fetchGyms();
  }, []);

  const value = {
    gyms,
    isLoading,
    error,
    filters,
    fetchGyms,
    fetchGymById,
    setFilters,
    getFilteredGyms,
    getPopularGyms,
    getNearbyGyms,
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
};

export default GymContext;
