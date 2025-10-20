'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, GraduationCap, Award, Facebook, Twitter, Instagram, Linkedin, Star, Sparkles, X, Mail, MapPin, Briefcase, Trophy, Phone, Send, MessageSquare, Clock } from 'lucide-react'

interface Instructor {
  id: number
  name: string
  title: string
  description: string
  image: string
  rating: number
  courses: number
  students: string
  bio: string
  expertise: string[]
  education: string[]
  achievements: string[]
  email: string
  location: string
}

const instructorsData: Instructor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Data Science & AI Specialist',
    description: 'PhD in Computer Science with 15+ years of experience in machine learning and data analytics.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces',
    rating: 4.9,
    courses: 24,
    students: '12K',
    bio: 'Dr. Sarah Johnson is a renowned data scientist and AI researcher with a passion for making complex concepts accessible to students. She has worked with leading tech companies including Google and Microsoft, developing cutting-edge machine learning solutions. Her teaching style focuses on practical, hands-on learning with real-world applications.',
    expertise: ['Machine Learning', 'Deep Learning', 'Data Analytics', 'Python', 'TensorFlow', 'Neural Networks'],
    education: [
      'PhD in Computer Science - Stanford University',
      'MSc in Artificial Intelligence - MIT',
      'BSc in Mathematics - UC Berkeley'
    ],
    achievements: [
      'Published 50+ research papers in top-tier journals',
      'Speaker at Google I/O and AWS re:Invent',
      'Winner of Best Data Science Educator Award 2024',
      'Developed AI curriculum used by 100+ universities'
    ],
    email: 'sarah.johnson@lmc.edu',
    location: 'San Francisco, CA'
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    title: 'Web Development Expert',
    description: 'Full-stack developer with expertise in React, Node.js, and modern web technologies.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=faces',
    rating: 4.8,
    courses: 18,
    students: '15K',
    bio: 'Professor Michael Chen is a seasoned full-stack developer and educator with over 12 years of industry experience. He has built enterprise applications for Fortune 500 companies and led development teams at major startups. Michael is known for his engaging teaching style and ability to simplify complex web development concepts.',
    expertise: ['React.js', 'Node.js', 'JavaScript', 'TypeScript', 'Next.js', 'MongoDB', 'GraphQL'],
    education: [
      'MSc in Software Engineering - Carnegie Mellon University',
      'BSc in Computer Science - University of Washington'
    ],
    achievements: [
      'Lead developer on 100+ production web applications',
      'Author of "Modern Web Development" bestselling book',
      'Contributing member to React.js open source community',
      'Mentor to 500+ developers through coding bootcamps'
    ],
    email: 'michael.chen@lmc.edu',
    location: 'Seattle, WA'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'UX/UI Design Lead',
    description: 'Award-winning designer specializing in user experience and interface design principles.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=faces',
    rating: 5.0,
    courses: 16,
    students: '9K',
    bio: 'Emily Rodriguez is an internationally recognized UX/UI designer with a keen eye for creating intuitive and beautiful digital experiences. She has led design teams at Apple and Airbnb, crafting products used by millions. Emily believes in design thinking and user-centered approaches to solve real problems.',
    expertise: ['User Experience Design', 'UI Design', 'Figma', 'Adobe Creative Suite', 'Design Systems', 'Prototyping'],
    education: [
      'MA in Interaction Design - Royal College of Art',
      'BFA in Graphic Design - Rhode Island School of Design'
    ],
    achievements: [
      'Winner of 3 Red Dot Design Awards',
      'Featured designer in Forbes 30 Under 30',
      'Created design systems for Fortune 100 companies',
      'International speaker at Adobe MAX and Figma Config'
    ],
    email: 'emily.rodriguez@lmc.edu',
    location: 'New York, NY'
  },
  {
    id: 4,
    name: 'David Thompson',
    title: 'Digital Marketing Guru',
    description: 'Marketing strategist with proven track record in SEO, social media, and content marketing.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=faces',
    rating: 4.9,
    courses: 22,
    students: '18K',
    bio: 'David Thompson is a digital marketing pioneer who has helped hundreds of businesses scale their online presence. With expertise spanning SEO, content marketing, and social media strategy, David has worked with brands like Nike, Coca-Cola, and Amazon. He combines data-driven insights with creative storytelling.',
    expertise: ['SEO', 'Content Marketing', 'Social Media Strategy', 'Google Analytics', 'PPC Advertising', 'Marketing Automation'],
    education: [
      'MBA in Marketing - Harvard Business School',
      'BSc in Business Administration - University of Pennsylvania'
    ],
    achievements: [
      'Grew startup from 0 to $10M revenue through digital marketing',
      'Certified Google Analytics & AdWords Expert',
      'Author of "Digital Marketing Mastery" with 100K+ copies sold',
      'Featured marketing expert on Forbes and Entrepreneur'
    ],
    email: 'david.thompson@lmc.edu',
    location: 'Los Angeles, CA'
  }
]

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const benefitImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=600&fit=crop',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % benefitImages.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedInstructor) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [selectedInstructor])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setContactForm({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

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
        <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
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
      <section className="flex-1 relative overflow-hidden">
        <div className="container mx-auto px-8 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="relative z-10 space-y-8">
              {/* Decorative Stars */}
              <div className="absolute -left-8 -top-8 text-primary/20">
                <Star className="h-12 w-12" fill="currentColor" />
              </div>
              <div className="absolute -top-4 left-20 text-purple-300/40">
                <Sparkles className="h-8 w-8" fill="currentColor" />
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight text-foreground lg:text-6xl">
                  Enhance Your Skills<br />
                  With <span className="text-primary">Our Online</span><br />
                  <span className="text-primary">Courses</span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                  Dive into a World of Knowledge with Our Comprehensive and Engaging
                  Online Courses Designed for Skill Enhancement
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="rounded-full px-8 font-medium shadow-lg shadow-primary/25">
                    Apply Now
                  </Button>
                </Link>
                <Link href="#courses">
                  <Button size="lg" variant="outline" className="rounded-full px-8 font-medium">
                    Know More
                  </Button>
                </Link>
              </div>

              {/* Social Links & Contact */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Call Us : 000 0000 0000</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -right-4 top-0 text-blue-200/30">
                <Star className="h-16 w-16" fill="currentColor" />
              </div>
              <div className="absolute right-1/4 top-12 text-purple-300/40">
                <Sparkles className="h-10 w-10" fill="currentColor" />
              </div>
              <div className="absolute bottom-20 left-8 text-blue-300/30">
                <Star className="h-10 w-10" fill="currentColor" />
              </div>

              {/* Main Image Container */}
              <div className="relative">
                {/* Background Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-purple-400/20" />
                </div>

                {/* Student Image Placeholder */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="relative h-[650px] w-[550px] rounded-3xl overflow-hidden">
                  <img 
                  src="/home/pack01.png" 
                  alt="Student with Books" 
                  className="h-full w-full object-cover"
                  />
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="absolute bottom-8 right-8 z-20 rounded-full bg-white p-6 shadow-2xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div className="h-10 w-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">B</div>
                      <div className="h-10 w-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">C</div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">30K</p>
                      <p className="text-sm text-muted-foreground">Enrolled Students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            Everything You Need to Manage Learning
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Comprehensive tools and features designed to enhance your educational experience
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 group-hover:bg-primary group-hover:scale-110 transition-all">
                <BookOpen className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Course Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create and organize courses with lessons, assignments, and quizzes
              </p>
            </div>

            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-500 group-hover:scale-110 transition-all">
                <Users className="h-10 w-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Student Enrollment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Easily enroll students and manage class rosters
              </p>
            </div>

            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-500 group-hover:scale-110 transition-all">
                <GraduationCap className="h-10 w-10 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Grade Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track student progress with comprehensive grade reports
              </p>
            </div>

            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-500 group-hover:scale-110 transition-all">
                <Award className="h-10 w-10 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Assessments</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create assignments and quizzes with automatic grading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-20">
        <div className="container mx-auto px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">30K+</div>
              <div className="text-lg font-medium text-foreground">Active Students</div>
              <div className="text-sm text-muted-foreground">Learning and growing daily</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">500+</div>
              <div className="text-lg font-medium text-foreground">Expert Instructors</div>
              <div className="text-sm text-muted-foreground">Industry professionals</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">1000+</div>
              <div className="text-lg font-medium text-foreground">Online Courses</div>
              <div className="text-sm text-muted-foreground">Diverse learning topics</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">95%</div>
              <div className="text-lg font-medium text-foreground">Success Rate</div>
              <div className="text-sm text-muted-foreground">Student satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Get started with our simple three-step process
          </p>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-foreground">Create Account</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sign up for free and choose your learning path. Set up your profile and preferences in minutes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-foreground">Choose Courses</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse our extensive catalog and enroll in courses that match your goals and interests.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-foreground">Start Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access course materials anytime, complete assignments, and track your progress towards certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-20">
        <div className="container mx-auto px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                Why Choose Our Platform
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our learning management system offers unique advantages that set us apart from traditional education platforms.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Flexible Learning Schedule</h3>
                    <p className="text-muted-foreground">Learn at your own pace, anytime and anywhere. Access course materials 24/7.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Expert Instructors</h3>
                    <p className="text-muted-foreground">Learn from industry professionals with years of real-world experience.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Interactive Learning</h3>
                    <p className="text-muted-foreground">Engage with multimedia content, quizzes, and hands-on assignments.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Certification & Recognition</h3>
                    <p className="text-muted-foreground">Earn certificates upon completion to showcase your achievements.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              {benefitImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Learning Platform ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-2xl font-bold">Transform Your Future</p>
                <p className="text-sm mt-2">Join thousands of successful learners</p>
              </div>
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {benefitImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            Popular Courses
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Explore our most sought-after courses
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop" 
                  alt="Web Development Course"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>2,500 Students</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Web Development Fundamentals</h3>
                <p className="text-muted-foreground">Master HTML, CSS, and JavaScript from scratch with hands-on projects.</p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-primary">$99</span>
                  <Link href="/login">
                    <Button className="rounded-full">Enroll Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" 
                  alt="Data Science Course"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>1,800 Students</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Data Science & Analytics</h3>
                <p className="text-muted-foreground">Learn data analysis, visualization, and machine learning techniques.</p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-primary">$149</span>
                  <Link href="/login">
                    <Button className="rounded-full">Enroll Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                  alt="Digital Marketing Course"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>3,200 Students</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Digital Marketing Mastery</h3>
                <p className="text-muted-foreground">Comprehensive guide to SEO, social media, and content marketing.</p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-primary">$79</span>
                  <Link href="/login">
                    <Button className="rounded-full">Enroll Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="bg-white py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            Meet Our Expert <span className="text-primary">Instructors</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Learn from industry professionals with years of real-world experience and a passion for teaching
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {instructorsData.map((instructor) => (
              <div 
                key={instructor.id}
                onClick={() => setSelectedInstructor(instructor)}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className={`relative h-72 overflow-hidden ${
                  instructor.id === 1 ? 'bg-gradient-to-br from-blue-100 to-purple-100' :
                  instructor.id === 2 ? 'bg-gradient-to-br from-green-100 to-blue-100' :
                  instructor.id === 3 ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
                  'bg-gradient-to-br from-orange-100 to-red-100'
                }`}>
                  <img 
                    src={instructor.image}
                    alt={instructor.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="rounded-full px-6 shadow-lg">View Profile</Button>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">{instructor.name}</h3>
                    <div className="flex gap-1 text-yellow-400 text-sm">
                      ★ {instructor.rating}
                    </div>
                  </div>
                  <p className="text-primary font-semibold text-sm">{instructor.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {instructor.description}
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{instructor.courses} Courses</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{instructor.students} Students</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <a href="#" onClick={(e) => e.stopPropagation()} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href="#" onClick={(e) => e.stopPropagation()} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Instructor Highlights */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg font-semibold text-foreground mb-1">Expert Instructors</div>
              <p className="text-sm text-muted-foreground">Industry professionals from top companies</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
              <div className="text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-lg font-semibold text-foreground mb-1">Satisfaction Rate</div>
              <p className="text-sm text-muted-foreground">Students love our teaching methods</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="text-5xl font-bold text-primary mb-2">20+</div>
              <div className="text-lg font-semibold text-foreground mb-1">Years Combined</div>
              <p className="text-sm text-muted-foreground">Teaching experience across all instructors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            What Our Students Say
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Real feedback from our learning community
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="flex gap-1 text-yellow-400">
                ★★★★★
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;This platform transformed my career. The courses are well-structured and the instructors are incredibly knowledgeable.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <div className="font-bold text-foreground">John Doe</div>
                  <div className="text-sm text-muted-foreground">Software Engineer</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="flex gap-1 text-yellow-400">
                ★★★★★
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;The flexibility to learn at my own pace while working full-time was exactly what I needed. Highly recommend!&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <div className="font-bold text-foreground">Sarah Miller</div>
                  <div className="text-sm text-muted-foreground">Marketing Manager</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="flex gap-1 text-yellow-400">
                ★★★★★
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;Excellent course content and great support from the community. I&apos;ve gained practical skills I use every day.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  MC
                </div>
                <div>
                  <div className="font-bold text-foreground">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Data Analyst</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-8 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Join thousands of students already learning with us. Create your account today and get access to our entire course library.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="rounded-full px-8 font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="#courses">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get in <span className="text-primary">Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
                <p className="text-muted-foreground mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Phone className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Phone</h4>
                      <p className="text-muted-foreground text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                      <a href="tel:+1234567890" className="text-primary font-semibold hover:underline">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                      <Mail className="h-7 w-7 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground text-sm mb-2">Our friendly team is here to help</p>
                      <a href="mailto:support@lmc.edu" className="text-primary font-semibold hover:underline">
                        support@lmc.edu
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                      <MapPin className="h-7 w-7 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Office</h4>
                      <p className="text-muted-foreground text-sm mb-2">Come say hello at our office</p>
                      <p className="text-foreground font-medium">
                        123 Learning Street<br />
                        Education City, EC 12345
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                      <Clock className="h-7 w-7 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Working Hours</h4>
                      <p className="text-muted-foreground text-sm mb-2">Monday - Friday</p>
                      <p className="text-foreground font-medium">
                        8:00 AM - 5:00 PM EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-bold text-foreground mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-border text-muted-foreground hover:border-primary hover:bg-primary hover:text-white transition-all">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-border text-muted-foreground hover:border-primary hover:bg-primary hover:text-white transition-all">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-border text-muted-foreground hover:border-primary hover:bg-primary hover:text-white transition-all">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-border text-muted-foreground hover:border-primary hover:bg-primary hover:text-white transition-all">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 border-2 border-border shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Send us a Message</h3>
                  <p className="text-sm text-muted-foreground">We&apos;ll get back to you soon</p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h4>
                  <p className="text-muted-foreground">Thank you for contacting us. We&apos;ll respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full rounded-xl gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    <Send className="h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Map or Additional Info */}
          <div className="mt-16 bg-white rounded-3xl p-8 border-2 border-border shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Visit Our Campus</h3>
              <p className="text-muted-foreground">We&apos;re conveniently located in the heart of Education City</p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop" 
                alt="Campus Location"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-8">
                <Button size="lg" className="rounded-full shadow-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LMS Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 LMS Platform. Built with Next.js and Prisma.
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

      {/* Instructor Detail Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="relative h-64 bg-gradient-to-br from-primary via-purple-600 to-blue-600">
              <button
                onClick={() => setSelectedInstructor(null)}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-end gap-6">
                  <img
                    src={selectedInstructor.image}
                    alt={selectedInstructor.name}
                    className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl object-cover"
                  />
                  <div className="flex-1 text-white pb-2">
                    <h2 className="text-3xl font-bold mb-2">{selectedInstructor.name}</h2>
                    <p className="text-lg text-white/90 mb-2">{selectedInstructor.title}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{selectedInstructor.rating}</span>
                        <span className="text-white/80">Rating</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{selectedInstructor.courses} Courses</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{selectedInstructor.students} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{selectedInstructor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{selectedInstructor.location}</p>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  About
                </h3>
                <p className="text-muted-foreground leading-relaxed">{selectedInstructor.bio}</p>
              </div>

              {/* Expertise */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInstructor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {selectedInstructor.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-muted-foreground">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  Key Achievements
                </h3>
                <div className="space-y-3">
                  {selectedInstructor.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <p className="text-foreground font-medium">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links & CTA */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex gap-3">
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="rounded-full">
                    View Courses
                  </Button>
                  <Link href="/login">
                    <Button size="lg" className="rounded-full shadow-lg shadow-primary/25">
                      Enroll Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
