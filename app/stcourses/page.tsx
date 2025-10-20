'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Clock, Star, Search, Filter, ChevronDown } from 'lucide-react'

const categories = ['All Courses', 'Web Development', 'Data Science', 'Digital Marketing', 'Business', 'Design', 'Mobile Development']
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

const courses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and deploy to production.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    instructor: 'John Smith',
    category: 'Web Development',
    level: 'Beginner',
    students: 2500,
    duration: '40 hours',
    rating: 4.8,
    reviews: 1240,
    price: 99,
    featured: true
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning A-Z',
    description: 'Learn data analysis, visualization, statistics, and machine learning with Python, Pandas, NumPy, Matplotlib, and Scikit-learn.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    instructor: 'Sarah Johnson',
    category: 'Data Science',
    level: 'Intermediate',
    students: 1800,
    duration: '50 hours',
    rating: 4.9,
    reviews: 890,
    price: 149,
    featured: true
  },
  {
    id: 3,
    title: 'Digital Marketing Mastery 2025',
    description: 'Complete guide to SEO, social media marketing, content marketing, email campaigns, and paid advertising strategies.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    instructor: 'Michael Brown',
    category: 'Digital Marketing',
    level: 'Beginner',
    students: 3200,
    duration: '30 hours',
    rating: 4.7,
    reviews: 1560,
    price: 79,
    featured: true
  },
  {
    id: 4,
    title: 'React & Next.js - The Complete Guide',
    description: 'Build modern, scalable web applications with React 18 and Next.js 15. Learn server components, routing, and deployment.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    instructor: 'Emily Chen',
    category: 'Web Development',
    level: 'Advanced',
    students: 1650,
    duration: '35 hours',
    rating: 4.9,
    reviews: 720,
    price: 129
  },
  {
    id: 5,
    title: 'Python for Data Analysis',
    description: 'Master Python programming for data analysis with Pandas, NumPy, and data visualization libraries.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
    instructor: 'David Wilson',
    category: 'Data Science',
    level: 'Beginner',
    students: 2100,
    duration: '25 hours',
    rating: 4.6,
    reviews: 980,
    price: 89
  },
  {
    id: 6,
    title: 'UI/UX Design Fundamentals',
    description: 'Learn user interface and user experience design principles. Master Figma, wireframing, prototyping, and user research.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    instructor: 'Lisa Anderson',
    category: 'Design',
    level: 'Beginner',
    students: 1950,
    duration: '28 hours',
    rating: 4.8,
    reviews: 850,
    price: 94
  },
  {
    id: 7,
    title: 'Business Strategy & Management',
    description: 'Strategic business planning, leadership skills, project management, and organizational development for modern businesses.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    instructor: 'Robert Taylor',
    category: 'Business',
    level: 'Intermediate',
    students: 1420,
    duration: '32 hours',
    rating: 4.7,
    reviews: 640,
    price: 119
  },
  {
    id: 8,
    title: 'iOS App Development with Swift',
    description: 'Build native iOS applications using Swift and SwiftUI. Learn iOS frameworks, design patterns, and app deployment.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    instructor: 'Jennifer Lee',
    category: 'Mobile Development',
    level: 'Intermediate',
    students: 1230,
    duration: '45 hours',
    rating: 4.8,
    reviews: 560,
    price: 139
  },
  {
    id: 9,
    title: 'Social Media Marketing Pro',
    description: 'Master Facebook, Instagram, Twitter, LinkedIn, and TikTok marketing strategies. Content creation and analytics.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    instructor: 'Amanda Garcia',
    category: 'Digital Marketing',
    level: 'Beginner',
    students: 2800,
    duration: '22 hours',
    rating: 4.6,
    reviews: 1120,
    price: 69
  }
]

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Courses')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All Courses' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
              <img src="/Logo/LOG.png" alt="LMC University Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-foreground">LMC University</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="#instructors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Instructors
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-6 font-medium">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-purple-50/50 to-blue-50/30 py-20 border-b border-border/30">
        <div className="container mx-auto px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Explore Our <span className="text-primary">Courses</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover world-class courses taught by industry experts. Learn new skills, advance your career, and achieve your goals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-border bg-white focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-border/30 py-6 sticky top-20 z-40">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter by:</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-border mx-2" />

            {/* Level Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedLevel === level
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {filteredCourses.length} Courses Available
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedCategory !== 'All Courses' && `in ${selectedCategory} `}
                {selectedLevel !== 'All Levels' && `• ${selectedLevel}`}
              </p>
            </div>
            <select className="px-4 py-2 rounded-lg border-2 border-border bg-white text-sm font-medium text-foreground focus:border-primary focus:outline-none">
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {course.featured && (
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                      {course.category}
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 space-y-4">
                    {/* Rating & Level */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-foreground">{course.rating}</span>
                        <span className="text-muted-foreground">({course.reviews})</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-muted-foreground">
                        {course.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{course.instructor}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-3xl font-bold text-primary">${course.price}</span>
                      <Link href="/login">
                        <Button className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                          Enroll Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-8 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            We&apos;re constantly adding new courses. Sign up to get notified when courses in your area of interest become available.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="rounded-full px-8 font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
                <img src="/Logo/LOG.png" alt="LMC University Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">LMC University</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 LMC University. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
