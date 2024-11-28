import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Booking {
  id: string;
  userId: string;
  classId: string;
  className: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  instructor: {
    id: string;
    name: string;
  };
  gym: {
    id: string;
    name: string;
    location: string;
  };
}

interface BookingContextType {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  createBooking: (classId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  getUpcomingBookings: () => Booking[];
  getPastBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's bookings
  const fetchBookings = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async (classId: string) => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const newBooking = await response.json();
      setBookings((prev) => [...prev, newBooking]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string) => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get upcoming bookings
  const getUpcomingBookings = () => {
    return bookings.filter((booking) => booking.status === 'upcoming');
  };

  // Get past bookings
  const getPastBookings = () => {
    return bookings.filter((booking) => booking.status === 'completed');
  };

  // Fetch bookings when user changes
  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const value = {
    bookings,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking,
    getUpcomingBookings,
    getPastBookings,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export default BookingContext;
