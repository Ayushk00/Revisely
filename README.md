# Revisely

**Turn any PDF into a quiz.** Upload your notes or a chapter, choose how many questions you want, and Revisely generates multiple-choice questions with AI and turns them into a timed quiz.

**Live demo:** https://revisely-two.vercel.app

## How it works

1. **Sign up** with your email and confirm it with the one-time code Revisely sends you.
2. **Upload a PDF** on the dashboard and choose how many questions you want.
3. **Take the quiz.** Answer each question before its 20-second timer runs out.
4. **See your results**, then review any past quiz from your history.

## Features

- **AI question generation.** Upload a PDF (up to 10 MB) and Google Gemini writes multiple-choice questions from it. Each question has four options and one correct answer.
- **Timed quizzes.** You get 20 seconds per question, with a visible countdown. Each correct answer is worth 4 points.
- **Instant results.** When the quiz ends you see your score, accuracy, correct, wrong and skipped answers, and your time per question.
- **Quiz history.** Every quiz you finish is saved so you can review the questions later.
- **Email sign-up with OTP.** New accounts are verified with a 6-digit code sent by email. The code expires after 10 minutes.
- **Secure sessions.** Passwords are hashed with bcrypt. Login uses a JWT stored in an HttpOnly cookie, and middleware protects the dashboard, quiz and history pages.
- **Tickets and payments.** Each quiz costs one ticket. Users buy 30 tickets for ₹100 through Razorpay, and the server verifies the payment signature before adding tickets.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 15 (Pages Router), React 19 |
| Styling | Tailwind CSS 4, lucide-react icons |
| Database | MongoDB with Mongoose |
| AI | Google Gemini (`@google/generative-ai`) |
| PDF parsing | pdf-parse |
| Email | Twilio SendGrid |
| Payments | Razorpay |
| Auth | bcryptjs, jsonwebtoken, jose (in middleware) |

## Getting started

### Prerequisites

- Node.js 18.18 or later
- A MongoDB database: [MongoDB Atlas](https://www.mongodb.com/atlas) or a local install
- API keys for [Google Gemini](https://aistudio.google.com/apikey), [SendGrid](https://sendgrid.com) and [Razorpay](https://razorpay.com). Razorpay test mode keys are fine for development.

### 1. Clone and install

```bash
git clone https://github.com/Ayushk00/Revisely.git
cd Revisely
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/revisely

# Auth: use long random strings
JWT_SECRET=
NEXT_PUBLIC_MCQSECRET=

# Google Gemini
GEMINI_API_KEY=

# SendGrid: the sender address must be verified in SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM=you@example.com

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs and verifies login tokens |
| `NEXT_PUBLIC_MCQSECRET` | Encrypts quiz questions kept in the browser during a quiz |
| `GEMINI_API_KEY` | Generates questions from PDF text |
| `SENDGRID_API_KEY` | Sends sign-up OTP emails. Only the Mail Send permission is needed. |
| `SENDGRID_FROM` | Verified sender address for OTP emails |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Creates orders and verifies ticket payments |

To generate a random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env.local` is git-ignored. Never commit it.

### 3. Run the app

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── components/   # Navbar, footer, timer, results and auth layout
├── context/      # Points context for the active quiz
├── lib/          # MongoDB connection helper
├── middleware.js # Protects /dashboard, /history and /test
├── models/       # User, pending OTP, MCQ history and ticket models
├── pages/
│   ├── api/      # Auth, OTP, MCQ generation, tickets and payments
│   ├── dashboard.jsx
│   ├── history.jsx
│   ├── test.jsx
│   ├── login.jsx
│   └── signup.jsx
└── styles/       # Global Tailwind styles
```

## Deploying to Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new). The Next.js preset works without changes.
2. Add every variable from `.env.local` under **Settings → Environment Variables**, then redeploy. `NEXT_PUBLIC_MCQSECRET` is built into the pages at build time, so changing it always needs a redeploy.
3. In MongoDB Atlas, open **Network Access** and allow Vercel to connect. Vercel's servers don't use fixed IP addresses, so this usually means `0.0.0.0/0`.
4. Use Razorpay live keys (`rzp_live_…`) in production once your Razorpay account is activated.
