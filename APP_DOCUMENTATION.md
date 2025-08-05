# TaskFlow AI - Complete App Documentation

## 📱 App Overview

**TaskFlow AI** is an intelligent task management mobile application built with React Native and Expo. The app leverages AI-powered prioritization using Groq API to help users organize and manage their tasks effectively with smart priority assignments.

### 🌟 Key Features
- **AI-Powered Task Prioritization** using Groq API
- **User Authentication** with Supabase
- **Real-time Task Management**
- **Profile Management** with image upload
- **Dark/Light Theme Support**
- **Cross-platform** (iOS & Android)

---

## 🏗️ App Architecture

### Technology Stack
- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Service**: Groq API for task analysis
- **State Management**: Zustand + React Query
- **Styling**: NativeWind (Tailwind CSS)
- **File Storage**: MinIO for profile images

### Project Structure
```
app/
├── (auth)/                 # Authentication screens
│   ├── _layout.tsx        # Auth layout wrapper
│   ├── login.tsx          # Login screen
│   ├── signup.tsx         # Sign up screen
│   └── forget-password.tsx # Password reset
├── (tabs)/                # Main app tabs
│   ├── _layout.tsx        # Tab layout
│   ├── index.tsx          # Task list (home)
│   ├── add-task.tsx       # Add new task
│   └── profile.tsx        # User profile
├── _layout.tsx            # Root layout
├── index.tsx              # Landing/splash screen
├── edit-profile.tsx       # Edit profile screen
├── change-password.tsx    # Change password screen
├── privacy-policy.tsx     # Privacy policy
├── contact-us.tsx         # Contact information
└── +not-found.tsx         # 404 error page
```

---

## 🔐 Authentication System

### Sign Up Requirements
**Required Fields:**
- **Full Name** (minimum 2 characters)
- **Email Address** (valid email format)
- **Password** (minimum 8 characters)
- **Confirm Password** (must match password)

**Features:**
- Form validation with Zod schema
- Password visibility toggle
- Real-time error feedback
- Automatic sign-in after successful registration

### Login Requirements
**Required Fields:**
- **Email Address**
- **Password**

**Features:**
- Remember login state
- "Forgot Password" functionality
- Session persistence with AsyncStorage
- Secure authentication with Supabase

### Password Reset
- Email-based password reset
- Secure token validation
- User-friendly recovery process

---

## 📋 Main App Features

### 1. **Landing Screen** (`app/index.tsx`)
**Purpose**: Welcome screen and authentication gateway

**What Users See:**
- App logo and branding
- App name: "TaskFlow AI"
- Subtitle: "Smart task prioritization powered by AI"
- **Sign In** button (red primary)
- **Sign Up** button (outline style)
- Theme toggle (dark/light mode)

**User Actions:**
- Navigate to login/signup
- Toggle between dark/light theme
- Automatic redirect if already logged in

### 2. **Task List Screen** (`app/(tabs)/index.tsx`)
**Purpose**: Main dashboard showing all tasks

**What Users See:**
- **Header**: App logo, name, and task counts
- **Tab System**: 
  - "Pending" tasks (sorted by AI priority score)
  - "Completed" tasks (sorted by completion date)
- **Task Cards** showing:
  - Task title and description
  - AI-generated priority badge (High/Medium/Low)
  - Priority score (0-100)
  - Creation date
  - Completion status

**User Actions:**
- **Pull to refresh** task list
- **Toggle task completion** (checkmark)
- **Delete tasks** (swipe or long press)
- **Navigate to Add Task** (floating + button)
- **Switch between Pending/Completed tabs**

**Empty States:**
- "No pending tasks" with motivational text
- "No completed tasks" with completion encouragement

### 3. **Add Task Screen** (`app/(tabs)/add-task.tsx`)
**Purpose**: Create new tasks with AI analysis

**Required Fields:**
- **Task Title** (required, minimum 1 character)

**Optional Fields:**
- **Description** (provides better AI analysis)

**AI Features:**
- **Automatic Priority Analysis** using Groq API
- **Smart Suggestions** based on task content
- **Context-aware** priority assignment
- **Real-time AI processing** with loading states

**User Experience:**
- **Loading Protection**: Prevents duplicate submissions
- **Visual Feedback**: Spinning indicators during AI analysis
- **Form Validation**: Real-time error checking
- **Auto-focus**: Title field focused on screen entry
- **Discard Protection**: Warns before losing unsaved data

**AI Analysis Process:**
1. User enters task details
2. Clicks "Add Task"
3. AI analyzes content using Groq API
4. Assigns priority (High: 70-100, Medium: 30-69, Low: 0-29)
5. Saves to database with AI score
6. Shows success message and returns to list

### 4. **Profile Screen** (`app/(tabs)/profile.tsx`)
**Purpose**: User account management and settings

**Profile Information Displayed:**
- **Profile Picture** (uploaded via MinIO)
- **Full Name** (from user metadata)
- **Email Address** (from Supabase auth)
- **Member Since** date
- **Task Statistics**:
  - Total tasks created
  - Completed tasks count
  - Completion percentage

**User Actions:**
- **Upload/Change Profile Picture**:
  - Camera capture
  - Photo library selection
  - Automatic cropping and optimization
  - MinIO cloud storage
- **Edit Profile**: Navigate to edit screen
- **Change Password**: Navigate to password change
- **Theme Toggle**: Switch dark/light mode
- **Sign Out**: Secure logout with confirmation
- **Pull to Refresh**: Update profile data

**Settings & Info:**
- **Privacy Policy** link
- **Contact Us** information
- **App Version** display

---

## 🤖 AI Integration (Groq API)

### AI Service Features
The app uses **Groq API** with the `meta-llama/llama-4-scout-17b-16e-instruct` model for:

**Task Priority Analysis:**
- **Urgency Assessment**: Deadline detection, time-sensitive keywords
- **Importance Evaluation**: Impact on goals, dependencies
- **Effort Estimation**: Complexity analysis
- **Context Consideration**: Comparison with existing tasks
- **Smart Scoring**: 0-100 priority score assignment

**AI Analysis Factors:**
- **Keywords Detection**: "urgent", "deadline", "important", etc.
- **Task Complexity**: Length, detail level, technical terms
- **Contextual Priority**: Comparison with user's existing tasks
- **Deadline Inference**: Date mentions, time references

**Fallback System:**
- **Rule-based Prioritization** when AI fails
- **Keyword Matching** for basic priority assignment
- **Error Handling** with user-friendly messages
- **Graceful Degradation** ensures app always works

---

## 👤 Profile Management

### Edit Profile (`app/edit-profile.tsx`)
**Editable Fields:**
- **Full Name** (updates Supabase user metadata)
- **Profile Picture** (MinIO upload with preview)

**Features:**
- **Real-time Preview** of changes
- **Form Validation** with error feedback
- **Image Processing**: Automatic resizing and optimization
- **Cloud Storage**: Secure MinIO integration
- **Loading States** during updates

### Change Password (`app/change-password.tsx`)
**Required Fields:**
- **Current Password** (for security verification)
- **New Password** (minimum 8 characters)
- **Confirm New Password** (must match)

**Security Features:**
- **Current Password Verification**
- **Strong Password Requirements**
- **Secure Update Process** via Supabase
- **Session Management** after password change

---

## 🎨 Theme System

### Dual Theme Support
**Light Theme:**
- Clean white backgrounds
- Dark text for readability
- Red accent color (#D10000)
- Gray color palette for secondary elements

**Dark Theme:**
- Dark gray backgrounds (#121212, #1F2937)
- White/light gray text
- Same red accent color
- Consistent contrast ratios

**Theme Persistence:**
- **AsyncStorage** saves user preference
- **Automatic Loading** on app restart
- **Smooth Transitions** between themes
- **System Integration** (respects device settings)

---

## 🔧 Technical Implementation

### Data Models

**Task Schema:**
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  aiPriorityScore?: number;
}
```

**User Profile Schema:**
```typescript
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}
```

### Database (Supabase)
**Tables:**
- **tasks**: User tasks with AI priority scores
- **profiles**: Extended user information
- **auth.users**: Supabase authentication

**Security:**
- **Row Level Security (RLS)** enabled
- **User-based Data Isolation**
- **Secure API Keys** management
- **Real-time Subscriptions** for live updates

### State Management
**React Query:** Server state and caching
**Zustand:** Client-side state management
**React Hook Form:** Form state management
**AsyncStorage:** Local data persistence

---

## 📱 User Experience Features

### Loading States
- **Skeleton Loading** for data fetching
- **Button Loading** with spinners
- **Form Submission** protection
- **AI Analysis** progress indicators

### Error Handling
- **Network Error** recovery
- **Form Validation** with clear messages
- **AI Service Fallback** when offline
- **User-friendly Error** displays

### Accessibility
- **Screen Reader** support
- **Keyboard Navigation** compatibility
- **High Contrast** theme support
- **Touch Target** optimization

### Performance
- **Image Optimization** for profile pictures
- **Lazy Loading** for task lists
- **Efficient Re-renders** with React Query
- **Background Sync** for offline support

---

## 🚀 Getting Started

### For Users
1. **Download & Install** the app
2. **Sign Up** with email and password
3. **Add Your First Task** with title and description
4. **Let AI Analyze** and assign priority
5. **Manage Tasks** by completing and organizing
6. **Customize Profile** with picture and preferences

### Required Permissions
- **Camera Access**: For profile picture capture
- **Photo Library**: For profile picture selection
- **Network Access**: For data sync and AI analysis
- **Storage Access**: For local data caching

---

## 🔒 Privacy & Security

### Data Protection
- **End-to-End Encryption** for sensitive data
- **Secure API Communications** (HTTPS)
- **User Data Isolation** with RLS
- **GDPR Compliant** data handling

### Privacy Features
- **Local Data Storage** for offline access
- **Opt-in Analytics** (if implemented)
- **Clear Privacy Policy** accessible in-app
- **User Control** over data sharing

---

## 📞 Support & Contact

### In-App Support
- **Contact Us** page with developer information
- **Privacy Policy** for transparency
- **Error Reporting** through toast notifications

### Technical Support
- **Real-time Error Tracking**
- **User Feedback** collection
- **Performance Monitoring**
- **Crash Reporting** with diagnostics

---

## 🔄 App Lifecycle

### User Journey
1. **First Launch**: Welcome screen → Sign up/Login
2. **Onboarding**: Profile setup → First task creation
3. **Daily Use**: Task management → AI prioritization
4. **Profile Management**: Picture upload → Settings
5. **Long-term**: Task history → Productivity insights

### Data Sync
- **Real-time Updates** across devices
- **Offline Support** with local caching
- **Background Sync** when app becomes active
- **Conflict Resolution** for concurrent edits

This comprehensive documentation covers all aspects of the TaskFlow AI application, from user-facing features to technical implementation details. The app combines modern React Native development with AI-powered intelligence to create a superior task management experience.