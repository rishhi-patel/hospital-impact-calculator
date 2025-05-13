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

## For the application to work properly in production, make sure to set the following environment variables:

## 🧾 Final Integration Guide

This document outlines how to manage and update core features of the **Hospital Impact Calculator**, including:

1. Updating the **PDF Report Text**
2. Managing the **OTP Workflow**
3. Understanding the **PDF Generation Service**
4. **HubSpot CRM Integration**

---

### 📝 1. Updating the PDF Report Text

**Files Involved:**

- `components/PDFReport/surgical-report.tsx` – Main layout and text structure for the PDF.
- `components/PDFReport/styles/pdf-print.css` – Print styling used when Puppeteer generates the PDF.
- `app/pdf-render/page.tsx` – Web preview for the final PDF layout.

**How to Edit:**

- Static labels, headings, and section titles can be edited directly in `surgical-report.tsx`.
- Dynamic content (e.g., case volume, cost savings) is passed as props from API responses or form inputs.
- Use `app/pdf-render/page.tsx` in the browser to visually confirm updates before triggering PDF generation.

---

### 🔐 2. OTP Verification Workflow

**Files Involved:**

- `components/ui/email-verification.tsx`
- Environment Variable: `.env → OTP_SECRET`
- Email Service API: `RESEND_API_KEY` (or SendGrid equivalent)

**How it Works:**

1. User enters their email after the summary report is shown.
2. OTP is generated using a secret stored in `OTP_SECRET`.
3. The OTP is sent via email using Resend/SendGrid.
4. User submits the OTP to the verification endpoint.
5. If correct:

   - The request for a detailed performance report has been submitted.
   - User data is logged in HubSpot via API.

**What Can Be Configured:**

- Email template
- OTP expiration logic
- API routes for `send-otp` and `verify-otp`

---

### 📄 3. PDF Generation (Puppeteer Service)

**Web Preview Page:** `app/pdf-render/page.tsx`

**How It Works:**

- Puppeteer runs on a secure ExoCodeLabs microservice.
- The service loads `https://hospital-impact-calculator.netlify.app/pdf-render` in headless Chrome.
- It renders the page exactly as seen in the browser, then generates and returns a PDF.

**Integration Notes:**

- Make sure all dynamic data is rendered in the page prior to Puppeteer snapshot.
- PDF styles are defined in `pdf-print.css`. Use print-safe colors, font sizes, and spacing.
- The service accepts a URL and returns a binary PDF. Optional: send it to the user via email or log to CRM.

---

### 🧩 4. HubSpot Integration

**What It Does:**

After email verification, a contact is either created or updated in HubSpot with the following data:

| Field             | Description                            |
| ----------------- | -------------------------------------- |
| Email             | From verified OTP input                |
| Name              | Can be static or optional              |
| Calculator Source | e.g., "Hospital Impact Calculator"     |
| Report Link       | Optional: base64 or public link to PDF |

**HubSpot API Handling:**

- On form submission → backend checks if contact exists.
- If exists → updates record with new data.
- If not → creates a new contact with the fields.
- Uses HubSpot access token stored securely in the environment or backend service.

---

## ✅ Summary Checklist

| Task                        | Location                                     |
| --------------------------- | -------------------------------------------- |
| Update PDF content          | `surgical-report.tsx`, `pdf-render/page.tsx` |
| Preview PDF                 | Open `/pdf-render` in browser                |
| Modify OTP logic/email      | `email-verification.tsx`, `.env`             |
| Verify OTP + show report    | OTP API + conditional UI logic               |
| PDF Generation              | Puppeteer via ExoCodeLabs API                |
| HubSpot Contact Integration | API route (backend) + HubSpot SDK            |

---

### 🔐 Environment Required

```env
OTP_SECRET=your-super-secure-otp-key
PDF_RENDER_URL=https://hospital-impact-calculator.netlify.app/pdf-render
NEXT_PUBLIC_VERCEL_ENVIRONMENT=local
RESEND_API_KEY=
NEXT_DEBUG=1
HUBSPOT_API_KEY=pat=
NEXT_PUBLIC_APP_URL=https://hospital-impact-calculator.netlify.app
```

---

Let me know if you’d like this as a downloadable file or formatted in a specific tool (e.g., Notion, Confluence, PDF).

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
