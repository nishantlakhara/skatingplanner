# CLAUDE.md

## Project
Build a production-ready React application called:
**Parth Skating Planner**

**Purpose:**
A mobile-first training planner for a competitive child speed skater.
The application should help the athlete maintain discipline, track training, nutrition, hydration, recovery, sleep and skating progress.
The application should feel like a modern sports mobile application rather than a checklist.

---

# Deployment Target
Application must deploy successfully to GitHub Pages.
Target URL: https://nishantlakhara.github.io/skatingplanner/

**Requirements:**
- Must work on GitHub Pages
- Must work after browser refresh
- Must support direct deep links
- Must support mobile devices
- Must support installation as PWA
- Use: **HashRouter** (NOT BrowserRouter)
- Vite Config: `base: "/skatingplanner/"`

---

# Technology Stack
- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context, React Hooks
- **Persistence:** localStorage (Key: `parth-skating-planner-v1`)

---

# Application Philosophy
- Build consistency
- Improve skating performance
- Encourage discipline
- Make progress visible
- Keep the child motivated

---

# Storage Requirements
Structure: Date-keyed (e.g., `"2026-06-01": {}`)
Each date contains independent information. Changing one date must never affect another date.

---

# Main Screens
- **Dashboard:** Current date, streaks, monthly completion, achievements, weekly focus.
- **Monthly Calendar:** Primary navigation with color-coded status (Green 80%+, Yellow 1-79%, Red 0%).
- **Daily Planner:** Independent data entry for selected dates.

---

# Features
- **Daily Routine:** Morning, Training, Education, Recovery.
- **Weekly Focus:** Rotating drills (Weeks 1-4).
- **Nutrition:** Vegetarian tracking (Breakfast, Lunch, Dinner).
- **Hydration:** 0-10 glasses of water.
- **Sleep Tracking:** Bed/Wake times and quality score.
- **Statistics:** Streak calculation, completion percentages.
- **Achievement System:** Badges (7, 15, 30, 90 days).
- **Motivation:** Rotating quotes.
- **Data Portability:** JSON Export/Import.

---

# UI Requirements
- Modern sports app design.
- Bright, motivating, child-friendly.
- Primary colors: Blue, Green, Orange.
- Components: Cards, progress bars, circular indicators, badges.
