# Goal Tracking Integration Guide

## Backend Setup (Completed)

### 1. Goal Entity (`Goal.java`)
- **Table**: `goals`
- **Fields**:
  - `id` (Primary Key)
  - `userId` (Foreign Key to users table)
  - `taskName` (String)
  - `currentCount` (int)
  - `maxCount` (int, default 5)
  - `achieved` (boolean, default false)

### 2. Goal Repository (`GoalRepository.java`)
- `findByUserId(Long userId)` - Get all goals for a user
- `findByUserIdAndAchieved(Long userId, boolean achieved)` - Filter by completion status

### 3. Goal Controller (`GoalController.java`)
Available endpoints:
- `GET /api/goals/user/{userId}` - Get all goals
- `GET /api/goals/user/{userId}/in-progress` - Get incomplete goals
- `GET /api/goals/user/{userId}/achieved` - Get completed goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal (increments count, marks as achieved)
- `DELETE /api/goals/{id}` - Delete goal

## Frontend Integration

### Key Changes in HomePage:

1. **State Management**:
   ```javascript
   const [userId, setUserId] = useState(null);
   const [inProgressTasks, setInProgressTasks] = useState([]);
   const [achievedTasks, setAchievedTasks] = useState([]);
   ```

2. **Fetch User and Goals on Mount**:
   - Fetches user info to get `userId`
   - Fetches in-progress goals from `/api/goals/user/{userId}/in-progress`
   - Fetches achieved goals from `/api/goals/user/{userId}/achieved`

3. **Create New Goal**:
   ```javascript
   POST /api/goals
   Body: {
     userId: userId,
     taskName: "task name",
     currentCount: 0,
     maxCount: 5,
     achieved: false
   }
   ```

4. **Increment Goal**:
   ```javascript
   PUT /api/goals/{goalId}
   Body: {
     currentCount: newCount,
     maxCount: goal.maxCount
   }
   ```
   - Backend automatically marks as `achieved=true` when `currentCount >= maxCount`

## Why You See Goals Table But No Completed Goals

Possible reasons:
1. **No goals marked as achieved yet** - Goals need `achieved=true` in database
2. **Frontend not integrated** - The old frontend was using local state only
3. **User ID mismatch** - Make sure goals are created with correct userId

## Testing the Integration

1. **Start Backend**:
   ```powershell
   cd C:\Users\booke\code\Unit2-Final-BG\unit2
   .\mvnw.cmd spring-boot:run
   ```

2. **Replace Your HomePage Component**:
   - Copy the content from `HomePage-integrated.jsx`
   - Replace your existing HomePage component

3. **Test Flow**:
   - Login as a user
   - Add a task (will be saved to database)
   - Click +1 five times (will mark as achieved and move to Achievements)
   - Refresh page (goals will persist)

## Database Schema

The `goals` table should look like:
```sql
CREATE TABLE goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    current_count INT NOT NULL,
    max_count INT NOT NULL,
    achieved BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Testing with cURL

Test if backend is working:

```powershell
# Get in-progress goals for user ID 1
curl http://localhost:8080/api/goals/user/1/in-progress

# Get achieved goals for user ID 1
curl http://localhost:8080/api/goals/user/1/achieved

# Create a new goal
curl -X POST http://localhost:8080/api/goals `
  -H "Content-Type: application/json" `
  -d '{\"userId\":1,\"taskName\":\"Test Goal\",\"currentCount\":0,\"maxCount\":5,\"achieved\":false}'
```

## Troubleshooting

1. **Empty achievements list**:
   - Check database: `SELECT * FROM goals WHERE achieved = true;`
   - Make sure you've completed a goal (5/5 clicks)

2. **Goals not persisting**:
   - Check Spring Boot console for errors
   - Verify database connection in `application.properties`

3. **Frontend not fetching**:
   - Check browser console for errors
   - Verify API base URL matches backend port

