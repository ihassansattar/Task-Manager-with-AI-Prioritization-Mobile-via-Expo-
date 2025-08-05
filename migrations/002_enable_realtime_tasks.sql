-- Migration: Enable real-time subscriptions for tasks table
-- Created: 2025-01-04
-- Description: Enables real-time functionality for the tasks table

-- Enable real-time for the tasks table
ALTER publication supabase_realtime ADD TABLE public.tasks;

-- Grant necessary permissions for real-time
GRANT SELECT ON public.tasks TO anon;
GRANT SELECT ON public.tasks TO authenticated;

-- Add comment
COMMENT ON TABLE public.tasks IS 'User tasks with AI-powered prioritization - Real-time enabled';