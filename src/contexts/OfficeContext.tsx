import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Office } from '../types/database';
import { mockApi } from '../lib/mock-api';
import { useAuth } from './AuthContext';

interface OfficeContextType {
  offices: Office[];
  selectedOffice: Office | null;
  setSelectedOffice: (office: Office | null) => void;
  loading: boolean;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const OfficeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffices = async () => {
      if (!user) {
        setOffices([]);
        setSelectedOffice(null);
        setLoading(false);
        return;
      }

      try {
        const userOffices = await mockApi.getUserOffices(user.id);
        setOffices(userOffices);
        
        // Si solo tiene una sede, seleccionarla automáticamente
        if (userOffices.length === 1) {
          setSelectedOffice(userOffices[0]);
        } else if (userOffices.length > 0 && !selectedOffice) {
          // Si tiene múltiples, seleccionar la primera por defecto
          setSelectedOffice(userOffices[0]);
        }
      } catch (error) {
        console.error('Error loading offices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffices();
  }, [user]);

  return (
    <OfficeContext.Provider
      value={{
        offices,
        selectedOffice,
        setSelectedOffice,
        loading,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
};

export const useOffices = () => {
  const context = useContext(OfficeContext);
  if (context === undefined) {
    throw new Error('useOffices must be used within an OfficeProvider');
  }
  return context;
};

