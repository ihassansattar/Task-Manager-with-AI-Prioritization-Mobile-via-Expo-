-- Migration: Create tasks table
-- Created: 2025-01-04
-- Description: Creates the tasks table with proper structure, indexes, RLS policies, and triggers

-- Drop existing table if it exists (for development)
DROP TABLE IF EXISTS public.tasks CASCADE;

-- Create tasks table with correct column names
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ai_priority_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_completed ON public.tasks(completed);
CREATE INDEX idx_tasks_ai_priority_score ON public.tasks(ai_priority_score);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can only access their own tasks
CREATE POLICY "Users can only access their own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

-- Policy: Users can insert tasks for themselves
CREATE POLICY "Users can insert their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (if needed)
-- GRANT ALL ON public.tasks TO authenticated;
-- GRANT ALL ON public.tasks TO service_role;

-- Add comments for documentation
COMMENT ON TABLE public.tasks IS 'User tasks with AI-powered prioritization';
COMMENT ON COLUMN public.tasks.id IS 'Unique identifier for the task';
COMMENT ON COLUMN public.tasks.title IS 'Task title/summary';
COMMENT ON COLUMN public.tasks.description IS 'Optional detailed description of the task';
COMMENT ON COLUMN public.tasks.priority IS 'Task priority: low, medium, or high';
COMMENT ON COLUMN public.tasks.completed IS 'Whether the task has been completed';
COMMENT ON COLUMN public.tasks.user_id IS 'ID of the user who owns this task';
COMMENT ON COLUMN public.tasks.ai_priority_score IS 'AI-calculated priority score (0-100)';
COMMENT ON COLUMN public.tasks.created_at IS 'Timestamp when the task was created';
COMMENT ON COLUMN public.tasks.updated_at IS 'Timestamp when the task was last updated';