import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useTasks } from './useTasks';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  joinedDate: Date;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
  averageAiScore: number;
}

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => void;
}

export function useProfile(): UseProfileReturn {
  const { user: authUser } = useAuth();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate task statistics from real tasks data
  const taskStats = useMemo(() => {
    if (!tasks.length) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        highPriorityTasks: 0,
        mediumPriorityTasks: 0,
        lowPriorityTasks: 0,
        averageAiScore: 0,
      };
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
    const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
    
    const totalAiScore = tasks.reduce((sum, task) => sum + (task.aiPriorityScore || 0), 0);
    const averageAiScore = totalTasks > 0 ? Math.round(totalAiScore / totalTasks) : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      averageAiScore,
    };
  }, [tasks]);

  // Build profile data from auth user + task statistics
  const profile: ProfileData | null = useMemo(() => {
    if (!authUser) return null;

    return {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || 
            authUser.email?.split('@')[0] || 
            'User',
      email: authUser.email || '',
      profilePicture: authUser.user_metadata?.avatar_url || null,
      joinedDate: new Date(authUser.created_at),
      ...taskStats,
    };
  }, [authUser, taskStats]);

  // Update loading state
  useEffect(() => {
    setLoading(tasksLoading);
  }, [tasksLoading]);

  // Update error state
  useEffect(() => {
    setError(tasksError);
  }, [tasksError]);

  const refreshProfile = () => {
    // Profile data is automatically refreshed when tasks refresh
    // since it's computed from tasks data
    console.log('Profile data refreshed automatically with tasks');
  };

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
}