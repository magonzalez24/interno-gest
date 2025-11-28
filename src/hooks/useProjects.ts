import { useState, useEffect } from 'react';
import type { Project, ProjectStatus } from '../types/database';
import { mockApi } from '../lib/mock-api';

export const useProjects = (filters?: { officeId?: string; status?: ProjectStatus }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getProjects(filters);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading projects'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filters?.officeId, filters?.status]);

  return { projects, loading, error, refetch: loadProjects };
};

