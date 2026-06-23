# Skills Careers -- Issues Tracker

> Living document tracking all identified issues, fixes applied, and remaining work.
> Last updated: 2026-06-23

---

## Fixed Issues

### #1 -- Hardcoded Cloudinary credentials (Security)
**File:** `lib/cloudinary.js`
**Severity:** Critical
**Status:** Fixed

Cloud name and API key were hardcoded directly in source code. Moved all three values to environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

**Action required:** Ensure these env vars are set in Vercel:
```
CLOUDINARY_CLOUD_NAME=dbeoiqgch
CLOUDINARY_API_KEY=315287362367284
CLOUDINARY_API_SECRET=<your_secret>
```

---

### #3 -- Regex injection / ReDoS in job search (Security)
**File:** `app/api/job/search/route.js`
**Severity:** Critical
**Status:** Fixed

User input was passed directly into `new RegExp(query, "i")` without escaping. A crafted regex pattern could cause ReDoS (Regular Expression Denial of Service). Now uses the existing `escapeRegex()` utility from `lib/escapeRegex.js` to sanitize input before building the regex.

---

### #5 -- `window.location.reload()` in job form (Bug)
**File:** `components/jobForm.js`
**Severity:** Medium
**Status:** Fixed

After creating a job, the code called `window.location.reload()` which does a full page reload, losing all React state. Removed the reload; the `onClose()` callback now handles cleanup. Parent components should use state updates or `router.refresh()` to reflect new data.

---

### #6 -- Contact form does nothing (Bug)
**File:** `components/ContactPortal.js`
**Severity:** High
**Status:** Fixed

The contact form had no state management, no `onSubmit` handler, and the submit button was a `<Link>` to a non-existent `/contact-us` page. Now fully wired to `POST /api/inquiry/add` with controlled inputs, loading state, and SweetAlert2 success/error feedback. Submissions go to the inquiries collection as "guest" role entries.

---

### #7 -- Newsletter Content-Type header (Bug)
**File:** `components/newsletter.js`
**Severity:** Low
**Status:** Fixed

Header was `"Content-Type": "application/JSON"` (capital J). Some servers may not recognize this. Fixed to `"application/json"`.

---

### #8, #11, #12 -- Unused imports (Code Quality)
**Files:** `app/about/page.js`, `app/jobs/page.js`, `app/recruiters/page.js`, `app/contact/page.js`
**Severity:** Low
**Status:** Fixed

Several pages imported `NavBar` and/or `Footer` but never used them (the root layout already renders these via wrapper components). All unused imports removed.

---

### #9 -- Broken sustainability policy link (Bug)
**File:** `app/about/page.js`
**Severity:** Medium
**Status:** Fixed

"Our Sustainability Policy" was a plain `<button>` with no navigation. Converted to `<a href="/sustainabilitypolicy">` so it actually links to the policy page.

---

### #10 -- Non-functional search button on tickets page (UX)
**File:** `app/tickets/page.js`
**Severity:** Low
**Status:** Fixed

The "Search" button in the tickets search bar was purely decorative. Filtering already happens in real-time via `useEffect` on input change. Removed the misleading button to avoid user confusion.

---

### #13 -- Empty `applicationsCard.js` file (Code Quality)
**File:** `components/PortalComponents/applicationsCard.js`
**Severity:** Low
**Status:** Fixed (deleted)

File existed but was 0 bytes and was not imported anywhere. Safely deleted.

---

### #19 -- Commented-out code throughout (Code Quality)
**Files:** `components/navBar.js`, `app/startingpage/page.js`, `lib/elasticsearch-utils.js`
**Severity:** Low
**Status:** Fixed

Removed approximately 200 lines of commented-out old code:
- `navBar.js`: ~170 lines of old navbar HTML/JSX
- `startingpage/page.js`: ~40 lines of commented-out country selector
- `elasticsearch-utils.js`: ~25 lines of commented-out jobapplications index config

---

### #21 -- Typos in user-facing text (UX)
**Files:** `app/about/page.js`, `app/contact/page.js`, `lib/mailer.js`
**Severity:** Low
**Status:** Fixed

| File | Typo | Fix |
|------|------|-----|
| about/page.js | "globaly" | "globally" |
| about/page.js | "recruitement" | "recruitment" |
| about/page.js | "foresting" | "fostering" |
| contact/page.js | "hear to help" | "here to help" |
| contact/page.js | Missing spaces after commas | Added spaces |
| mailer.js | "sucessfully" | "successfully" |

---

### #22 -- Debug `console.log` in production (Code Quality)
**Files:** 10 component files across `components/` and `components/PortalComponents/`
**Severity:** Low
**Status:** Fixed

Removed debug `console.log` statements from:
- `newsletter.js` (2)
- `PressReleaseSection.js` (1)
- `JobSearchDropdown.js` (2)
- `portalApplicationCard.js` (1)
- `dashboardDataList.js` (2)
- `dashboardStats.js` (3)
- `ticketsAdminPage.js` (1)
- `bookingAdminPage.js` (1)
- `candidateProfile.js` (5)
- `recruiterProfile.js` (4)

Kept `console.error` statements in catch blocks for production error tracking.

---

### #24 -- Dead Netlify dependency (Code Quality)
**File:** `package.json`
**Severity:** Low
**Status:** Fixed

`@netlify/plugin-nextjs` was still in dependencies despite the project deploying on Vercel. Removed.

---

### #25 -- Loading spinner uses wrong shade (UX)
**File:** `app/loading.js`
**Severity:** Low
**Status:** Fixed

Bouncing dots used `bg-blue-700` which is a different shade than the brand navy `#001571`. Changed to `bg-[#001571]` for brand consistency. Also removed a commented-out spinner alternative.

---

### #26 -- No custom 404 page (UX)
**File:** `app/not-found.js` (new)
**Severity:** Medium
**Status:** Fixed

Created a custom 404 page with brand styling (`#001571` heading, matching button style) and a "Go Back Home" link.

---

### #27 -- No SEO meta descriptions (SEO)
**Files:** `app/layout.js`, `app/about/page.js`, `app/jobs/page.js`, `app/recruiters/page.js`
**Severity:** Medium
**Status:** Fixed

- Updated root layout metadata: fixed title capitalization, replaced "Generated by create next app" with real description
- Added page-specific `metadata` exports to about, jobs, and recruiters pages

Note: Client component pages (`contact`, `tickets`, `login`, `register`) cannot export metadata directly. To add metadata to those pages, create a `layout.js` or `page.js` wrapper in each directory that exports metadata and renders the client component.

---

### #28 -- `suppressHydrationWarning` on body tag
**File:** `app/layout.js`
**Severity:** None
**Status:** No change needed

This is the standard recommended pattern for Next.js + NextAuth. Browser extensions and third-party scripts can inject attributes onto `<body>` that cause false hydration warnings. Suppressing on the body tag is the correct approach.

---

## Remaining Issues

### #2 -- No input validation on API routes (Security)
**Severity:** Critical
**Risk to fix:** Medium

Most API routes (`/api/job/add`, `/api/jobapplication/add`, `/api/inquiry/add`, etc.) accept raw JSON body without validation. No length limits, no type checking, no XSS sanitization on user-submitted text fields.

**Recommended approach:**
- Add a shared validation utility (e.g., using Zod or a lightweight custom validator)
- Validate and sanitize all string inputs (trim, max length, strip HTML)
- Validate ObjectId fields before querying MongoDB
- Return 400 with descriptive error messages for invalid input

**Affected routes:** All POST/PUT routes in `app/api/`

---

### #4 -- No CSRF protection on custom API routes (Security)
**Severity:** High
**Risk to fix:** Medium

POST/PUT/DELETE routes rely only on NextAuth session cookies. NextAuth provides CSRF protection for its own endpoints, but custom API routes (job creation, application submission, profile updates, etc.) have no CSRF tokens.

**Recommended approach:**
- Implement a CSRF token middleware or use `next-csrf` package
- Alternatively, verify the `Origin` header on all state-changing requests
- Consider using `SameSite=strict` cookies

---

### #14 -- No pagination on recruiter batch API (Performance)
**Severity:** Low
**Risk to fix:** Low

`/api/recruiterdetails/batch` fetches all matching recruiters without a limit. If many IDs are sent in a single request, this could be slow.

**Recommended approach:**
- Add a max limit (e.g., 100 IDs per request)
- Return 400 if the IDs array exceeds the limit

---

### #15 -- Session callback hits DB on every request (Performance)
**Severity:** Medium
**Risk to fix:** Medium

The `session` callback in `lib/authOptions.js` queries `users.findOne()` on every session check to get a fresh profile image. This adds a database roundtrip to every authenticated request.

**Recommended approach:**
- Store profile image URL in the JWT token
- Only refresh from DB on explicit profile update (via `trigger === "update"`)
- Use the `jwt` callback's existing update trigger for profile image changes

---

### #16 -- Duplicate recruiter fetching logic (Code Quality)
**Severity:** Low
**Risk to fix:** Low (but touches many files)

The pattern of "fetch data, extract recruiter IDs, batch fetch recruiters, merge results" is copy-pasted across 6+ files:
- `components/StartingPageComponents/FetchingJobs.js`
- `components/StartingPageComponents/JobsClient.js`
- `components/JobSearchDropdown.js`
- `components/jobSearch.js`
- `app/tickets/page.js`
- `components/PortalComponents/PortalHeader.js`

**Recommended approach:**
- Create a custom hook `useJobsWithRecruiters(fetchUrl)` or a utility function
- Or create a shared API endpoint that returns jobs already enriched with recruiter data
- The existing `lib/recruiterCache.js` attempts this but is not used by any component

---

### #17 -- Two MongoDB connection utilities (Code Quality)
**Severity:** Low
**Risk to fix:** Medium

Two separate MongoDB connection utilities coexist:
- `lib/db.js` -- `connectToDatabase()` with connection pooling, ping verification, and reconnection logic
- `lib/mongodb.js` -- `clientPromise` with simpler caching, used by NextAuth

Some API routes use `clientPromise`, others use `connectToDatabase()`. This inconsistency can lead to connection pool confusion.

**Recommended approach:**
- Standardize on one utility (likely `clientPromise` since it is the NextAuth pattern)
- Migrate all `connectToDatabase()` calls to use `clientPromise`
- Or keep both but document when to use each

---

### #18 -- Large static images not optimized (Performance)
**Severity:** Low
**Risk to fix:** Low

Several static images in `public/` are oversized:
- `cover1.png` -- 720KB
- `recruiterbg.png` -- 720KB
- `newsImage.png` -- 412KB
- `madhusha_sanjeewa.jpg` -- 64KB
- `vishma_bandara.jpg` -- 435KB
- `wathsara_umesh.jpg` -- 33KB

Some pages also use `<img>` tags instead of `next/image`, missing automatic optimization.

**Recommended approach:**
- Convert PNGs to WebP (significant size reduction)
- Use `next/image` consistently instead of raw `<img>` tags
- Add `loading="lazy"` to below-the-fold images

---

### #20 -- Inconsistent file naming conventions (Code Quality)
**Severity:** Low
**Risk to fix:** HIGH (breaking changes on live site)

Mix of PascalCase and camelCase for component files:
- PascalCase: `Button.js`, `Footer.js`, `CategoryComponent.js`
- camelCase: `jobCard.js`, `navBar.js`, `jobSearch.js`

Also mismatched export names:
- `PortalSidebar.js` exports `SideMenuSection`
- `jobForm.js` exports `CreateJobPost`

**Recommended approach:**
- Do NOT rename files on a live site (breaks all imports)
- If desired, do it in a dedicated refactoring PR with a find-and-replace across all imports
- Consider adopting a consistent convention (PascalCase for components) going forward

---

### #23 -- No React error boundaries (Reliability)
**Severity:** Medium
**Risk to fix:** Low

No React error boundaries are defined anywhere. If any component throws an unhandled error, the entire page crashes with no recovery path.

**Recommended approach:**
- Create a reusable `ErrorBoundary` component
- Wrap the Portal layout and key page sections with error boundaries
- Add a fallback UI with a "Try Again" button

---

## Additional Notes

### Environment Variables (complete list)

All environment variables used by the project (see `.env.example` for template):

| Variable | Required | Used By |
|----------|----------|---------|
| `MONGODB_URI` | Yes | `lib/db.js`, `lib/mongodb.js` |
| `NEXTAUTH_SECRET` | Yes | `lib/authOptions.js` |
| `NEXTAUTH_URL` | Yes | `lib/authOptions.js`, `/api/auth/forgotPassword` |
| `NEXT_PUBLIC_BASE_URL` | No | `PortalHeader.js` |
| `CLOUDINARY_CLOUD_NAME` | Yes | `lib/cloudinary.js`, 6 upload API routes |
| `CLOUDINARY_API_KEY` | Yes | `lib/cloudinary.js`, 6 upload API routes |
| `CLOUDINARY_API_SECRET` | Yes | `lib/cloudinary.js`, 6 upload API routes |
| `EMAIL_USER` | Yes | `lib/mailer.js` |
| `EMAIL_PASSWORD` | Yes | `lib/mailer.js` |
| `BREVO_API` | Yes | `lib/mailer.js` (ticket enrollment emails) |
| `GOOGLE_CLIENT_ID` | No | `lib/authOptions.js` |
| `GOOGLE_CLIENT_SECRET` | No | `lib/authOptions.js` |
| `LINKEDIN_CLIENT_ID` | No | `lib/authOptions.js` |
| `LINKEDIN_CLIENT_SECRET` | No | `lib/authOptions.js` |
| `ELASTIC_CLOUD_ID` | No | `lib/elasticsearch-utils.js` |
| `ELASTIC_API_KEY` | No | `lib/elasticsearch-utils.js` |

### Pages with missing SEO metadata (client components)

These pages are `"use client"` and cannot export `metadata` directly. To add SEO metadata, create a `layout.js` in each directory that exports metadata and wraps the client component:

- `app/contact/page.js`
- `app/tickets/page.js`
- `app/login/page.js`
- `app/register/page.js`
- `app/startingpage/page.js` (rendered via `app/page.js`)

### MongoDB collections used

`users`, `recruiters`, `jobseekers`, `jobs`, `jobapplications`, `admins`, `experiences`, `educations`, `certifications`, `announcements`, `inquiries`, `pressreleases`, `tickets`, `ticketenrollments`

### Cloudinary config duplication

Six API routes configure Cloudinary inline instead of using the shared `lib/cloudinary.js`:
- `app/api/ticket/update/route.js`
- `app/api/users/uploadimage/route.js`
- `app/api/jobseekerdetails/uploadimage/route.js`
- `app/api/jobseekerdetails/uploadCoverImage/route.js`
- `app/api/recruiterdetails/uploadimage/route.js`
- `app/api/recruiterdetails/uploadCoverImage/route.js`

All six import `v2 as cloudinary` from `"cloudinary"` and call `cloudinary.config()` with the same env vars. They should import from `@/lib/cloudinary` instead to avoid duplication and ensure the shared config is used.

---

### `lib/recruiterCache.js` is unused

The file implements an in-memory recruiter cache with automatic batching (`getRecruiterDetails`, `prefetchRecruiters`, `clearRecruiterCache`). It was designed to solve the duplicate recruiter fetch problem (#16), but no component or API route actually imports or uses it. Either integrate it or remove it to avoid confusion.

---

### Portal layout validates account on every mount

`app/Portal/layout.js` makes a `GET /api/users/get?id=...` call on every mount to verify the user's account still exists in the database. If the account was deleted by an admin, it shows a Swal alert and forces logout. This is a good safety feature but adds a network roundtrip on every Portal page load.

---

### Starting page route structure

The home page (`/`) renders `app/page.js` which is a client component that simply renders `app/startingpage/page.js`. This is an unnecessary indirection -- the starting page content could live directly in `app/page.js`.

---

### Portal sidebar role-based menu items

`components/PortalComponents/PortalSidebar.js` conditionally renders menu items based on `session.user.role`:
- **Admin**: Dashboard, Recruiters, Candidates, Job Posts, Events, Booking Record, Announcements, Press Releases, My Profile, Help & Contact, Settings
- **Recruiter**: Dashboard, Candidates, Job Posts, Applications, Events, Booking Record, Announcements, Press Releases, My Profile, Help & Contact, Settings
- **Job Seeker**: Dashboard, Recruiters (links to public `/recruiters`), Job Posts (links to public `/jobs`), Applications, Announcements, Press Releases, My Profile, Help & Contact, Settings

---

### Swiper carousel patterns

Two Swiper carousel patterns are used:
1. **Featured Jobs** (`FetchingJobs.js`): 4 slides on desktop, pagination + custom nav arrows, loop enabled
2. **Success Stories** (`StoryComponent.js`): 3 slides on desktop, same pagination + nav pattern

Custom pagination styles are defined in `globals.css` (`.custom-pagination`, `.swiper-button-prev-custom`, `.swiper-button-next-custom`).

---

### Auth flow: OAuth role selection

Both login and register pages have a role selection modal for Google/LinkedIn OAuth. The flow:
1. User clicks "Sign in with Google/LinkedIn"
2. Modal appears asking "Job Seeker" or "Recruiter"
3. Role is stored in `sessionStorage`
4. OAuth flow initiates with `signIn(provider, { callbackUrl })`
5. `authOptions.js` `signIn` callback checks if user exists, creates account if not

New OAuth users default to "jobseeker" role.

---

### `lib/GenerateCV.js` -- Client-side PDF generation

Uses `jsPDF` to generate a CV PDF entirely on the client side. Sections include: Personal Profile, Personal Information, Work Experience, Education, Certifications, Professional Expertise, Soft Skills. The PDF uses Helvetica/Times fonts and the brand navy color `#001571`.

---

### Elasticsearch integration (optional)

`lib/elasticsearch-utils.js` provides a `reindexCollection()` function that syncs MongoDB collections to Elasticsearch. It supports: recruiters, jobseekers, jobs, pressreleases. The Elasticsearch client uses Elastic Cloud (via `ELASTIC_CLOUD_ID` and `ELASTIC_API_KEY`). This is optional -- the app works fine with MongoDB regex search alone.

---

### Brevo vs Nodemailer for emails

The project uses two email providers:
- **Nodemailer (Gmail SMTP)**: Used for password reset and application status notifications (`sendPasswordResetEmail`, `sendStatusChangedNotification`)
- **Brevo API**: Used for ticket enrollment notifications (`sendTicketEnrollmentNotification`)

Both are configured in `lib/mailer.js`.

---

### `@mui/icons-material` and `react-icons` dual usage

The project uses both Material UI icons and React Icons:
- MUI: `ArrowOutwardIcon` in `FetchingJobs.js`
- React Icons: `IoSearchSharp`, `FaLinkedin`, `FaFacebook`, `BsArrowUpRightCircleFill`, `FaLocationDot`, `MdDateRange`, `GiDuration`, etc. across many components

The `next.config.mjs` has `optimizePackageImports` for both libraries.

---

### Database schema notes

- `recruiterId` in the `jobs` collection stores ObjectId (not string), matching the `_id` of the `recruiters` collection
- `jobseekerId` in `jobapplications` similarly stores ObjectId
- The `recruiters` collection has both `category` and `industry` fields -- some code uses one, some the other. The batch API returns both for compatibility.
- The `users` collection links to `recruiters`/`jobseekers`/`admins` via email (not ObjectId FK), except for `jobseekers.userId` which stores the ObjectId

---

### `.gitignore` should include `.env.local`

Verify that `.env.local` is in `.gitignore` to prevent accidental credential commits. The `.env.example` file is safe to commit as it contains only placeholders.

---

### Key API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |
| `/api/auth/jobseekersignup` | POST | Job seeker registration |
| `/api/auth/recruitersignup` | POST | Recruiter registration |
| `/api/auth/adminsignup` | POST | Admin registration |
| `/api/auth/forgotPassword` | POST | Password reset request |
| `/api/auth/resetPassword` | POST | Password reset |
| `/api/job/all` | GET | List all published jobs |
| `/api/job/add` | POST | Create job |
| `/api/job/update` | PUT | Update job |
| `/api/job/search` | GET | Search jobs |
| `/api/job/filter` | GET | Filter jobs |
| `/api/jobapplication/all` | GET | List applications |
| `/api/jobapplication/add` | POST | Submit application |
| `/api/jobapplication/update` | PUT | Update application status |
| `/api/recruiterdetails/batch` | POST | Batch fetch recruiters |
| `/api/recruiterdetails/get` | GET | Get single recruiter |
| `/api/recruiterdetails/uploadimage` | POST | Upload recruiter logo |
| `/api/jobseekerdetails/get` | GET | Get jobseeker profile |
| `/api/jobseekerdetails/uploadimage` | POST | Upload profile image |
| `/api/users/get` | GET | Get user by ID |
| `/api/users/update` | PUT | Update user |
| `/api/ticket/all` | GET | List tickets/events |
| `/api/ticketenrollments/add` | POST | Enroll for event |
| `/api/inquiry/add` | POST | Submit inquiry |
| `/api/pressrelease/all` | GET | List press releases |
| `/api/newsletter` | POST | Newsletter signup |
| `/api/analytics/*` | GET | Platform analytics |
| `/api/download-cv` | GET | Download CV PDF |
