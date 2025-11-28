import { useState, useEffect } from 'react';
import type { Department } from '../types/database';
import { mockApi } from '../lib/mock-api';

export const useDepartments = (officeId?: string) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getDepartments(officeId);
      setDepartments(data);
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

