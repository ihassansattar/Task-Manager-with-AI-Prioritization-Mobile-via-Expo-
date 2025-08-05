import { useQuery } from '@tanstack/react-query';
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

export function useProfile() {
  const { user: authUser } = useAuth();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();

  const { data: profile, isLoading, isError, error, refetch } = useQuery<ProfileData | null, Error>({
    queryKey: ['profile', authUser?.id, tasks],
    queryFn: async () => {
      if (!authUser) return null;

      const taskStats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.completed).length,
        pendingTasks: tasks.filter(task => !task.completed).length,
        highPriorityTasks: tasks.filter(task => task.priority === 'high').length,
        mediumPriorityTasks: tasks.filter(task => task.priority === 'medium').length,
        lowPriorityTasks: tasks.filter(task => task.priority === 'low').length,
        averageAiScore: tasks.length > 0 ? Math.round(tasks.reduce((sum, task) => sum + (task.aiPriorityScore || 0), 0) / tasks.length) : 0,
      };

      return {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        profilePicture: authUser.user_metadata?.avatar_url || null,
        joinedDate: new Date(authUser.created_at),
        ...taskStats,
      };
    },
    enabled: !!authUser && !tasksLoading,
  });

  return {
    profile,
    loading: isLoading || tasksLoading,
    error: isError ? error.message : tasksError,
    refreshProfile: refetch,
  };
}
