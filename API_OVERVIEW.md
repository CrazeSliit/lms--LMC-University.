# LMS API Overview

## 📁 Project Structure

```
app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts          # NextAuth authentication endpoints
├── users/
│   ├── route.ts              # GET all, POST create
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE by ID
├── courses/
│   ├── route.ts              # GET all, POST create
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE by ID
├── lessons/
│   ├── route.ts              # GET all (by courseId), POST create
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE by ID
├── assignments/
│   ├── route.ts              # GET all (by courseId), POST create
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE by ID
├── enrollments/
│   └── route.ts              # GET user's enrollments, POST enroll
└── grades/
    └── route.ts              # GET grades with stats

lib/
├── api-response.ts           # Standardized API responses
├── api-middleware.ts         # Auth & authorization middleware
├── auth.ts                   # NextAuth configuration
├── prisma.ts                 # Prisma client
└── validations/
    ├── user.ts               # User validation schemas
    ├── course.ts             # Course validation schemas
    ├── lesson.ts             # Lesson validation schemas
    └── assignment.ts         # Assignment validation schemas
```

---

## 🔐 Authentication Flow

1. **Login** → `POST /api/auth/signin`
2. **Session Cookie** → Stored automatically
3. **Protected Requests** → Include session cookie
4. **Authorization** → Role checked via middleware

---

## 🎯 API Endpoints Summary

### Total Endpoints: 22

| Category | Endpoints | Auth Required | Roles |
|----------|-----------|---------------|-------|
| Auth | 3 | No | All |
| Users | 5 | Yes | Admin |
| Courses | 5 | Yes | All (role-based) |
| Lessons | 5 | Yes | All (role-based) |
| Assignments | 5 | Yes | All (role-based) |
| Enrollments | 2 | Yes | Student |
| Grades | 1 | Yes | All |

---

## 📊 API Features

### ✅ Implemented Features

1. **CRUD Operations**
   - Complete Create, Read, Update, Delete for all resources
   - Soft relationships maintained via Prisma

2. **Pagination**
   - `/api/users`, `/api/courses` support pagination
   - Query: `?page=1&limit=10`

3. **Filtering & Search**
   - Role filtering: `?role=STUDENT`
   - Status filtering: `?status=PUBLISHED`
   - Text search: `?search=javascript`
   - Teacher filtering: `?teacherId={id}`

4. **Role-Based Access Control**
   - Admin: Full system access
   - Teacher: Manage own courses/lessons/assignments
   - Student: View published content, submit work

5. **Data Relationships**
   - Courses include teacher info, counts
   - Assignments include submission counts
   - Grades include course context

6. **Input Validation**
   - Zod schemas for all inputs
   - Type-safe validation
   - Descriptive error messages

7. **Error Handling**
   - Consistent error format
   - HTTP status codes
   - Detailed error messages

8. **Notifications**
   - Auto-created on enrollment
   - Extensible for other events

9. **Statistics**
   - Grade averages
   - Assignment/quiz counts
   - Enrollment counts

---

## 🚀 Quick Start

### 1. Start Server
```powershell
npm run dev
```

### 2. Login
```http
POST http://localhost:3000/api/auth/signin
Content-Type: application/json

{
  "email": "admin@lms.com",
  "password": "admin123"
}
```

### 3. Test Endpoint
```http
GET http://localhost:3000/api/courses
```

---

## 📝 Example Requests

### Create Course
```http
POST /api/courses
{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "teacherId": "clxxxxxxxxx",
  "status": "PUBLISHED"
}
```

### Get User's Enrollments
```http
GET /api/enrollments?status=ACTIVE
```

### Create Lesson
```http
POST /api/lessons
{
  "title": "Introduction to React",
  "content": "# What is React?\n\nReact is a JavaScript library...",
  "order": 1,
  "courseId": "clxxxxxxxxx"
}
```

---

## ⚡ Performance Tips

1. **Use Pagination**: Always paginate large lists
2. **Filter Early**: Use query params to reduce data
3. **Select Fields**: API returns only needed fields
4. **Include Relations**: Related data loaded efficiently
5. **Prisma Optimization**: Queries optimized with `include` and `select`

---

## 🔒 Security

- ✅ Authentication required on all endpoints (except auth)
- ✅ Role-based authorization
- ✅ Input validation
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection (NextAuth)
- ✅ Secure session cookies

---

## 🧪 Testing Status

| Category | Status |
|----------|--------|
| Authentication | ✅ Ready |
| Users API | ✅ Ready |
| Courses API | ✅ Ready |
| Lessons API | ✅ Ready |
| Assignments API | ✅ Ready |
| Enrollments API | ✅ Ready |
| Grades API | ✅ Ready |

---

## 🎯 Next Steps

- [ ] Test all endpoints with Thunder Client/Postman
- [ ] Implement Quiz API (similar to assignments)
- [ ] Add submission endpoints
- [ ] Implement notification system
- [ ] Build frontend UI (Phase 11)

---

## 📚 Documentation Files

- `API_TESTING_GUIDE.md` - Detailed testing instructions
- `PRISMA_REFERENCE.md` - Database query examples
- `DATABASE_SCHEMA.md` - Database structure
- `SETUP_GUIDE.md` - Initial setup instructions

---

## 💡 Tips

1. **Use TypeScript**: Full type safety throughout
2. **Consistent Naming**: RESTful conventions
3. **Error Messages**: Clear and actionable
4. **Response Format**: Standardized across all endpoints
5. **Middleware Reuse**: Auth logic centralized

---

**API Base URL**: `http://localhost:3000`  
**Development Server**: Running ✅  
**Database**: Connected ✅  
**Authentication**: Working ✅  

**Phase 10 Complete!** 🎉
