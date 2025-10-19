# LMS Database Schema - Entity Relationship Diagram

## Visual Database Structure

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (unique)  │
│ password        │
│ role (enum)     │◄──────────────────────┐
│ avatar          │                       │
│ emailVerified   │                       │
│ createdAt       │                       │
│ updatedAt       │                       │
└─────────────────┘                       │
         │                                │
         │ teaches                        │
         │                                │
         ▼                                │
┌─────────────────┐              ┌───────┴────────┐
│    COURSES      │              │  ENROLLMENTS   │
├─────────────────┤              ├────────────────┤
│ id (PK)         │◄─────────────│ id (PK)        │
│ title           │              │ studentId (FK) │
│ description     │              │ courseId (FK)  │
│ teacherId (FK)  │              │ status (enum)  │
│ status (enum)   │              │ enrolledAt     │
│ createdAt       │              └────────────────┘
│ updatedAt       │
└─────────────────┘
         │
         │ has many
         │
    ┌────┼────┬────────────┐
    │         │            │
    ▼         ▼            ▼
┌────────┐ ┌─────────┐ ┌──────────┐
│LESSONS │ │ASSIGNM. │ │ QUIZZES  │
├────────┤ ├─────────┤ ├──────────┤
│id (PK) │ │id (PK)  │ │id (PK)   │
│title   │ │title    │ │title     │
│content │ │desc     │ │desc      │
│order   │ │dueDate  │ │timeLimit │
│courseId│ │maxScore │ │courseId  │
│        │ │courseId │ │          │
└────────┘ └─────────┘ └──────────┘
                │            │
                │            │ has many
                │            │
                ▼            ▼
     ┌──────────────┐  ┌──────────┐
     │ASSIGNMENT    │  │QUESTIONS │
     │SUBMISSIONS   │  ├──────────┤
     ├──────────────┤  │id (PK)   │
     │id (PK)       │  │quizId    │
     │assignmentId  │  │text      │
     │studentId     │  │type      │
     │content       │  │options   │
     │fileUrl       │  │answer    │
     │submittedAt   │  │points    │
     └──────────────┘  └──────────┘
                              │
                              │ attempted in
                              │
                              ▼
                       ┌──────────────┐
                       │QUIZ ATTEMPTS │
                       ├──────────────┤
                       │id (PK)       │
                       │quizId (FK)   │
                       │studentId (FK)│
                       │answers (JSON)│
                       │score         │
                       │submittedAt   │
                       └──────────────┘

┌─────────────────┐              ┌──────────────────┐
│     GRADES      │              │  NOTIFICATIONS   │
├─────────────────┤              ├──────────────────┤
│ id (PK)         │              │ id (PK)          │
│ studentId (FK)  │              │ userId (FK)      │
│ assignmentId    │              │ message          │
│ quizId          │              │ type (enum)      │
│ score           │              │ isRead           │
│ maxScore        │              │ createdAt        │
│ feedback        │              └──────────────────┘
│ gradedAt        │
└─────────────────┘
```

## Relationship Types

### One-to-Many (1:N)
- 👤 **User** → **Courses** (as teacher)
- 📚 **Course** → **Lessons**
- 📚 **Course** → **Assignments**
- 📚 **Course** → **Quizzes**
- 📝 **Quiz** → **Questions**
- 👤 **User** → **Notifications**

### Many-to-Many (N:M) via Junction Table
- 👤 **Users** ↔ **Courses** (via **Enrollments**)

### One-to-Many with Multiple Parents
- 📊 **Grades** ← **Assignment** OR **Quiz**
- 📊 **Grades** ← **User** (as student)

### Unique Constraints
- 📧 `users.email` - One email per user
- 🎓 `(enrollments.studentId, enrollments.courseId)` - One enrollment per student-course pair
- 📄 `(assignment_submissions.assignmentId, assignment_submissions.studentId)` - One submission per assignment

## Cascade Delete Behavior

When a **Course** is deleted:
- ❌ All **Lessons** are deleted
- ❌ All **Assignments** are deleted
- ❌ All **Quizzes** are deleted
- ❌ All **Enrollments** are deleted

When a **User** is deleted:
- ❌ All their **taught Courses** are deleted
- ❌ All their **Enrollments** are deleted
- ❌ All their **Assignment Submissions** are deleted
- ❌ All their **Quiz Attempts** are deleted
- ❌ All their **Grades** are deleted
- ❌ All their **Notifications** are deleted

When an **Assignment** is deleted:
- ❌ All **Assignment Submissions** are deleted
- ❌ All related **Grades** are deleted

When a **Quiz** is deleted:
- ❌ All **Questions** are deleted
- ❌ All **Quiz Attempts** are deleted
- ❌ All related **Grades** are deleted

## Enums (Type Safety)

### Role
```typescript
ADMIN    // Full system access
TEACHER  // Manage courses, lessons, assignments, grades
STUDENT  // Enroll, submit, view grades
```

### CourseStatus
```typescript
DRAFT      // Course being created
PUBLISHED  // Active and visible to students
ARCHIVED   // No longer active
```

### EnrollmentStatus
```typescript
ACTIVE     // Currently enrolled
COMPLETED  // Finished the course
DROPPED    // Withdrawn from course
```

### QuestionType
```typescript
MULTIPLE_CHOICE  // Options with one correct answer
TRUE_FALSE       // Boolean questions
SHORT_ANSWER     // Text input (manual grading)
```

### NotificationType
```typescript
ENROLLMENT      // Student enrolled in course
ASSIGNMENT_DUE  // Assignment deadline reminder
GRADE_POSTED    // New grade available
COURSE_UPDATE   // Course content changed
GENERAL         // Other notifications
```

## Database Statistics (After Seeding)

- **3 Users**: 1 Admin, 1 Teacher, 1 Student
- **1 Course**: "Introduction to Web Development"
- **2 Lessons**: HTML Basics, CSS Styling
- **1 Assignment**: "Build Your First Web Page"
- **1 Quiz**: "HTML Fundamentals Quiz" with 2 questions
- **1 Enrollment**: Student enrolled in the course

## Connection Pooling

NeonDB automatically handles connection pooling. For optimal performance:

```typescript
// lib/prisma.ts already configured with:
- Singleton pattern (prevents multiple instances)
- Development logging (query, error, warn)
- Production-ready configuration
```

## Indexes & Performance

Prisma automatically creates indexes for:
- ✅ Primary keys (`@id`)
- ✅ Foreign keys (`@relation`)
- ✅ Unique constraints (`@unique`)

For large-scale deployments, consider adding:
- Index on `courses.status` for filtering
- Index on `enrollments.studentId` for student lookups
- Index on `grades.studentId` for grade reports
- Full-text search on `courses.title` and `description`
