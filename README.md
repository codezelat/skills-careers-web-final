# Skills Careers

<div align="center">
  
[![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.12.0-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**A modern, full-stack job portal connecting job seekers with recruiters**

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [API Docs](#api-documentation) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Roles & Permissions](#user-roles--permissions)
- [Core Functionality](#core-functionality)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Skills Careers** is a comprehensive job portal platform built with Next.js 15, designed to streamline the hiring process by connecting talented job seekers with top recruiters. The platform offers a seamless experience with role-based access control, real-time job search, application tracking, and an intuitive admin portal.

### Key Highlights

- 🔐 **Multi-role Authentication**: Job Seekers, Recruiters, and Admins with distinct permissions
- 🔍 **Advanced Job Search**: Real-time search with filters (location, category, experience, job type)
- 📊 **Analytics Dashboard**: Comprehensive insights for admins and recruiters
- 📄 **CV Management**: Automated CV generation with PDF export
- 🌐 **OAuth Integration**: Google & LinkedIn authentication
- 📱 **Responsive Design**: Mobile-first, optimized for all devices
- 🚀 **Performance**: Server-side rendering, optimized images, and cached connections

---

## ✨ Features

### For Job Seekers

- ✅ Create and manage professional profiles
- ✅ Upload and manage CVs with automatic PDF generation
- ✅ Search and filter jobs by location, category, experience
- ✅ Apply to jobs with one-click application
- ✅ Track application status (Pending, Approved, Declined)
- ✅ Receive application notifications
- ✅ View recruiter company profiles
- ✅ Bookmark favorite jobs

### For Recruiters

- ✅ Create company profiles with branding
- ✅ Post and manage job listings
- ✅ Publish/unpublish jobs
- ✅ View and manage applications
- ✅ Filter candidates by status
- ✅ Mark candidates as favorites
- ✅ Track hiring metrics and analytics
- ✅ Manage company information
- ✅ Access candidate profiles and CVs

### For Administrators

- ✅ Complete platform oversight dashboard
- ✅ Manage users, recruiters, and job seekers
- ✅ Moderate job postings
- ✅ View platform analytics (jobs, applications, users)
- ✅ Manage press releases and announcements
- ✅ Handle inquiries and support tickets
- ✅ Restrict/unrestrict accounts
- ✅ Create new admin accounts

### Platform Features

- 🔍 **Smart Search**: Real-time job search with MongoDB regex queries
- 📧 **Email Notifications**: Automated emails via Nodemailer
- 🗺️ **Interactive Maps**: Location-based job viewing with Leaflet
- 📊 **Data Visualization**: Charts and analytics with Chart.js
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 🔒 **Security**: Bcrypt password hashing, secure sessions
- 🌐 **Internationalization**: Multi-language support ready
- ♿ **Accessibility**: WCAG compliant components

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.7 (App Router)
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: React Icons, FontAwesome
- **Forms**: React Hook Form (via custom components)
- **Maps**: React Leaflet 4.2.1
- **Charts**: React Chart.js 2 5.3.0
- **Animations**: Swiper 11.2.0
- **UI Components**: Material-UI 6.1.7
- **Notifications**: SweetAlert2 11.15.10

### Backend

- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB 6.12.0
- **ODM**: Native MongoDB Driver
- **Authentication**: NextAuth.js 4.24.10
- **Password Hashing**: Bcrypt.js 2.4.3
- **Email**: Nodemailer 7.0.11
- **File Storage**: Cloudinary 2.5.1
- **PDF Generation**: jsPDF 3.0.0

### DevOps & Tools

- **Deployment**: Netlify (with Next.js plugin)
- **Version Control**: Git
- **Linting**: ESLint 8
- **Package Manager**: npm
- **Environment**: dotenv 16.4.7

### Optional/Future

- **Search Engine**: Elasticsearch (setup scripts included)

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Job Seeker│  │ Recruiter│  │  Admin   │  │  Public  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │
        ┌─────────────▼──────────────┐
        │   Next.js Frontend (SSR)   │
        │  - App Router               │
        │  - React Components         │
        │  - Tailwind CSS             │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │   API Routes (Backend)     │
        │  - /api/auth/*             │
        │  - /api/job/*              │
        │  - /api/users/*            │
        │  - /api/applications/*     │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    Authentication Layer    │
        │  - NextAuth.js             │
        │  - JWT Sessions            │
        │  - OAuth Providers         │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    Business Logic Layer    │
        │  - /lib/* utilities        │
        │  - Data validation         │
        │  - PDF Generation          │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    Data Access Layer       │
        │  - MongoDB Connection      │
        │  - Cached Connections      │
        │  - Query Optimization      │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    External Services       │
        │  - Cloudinary (Images)     │
        │  - Nodemailer (Email)      │
        │  - OAuth Providers         │
        └────────────────────────────┘
```

### Database Design

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    Users    │       │  Recruiters  │       │ Job Seekers │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ _id (PK)    │◄──┐   │ _id (PK)     │   ┌──►│ _id (PK)    │
│ firstName   │   │   │ userId (FK)  │◄──┘   │ userId (FK) │
│ lastName    │   └───┤ recruiterName│       │ email       │
│ email       │       │ category     │       │ experience  │
│ password    │       │ email        │       │ education   │
│ role        │       │ contactNum   │       │ skills      │
│ profileImg  │       │ logo         │       └─────────────┘
└─────────────┘       └──────────────┘              │
                            │                       │
                            │                       │
                      ┌─────▼────────┐       ┌──────▼──────┐
                      │     Jobs     │       │Applications │
                      ├──────────────┤       ├─────────────┤
                      │ _id (PK)     │◄──────┤ jobId (FK)  │
                      │ recruiterId  │       │ jobseekerId │
                      │ jobTitle     │       │ status      │
                      │ location     │       │ appliedAt   │
                      │ category     │       │ isFavourite │
                      │ experience   │       └─────────────┘
                      │ jobTypes     │
                      │ isPublished  │
                      └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB** (v6.x or higher)
- **Git**

Optional:

- **Elasticsearch** (v8.x) - for advanced search features

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/skills-careers-web-final.git
cd skills-careers-web-final
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials (see [Environment Variables](#environment-variables) section)

4. **Set up MongoDB**

Ensure MongoDB is running locally or have a MongoDB Atlas connection string ready.

```bash
# For local MongoDB
mongod --dbpath /path/to/data/directory

# Or use MongoDB Atlas connection string in .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/skillscareers
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillscareers

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
# Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# LinkedIn OAuth (Optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password

# Optional: Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200
ELASTIC_CLOUD_ID=your_elastic_cloud_id
ELASTIC_API_KEY=your_elastic_api_key

# Optional: Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Running the Application

#### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

#### Linting

```bash
npm run lint
```

### Initial Setup

1. **Create Admin Account**

Once the app is running, you can create an admin account through the API:

```bash
POST /api/auth/adminsignup
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@skillscareers.com",
  "contactNumber": "+1234567890",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

2. **Configure OAuth (Optional)**

- Set up Google OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
- Set up LinkedIn OAuth credentials in [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
- Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/linkedin`

3. **Set up Elasticsearch (Optional)**

```bash
# Run the setup script
node scripts/setup-elasticsearch.js

# Sync data
node scripts/sync-elasticsearch.js
```

---

## 📁 Project Structure

```
skills-careers-web-final/
├── app/                          # Next.js App Router pages
│   ├── (signup)/                 # Auth group routes
│   │   ├── jobseekersignup/     # Job seeker registration
│   │   └── recruitersignup/     # Recruiter registration
│   ├── Portal/                   # Dashboard (protected routes)
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── annoucements/        # Announcements management
│   │   ├── bookingRecord/       # Booking/ticket records
│   │   ├── candidates/          # Candidate management
│   │   ├── dashboard/           # Main dashboard
│   │   ├── inquiries/           # Support inquiries
│   │   ├── jobApplications/     # Application management
│   │   ├── jobsAdmin/           # Admin job management
│   │   ├── jobsRecruiter/       # Recruiter job management
│   │   ├── pressrelease/        # Press release management
│   │   ├── profile/             # User profiles
│   │   ├── recruiter/           # Recruiter management
│   │   ├── settings/            # User settings
│   │   └── tickets/             # Ticket system
│   ├── api/                     # API routes
│   │   ├── analytics/           # Analytics endpoints
│   │   ├── announcement/        # Announcement CRUD
│   │   ├── applications/        # Application endpoints
│   │   ├── auth/                # Authentication
│   │   │   ├── [...nextauth]/  # NextAuth handler
│   │   │   ├── adminsignup/    # Admin registration
│   │   │   ├── jobseekersignup/# Job seeker registration
│   │   │   ├── recruitersignup/# Recruiter registration
│   │   │   ├── forgotPassword/ # Password reset request
│   │   │   └── resetPassword/  # Password reset
│   │   ├── job/                # Job CRUD operations
│   │   ├── jobapplication/     # Job application CRUD
│   │   ├── jobseekerdetails/   # Job seeker profile
│   │   ├── recruiterdetails/   # Recruiter profile
│   │   ├── users/              # User management
│   │   └── ...                 # Other endpoints
│   ├── about/                  # About page
│   ├── applications/           # Public applications view
│   ├── categoryPage/           # Job categories
│   ├── contact/                # Contact page
│   ├── dashboard/              # Recruiter dashboard (legacy)
│   ├── jobs/                   # Job listings
│   │   └── [jobid]/           # Job detail page
│   ├── jobseeker/             # Job seeker profiles
│   │   └── [jobseekerid]/     # Job seeker detail
│   ├── login/                 # Login page
│   ├── pressRelease/          # Press releases
│   ├── profile/               # User profile
│   │   └── edit/             # Profile editing
│   ├── recruiters/            # Recruiter directory
│   │   └── [recruiterid]/    # Recruiter profile
│   ├── register/              # Registration page
│   ├── startingpage/          # Landing page
│   ├── tickets/               # Public tickets
│   ├── layout.js              # Root layout
│   ├── page.js                # Home page
│   └── Providers.js           # Context providers
│
├── components/                 # Reusable React components
│   ├── PortalComponents/      # Portal-specific components
│   │   ├── PortalHeader.js   # Dashboard header
│   │   ├── PortalSidebar.js  # Dashboard sidebar
│   │   ├── dashboardStats.js # Statistics cards
│   │   ├── dashboardCharts.js# Analytics charts
│   │   └── ...               # Other portal components
│   ├── StartingPageComponents/# Landing page components
│   ├── Button.js              # Reusable button
│   ├── CategoryComponent.js   # Category display
│   ├── Footer.js              # Site footer
│   ├── jobCard.js             # Job listing card
│   ├── jobForm.js             # Job posting form
│   ├── jobSearch.js           # Job search component
│   ├── navBar.js              # Navigation bar
│   ├── newsletter.js          # Newsletter signup
│   ├── PhoneInput.js          # Phone number input
│   └── ...                    # Other components
│
├── lib/                       # Utility libraries
│   ├── auth.js               # Authentication helpers
│   ├── authOptions.js        # NextAuth configuration
│   ├── categories.js         # Job categories data
│   ├── cloudinary.js         # Cloudinary integration
│   ├── countries.js          # Countries data
│   ├── db.js                 # MongoDB connection
│   ├── elasticsearch-utils.js# Elasticsearch utilities
│   ├── faq.js                # FAQ data
│   ├── GenerateCV.js         # PDF CV generation
│   ├── handlers.js           # Event handlers
│   ├── mailer.js             # Email sending
│   ├── mongodb.js            # MongoDB helpers
│   ├── news.js               # News data
│   └── successStory.js       # Success stories data
│
├── public/                    # Static assets
│   ├── catagory/             # Category images
│   ├── images/               # General images
│   ├── landing/              # Landing page assets
│   ├── portal-dashboard/     # Dashboard assets
│   └── sidebar/              # Sidebar icons
│
├── scripts/                   # Utility scripts
│   ├── setup-elasticsearch.js # ES index setup
│   └── sync-elasticsearch.js  # ES data sync
│
├── data/                      # Static data files
│   ├── jobCategories.json    # Job categories list
│   └── jobExperiences.json   # Experience levels
│
├── .env.example              # Environment variables template
├── .env.local                # Local environment variables (gitignored)
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── jsconfig.json             # JavaScript configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

---

## 👥 User Roles & Permissions

### Role Hierarchy

```
Admin (Full Access)
  ├── Platform Management
  ├── User Management
  ├── Content Moderation
  └── Analytics Access

Recruiter
  ├── Company Profile Management
  ├── Job Posting & Management
  ├── Application Management
  ├── Candidate Viewing
  └── Recruiter Analytics

Job Seeker
  ├── Profile Management
  ├── Job Search & Application
  ├── Application Tracking
  └── CV Management
```

### Access Control Matrix

| Feature                   | Admin | Recruiter | Job Seeker | Public |
| ------------------------- | :---: | :-------: | :--------: | :----: |
| View Jobs                 |  ✅   |    ✅     |     ✅     |   ✅   |
| Apply to Jobs             |  ❌   |    ❌     |     ✅     |   ❌   |
| Post Jobs                 |  ✅   |    ✅     |     ❌     |   ❌   |
| Manage Applications       |  ✅   |    ✅     |     ❌     |   ❌   |
| View Candidate Profiles   |  ✅   |    ✅     |     ❌     |   ❌   |
| Edit Own Profile          |  ✅   |    ✅     |     ✅     |   ❌   |
| Platform Analytics        |  ✅   |    ❌     |     ❌     |   ❌   |
| Recruiter Analytics       |  ✅   |    ✅     |     ❌     |   ❌   |
| User Management           |  ✅   |    ❌     |     ❌     |   ❌   |
| Content Moderation        |  ✅   |    ❌     |     ❌     |   ❌   |
| Press Release Management  |  ✅   |    ❌     |     ❌     |   ❌   |
| Support Ticket Management |  ✅   |    ✅     |     ✅     |   ❌   |

---

## 🔧 Core Functionality

### Authentication Flow

```
User Registration
  ├── Job Seeker → Create User + Job Seeker Profile
  ├── Recruiter → Create User + Recruiter Profile
  └── Admin → Create User + Admin Profile (admin only)

Login Methods
  ├── Email/Password (Credentials)
  ├── Google OAuth
  └── LinkedIn OAuth

Session Management
  ├── JWT-based sessions
  ├── Secure HTTP-only cookies
  └── Role-based access control
```

### Job Application Workflow

```
1. Job Seeker browses jobs
   ↓
2. Applies to job with one click
   ↓
3. Application created with status: "Pending"
   ↓
4. Recruiter receives application notification
   ↓
5. Recruiter reviews application
   ↓
6. Recruiter updates status:
   - Approve → Status: "Approved"
   - Decline → Status: "Declined"
   - Favorite → isFavourited: true
   ↓
7. Job Seeker receives notification
   ↓
8. Job Seeker can track all applications
```

### Job Posting Workflow

```
1. Recruiter creates job posting
   ↓
2. Job saved with isPublished: false
   ↓
3. Recruiter reviews/edits job
   ↓
4. Recruiter publishes job
   ↓
5. Job appears in public listings
   ↓
6. Admin can moderate/unpublish
   ↓
7. Recruiter can unpublish/edit/delete
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register Job Seeker

```http
POST /api/auth/jobseekersignup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "contactNumber": "+1234567890",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}

Response: 201 Created
{
  "message": "User and jobseeker created!"
}
```

#### Register Recruiter

```http
POST /api/auth/recruitersignup
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "recruiterName": "Tech Corp",
  "category": "Information Technology",
  "employeeRange": "50-100",
  "email": "jane@techcorp.com",
  "contactNumber": "+1234567890",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}

Response: 201 Created
{
  "message": "User and recruiter created!"
}
```

#### Login

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response: 200 OK
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "jobseeker"
  }
}
```

### Job Endpoints

#### Get All Jobs

```http
GET /api/job/all?showAll=false&recruiterId=123

Response: 200 OK
{
  "jobs": [...],
  "count": 42
}
```

#### Get Single Job

```http
GET /api/job/[id]

Response: 200 OK
{
  "job": {
    "_id": "...",
    "jobTitle": "Software Engineer",
    "location": "New York",
    ...
  }
}
```

#### Create Job

```http
POST /api/job/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobTitle": "Senior Developer",
  "location": "San Francisco",
  "jobCategory": "IT & Software",
  "jobExperience": "5-7 Years",
  "jobTypes": ["Full-Time", "Remote"],
  "jobDescription": "...",
  "keyResponsibilities": "...",
  "shortDescription": "..."
}

Response: 201 Created
{
  "message": "Job created successfully",
  "jobId": "..."
}
```

#### Update Job

```http
PUT /api/job/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "...",
  "jobTitle": "Updated Title",
  ...
}

Response: 200 OK
{
  "message": "Job updated successfully"
}
```

#### Publish/Unpublish Job

```http
PATCH /api/job/[id]/publish
Authorization: Bearer <token>
Content-Type: application/json

{
  "isPublished": true
}

Response: 200 OK
{
  "message": "Job published successfully"
}
```

#### Search Jobs

```http
GET /api/job/search?query=developer

Response: 200 OK
{
  "jobs": [...]
}
```

#### Filter Jobs

```http
GET /api/job/filter?jobCategory=IT&jobExperience=3-5%20Years

Response: 200 OK
{
  "jobs": [...]
}
```

### Application Endpoints

#### Apply to Job

```http
POST /api/jobapplication/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "...",
  "jobseekerId": "..."
}

Response: 201 Created
{
  "message": "Application submitted successfully",
  "applicationId": "..."
}
```

#### Get Applications

```http
GET /api/jobapplication/all?recruiterId=123

Response: 200 OK
{
  "applications": [...],
  "count": 15
}
```

#### Update Application Status

```http
PUT /api/jobapplication/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": "...",
  "status": "Approved",
  "isFavourited": true
}

Response: 200 OK
{
  "message": "Application updated successfully"
}
```

### User Management Endpoints

#### Get User Profile

```http
GET /api/users/get?id=123

Response: 200 OK
{
  "user": {
    "_id": "...",
    "firstName": "John",
    "email": "john@example.com",
    "role": "jobseeker"
  }
}
```

#### Update User

```http
PUT /api/users/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "...",
  "firstName": "John",
  "lastName": "Updated"
}

Response: 200 OK
{
  "message": "User updated successfully"
}
```

#### Upload Profile Image

```http
POST /api/users/uploadimage
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>

Response: 200 OK
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://..."
}
```

---

## 🗄️ Database Schema

### Collections

#### users

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  profileImage: String (URL),
  role: String ("admin" | "recruiter" | "jobseeker"),
  createdAt: Date
}
```

#### jobseekers

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  email: String,
  contactNumber: String,
  dob: Date,
  nationality: String,
  languages: [String],
  address: String,
  age: Number,
  maritalStatus: String,
  religion: String,
  ethnicity: String,
  coverImage: String,
  createdAt: Date
}
```

#### recruiters

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  recruiterName: String,
  category: String,
  email: String,
  employeeRange: String,
  contactNumber: String,
  website: String,
  companyDescription: String,
  industry: String,
  location: String,
  logo: String (URL),
  coverImage: String,
  facebook: String,
  instagram: String,
  linkedin: String,
  x: String,
  createdAt: Date
}
```

#### jobs

```javascript
{
  _id: ObjectId,
  recruiterId: ObjectId (ref: recruiters),
  jobTitle: String (indexed),
  location: String (indexed),
  jobCategory: String (indexed),
  jobExperience: String,
  jobTypes: [String],
  jobDescription: String (text),
  keyResponsibilities: String (text),
  shortDescription: String,
  isPublished: Boolean (default: false, indexed),
  createdAt: Date,
  updatedAt: Date
}
```

#### jobapplications

```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref: jobs),
  jobseekerId: ObjectId (ref: jobseekers),
  recruiterId: ObjectId (ref: recruiters),
  status: String ("Pending" | "Approved" | "Declined"),
  isFavourited: Boolean (default: false),
  appliedAt: Date,
  updatedAt: Date
}
```

#### experiences

```javascript
{
  _id: ObjectId,
  jobseekerId: ObjectId (ref: jobseekers),
  jobTitle: String,
  companyName: String,
  country: String,
  city: String,
  startDate: Date,
  endDate: Date,
  description: String
}
```

#### educations

```javascript
{
  _id: ObjectId,
  jobseekerId: ObjectId (ref: jobseekers),
  institutionName: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  description: String
}
```

#### certifications

```javascript
{
  _id: ObjectId,
  jobseekerId: ObjectId (ref: jobseekers),
  certificationName: String,
  issuingOrganization: String,
  receivedDate: Date,
  expiryDate: Date,
  credentialId: String
}
```

#### admins

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  firstName: String,
  lastName: String,
  contactNumber: String,
  email: String,
  password: String (hashed),
  profileImage: String,
  createdAt: Date
}
```

#### announcements

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### inquiries

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String,
  createdAt: Date
}
```

#### pressreleases

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  image: String,
  createdAt: Date
}
```

#### tickets

```javascript
{
  _id: ObjectId,
  recruiterId: ObjectId (ref: recruiters),
  title: String,
  description: String,
  location: String,
  date: Date,
  time: String,
  capacity: Number,
  createdAt: Date
}
```

#### ticketenrollments

```javascript
{
  _id: ObjectId,
  ticketId: ObjectId (ref: tickets),
  jobseekerId: ObjectId (ref: jobseekers),
  enrolledAt: Date
}
```

### Indexes

```javascript
// Performance optimization indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.jobs.createIndex({ isPublished: 1, createdAt: -1 });
db.jobs.createIndex({
  jobTitle: "text",
  jobCategory: "text",
  location: "text",
});
db.jobapplications.createIndex({ jobId: 1, jobseekerId: 1 }, { unique: true });
db.jobapplications.createIndex({ recruiterId: 1, status: 1 });
```

---

## 🚢 Deployment

Netlify configuration has been removed; use Vercel or Docker for current deployments.

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t skills-careers .
docker run -p 3000:3000 --env-file .env.local skills-careers
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication

- [ ] Job seeker registration
- [ ] Recruiter registration
- [ ] Login with credentials
- [ ] Google OAuth login
- [ ] LinkedIn OAuth login
- [ ] Password reset flow
- [ ] Session persistence

#### Job Seeker Features

- [ ] Profile creation/editing
- [ ] CV upload and generation
- [ ] Job search and filtering
- [ ] Job application submission
- [ ] Application tracking
- [ ] Recruiter profile viewing

#### Recruiter Features

- [ ] Company profile setup
- [ ] Job posting creation
- [ ] Job publishing/unpublishing
- [ ] Application management
- [ ] Candidate profile viewing
- [ ] Analytics dashboard

#### Admin Features

- [ ] User management
- [ ] Job moderation
- [ ] Platform analytics
- [ ] Press release management
- [ ] Announcement management
- [ ] Support ticket management

### Performance Testing

```bash
# Install testing tools
npm install -g lighthouse

# Run Lighthouse audit
lighthouse http://localhost:3000 --view
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow ESLint configuration
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

### Pull Request Guidelines

- Describe your changes clearly
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors & Acknowledgments

### Development Team

- **Lead Developer**: [CodeZela Technologies](https://codezela.com)
- **Contributors**: [Diluksha Namal](https://github.com/dilukshanamal),
  [Shamal Rajapaksha](https://github.com/shamalrajapaksha)

### Special Thanks

- Next.js team for the amazing framework
- MongoDB for reliable database solutions
- All open-source contributors

---

## 📞 Support & Contact

- **Documentation**: [Wiki](https://github.com/yourusername/skills-careers/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/skills-careers/issues)
- **Email**: support@skillscareers.lk
- **Website**: [skillscareers.lk](https://skillscareers.lk)

---

## 🗺️ Roadmap

### Current Version (v1.0.0)

- ✅ Core authentication system
- ✅ Job posting and management
- ✅ Application tracking
- ✅ Admin dashboard
- ✅ CV generation

### Upcoming Features (v1.1.0)

- 🔄 Real-time notifications
- 🔄 Advanced analytics
- 🔄 AI-powered job recommendations

### Future Enhancements

- 📅 Calendar integration
- 📅 Skills assessment tests
- 📅 Company reviews
- 📅 Dark mode

---

<div align="center">

**Made with ❤️ by the Skills Careers Team**

[⬆ Back to Top](#skills-careers)

</div>
