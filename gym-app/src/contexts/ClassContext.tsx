import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Instructor {
  id: string;
  name: string;
  image: string;
  rating: number;
}

interface Gym {
  id: string;
  name: string;
  location: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: Instructor;
  gym: Gym;
  type: string;
  level: string;
  duration: number;
  capacity: number;
  enrolled: number;
  date: string;
  time: string;
  price: number;
  image?: string;
  requirements?: string[];
  benefits?: string[];
}

interface ClassFilters {
  type?: string;
  level?: string;
  instructor?: string;
  gym?: string;
  date?: string;
}

interface ClassContextType {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  filters: ClassFilters;
  fetchClasses: () => Promise<void>;
  fetchClassById: (id: string) => Promise<Class | null>;
  setFilters: (filters: ClassFilters) => void;
  getFilteredClasses: () => Class[];
  getPopularClasses: () => Class[];
  getUpcomingClasses: () => Class[];
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
};

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClassFilters>({});

  // Fetch all classes
  const fetchClasses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/classes', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a specific class by ID
  const fetchClassById = async (id: string): Promise<Class | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/classes/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch class');
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

  // Get filtered classes based on current filters
  const getFilteredClasses = () => {
    return classes.filter((classItem) => {
      const matchesType =
        !filters.type || classItem.type === filters.type;
      const matchesLevel =
        !filters.level || classItem.level === filters.level;
      const matchesInstructor =
        !filters.instructor || classItem.instructor.id === filters.instructor;
      const matchesGym =
        !filters.gym || classItem.gym.id === filters.gym;
      const matchesDate =
        !filters.date || classItem.date === filters.date;

      return (
        matchesType &&
        matchesLevel &&
        matchesInstructor &&
        matchesGym &&
        matchesDate
      );
    });
  };

  // Get popular classes (based on enrollment)
  const getPopularClasses = () => {
    return [...classes]
      .sort((a, b) => b.enrolled / b.capacity - a.enrolled / a.capacity)
      .slice(0, 5);
  };

  // Get upcoming classes
  const getUpcomingClasses = () => {
    const now = new Date();
    return classes.filter((classItem) => {
      const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
      return classDateTime > now;
    });
  };

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const value = {
    classes,
    isLoading,
    error,
    filters,
    fetchClasses,
    fetchClassById,
    setFilters,
    getFilteredClasses,
    getPopularClasses,
    getUpcomingClasses,
  };

  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>;
};

export default ClassContext;
