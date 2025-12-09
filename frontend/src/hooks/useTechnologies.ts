import { useState, useEffect } from 'react';
import type { Technology } from '../types/database';
import { api } from '../lib/api';

export const useTechnologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      const data = await api.getTechnologies();
      setTechnologies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading technologies'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);

  return { technologies, loading, error, refetch: loadTechnologies };
};

