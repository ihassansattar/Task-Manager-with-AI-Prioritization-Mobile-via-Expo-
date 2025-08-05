# How to Run Database Migrations

## Step-by-Step Instructions

### 1. Access Supabase Dashboard
- Go to [your Supabase project dashboard](https://supabase.com/dashboard)
- Select your TaskManager AI project

### 2. Open SQL Editor
- Click on **SQL Editor** in the left sidebar
- Click **New Query** to create a new SQL query

### 3. Run the Tasks Table Migration
- Open the file `migrations/001_create_tasks_table.sql`
- Copy all the contents
- Paste into the Supabase SQL Editor
- Click **RUN** button

### 4. Verify the Migration
After running the migration, you can verify it worked by running:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'tasks';

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';

-- Check policies exist
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies 
WHERE tablename = 'tasks';
```

### 5. Test the Setup
- Restart your React Native app
- Try creating a new task
- Verify tasks appear in the dashboard

## Troubleshooting

### Common Issues:

**Error: "relation already exists"**
- The migration includes `DROP TABLE IF EXISTS` so this shouldn't happen
- If it does, manually drop the table first: `DROP TABLE public.tasks CASCADE;`

**Error: "permission denied"**
- Make sure you're running the query as the project owner
- Check that RLS policies are correctly set up

**Error: "column doesn't exist"**
- Make sure the migration ran completely
- Check the table structure with the verification queries above

### Getting Help
If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your database connection
3. Make sure you're using the correct project