# Parth Skating Planner

A mobile-first, production-ready training planner for competitive speed skaters. Built for Parth to maintain discipline, track training, nutrition, hydration, and sleep.

## 🚀 Features
- **Modern Sports UI:** Mobile-first design using Tailwind CSS and shadcn/ui.
- **Progressive Web App (PWA):** Installable on mobile devices for offline use.
- **Daily Training Log:** Track routines, vegetarian nutrition, hydration, and sleep.
- **Performance Stats:** Visualize completion trends and streaks.
- **Dynamic Weekly Focus:** Rotating training drills based on the current week.
- **Data Portability:** Export and import your data as JSON for manual backups.
- **Privacy First:** All data is stored locally on your device (`localStorage`).

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Router:** HashRouter (optimized for GitHub Pages)
- **Deployment:** GitHub Actions

## 📦 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nishantlakhara/parth.git
   cd skatingplanner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🚀 Deployment to GitHub Pages

The application is configured to deploy automatically to GitHub Pages via GitHub Actions when code is pushed to the `main` branch.

1. **Initialize Git & Push:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/nishantlakhara/parth.git
   git branch -M main
   git push -u origin main
   ```

2. **Configure GitHub Pages:**
   - Go to your repository settings on GitHub.
   - Select **Pages** from the sidebar.
   - Under **Build and deployment > Source**, ensure **GitHub Actions** is selected.

The app will be available at: `https://nishantlakhara.github.io/skatingplanner/`

## 📂 Project Structure
- `src/components`: Reusable UI components.
- `src/pages`: Main application screens (Dashboard, Calendar, Planner, Stats).
- `src/context`: State management and statistics logic.
- `src/services`: Data persistence layer (StorageService).
- `src/constants`: Static data (Quotes, Weekly Focus, Default Tasks).
- `src/types`: TypeScript interfaces.
- `src/utils`: Helper functions.

## 🔒 Storage
The application uses a key called `parth-skating-planner-v1` in `localStorage`. Each date is an independent entry, ensuring that changes to one day never affect history.
