# Prisma Database Quick Reference

## Common Prisma Commands

```powershell
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (visual database editor)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# View migration status
npx prisma migrate status

# Seed database with sample data
npm run prisma:seed
```

## Example Queries

### User Operations

```typescript
import { prisma } from '@/lib/prisma'

// Find user by email
const user = await prisma.user.findUnique({
  where: { email: 'student@lms.com' }
})

// Create new user
const newUser = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword, // Use bcrypt
    role: 'STUDENT'
  }
})

// Update user
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' }
})

// Delete user (cascades to related records)
await prisma.user.delete({
  where: { id: userId }
})

// Get user with relations
const userWithCourses = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    taughtCourses: true,
    enrollments: {
      include: {
        course: true
      }
    }
  }
})
```

### Course Operations

```typescript
// Create course with teacher
const course = await prisma.course.create({
  data: {
    title: 'Web Development 101',
    description: 'Learn web development basics',
    status: 'PUBLISHED',
    teacherId: teacherId
  }
})

// Get all published courses
const courses = await prisma.course.findMany({
  where: { status: 'PUBLISHED' },
  include: {
    teacher: {
      select: { name: true, email: true }
    },
    _count: {
      select: { enrollments: true, lessons: true }
    }
  }
})

// Get course with all related data
const fullCourse = await prisma.course.findUnique({
  where: { id: courseId },
  include: {
    teacher: true,
    lessons: { orderBy: { order: 'asc' } },
    assignments: true,
    quizzes: {
      include: {
        questions: { orderBy: { order: 'asc' } }
      }
    },
    enrollments: {
      include: { student: true }
    }
  }
})
```

### Enrollment Operations

```typescript
// Enroll student in course
const enrollment = await prisma.enrollment.create({
  data: {
    studentId: studentId,
    courseId: courseId,
    status: 'ACTIVE'
  }
})

// Check if student is enrolled
const isEnrolled = await prisma.enrollment.findUnique({
  where: {
    studentId_courseId: {
      studentId: studentId,
      courseId: courseId
    }
  }
})

// Get all enrolled students for a course
const students = await prisma.enrollment.findMany({
  where: {
    courseId: courseId,
    status: 'ACTIVE'
  },
  include: {
    student: {
      select: { id: true, name: true, email: true }
    }
  }
})

// Get student's enrolled courses
const myCourses = await prisma.enrollment.findMany({
  where: {
    studentId: studentId,
    status: 'ACTIVE'
  },
  include: {
    course: {
      include: {
        teacher: { select: { name: true } },
        _count: { select: { lessons: true } }
      }
    }
  }
})
```

### Assignment & Submission

```typescript
// Create assignment
const assignment = await prisma.assignment.create({
  data: {
    title: 'Week 1 Assignment',
    description: 'Complete the exercises',
    dueDate: new Date('2025-11-01'),
    maxScore: 100,
    courseId: courseId
  }
})

// Submit assignment
const submission = await prisma.assignmentSubmission.create({
  data: {
    assignmentId: assignmentId,
    studentId: studentId,
    content: 'My submission content',
    fileUrl: 'https://...' // optional
  }
})

// Get assignment with submissions
const assignmentWithSubmissions = await prisma.assignment.findUnique({
  where: { id: assignmentId },
  include: {
    submissions: {
      include: {
        student: {
          select: { name: true, email: true }
        }
      }
    }
  }
})

// Check if student submitted
const hasSubmitted = await prisma.assignmentSubmission.findUnique({
  where: {
    assignmentId_studentId: {
      assignmentId: assignmentId,
      studentId: studentId
    }
  }
})
```

### Quiz Operations

```typescript
// Create quiz with questions
const quiz = await prisma.quiz.create({
  data: {
    title: 'Midterm Quiz',
    description: 'Covers chapters 1-5',
    courseId: courseId,
    timeLimit: 60, // minutes
    questions: {
      create: [
        {
          questionText: 'What is 2+2?',
          questionType: 'MULTIPLE_CHOICE',
          options: ['3', '4', '5', '6'],
          correctAnswer: '4',
          points: 10,
          order: 1
        },
        {
          questionText: 'JavaScript is compiled.',
          questionType: 'TRUE_FALSE',
          options: ['True', 'False'],
          correctAnswer: 'False',
          points: 10,
          order: 2
        }
      ]
    }
  }
})

// Submit quiz attempt
const attempt = await prisma.quizAttempt.create({
  data: {
    quizId: quizId,
    studentId: studentId,
    answers: {
      '1': '4',
      '2': 'False'
    },
    score: 20 // calculated score
  }
})

// Get quiz with attempts
const quizResults = await prisma.quiz.findUnique({
  where: { id: quizId },
  include: {
    questions: { orderBy: { order: 'asc' } },
    attempts: {
      include: {
        student: { select: { name: true } }
      },
      orderBy: { submittedAt: 'desc' }
    }
  }
})
```

### Grade Operations

```typescript
// Create grade for assignment
const grade = await prisma.grade.create({
  data: {
    studentId: studentId,
    assignmentId: assignmentId,
    score: 85,
    maxScore: 100,
    feedback: 'Good work! Improve error handling.'
  }
})

// Get student's all grades
const studentGrades = await prisma.grade.findMany({
  where: { studentId: studentId },
  include: {
    assignment: { select: { title: true } },
    quiz: { select: { title: true } }
  },
  orderBy: { gradedAt: 'desc' }
})

// Calculate average grade for student
const grades = await prisma.grade.findMany({
  where: { studentId: studentId }
})

const average = grades.reduce((sum, g) => {
  return sum + (g.score / g.maxScore)
}, 0) / grades.length * 100
```

### Notification Operations

```typescript
// Create notification
const notification = await prisma.notification.create({
  data: {
    userId: userId,
    message: 'New assignment posted in Web Development',
    type: 'ASSIGNMENT_DUE',
    isRead: false
  }
})

// Get unread notifications
const unread = await prisma.notification.findMany({
  where: {
    userId: userId,
    isRead: false
  },
  orderBy: { createdAt: 'desc' }
})

// Mark as read
await prisma.notification.update({
  where: { id: notificationId },
  data: { isRead: true }
})

// Mark all as read
await prisma.notification.updateMany({
  where: {
    userId: userId,
    isRead: false
  },
  data: { isRead: true }
})
```

### Advanced Queries

```typescript
// Pagination
const page = 1
const perPage = 10

const courses = await prisma.course.findMany({
  skip: (page - 1) * perPage,
  take: perPage,
  where: { status: 'PUBLISHED' },
  orderBy: { createdAt: 'desc' }
})

// Search
const searchResults = await prisma.course.findMany({
  where: {
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } }
    ],
    status: 'PUBLISHED'
  }
})

// Count records
const totalCourses = await prisma.course.count({
  where: { status: 'PUBLISHED' }
})

// Aggregate data
const stats = await prisma.grade.aggregate({
  where: { studentId: studentId },
  _avg: { score: true },
  _max: { score: true },
  _min: { score: true },
  _count: true
})

// Group by
const courseStats = await prisma.enrollment.groupBy({
  by: ['courseId'],
  _count: {
    studentId: true
  }
})

// Transactions (all or nothing)
const result = await prisma.$transaction([
  prisma.enrollment.create({
    data: { studentId, courseId, status: 'ACTIVE' }
  }),
  prisma.notification.create({
    data: {
      userId: studentId,
      message: `You enrolled in ${courseName}`,
      type: 'ENROLLMENT'
    }
  })
])
```

## Error Handling

```typescript
import { Prisma } from '@prisma/client'

try {
  await prisma.user.create({ data: { email, name, password, role } })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      return { error: 'Email already exists' }
    }
    if (error.code === 'P2025') {
      // Record not found
      return { error: 'User not found' }
    }
  }
  throw error
}
```

## Common Error Codes

- `P2002` - Unique constraint violation
- `P2025` - Record not found
- `P2003` - Foreign key constraint failed
- `P2016` - Query interpretation error
- `P2014` - Relation violation

## Performance Tips

1. **Use select instead of include when possible**
```typescript
// ❌ Fetches all user fields
const user = await prisma.user.findUnique({ where: { id } })

// ✅ Only fetch needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true }
})
```

2. **Avoid N+1 queries - use include**
```typescript
// ❌ N+1 queries (one for courses, one for each teacher)
const courses = await prisma.course.findMany()
for (const course of courses) {
  const teacher = await prisma.user.findUnique({ where: { id: course.teacherId } })
}

// ✅ Single query with join
const courses = await prisma.course.findMany({
  include: { teacher: true }
})
```

3. **Use transactions for multiple operations**
4. **Implement cursor-based pagination for large datasets**
5. **Add database indexes for frequently queried fields**

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [NeonDB Docs](https://neon.tech/docs)
