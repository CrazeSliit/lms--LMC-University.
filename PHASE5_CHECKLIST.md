# Phase 5: NeonDB Setup Checklist

Follow these steps to complete the database setup and initialize your LMS.

---

## 📋 Step-by-Step Guide

### Step 1: Create NeonDB Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click "Sign Up" (or "Get Started")
3. Sign up with:
   - GitHub (recommended - fastest)
   - Google
   - Email

### Step 2: Create Your First Project

1. After login, click **"New Project"**
2. Configure your project:
   - **Project Name**: `lms-database` (or your preferred name)
   - **Region**: Choose closest to you or your users
     - `US East (Ohio)` - us-east-2
     - `US West (Oregon)` - us-west-2
     - `Europe (Frankfurt)` - eu-central-1
     - `Asia Pacific (Singapore)` - ap-southeast-1
   - **PostgreSQL Version**: Use default (latest, usually 16)
   - **Compute Size**: Free tier is sufficient for development

3. Click **"Create Project"**

### Step 3: Get Connection String

1. After project creation, you'll see the dashboard
2. Look for **"Connection Details"** or **"Connection String"**
3. Make sure **"Pooled connection"** is selected (recommended for serverless)
4. Click **"Copy"** to copy the connection string

The connection string looks like:
```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Step 4: Update Your .env File

1. Open your project in VS Code
2. Find the `.env` file in the root directory
3. Update the `DATABASE_URL` with your copied connection string:

```env
# Replace this entire line with your NeonDB connection string
DATABASE_URL="postgresql://your-username:your-password@your-host.neon.tech/neondb?sslmode=require"

# Keep these as they are for now
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. **Generate NextAuth Secret**:
   In PowerShell, run:
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   
   Copy the output and paste it as your `NEXTAUTH_SECRET`

5. **Save the .env file** (Ctrl+S)

### Step 5: Initialize Database

Open your terminal in VS Code and run these commands:

#### 5.1 Generate Prisma Client
```powershell
npm run prisma:generate
```
✅ Expected output: "Generated Prisma Client..."

#### 5.2 Create Database Tables
```powershell
npm run prisma:migrate
```
- When prompted for migration name, type: `init`
- ✅ Expected output: "Your database is now in sync with your schema"

#### 5.3 Seed Sample Data
```powershell
npm run prisma:seed
```
✅ Expected output:
```
🌱 Starting seed...
✅ Admin user created: admin@lms.com
✅ Teacher user created: teacher@lms.com
✅ Student user created: student@lms.com
✅ Sample course created: Introduction to Web Development
✅ Sample lessons created
✅ Sample assignment created
✅ Sample quiz with questions created
✅ Student enrolled in course
🎉 Seed completed successfully!

📝 Test Credentials:
Admin: admin@lms.com / admin123
Teacher: teacher@lms.com / teacher123
Student: student@lms.com / student123
```

### Step 6: Verify Setup

#### 6.1 Check Prisma Studio
```powershell
npm run prisma:studio
```
- This opens a visual database browser at `http://localhost:5555`
- You should see all your tables with the seeded data
- Verify:
  - 3 users in the `User` table
  - 1 course in the `Course` table
  - 2 lessons in the `Lesson` table
  - 1 assignment in the `Assignment` table
  - 1 quiz with 2 questions
  - 1 enrollment

#### 6.2 Check NeonDB Dashboard
1. Go back to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click on **"Tables"** or **"SQL Editor"**
4. You should see all 9 tables created:
   - users
   - courses
   - lessons
   - assignments
   - assignment_submissions
   - quizzes
   - questions
   - quiz_attempts
   - enrollments
   - grades
   - notifications

### Step 7: Start Development Server

```powershell
npm run dev
```

Your app should start at: **http://localhost:3000**

---

## ✅ Verification Checklist

Mark each item as you complete it:

- [ ] NeonDB account created
- [ ] Database project created
- [ ] Connection string copied
- [ ] `.env` file updated with `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET` generated and added to `.env`
- [ ] `npm run prisma:generate` executed successfully
- [ ] `npm run prisma:migrate` executed successfully (migration created)
- [ ] `npm run prisma:seed` executed successfully (3 users, 1 course, etc.)
- [ ] Prisma Studio opened and data verified
- [ ] NeonDB dashboard shows all 9 tables
- [ ] Development server started with `npm run dev`

---

## 🚨 Troubleshooting

### Issue: "Can't reach database server"
**Solution**: 
- Check your internet connection
- Verify the connection string is correct
- Make sure NeonDB project is active (not suspended)
- Check if there are any typos in `.env`

### Issue: "P1001: Can't reach database server at..."
**Solution**:
- The connection string might be wrong
- Copy it again from NeonDB dashboard
- Ensure `?sslmode=require` is at the end

### Issue: "prisma command not found"
**Solution**:
```powershell
npm install
```

### Issue: Migration fails
**Solution**:
```powershell
# Reset and try again
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

### Issue: Seed script fails
**Solution**:
- Check if tables were created: `npm run prisma:studio`
- If tables exist but seed fails, manually delete all data in Prisma Studio
- Run seed again: `npm run prisma:seed`

### Issue: "Module not found: Can't resolve 'bcryptjs'"
**Solution**:
```powershell
npm install bcryptjs @types/bcryptjs
```

---

## 📚 Useful Commands

```powershell
# View migration status
npx prisma migrate status

# Reset database (deletes all data!)
npx prisma migrate reset

# Open Prisma Studio
npm run prisma:studio

# Generate Prisma Client after schema changes
npm run prisma:generate

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate

# View Prisma help
npx prisma --help
```

---

## 🎉 Success!

If all steps completed successfully, you now have:

✅ A fully configured PostgreSQL database on NeonDB  
✅ All 9 tables created with proper relationships  
✅ Sample data (3 users, 1 course, lessons, assignment, quiz)  
✅ Prisma ORM connected and ready  
✅ NextAuth.js configured for authentication  
✅ Development environment ready  

**You can now proceed to Phase 10: Base API Structure!**

---

## 🔐 Important Notes

1. **Never commit `.env`** - It contains sensitive credentials
2. **Keep your connection string secure** - Don't share it publicly
3. **Use different databases** for development, staging, and production
4. **Back up your data** regularly (NeonDB has automatic backups on paid plans)
5. **Monitor your database usage** in the NeonDB dashboard

---

## 📖 Additional Resources

- [NeonDB Getting Started](https://neon.tech/docs/get-started-with-neon)
- [Prisma with NeonDB](https://www.prisma.io/docs/guides/database/neondb)
- [NeonDB Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Troubleshooting Prisma](https://www.prisma.io/docs/guides/database/troubleshooting)

---

**Need help? Check:**
- `SETUP_GUIDE.md` - Complete setup documentation
- `DATABASE_SCHEMA.md` - Database structure and relationships
- `PRISMA_REFERENCE.md` - Prisma query examples
- `PROJECT_PROGRESS.md` - Overall project progress

---

Good luck! 🚀
