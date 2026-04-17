# Power AI – Intelligent Business Intelligence Suite

Power AI (formerly DataLeap Suite) is a high-performance, AI-driven business intelligence platform that transforms raw data into actionable insights instantly. By leveraging advanced Machine Learning and Large Language Models, Power AI automates the complex process of data schema analysis, KPI identification, and interactive dashboard generation.

---

## Technical Architecture

The platform is designed as a modular monorepo, separating core concerns into a high-performance backend and a pixel-perfect frontend.

- **Frontend**: A high-fidelity React application built with Vite and Tailwind CSS. It features a custom-built dashboard engine capable of rendering real-time KPIs, Bar Charts, Line Graphs, and Pie Charts with dynamic filtering.
- **Backend**: A robust Express.js server that acts as the intelligence hub, coordinating requests between the OpenAI API and the client-side application.
- **Data Persistence**: Fully integrated with Supabase for secure multi-tenant authentication and dashboard configuration persistence.

---

## Core Features

### 1. Zero-Config Data Ingestion
Drop any CSV or Excel file into the platform. Power AI handles the heavy lifting of parsing, cleaning, and extracting your data's DNA—even with complex, multi-sheet workbooks.

### 2. Autonomous Schema Analysis
The backend executes deep-context analysis of your data's cardinality, data types, and statistical properties. It doesn't just read columns; it understands the *relationships* between your business metrics.

### 3. AI-Driven Dashboard Synthesis
Instead of building charts manually, Power AI's "Synthesis Engine" generates optimal visualization layouts based on your data's unique structure. It identifies the most relevant KPIs and chooses the best chart types to represent your trends.

### 4. Interactive Intelligence
Once a dashboard is generated, it's fully interactive. Filter by region, category, or time-frame, and watch the entire AI-generated landscape react in real-time.

---

## Technology Stack

### Frontend Essentials
- **React 18 & Vite**: For ultra-fast development and optimized production bundles.
- **Tailwind CSS**: For a refined, modern design system using variable-based tokens.
- **Lucide React**: For high-clarity, crisp iconography.
- **Recharts / Custom Charting**: For high-performance data visualization.

### Backend Intelligence
- **Node.js & Express**: Handling the orchestration layer.
- **OpenAI GPT-4**: Powering the schema analysis and layout configuration logic.
- **Supabase SDK**: Managing authentication and Postgres-based configuration storage.
- **SheetJS (XLSX)**: For robust client-side and server-side workbook parsing.

---

## Infrastructure & Environment

To run this platform, you must configure the following environmental variables:

### Frontend (`/app/frontend/.env`)
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
- `VITE_API_BASE_URL`: Pointer to the Intelligence Backend (default `http://localhost:5000`).

### Backend (`/app/backend/.env`)
- `OPENAI_API_KEY`: Required for schema analysis and AI layout generation.
- `SUPABASE_URL`: For backend database synchronization.
- `SUPABASE_ANON_KEY`: For backend-side database access.

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Build & Installation
Install all dependencies across the monorepo using the master script:
```bash
cd app
npm run install:all
```

### 2. Launch Development Suite
Run both the frontend and the intelligence backend concurrently:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## Project Structure

```text
PowerBI/
├── app/
│   ├── frontend/             # High-fidelity React application
│   │   ├── src/components/   # Modular UI architecture
│   │   └── src/pages/        # Dashboard and Auth views
│   ├── backend/              # Intelligence orchestration server
│   │   ├── routes/           # AI and Data endpoints
│   │   └── services/         # OpenAI and Supabase integrations
│   └── package.json          # Master monorepo configuration
│
└── .gitignore                # Optimized repository exclusion list
```

---

## Security & Reliability

Power AI implements enterprise-grade security through **Supabase Auth**, ensuring that every dashboard is private and tied to a unique user session. All AI-driven analysis is handled via secure API gateways with strict validation of input data to ensure integrity and performance.



Auto-Power-BI
Core Repository Information
Repository Name: Auto-Power-BI Repository Owner: gobinath-sketch Repository ID: 1210430025 Repository URL: https://github.com/gobinath-sketch/Auto-Power-BI Default Branch: main Repository Status: Active and Public Primary Language: TypeScript License: None Specified Repository Created: 2 days ago Last Push: 2026-04-15 at 12:04:14 UTC Last Updated: 1 day ago Repository Size: 586 KB Homepage URL: None configured

Language Composition
Auto-Power-BI repository language distribution:

TypeScript: 93.6%
JavaScript: 3.4%
CSS: 1.4%
PLpgSQL: 1.4%
HTML: 0.2%
This composition reflects a professional full-stack application with TypeScript as primary language, backend database procedures in PLpgSQL, and minimal HTML markup usage indicating modern component-based architecture.

Repository Statistics and Engagement
Open Issues Count: 0 Forks: 0 Stars: 0 Network Count: 0 Watchers: 0 Downloads: Enabled Projects Board: Enabled Issues Feature: Enabled Pull Requests: Enabled Discussions: Disabled Wiki: Disabled Pages: Disabled

Repository Configuration Settings
Repository Type: Standard Repository (not a template) Fork Allowed: Yes Auto-merge: Disabled Delete Branch on Merge: Disabled Merge Strategies Available: All enabled (merge commit, rebase merge, squash merge) Merge Commit Title Format: MERGE_MESSAGE Merge Commit Message Format: PR_TITLE Squash Merge Title Format: COMMIT_OR_PR_TITLE Squash Merge Message Format: COMMIT_MESSAGES Web Commit Signoff Required: No Pull Request Creation Policy: All branches allowed Update Branch: Disabled

Project Structure and Architecture Overview
The repository implements a monorepo architecture with clear separation of concerns between frontend and backend components. The root level includes master coordination files for the entire project ecosystem.

Root Level Files:

README.md: Comprehensive project documentation (4,664 bytes)
package.json: Monorepo master configuration
package-lock.json: NPM dependency lock file
.gitignore: Git ignore rules (176 bytes)
Application Directory Structure (app/):

Frontend subdirectory: React-based frontend application
Backend subdirectory: Express.js backend server
package.json: Master monorepo coordinator
Frontend Configuration and Setup
Frontend Package Name: vite_react_shadcn_ts Frontend Type: Private application Frontend Version: 0.0.0 Frontend Module Type: ES modules (import/export)

Frontend Available Scripts:

dev: Start Vite development server
build: Production build compilation
build:dev: Development mode build
lint: ESLint code quality checks
preview: Preview production build
test: Run tests with Vitest (single run)
test:watch: Run tests in watch mode with Vitest
Frontend Dependencies Core Libraries:

react: 18.3.1
react-dom: 18.3.1
react-router-dom: 6.30.1
react-hook-form: 7.61.1
@hookform/resolvers: 3.10.0
zod: 3.25.76
Frontend UI Component System (Radix UI):

@radix-ui/react-accordion: 1.2.11
@radix-ui/react-alert-dialog: 1.1.14
@radix-ui/react-aspect-ratio: 1.1.7
@radix-ui/react-avatar: 1.1.10
@radix-ui/react-checkbox: 1.3.2
@radix-ui/react-collapsible: 1.1.11
@radix-ui/react-context-menu: 2.2.15
@radix-ui/react-dialog: 1.1.14
@radix-ui/react-dropdown-menu: 2.1.15
@radix-ui/react-hover-card: 1.1.14
@radix-ui/react-label: 2.1.7
@radix-ui/react-menubar: 1.1.15
@radix-ui/react-navigation-menu: 1.2.13
@radix-ui/react-popover: 1.1.14
@radix-ui/react-progress: 1.1.7
@radix-ui/react-radio-group: 1.3.7
@radix-ui/react-scroll-area: 1.2.9
@radix-ui/react-select: 2.2.5
@radix-ui/react-separator: 1.1.7
@radix-ui/react-slider: 1.3.5
@radix-ui/react-slot: 1.2.3
@radix-ui/react-switch: 1.2.5
@radix-ui/react-tabs: 1.1.12
@radix-ui/react-toast: 1.2.14
@radix-ui/react-toggle: 1.1.9
@radix-ui/react-toggle-group: 1.1.10
@radix-ui/react-tooltip: 1.2.7
Frontend Styling and CSS:

tailwindcss: 3.4.17
tailwind-merge: 2.6.0
tailwindcss-animate: 1.0.7
@tailwindcss/typography: 0.5.16
autoprefixer: 10.4.21
Frontend Utilities and Components:

lucide-react: 0.462.0 (Icons)
cmdk: 1.1.1 (Command menu)
input-otp: 1.4.2 (OTP input)
embla-carousel-react: 8.6.0 (Carousel)
react-day-picker: 8.10.1 (Date picker)
date-fns: 3.6.0 (Date utilities)
react-resizable-panels: 2.1.9 (Layout panels)
recharts: 2.15.4 (Data visualization)
sonner: 1.7.4 (Toast notifications)
vaul: 0.9.9 (Drawer)
class-variance-authority: 0.7.1
clsx: 2.1.1
next-themes: 0.3.0 (Theme management)
Frontend Data and API:

@tanstack/react-query: 5.83.0 (Server state management)
@supabase/supabase-js: 2.103.0 (Backend and authentication)
Frontend Spreadsheet Support:

xlsx: 0.18.5 (Excel file handling)
Frontend Development Tools:

vite: 5.4.19 (Build tool)
@vitejs/plugin-react-swc: 3.11.0 (React SWC transpiler)
typescript: 5.8.3
@types/react: 18.3.23
@types/react-dom: 18.3.7
@types/node: 22.16.5
typescript-eslint: 8.38.0
eslint: 9.32.0
@eslint/js: 9.32.0
eslint-plugin-react-hooks: 5.2.0
eslint-plugin-react-refresh: 0.4.20
Frontend Testing Tools:

vitest: 3.2.4 (Unit testing framework)
@testing-library/react: 16.0.0
@testing-library/jest-dom: 6.6.0
jsdom: 20.0.3 (DOM environment)
Frontend CSS Processing:

postcss: 8.5.6
Frontend Additional Tools:

lovable-tagger: 1.1.13
Backend Configuration and Setup
Backend Package Name: backend Backend Version: 1.0.0 Backend Entry Point: server.js Backend Module Type: CommonJS

Backend Available Scripts:

start: Execute Node.js server (server.js)
test: Echo placeholder (no tests configured)
Backend Core Dependencies:

express: 5.2.1 (HTTP server framework)
cors: 2.8.6 (Cross-Origin Resource Sharing)
dotenv: 17.4.2 (Environment variable management)
Backend Data and Database:

@supabase/supabase-js: 2.103.0 (Database client and auth)
Backend AI Integration:

openai: 6.34.0 (OpenAI API client for GPT-4)
Master Monorepo Configuration
Monorepo Name: dataleap-monorepo Monorepo Version: 1.0.0 Monorepo Type: Private workspace Monorepo Description: Professional monorepo structure for DataLeap Suite

Monorepo Orchestration Scripts:

dev: Concurrently run frontend dev server and backend start command
install:all: Install dependencies for both frontend and backend packages
build:frontend: Build frontend production bundle
test:frontend: Run frontend tests
Monorepo Development Dependency:

concurrently: 8.2.2 (Run multiple npm commands simultaneously)
Project Documentation Overview
The README.md file contains comprehensive documentation covering:

Project Title: Power AI - Intelligent Business Intelligence Suite Previous Project Name: DataLeap Suite Project Focus: AI-driven business intelligence platform

Key Feature Descriptions:

Zero-Config Data Ingestion: Automatic parsing and cleaning of CSV and Excel files including complex multi-sheet workbooks

Autonomous Schema Analysis: Deep-context analysis including:

Data cardinality analysis
Data type detection
Statistical properties calculation
Relationship identification between business data
AI-Driven Dashboard Synthesis: Intelligent visualization engine that:

Generates optimal dashboard layouts
Identifies relevant KPIs automatically
Selects appropriate chart types based on data
Interactive Intelligence: Full-featured interactive dashboards with:

Real-time filtering capabilities
Region-based filtering
Category filtering
Time-frame filtering
Technology Stack Summary:

Frontend: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Custom Charting
Backend: Node.js, Express.js, OpenAI GPT-4, Supabase SDK, SheetJS (XLSX)
Environment Configuration:

Frontend Environment Variables:

VITE_SUPABASE_URL: Supabase project URL
VITE_SUPABASE_ANON_KEY: Supabase anonymous key
VITE_API_BASE_URL: Backend API endpoint (default: http://localhost:5000)
Backend Environment Variables:

OPENAI_API_KEY: OpenAI API authentication
SUPABASE_URL: Supabase backend URL
SUPABASE_ANON_KEY: Supabase authentication key
Installation and Setup Instructions
Prerequisites: Node.js v18 or higher, npm or yarn

Installation Steps:

Navigate to app directory
Run: npm run install:all
Launch development: npm run dev
Access application: http://localhost:5173
Project Security Architecture
Authentication Method: Supabase Auth Security Features:

Auto-Power-BI represents an enterprise-level AI-driven business intelligence platform engineered to:

Provide zero-configuration data import and processing
Deliver AI-powered dashboard generation without manual configuration
Support real-time interactive data analysis and visualization
Enable multi-tenant architecture with Supabase authentication
Integrate cutting-edge AI capabilities via OpenAI GPT-4
Process complex spreadsheet formats (CSV, Excel, multi-sheet workbooks)
Generate context-aware data visualizations and KPI recommendations
Provide interactive filtering and drilling capabilities
Maintain enterprise-grade security and data persistence
Support parallel frontend and backend development workflows
