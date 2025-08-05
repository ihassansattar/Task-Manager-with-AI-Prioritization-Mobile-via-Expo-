# Task Manager App with AI Prioritisation

## Project Overview

A cross-platform mobile application built with Expo that allows users to add tasks and leverages AI to automatically reorder them by importance based on urgency and keywords. The app aims to solve the common problem of overwhelming, unorganised task lists by using LLMs to auto-sort tasks for maximum focus.

## Tech Stack

- **Frontend**: Expo (React Native)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase
- **AI Integration**: Vercel AI SDK
- **Language**: TypeScript
- **Validation**: Zod
- **Database**: PostgreSQL (via Supabase)

## Project Goals

- AI priority accuracy tested on 30+ dummy tasks
- Task ranking within 300ms response time
- Cross-platform build size under 15MB
- Demonstrate how AI can simplify productivity UX

## Prerequisites

Before starting, ensure you have:

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Supabase account
- Vercel account (for AI SDK)

## Installation & Setup

### 1. Project Initialisation

```bash
# Create new Expo project with TypeScript template
npx create-expo-app TaskManagerAI --template

# Navigate to project directory
cd TaskManagerAI

# Install dependencies
npm install
```

### 2. Core Dependencies

```bash
# Expo and React Native essentials
npm install expo-router expo-status-bar

# Styling
npm install nativewind
npm install --save-dev tailwindcss

# UI Components (optional but recommended)
npm install @expo/vector-icons
npm install react-native-safe-area-context
npm install react-native-screens

# Backend & Database
npm install @supabase/supabase-js
npm install @react-native-async-storage/async-storage

# AI Integration
npm install ai
npm install openai  # or your preferred AI provider

# Validation & Forms
npm install zod
npm install react-hook-form
npm install @hookform/resolvers

# Date handling
npm install date-fns

# State management (optional)
npm install zustand
```

### 3. Development Dependencies

```bash
npm install --save-dev @types/react @types/react-native
npm install --save-dev typescript
```

## Configuration Files

### 1. Tailwind CSS Setup

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Create `metro.config.js`:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### 2. Environment Variables

Create `.env.local`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

## Project Structure

```
TaskManagerAI/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home/Task List screen
│   │   ├── add-task.tsx       # Add Task screen
│   │   └── _layout.tsx        # Tab layout
│   ├── _layout.tsx            # Root layout
│   └── +not-found.tsx
├── components/
│   ├── TaskItem.tsx           # Individual task component
│   ├── TaskList.tsx           # Task list component
│   ├── AddTaskForm.tsx        # Add task form
│   └── PriorityBadge.tsx      # Priority indicator
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── ai.ts                  # AI integration
│   └── utils.ts               # Utility functions
├── types/
│   └── task.ts                # Task type definitions
├── hooks/
│   ├── useTasksSurvey.ts              # Tasks data management
│   └── useAIPrioritisation.ts # AI prioritisation logic
└── global.css                 # Global styles
```

## Database Schema (Supabase)

Create the following table in your Supabase dashboard:

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
  ai_priority_score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create index for better performance
CREATE INDEX idx_tasks_user_priority ON tasks(user_id, ai_priority_score DESC);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);
```

## Key Features to Implement

### Core Screens

1. **Task List Screen** (`app/(tabs)/index.tsx`)

   - Display tasks sorted by AI priority
   - Real-time updates
   - Mark tasks as complete
   - Pull-to-refresh functionality

2. **Add Task Screen** (`app/(tabs)/add-task.tsx`)
   - Task title and description input
   - Form validation with Zod
   - AI prioritisation on submission

### AI Integration

- Integrate Vercel AI SDK for task prioritisation
- Analyse task content for urgency keywords
- Assign priority scores (low/medium/high)
- Real-time re-prioritisation when new tasks are added

### Backend Integration

- Supabase authentication
- Real-time subscriptions for task updates
- CRUD operations for tasks
- Data persistence and synchronisation

## Development Workflow

1. **Setup Environment**

   ```bash
   # Start development server
   npm start

   # Run on specific platform
   npm run android
   npm run ios
   ```

2. **Database Setup**

   - Configure Supabase project
   - Set up authentication
   - Create database tables
   - Configure row-level security (RLS)

3. **Implement Core Features**

   - Basic task CRUD operations
   - AI prioritisation logic
   - Real-time updates
   - Form validation

4. **Testing & Optimisation**
   - Test AI accuracy with 30+ dummy tasks
   - Optimise for 300ms response time
   - Ensure build size stays under 15MB

## Performance Targets

- **AI Response Time**: Under 300ms for task prioritisation
- **Build Size**: Less than 15MB for cross-platform build
- **AI Accuracy**: Tested and validated with 30+ dummy tasks
- **Real-time Updates**: Instant task synchronisation across devices

## Next Steps

1. Set up development environment and install dependencies
2. Configure Supabase backend and database schema
3. Implement basic task management functionality
4. Integrate AI prioritisation with Vercel AI SDK
5. Add real-time features and optimise performance
6. Test thoroughly with dummy data
7. Prepare for cross-platform deployment

## Useful Commands

```bash
# Start development
npm start

# Build for production
npm run build

# Run on Android
npm run android

# Run on iOS
npm run ios

# Type checking
npm run type-check

# Reset cache
npm start -- --clear
```

This project demonstrates how AI can enhance productivity applications by automatically organising and prioritising user tasks, creating a more focused and efficient user experience.

---

_This document was last updated on 2025-08-05._
