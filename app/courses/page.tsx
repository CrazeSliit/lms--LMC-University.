'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Clock, Star, Filter, Search } from 'lucide-react'

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'Web Development', 'Data Science', 'Business', 'Design', 'Marketing', 'Mobile Development']

  const courses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Master HTML, CSS, and JavaScript from scratch with hands-on projects.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
      instructor: 'John Smith',
      students: 2500,
      duration: '12 weeks',
      level: 'Beginner',
      price: 99,
      rating: 4.8,
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'Data Science & Analytics',
      description: 'Learn data analysis, visualization, and machine learning techniques.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      instructor: 'Sarah Johnson',
      students: 1800,
      duration: '16 weeks',
      level: 'Intermediate',
      price: 149,
      rating: 4.9,
      category: 'Data Science'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Comprehensive guide to SEO, social media, and content marketing.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      instructor: 'Mike Davis',
      students: 3200,
      duration: '10 weeks',
      level: 'Beginner',
      price: 79,
      rating: 4.7,
      category: 'Marketing'
    },
    {
      id: 4,
      title: 'React & Next.js Development',
      description: 'Build modern web applications with React 18 and Next.js 14.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
      instructor: 'Emily Chen',
      students: 2100,
      duration: '14 weeks',
      level: 'Advanced',
      price: 129,
      rating: 4.9,
      category: 'Web Development'
    },
    {
      id: 5,
      title: 'UI/UX Design Principles',
      description: 'Create beautiful and functional user interfaces with modern design tools.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      instructor: 'David Park',
      students: 1650,
      duration: '8 weeks',
      level: 'Beginner',
      price: 89,
      rating: 4.6,
      category: 'Design'
    },
    {
      id: 6,
      title: 'Python for Data Analysis',
      description: 'Master Python programming and data analysis with pandas and NumPy.',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
      instructor: 'Lisa Anderson',
      students: 2800,
      duration: '12 weeks',
      level: 'Intermediate',
      price: 119,
      rating: 4.8,
      category: 'Data Science'
    },
    {
      id: 7,
      title: 'Mobile App Development',
      description: 'Build native mobile apps for iOS and Android using React Native.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      instructor: 'James Wilson',
      students: 1900,
      duration: '16 weeks',
      level: 'Advanced',
      price: 159,
      rating: 4.7,
      category: 'Mobile Development'
    },
    {
      id: 8,
      title: 'Business Strategy & Management',
      description: 'Learn essential business strategies and management techniques.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      instructor: 'Robert Brown',
      students: 2300,
      duration: '10 weeks',
      level: 'Intermediate',
      price: 109,
      rating: 4.5,
      category: 'Business'
    },
    {
      id: 9,
      title: 'Full Stack Web Development',
      description: 'Complete guide to front-end and back-end web development.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      instructor: 'Anna Martinez',
      students: 3500,
      duration: '20 weeks',
      level: 'Intermediate',
      price: 199,
      rating: 4.9,
      category: 'Web Development'
    }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50">
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
      <section className="bg-gradient-to-r from-primary to-purple-600 py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold text-white">
              Explore Our Courses
            </h1>
            <p className="text-xl text-white/90">
              Choose from over 1000+ courses taught by expert instructors
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-white/20 bg-white/95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-border py-6">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-foreground hover:bg-gray-200'
                  }`}
                >
                  {category}
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
              <h2 className="text-3xl font-bold text-foreground">
                {selectedCategory === 'All' ? 'All Courses' : selectedCategory}
              </h2>
              <p className="text-muted-foreground mt-2">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} available
              </p>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-bold text-foreground shadow-md">
                      ${course.price}
                    </div>
                    <div className="absolute top-4 left-4 bg-primary/90 rounded-full px-3 py-1 text-sm font-medium text-white">
                      {course.level}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6 space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{course.rating}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-foreground">{course.instructor}</span>
                    </div>

                    {/* Action Button */}
                    <Link href="/login" className="block">
                      <Button className="w-full rounded-full font-semibold group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            We&apos;re constantly adding new courses. Sign up to get notified about new course releases.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="rounded-full px-8 font-semibold">
                Create Free Account
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
