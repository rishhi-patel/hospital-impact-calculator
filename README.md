# Hospital Impact Calculator

This project is an **embedded hospital impact calculator** that can be integrated into a website using an `<iframe>` or a script. The calculator estimates hospital impact metrics based on user input.

## 🚀 Features

- **Static UI** built with HTML, CSS (Tailwind), and JavaScript
- **Client-Side Script Loading** to avoid hydration issues in Next.js
- **WordPress & Next.js Integration Support**
- **Embedded via `iframe` or `<script>`**
- **HubSpot Email Capture Simulation** (Static for now)

## 📂 Project Structure

```
📁 hospital-impact-calculator
│── 📁 assets              # CSS, icons, images
│── 📁 js                  # JavaScript logic
│   │── 📄 main.js         # Handles UI interactions
│   │── 📄 api.js          # Manages API requests (if needed in future)
│   │── 📄 hubspot.js      # Handles static email validation
│── 📁 styles              # Styling (Tailwind)
│── 📄 index.html          # Main embedded calculator page
│── 📄 embed.js            # Script for embedding in WordPress
│── 📄 README.md           # Documentation
```

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/rishhi-patel/hospital-impact-calculator.git
cd hospital-impact-calculator
```

### **2️⃣ Run Locally**

```sh
npx http-server .
```

_This will serve the `index.html` file at `http://localhost:8080`._

## 🌐 Deployment

### **1️⃣ GitHub Pages (Recommended for Static Hosting)**

1. **Push the repo to GitHub**
2. **Go to** `Settings > Pages`
3. **Select Branch:** `main` and folder `/ (root)`
4. **Access it via:** `https://<your-username>.github.io/hospital-impact-calculator/index.html`

### **2️⃣ Next.js Integration (via `iframe`)**

To embed in a **Next.js app**, use:

```jsx
<iframe
  src="https://rishhi-patel.github.io/hospital-impact-calculator/index.html"
  className="w-full min-h-[600px] border rounded"
  loading="lazy"
  title="Hospital Impact Calculator"
></iframe>
```

### **3️⃣ WordPress Integration**

To embed in **WordPress**, use:

```html
<iframe
  src="https://rishhi-patel.github.io/hospital-impact-calculator/index.html"
  width="100%"
  height="600px"
  style="border: none;"
></iframe>
```

Or add this `<script>` inside a post/page:

```html
<script
  src="https://rishhi-patel.github.io/hospital-impact-calculator/embed.js"
  defer
></script>
```
