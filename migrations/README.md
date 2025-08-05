# Database Migrations

This folder contains SQL migration files for the TaskManager AI database schema.

## Migration Files

- `001_create_tasks_table.sql` - Creates the main tasks table with proper structure, indexes, and Row Level Security policies

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file
4. Paste and click **RUN**

### Option 2: Supabase CLI (Advanced)
If you have the Supabase CLI installed:
```bash
supabase db reset
# or
supabase db push
```

## Migration Naming Convention

Files are named with the format: `{number}_{description}.sql`

- `001_` - Sequential number for ordering
- `create_tasks_table` - Descriptive name of what the migration does
- `.sql` - SQL file extension

## Database Schema

### Tasks Table Structure

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| title | TEXT | Task title (required) |
| description | TEXT | Optional task description |
| priority | TEXT | Task priority: 'low', 'medium', 'high' |
| completed | BOOLEAN | Task completion status |
| user_id | UUID | Foreign key to auth.users |
| ai_priority_score | INTEGER | AI-calculated priority score (0-100) |
| created_at | TIMESTAMP | Auto-generated creation timestamp |
| updated_at | TIMESTAMP | Auto-updated modification timestamp |

### Indexes
- `idx_tasks_user_id` - For filtering tasks by user
- `idx_tasks_created_at` - For sorting by creation date
- `idx_tasks_priority` - For filtering by priority
- `idx_tasks_completed` - For filtering completed/pending tasks
- `idx_tasks_ai_priority_score` - For sorting by AI priority score

### Row Level Security (RLS)
- Users can only access, create, update, and delete their own tasks
- Enforced through RLS policies based on `auth.uid() = user_id`

## Development Notes

- The migration includes `DROP TABLE IF EXISTS` for development convenience
- In production, you might want to use `ALTER TABLE` statements instead of dropping tables
- All timestamps are stored with timezone information
- The `updated_at` column is automatically updated via a trigger function