# Claude Code Prompt: Task Manager App UI

Create a React Native Expo app with TypeScript and NativeWind for a Task Manager with AI prioritisation. Build the following screens and components:

## Tech Stack

- Expo (latest) with TypeScript
- NativeWind (Tailwind for React Native)
- Expo Router for navigation
- React Hook Form + Zod validation
- @expo/vector-icons

## Design System

- **Primary Colour**: Use `#3B82F6` (blue-500) - works beautifully on both light and dark themes
- **Dark/Light Mode**: Full theme support with proper contrast ratios
- **Clean UI**: Minimal design with generous white space, subtle shadows, and smooth corners

## Screens Needed

### 1. Welcome/Splash Screen (`app/index.tsx`)

- App logo/icon centred
- App name "AI Task Manager" with subtitle
- Two primary action buttons:
  - "Sign In" button (primary blue)
  - "Sign Up" button (outline style)
- Clean background with subtle gradient
- Theme toggle button in top-right corner

### 2. Main Task List Screen (`app/(tabs)/index.tsx`)

- Header with app title "AI Task Manager" and theme toggle
- Pull-to-refresh functionality
- List of tasks showing:
  - Task title and description
  - Priority badge (High=red, Medium=orange, Low=green)
  - Completion checkbox
  - Created timestamp
- Empty state when no tasks
- Floating action button to add new task (primary blue)

### 3. Add Task Screen (`app/(tabs)/add-task.tsx`)

- Form with:
  - Task title input (required)
  - Task description textarea (optional)
  - Submit button "Add Task" (primary blue)
  - Cancel/back button
- Form validation with error messages
- Loading state during submission

### 4. Tab Navigation Layout (`app/(tabs)/_layout.tsx`)

- Bottom tab navigation with primary blue active state
- Home tab (task list) with list icon
- Add Task tab with plus icon

## Components to Create

### TaskItem Component

- Individual task card with modern design and subtle shadow
- Swipe actions (mark complete, delete)
- Priority colour coding
- Tap to expand description

### PriorityBadge Component

- Small coloured badge showing High/Medium/Low
- Proper colour scheme and typography

### ThemeToggle Component

- Switch between light/dark modes
- Sun/moon icons
- Smooth transition animations

## Design Requirements

- **Primary Colour**: #3B82F6 (blue-500) for buttons, active states, and key elements
- **Theme Support**: Complete dark/light mode with proper contrast
- **Clean UI**: Minimal design with generous spacing, subtle shadows (light mode), elevated cards (dark mode)
- Modern card-based layout with rounded corners (rounded-xl)
- Proper TypeScript interfaces for all props
- Accessible design with proper contrast ratios
- Loading states and error handling with skeleton screens
- Smooth animations for theme switching and interactions
- Consistent spacing using Tailwind's spacing scale (p-4, m-6, etc.)

## Theme Colours

**Light Mode:**

- Background: white/gray-50
- Cards: white with subtle shadow
- Text: gray-900/gray-600
- Primary: #3B82F6

**Dark Mode:**

- Background: gray-900/black
- Cards: gray-800 with subtle border
- Text: white/gray-300
- Primary: #3B82F6 (same blue works great on dark)

## File Structure

```
app/
├── index.tsx          # Welcome/Splash screen
├── (tabs)/
│   ├── index.tsx      # Task list
│   ├── add-task.tsx   # Add task form
│   └── _layout.tsx    # Tab layout
├── _layout.tsx        # Root layout with theme provider
components/
├── TaskItem.tsx
├── PriorityBadge.tsx
├── ThemeToggle.tsx
└── LoadingSpinner.tsx
types/
└── task.ts           # Task interfaces
hooks/
└── useTheme.ts        # Theme management hook
```

## Sample Task Interface

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: Date;
}
```

Please implement mock data for now - I'll handle the backend integration separately. Focus on creating a polished, responsive UI that works well on both iOS and Android.
