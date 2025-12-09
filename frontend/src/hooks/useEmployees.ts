import { useState, useEffect } from 'react';
import type { Employee } from '../types/database';
import { api } from '../lib/api';

export const useEmployees = (filters?: { officeId?: string; departmentId?: string }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees(filters);
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading employees'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [filters?.officeId, filters?.departmentId]);

  return { employees, loading, error, refetch: loadEmployees };
};

