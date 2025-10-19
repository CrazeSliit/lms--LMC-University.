import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Teacher User
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@lms.com' },
    update: {},
    create: {
      email: 'teacher@lms.com',
      name: 'Teacher User',
      password: teacherPassword,
      role: 'TEACHER',
    },
  })
  console.log('✅ Teacher user created:', teacher.email)

  // Create Student User
  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.user.upsert({
    where: { email: 'student@lms.com' },
    update: {},
    create: {
      email: 'student@lms.com',
      name: 'Student User',
      password: studentPassword,
      role: 'STUDENT',
    },
  })
  console.log('✅ Student user created:', student.email)

  // Create Sample Course
  const course = await prisma.course.upsert({
    where: { id: 'sample-course-1' },
    update: {},
    create: {
      id: 'sample-course-1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
      teacherId: teacher.id,
      status: 'PUBLISHED',
    },
  })
  console.log('✅ Sample course created:', course.title)

  // Create Sample Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'HTML Basics',
      content: 'Learn the fundamental building blocks of web pages with HTML.',
      order: 1,
      courseId: course.id,
    },
  })

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'CSS Styling',
      content: 'Make your web pages beautiful with CSS styling and layouts.',
      order: 2,
      courseId: course.id,
    },
  })
  console.log('✅ Sample lessons created')

  // Create Sample Assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Build Your First Web Page',
      description: 'Create a simple web page using HTML and CSS.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxScore: 100,
      courseId: course.id,
    },
  })
  console.log('✅ Sample assignment created')

  // Create Sample Quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'HTML Fundamentals Quiz',
      description: 'Test your knowledge of HTML basics',
      courseId: course.id,
      timeLimit: 30,
      questions: {
        create: [
          {
            questionText: 'What does HTML stand for?',
            questionType: 'MULTIPLE_CHOICE',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language',
            ],
            correctAnswer: 'Hyper Text Markup Language',
            points: 10,
            order: 1,
          },
          {
            questionText: 'HTML is a programming language.',
            questionType: 'TRUE_FALSE',
            options: ['True', 'False'],
            correctAnswer: 'False',
            points: 10,
            order: 2,
          },
        ],
      },
    },
  })
  console.log('✅ Sample quiz with questions created')

  // Enroll student in course
  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: course.id,
      status: 'ACTIVE',
    },
  })
  console.log('✅ Student enrolled in course')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('Admin: admin@lms.com / admin123')
  console.log('Teacher: teacher@lms.com / teacher123')
  console.log('Student: student@lms.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
