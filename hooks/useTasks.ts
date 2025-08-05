import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { aiService } from '../lib/aiService';
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';

// Fetch tasks from Supabase
const fetchTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    completed: task.completed,
    createdAt: new Date(task.created_at),
    updatedAt: task.updated_at ? new Date(task.updated_at) : undefined,
    userId: task.user_id,
    aiPriorityScore: task.ai_priority_score,
  }));
};

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, isError, error } = useQuery<Task[], Error>({
    queryKey: ['tasks', user?.id],
    queryFn: () => fetchTasks(user!.id),
    enabled: !!user,
  });

  const createTaskMutation = useMutation<Task, Error, CreateTaskData>({
    mutationFn: async (newTaskData) => {
      if (!user) throw new Error('User not authenticated');

      const aiAnalysis = await aiService.analyzeTaskPriority(
        newTaskData.title,
        newTaskData.description,
        { existingTasks: tasks.map(t => ({ title: t.title, priority: t.priority, completed: t.completed })) }
      );

      let priority = newTaskData.priority || 'medium';
      let aiPriorityScore = 50;

      if (aiAnalysis.success && aiAnalysis.result) {
        priority = aiAnalysis.result.priority;
        aiPriorityScore = aiAnalysis.result.score;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...newTaskData,
          priority,
          ai_priority_score: aiPriorityScore,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return { ...data, createdAt: new Date(data.created_at), updatedAt: data.updated_at ? new Date(data.updated_at) : undefined, userId: data.user_id, aiPriorityScore: data.ai_priority_score };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    },
  });

  const updateTaskMutation = useMutation<void, Error, { id: string; data: UpdateTaskData }>({
    mutationFn: async ({ id, data }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    },
  });

  const deleteTaskMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    },
  });

  const toggleTaskCompleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!user) throw new Error('User not authenticated');
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error('Task not found');

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    },
  });

  return {
    tasks,
    loading: isLoading,
    error: isError ? error.message : null,
    createTask: createTaskMutation.mutateAsync,
    updateTask: (id: string, data: UpdateTaskData) => updateTaskMutation.mutateAsync({ id, data }),
    deleteTask: deleteTaskMutation.mutateAsync,
    toggleTaskComplete: toggleTaskCompleteMutation.mutateAsync,
    refreshTasks: () => queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] }),
  };
}
