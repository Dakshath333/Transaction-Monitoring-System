# TxnWatch — Real-Time Transaction Monitoring System

<div align="center">

![TxnWatch Banner](https://img.shields.io/badge/TxnWatch-v1.0-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMSAxN3YtNkg5bDMtNCAzIDRoLTJ2NmgtMnoiLz48L3N2Zz4=)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-22C55E?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)

**A real-time financial transaction monitoring dashboard with live risk classification, analytics, and alerts.**

[🚀 Live Demo](https://transaction-monitoring-system.vercel.app) • [📋 Report](#) • [🐛 Issues](../../issues)

</div>

---

## 📸 Preview

| Live Feed | Analytics |
|-----------|-----------|
| Real-time transaction table with risk highlighting | Area, Line, Bar & Pie charts |
| High-risk alerts panel with badge count | Risk, Status & Type breakdown |
| Search + multi-filter system | Rolling volume trend |

---

## ✨ Features

- **🔴 Live Transaction Feed** — Transactions auto-generate every 1–2 seconds with full details: ID, Sender, Receiver, Bank, Amount, Type, Category, Risk, Status
- **⚡ Risk Classification Engine** — Rule-based engine classifies every transaction as HIGH / MEDIUM / LOW risk in real time
- **🚨 Alerts Panel** — Dedicated panel showing only HIGH-risk transactions with alert count badge
- **📊 Analytics Dashboard** — 4 interactive charts: Area (volume), Line (trends), Bar (categories), Pie (risk + type split)
- **🔍 Search & Filters** — Filter by Risk Level, Status, Transaction Type; search by ID, Sender, or Receiver
- **📋 Transaction Detail View** — Click any row to open a full detail modal
- **⏸ Live / Pause Toggle** — Pause the feed at any time to inspect transactions
- **📱 Responsive Layout** — Works on desktop, tablet, and mobile

---

## 🧠 Risk Classification Logic

```
IF   amount > ₹8,00,000  OR  random < 4%   →  HIGH   🔴
ELIF random < 19%                           →  MEDIUM  🟡
ELSE                                        →  LOW     🟢
```

**Status Distribution:**
```
SUCCESS  →  88%
PENDING  →   6%
FAILED   →   6%
```

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                  │
│   Navbar │ StatCards │ FeedTable │ AlertsPanel      │
├─────────────────────────────────────────────────────┤
│                  VISUALIZATION LAYER                 │
│   AreaChart │ LineChart │ BarChart │ PieChart        │
├─────────────────────────────────────────────────────┤
│                  INTERACTION LAYER                   │
│   Search │ Risk Filter │ Status Filter │ Type Filter │
├─────────────────────────────────────────────────────┤
│                    STATE LAYER                       │
│   useState │ useEffect │ useCallback │ useRef        │
├─────────────────────────────────────────────────────┤
│                     DATA LAYER                       │
│   generateTransaction() │ classifyRisk() │ assignStatus() │
└─────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18.x | Component-based UI |
| Vite | 5.x | Build tool & dev server |
| Recharts | 2.x | Data visualization charts |
| JavaScript (ES6+) | — | App logic & data generation |
| CSS-in-JS (Inline) | — | Component-scoped styling |
| DM Sans | Google Fonts | Typography |
| Vercel | — | Deployment & hosting |

---

## 🚀 Quick Start — Run Locally

Follow these steps to run TxnWatch on your own computer after downloading from GitHub.

### Prerequisites

Make sure you have the following installed:

| Tool | Required Version | Check | Download |
|------|-----------------|-------|----------|
| Node.js | **v20.19+** or v22.12+ | `node -v` | [nodejs.org](https://nodejs.org) |
| npm | v9+ | `npm -v` | Comes with Node.js |
| Git | Any | `git --version` | [git-scm.com](https://git-scm.com) |

> ⚠️ **Important:** Vite 5 requires Node.js **v18+**. If your Node version is older, download the latest LTS from [nodejs.org](https://nodejs.org/en/download).

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/transaction-monitoring-system.git
```

Then navigate into the project folder:

```bash
cd transaction-monitoring-system
```

---

### Step 2 — Navigate into the App Folder

```bash
cd txnwatch
```

> The React app lives inside the `txnwatch/` subfolder.

---

### Step 3 — Install Dependencies

```bash
npm install
```

This installs React, Vite, Recharts, and all other required packages. It may take 30–60 seconds.

---

### Step 4 — Install Recharts (if not already installed)

```bash
npm install recharts
```

---

### Step 5 — Start the Development Server

```bash
npm run dev
```

You should see output like this:

```
  VITE v5.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 6 — Open in Browser

Open your browser and go to:

```
http://localhost:5173
```

TxnWatch will load and start generating live transactions immediately. ✅

---

### All Steps at a Glance

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/transaction-monitoring-system.git

# 2. Enter the project
cd transaction-monitoring-system/txnwatch

# 3. Install all dependencies
npm install

# 4. Install Recharts
npm install recharts

# 5. Run it
npm run dev

# 6. Open browser → http://localhost:5173
```

---

### Build for Production (Optional)

If you want to create an optimized production build:

```bash
npm run build
```

This generates a `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploy Your Own (Free)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Deploy to Netlify (Drag & Drop)

1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist/` folder onto the Netlify dashboard
4. Done — you get a live link instantly

---

## 📁 Project Structure

```
transaction-monitoring-system/
└── txnwatch/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── App.jsx          ← Main TxnWatch component (all logic here)
    │   ├── main.jsx         ← React entry point
    │   └── index.css        ← Global CSS reset
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── README.md
```

---

## 🔧 Common Issues & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| `vite: command not found` | Dependencies not installed | Run `npm install` first |
| Blank white page | App.jsx not replaced | Paste TxnWatch code into `src/App.jsx` |
| Charts not showing | Recharts missing | Run `npm install recharts` |
| Node version error | Node too old | Upgrade to Node v20.19+ from nodejs.org |
| Port 5173 in use | Another app running | Run `npm run dev -- --port 3000` |
| Right-side white gap | index.css has margin | Replace index.css with the reset (see below) |

**Fix for white gap on right side** — replace all content in `src/index.css` with:

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root { width: 100%; min-height: 100vh; }
```

---

## 📊 Transaction Data Model

Each generated transaction has the following structure:

```javascript
{
  id:        "TXN-20250325-A1B2C3",   // Unique transaction ID
  sender:    "Arjun Mehta",            // Sender name
  receiver:  "HDFC Bank Ltd",          // Receiver institution
  bank:      "ICICI Bank",             // Processing bank
  amount:    125000,                   // Amount in INR (₹500 – ₹15,00,000)
  type:      "NEFT",                   // NEFT | RTGS | IMPS | UPI | SWIFT | NACH
  category:  "Business",               // Transaction category
  status:    "SUCCESS",                // SUCCESS | PENDING | FAILED
  risk:      "LOW",                    // HIGH | MEDIUM | LOW
  timestamp: "2025-03-25T10:30:00Z"   // ISO timestamp
}
```

---

## 👨‍💻 Author

**Dakshath B S**
- 🌐 Live App: [transaction-monitoring-system.vercel.app](https://transaction-monitoring-system.vercel.app)
- 📧 Department of Computer Science & Engineering

---

## 📄 License

This project is developed for academic purposes as part of a B.E. Computer Science final year project.

---

<div align="center">
  Built with ❤️ using React.js + Recharts + Vite
</div>
