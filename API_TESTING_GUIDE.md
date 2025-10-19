# Phase 10: Base API Structure - Testing Guide

## 🧪 API Testing with Thunder Client / Postman

### Setup

1. **Install Thunder Client** (VS Code Extension) or use Postman
2. **Base URL**: `http://localhost:3000`
3. **Authentication**: Use session cookies after login

---

## 🔐 Authentication Endpoints

### 1. Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@lms.com",
  "password": "admin123"
}
```

**Test Users:**
- Admin: `admin@lms.com` / `admin123`
- Teacher: `teacher@lms.com` / `teacher123`
- Student: `student@lms.com` / `student123`

### 2. Get Session
```http
GET /api/auth/session
```

### 3. Logout
```http
POST /api/auth/signout
```

---

## 👥 User Management APIs (Admin Only)

### 1. Get All Users
```http
GET /api/users?page=1&limit=10&role=STUDENT&search=john
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (ADMIN, TEACHER, STUDENT)
- `search` (optional): Search by name or email

### 2. Get User by ID
```http
GET /api/users/{userId}
```

### 3. Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 4. Update User
```http
PATCH /api/users/{userId}
Content-Type: application/json

{
  "name": "John Updated",
  "role": "TEACHER"
}
```

### 5. Delete User
```http
DELETE /api/users/{userId}
```

---

## 📚 Course Management APIs

### 1. Get All Courses
```http
GET /api/courses?page=1&limit=10&status=PUBLISHED&search=web&teacherId={id}
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: DRAFT, PUBLISHED, ARCHIVED
- `search`: Search in title/description
- `teacherId`: Filter by teacher

**Access:**
- Admin: See all courses
- Teacher: See only their courses
- Student: See only published courses

### 2. Get Course by ID
```http
GET /api/courses/{courseId}
```

### 3. Create Course (Teacher/Admin)
```http
POST /api/courses
Content-Type: application/json

{
  "title": "Advanced JavaScript",
  "description": "Learn advanced JS concepts including closures, promises, and async/await",
  "teacherId": "clxxxxxxxxx",
  "status": "DRAFT"
}
```

### 4. Update Course
```http
PATCH /api/courses/{courseId}
Content-Type: application/json

{
  "title": "Advanced JavaScript Updated",
  "status": "PUBLISHED"
}
```

### 5. Delete Course
```http
DELETE /api/courses/{courseId}
```

---

## 📖 Lesson Management APIs

### 1. Get All Lessons
```http
GET /api/lessons?courseId={courseId}
```

**Required:** `courseId` query parameter

### 2. Get Lesson by ID
```http
GET /api/lessons/{lessonId}
```

### 3. Create Lesson (Teacher/Admin)
```http
POST /api/lessons
Content-Type: application/json

{
  "title": "Introduction to Functions",
  "content": "# Functions in JavaScript\n\nFunctions are reusable blocks of code...",
  "order": 3,
  "courseId": "clxxxxxxxxx"
}
```

### 4. Update Lesson
```http
PATCH /api/lessons/{lessonId}
Content-Type: application/json

{
  "title": "Advanced Functions",
  "order": 4
}
```

### 5. Delete Lesson
```http
DELETE /api/lessons/{lessonId}
```

---

## 📝 Assignment Management APIs

### 1. Get All Assignments
```http
GET /api/assignments?courseId={courseId}
```

### 2. Get Assignment by ID
```http
GET /api/assignments/{assignmentId}
```

**Returns:**
- Full assignment details
- Submissions (all for teacher/admin, own for student)

### 3. Create Assignment (Teacher/Admin)
```http
POST /api/assignments
Content-Type: application/json

{
  "title": "Build a Calculator",
  "description": "Create a calculator app using HTML, CSS, and JavaScript",
  "dueDate": "2025-11-15T23:59:59Z",
  "maxScore": 100,
  "courseId": "clxxxxxxxxx"
}
```

### 4. Update Assignment
```http
PATCH /api/assignments/{assignmentId}
Content-Type: application/json

{
  "title": "Build an Advanced Calculator",
  "maxScore": 150
}
```

### 5. Delete Assignment
```http
DELETE /api/assignments/{assignmentId}
```

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    // validation errors (if applicable)
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

## 🔒 Role-Based Access Control

| Endpoint | Admin | Teacher | Student |
|----------|-------|---------|---------|
| **Users** |
| GET /api/users | ✅ | ❌ | ❌ |
| POST /api/users | ✅ | ❌ | ❌ |
| PATCH /api/users/:id | ✅ | ❌ | ❌ |
| DELETE /api/users/:id | ✅ | ❌ | ❌ |
| **Courses** |
| GET /api/courses | ✅ All | ✅ Own | ✅ Published |
| POST /api/courses | ✅ | ✅ Own | ❌ |
| PATCH /api/courses/:id | ✅ | ✅ Own | ❌ |
| DELETE /api/courses/:id | ✅ | ✅ Own | ❌ |
| **Lessons** |
| GET /api/lessons | ✅ | ✅ | ✅ |
| POST /api/lessons | ✅ | ✅ Own | ❌ |
| PATCH /api/lessons/:id | ✅ | ✅ Own | ❌ |
| DELETE /api/lessons/:id | ✅ | ✅ Own | ❌ |
| **Assignments** |
| GET /api/assignments | ✅ | ✅ | ✅ |
| POST /api/assignments | ✅ | ✅ Own | ❌ |
| PATCH /api/assignments/:id | ✅ | ✅ Own | ❌ |
| DELETE /api/assignments/:id | ✅ | ✅ Own | ❌ |

---

## ⚠️ Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation failed
- `500 Internal Server Error` - Server error

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login with admin credentials
- [ ] Login with teacher credentials
- [ ] Login with student credentials
- [ ] Get current session
- [ ] Logout

### Users (Admin)
- [ ] Get all users
- [ ] Get users with filters (role, search)
- [ ] Get single user by ID
- [ ] Create new user
- [ ] Update user
- [ ] Delete user
- [ ] Try creating user with duplicate email (should fail)

### Courses
- [ ] Get all courses (test with all roles)
- [ ] Get single course
- [ ] Create course as teacher
- [ ] Update course
- [ ] Delete course
- [ ] Try updating other teacher's course (should fail)

### Lessons
- [ ] Get lessons for a course
- [ ] Get single lesson
- [ ] Create lesson
- [ ] Update lesson
- [ ] Delete lesson

### Assignments
- [ ] Get assignments for a course
- [ ] Get single assignment with submissions
- [ ] Create assignment
- [ ] Update assignment
- [ ] Delete assignment

---

## 🛠️ Thunder Client Collection

Save this as `lms-api.json` in Thunder Client:

```json
{
  "client": "Thunder Client",
  "collectionName": "LMS API",
  "dateExported": "2025-10-19",
  "version": "1.1",
  "folders": [],
  "requests": []
}
```

Import and start testing!

---

## 🐛 Troubleshooting

### Error: "Unauthorized access"
- Make sure you're logged in
- Check if session cookie is set

### Error: "Forbidden"
- Check your user role
- Admin/Teacher trying to access other teacher's resources

### Error: "Validation failed"
- Check request body structure
- Ensure all required fields are provided
- Verify data types match schema

### Error: "Resource not found"
- Check if ID exists in database
- Use Prisma Studio to verify data

---

**Next Steps:** After testing all APIs, proceed to Phase 11 (Frontend Project Initialization) to build the UI! 🚀
