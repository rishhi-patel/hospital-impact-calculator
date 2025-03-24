# Hospital Impact Calculator

This project is an embedded hospital impact calculator built with Next.js, which can be integrated into websites via an `<iframe>` or a script. The calculator estimates hospital impact metrics based on user input and integrates email verification for legitimate users.

## 🚀 Features

- Dynamic UI built with Next.js and Tailwind CSS
- Email verification (OTP-based) before storing data in HubSpot CRM
- Dynamic API integration for performance calculations
- Embedded via `<iframe>` or `<script>`
- HubSpot Email Capture Simulation (for integration)

## 📂 Project Structure

```
📁 hospital-impact-calculator
│── 📁 assets # CSS, icons, images
│── 📁 components # React components (e.g., Calculator UI, Form)
│── 📁 pages # Next.js Pages (API Routes, Embed Script)
│── 📁 public # Static assets (favicon, etc.)
│── 📁 styles # Styling (Tailwind)
│── 📄 embed.js # Script for embedding in WordPress
│── 📄 README.md # Documentation
│── 📄 package.json # Project dependencies & scripts
```

## 🔧 Installation & Setup

1️⃣ Clone the Repository

```bash
git clone https://github.com/rishhi-patel/hospital-impact-calculator.git
cd hospital-impact-calculator
```

2️⃣ Install Dependencies

```bash
npm install
```

3️⃣ Run Locally

```bash
npm run dev
```

This will start the Next.js development server at `http://localhost:3000`.

## 🌐 Deployment

### 1️⃣ Netlify (Production Link)

To deploy to Netlify:

1. Push the repo to GitHub
2. Go to Netlify → Create a New Site from Git
3. Connect the repository and follow the steps

Production Link: [https://hospital-impact-calculator.netlify.app/](https://hospital-impact-calculator.netlify.app/)

### 2️⃣ Next.js Integration (via iframe)

To embed in a Next.js app, use:

```html
<iframe
  src="https://hospital-impact-calculator.netlify.app/"
  className="w-full min-h-[600px] border rounded"
  loading="lazy"
  title="Hospital Impact Calculator"
></iframe>
```

### 3️⃣ WordPress Integration

To embed in WordPress, use:

```html
<iframe
  src="https://hospital-impact-calculator.netlify.app/"
  width="100%"
  height="600px"
  style="border: none;"
></iframe>
```

Or add this `<script>` inside a post/page:

```html
<script
  src="https://hospital-impact-calculator.netlify.app/embed.js"
  defer
></script>
```

## 🔑 Environment Variables

For the application to work properly in production, make sure to set the following environment variables:

```env
RESEND_API_KEY=
OTP_SECRET=your-super-secure-key
NEXT_DISABLE_ERROR_OVERLAY=true
```

- `RESEND_API_KEY`: API key for SendGrid (or your email service provider).
- `OTP_SECRET`: Secret key used for generating OTPs.
- `NEXT_DEBUG`: Enables debugging mode in Next.js (helpful for development).
- `NEXT_DISABLE_ERROR_OVERLAY`: Disables error overlays in production (optional).

## ⚙️ Features To Be Implemented

- PDF Report Generation: After the email verification step, the app will generate a personalized PDF report.
- HubSpot Integration: Once verified, user data will be captured in HubSpot CRM.
- Automation: Email responses will be automated using HubSpot, SendGrid, or AWS SES.

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
