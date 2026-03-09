# 🎯 Complete Goal Tracking Integration Guide

## Problem
Your frontend was using **local state only** (arrays in React state), so when you refreshed the page or logged out, all goals were lost. The goals table exists in the database, but your frontend wasn't connected to it.

## Solution Overview
I've integrated your frontend with the backend API so goals are now **persisted in the MySQL database**.

---

## ✅ What's Been Done

### Backend (Already Created)
1. **Goal.java** - Entity representing a goal in the database
2. **GoalRepository.java** - JPA repository for database operations
3. **GoalController.java** - REST API endpoints for goals

### Frontend (Updated)
**New file created**: `HomePage-UPDATED.jsx`

---

## 🔄 Key Changes in Frontend

### 1. **Added State for Database Integration**
```javascript
const [userId, setUserId] = useState(null);
const [isLoading, setIsLoading] = useState(true);
```

### 2. **Changed Data Structure**
**Before**: Stored simple strings and numbers
```javascript
const [inProgressTasks, setInProgressTasks] = useState(["Task 1", "Task 2"]);
const [counts, setCounts] = useState([0, 0]);
```

**After**: Stores Goal objects from database
```javascript
const [inProgressTasks, setInProgressTasks] = useState([]);
// Each item is now: { id, userId, taskName, currentCount, maxCount, achieved }
```

### 3. **Added fetchGoals() Function**
Fetches goals from the database:
- In-progress goals: `GET /api/goals/user/{userId}/in-progress`
- Achieved goals: `GET /api/goals/user/{userId}/achieved`

### 4. **Updated increment() Function**
Now saves to database using `PUT /api/goals/{goalId}`

### 5. **Updated handleAddTask() Function**
Now saves new goals to database using `POST /api/goals`

### 6. **Updated Rendering**
Changed from array index to goal objects:
```javascript
// Before:
inProgressTasks.map((task, index) => (
  <li key={task}>
    {task} — {counts[index]}/5
  </li>
))

// After:
inProgressTasks.map((goal) => (
  <li key={goal.id}>
    {goal.taskName} — {goal.currentCount}/{goal.maxCount}
  </li>
))
```

---

## 📋 Step-by-Step Instructions

### Step 1: Replace Your HomePage Component
1. Open your current `HomePage.jsx` (or wherever your HomePage component is)
2. **Replace ALL the content** with the code from `HomePage-UPDATED.jsx`
3. Save the file

### Step 2: Test the Application

#### A. Start Backend
```powershell
cd C:\Users\booke\code\Unit2-Final-BG\unit2
.\mvnw.cmd spring-boot:run
```

#### B. Start Frontend (in a new terminal)
```powershell
cd [your-frontend-directory]
npm run dev
```

#### C. Test the Flow
1. **Login** to your account
2. **Add a new task** - it should save to database
3. **Click +1** five times - it should:
   - Increment the counter
   - Move to "Achievements" when reaching 5/5
   - Trigger confetti
   - Save to database with `achieved=true`
4. **Refresh the page** - all goals should persist!
5. **Logout and login again** - goals should still be there!

---

## 🗄️ Database Schema

Your `goals` table structure:
```sql
CREATE TABLE goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    current_count INT NOT NULL,
    max_count INT NOT NULL DEFAULT 5,
    achieved BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🧪 Testing with Sample Data

If you want to add test data directly to the database:

```sql
-- First, find your user ID
SELECT id, username FROM users;

-- Add in-progress goals (replace user_id with your actual ID)
INSERT INTO goals (user_id, task_name, current_count, max_count, achieved) 
VALUES 
  (1, 'Send a Climb', 2, 5, false),
  (1, 'Try a new route', 3, 5, false),
  (1, 'Stretch before climbing', 1, 5, false);

-- Add completed goals
INSERT INTO goals (user_id, task_name, current_count, max_count, achieved) 
VALUES 
  (1, 'Complete a V4 boulder', 5, 5, true),
  (1, 'Climb three times this week', 5, 5, true);

-- Verify
SELECT * FROM goals WHERE user_id = 1;
```

---

## 🔍 API Endpoints Available

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals/user/{userId}` | Get all goals for a user |
| GET | `/api/goals/user/{userId}/in-progress` | Get incomplete goals |
| GET | `/api/goals/user/{userId}/achieved` | Get completed goals |
| POST | `/api/goals` | Create a new goal |
| PUT | `/api/goals/{goalId}` | Update goal (increment count) |
| DELETE | `/api/goals/{goalId}` | Delete a goal |

---

## 🐛 Troubleshooting

### "No achievements yet" but database has achieved goals

**Check:**
1. Are you logged in as the correct user?
2. Run this SQL query:
   ```sql
   SELECT u.id, u.username, g.* 
   FROM users u 
   LEFT JOIN goals g ON u.id = g.user_id 
   WHERE u.username = 'YOUR_USERNAME';
   ```

3. Open browser console (F12) - look for errors
4. Check Network tab - verify API calls are returning data

### Goals not persisting after refresh

**Check:**
1. Backend is running (check console for "Started Unit2Application")
2. Database connection is working
3. Look for errors in Spring Boot console
4. Verify `application.properties` has correct database settings

### Cannot add new goals

**Check:**
1. User ID is being set correctly (check browser console)
2. API endpoint is reachable: `http://localhost:8080/api/goals`
3. Check Network tab for POST request errors

### Achievements not showing after clicking +1 five times

**Check:**
1. The goal is being marked as `achieved=true` in database:
   ```sql
   SELECT * FROM goals WHERE current_count >= max_count;
   ```
2. Backend logic in `GoalController.updateGoal()` is working
3. Frontend is calling `fetchGoals()` after update

---

## 📊 How It Works (Data Flow)

### Adding a Task:
```
User clicks "Add Task"
  ↓
Frontend: handleAddTask()
  ↓
POST /api/goals { userId, taskName, currentCount: 0, maxCount: 5, achieved: false }
  ↓
Backend: GoalController.createGoal()
  ↓
GoalRepository.save()
  ↓
MySQL: INSERT INTO goals
  ↓
Frontend: fetchGoals() to refresh display
```

### Incrementing a Goal:
```
User clicks "+1"
  ↓
Frontend: increment(goal)
  ↓
PUT /api/goals/{goalId} { currentCount: newCount }
  ↓
Backend: GoalController.updateGoal()
  - Increments count
  - If count >= maxCount, sets achieved = true
  ↓
MySQL: UPDATE goals
  ↓
Frontend: fetchGoals() to refresh display
  ↓
If achieved: triggers confetti & moves to Achievements
```

---

## ✨ Benefits of This Integration

1. **Persistence** - Goals survive page refreshes and logouts
2. **User-specific** - Each user sees only their goals
3. **Real-time sync** - Changes immediately saved to database
4. **Scalable** - Can add features like goal editing, deletion, history
5. **Data integrity** - Foreign key ensures goals are linked to valid users

---

## 🚀 Next Steps (Optional Enhancements)

1. **Delete Goals** - Add delete button for individual goals
2. **Edit Goals** - Allow editing task names
3. **Goal History** - Track completion dates
4. **Statistics** - Show total goals completed, completion rate
5. **Sharing** - Share achievements with other users
6. **Categories** - Add goal categories (strength, endurance, technique)

---

## ❓ Questions to Verify Setup

1. ✅ Do you see the `goals` table in your MySQL database?
2. ✅ Is your Spring Boot app running without errors?
3. ✅ Have you replaced your HomePage component with the updated version?
4. ✅ Can you add a new goal and see it persist after refresh?
5. ✅ When you complete a goal (5/5), does it move to Achievements?

If you answered NO to any of these, refer to the troubleshooting section above!

---

**File to use**: `HomePage-UPDATED.jsx` - Copy this to replace your current HomePage component.

