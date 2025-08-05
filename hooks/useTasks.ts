import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { aiService } from '../lib/aiService';
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (data: CreateTaskData) => Promise<{ task?: Task; error?: string }>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<{ error?: string }>;
  deleteTask: (id: string) => Promise<{ error?: string }>;
  toggleTaskComplete: (id: string) => Promise<{ error?: string }>;
  refreshTasks: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching tasks for user:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching tasks:', fetchError);
        setError(fetchError.message);
        return;
      }

      console.log('Fetched tasks count:', data?.length || 0);

      // Transform the data to match our Task interface
      const transformedTasks: Task[] = data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: task.completed,
        createdAt: new Date(task.created_at),
        updatedAt: task.updated_at ? new Date(task.updated_at) : undefined,
        userId: task.user_id,
        aiPriorityScore: task.ai_priority_score,
      })) || [];

      setTasks(transformedTasks);
      console.log('Tasks state updated with', transformedTasks.length, 'tasks');
    } catch (err: any) {
      console.error('Error in fetchTasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new task
  const createTask = async (data: CreateTaskData): Promise<{ task?: Task; error?: string }> => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    try {
      console.log('Creating task for user:', user.id, 'with data:', data);
      
      // Get AI-powered priority analysis
      const aiAnalysis = await aiService.analyzeTaskPriority(
        data.title,
        data.description,
        {
          existingTasks: tasks.map(task => ({
            title: task.title,
            priority: task.priority,
            completed: task.completed
          }))
        }
      );

      let priority = data.priority || 'medium';
      let aiPriorityScore = 50;

      if (aiAnalysis.success && aiAnalysis.result) {
        priority = aiAnalysis.result.priority;
        aiPriorityScore = aiAnalysis.result.score;
        console.log('AI Priority Analysis:', {
          priority,
          score: aiPriorityScore,
          reasoning: aiAnalysis.result.reasoning
        });
      } else {
        console.log('Using fallback priority:', aiAnalysis.error);
        if (aiAnalysis.result) {
          priority = aiAnalysis.result.priority;
          aiPriorityScore = aiAnalysis.result.score;
        }
      }

      const { data: newTask, error: insertError } = await supabase
        .from('tasks')
        .insert({
          title: data.title,
          description: data.description,
          priority,
          completed: false,
          user_id: user.id,
          ai_priority_score: aiPriorityScore,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating task:', insertError);
        return { error: insertError.message };
      }

      // Transform the response to match our Task interface
      const transformedTask: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        completed: newTask.completed,
        createdAt: new Date(newTask.created_at),
        updatedAt: newTask.updated_at ? new Date(newTask.updated_at) : undefined,
        userId: newTask.user_id,
        aiPriorityScore: newTask.ai_priority_score,
      };

      // Update local state immediately for better UX
      setTasks(prev => [transformedTask, ...prev]);

      console.log('Task created successfully:', transformedTask);
      return { task: transformedTask };
    } catch (err: any) {
      console.error('Error in createTask:', err);
      return { error: err.message || 'Failed to create task' };
    }
  };

  // Update an existing task
  const updateTask = async (id: string, data: UpdateTaskData): Promise<{ error?: string }> => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.completed !== undefined) updateData.completed = data.completed;
      
      updateData.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating task:', updateError);
        return { error: updateError.message };
      }

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { 
              ...task, 
              ...data, 
              updatedAt: new Date() 
            }
          : task
      ));

      return {};
    } catch (err: any) {
      console.error('Error in updateTask:', err);
      return { error: err.message || 'Failed to update task' };
    }
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<{ error?: string }> => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting task:', deleteError);
        return { error: deleteError.message };
      }

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== id));

      return {};
    } catch (err: any) {
      console.error('Error in deleteTask:', err);
      return { error: err.message || 'Failed to delete task' };
    }
  };

  // Toggle task completion status
  const toggleTaskComplete = async (id: string): Promise<{ error?: string }> => {
    const task = tasks.find(t => t.id === id);
    if (!task) {
      return { error: 'Task not found' };
    }

    return updateTask(id, { completed: !task.completed });
  };

  // Refresh tasks
  const refreshTasks = async (): Promise<void> => {
    await fetchTasks();
  };

  // Load tasks on component mount and when user changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Set up real-time subscription for tasks
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`tasks_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time task change:', payload);
          // Refresh tasks when changes occur from other sources
          fetchTasks();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refreshTasks,
  };
}