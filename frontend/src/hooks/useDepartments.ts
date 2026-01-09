import { useState, useEffect } from 'react';
import type { Department, Office } from '../types/database';
import { api } from '../lib/api';

type DepartmentWithOffice = Department & {
  offices?: Office[];
  country?: string;
};

type DepartmentsByCountry = Record<string, DepartmentWithOffice[]>;

export const useDepartments = (officeId?: string) => {
  const [departments, setDepartments] = useState<DepartmentsByCountry>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await api.getDepartments(officeId);
      setDepartments(data as DepartmentsByCountry);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading departments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, [officeId]);

  return { departments, loading, error, refetch: loadDepartments };
};

