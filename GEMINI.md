# Parth Skating Planner

## Project Overview
A production-ready React application called Parth Skating Planner. It is a mobile-first training planner for a competitive child speed skater to maintain discipline, track training, nutrition, hydration, recovery, sleep, and skating progress. The app must feel like a modern sports mobile application rather than a checklist.

## Deployment Target
- **Platform:** GitHub Pages
- **Target URL:** https://nishantlakhara.github.io/skatingplanner/
- **Requirements:** Must work after browser refresh, support direct deep links, mobile devices, and PWA installation.
- **Router:** HashRouter (NOT BrowserRouter)
- **Vite Config:** `base: "/skatingplanner/"`
- **Automation:** GitHub Actions workflow required for deployment on push to `main`.

## Technology Stack
- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **State/Hooks:** React Context, Custom Hooks
- **Persistence:** localStorage (Key: `parth-skating-planner-v1`)
- **Backend:** None (No server, db, auth, cloud storage).

## Storage Requirements
Structure must be date-keyed (e.g., `"2026-06-01": {}`). Each date contains independent information. Changing one date must never affect another. All progress must survive refresh, restart, and reboot.

## Application Philosophy
This is a sports performance planner, not a task manager.
**Goals:** Build consistency, improve performance, encourage discipline, make progress visible, motivate the child.

## User
- **Primary:** Parth (Age ~10), Daily use, Mobile/Tablet.

## Core Features
1. **Dashboard:** Current date, streak data, monthly completion %, achievements, weekly focus.
2. **Monthly Calendar:** Primary navigation. Displays current month with clickable days colored by completion (Green 80%+, Yellow 1-79%, Red 0%).
3. **Daily Planner:** Stores independent data for selected date.
4. **Daily Routine Checklist:** Morning, Training, Education, Recovery tasks.
5. **Monthly Training Focus:** Rotates weekly (e.g., Week 1: Cross Leg Mastery). Not permanent checkboxes.
6. **Nutrition & Hydration:** Track vegetarian meals (Protein, Calcium, Fruit, Veggies, Carbs) and Water (0-10 glasses).
7. **Sleep Tracking:** Bed Time, Wake Time, Sleep Hours (Target 9-10). Generates Sleep Score.
8. **Statistics & Achievements:** Streaks, Total Days, Averages. Badge system based on streaks.
9. **Motivation System:** Rotating motivational quotes.
10. **Data Management:** Export/Import JSON for backups.
11. **PWA:** Manifest, Service Worker, Offline support, Home screen icon.
12. **Custom Planning & Templates:**
    *   **Template System:** Create and manage reusable templates for daily routines and nutrition.
    *   **Flexible Scheduling:** Assign templates to specific dates or date ranges (weeks, months).
    *   **Special Day Types:** Support for 'Rest', 'Sick', and 'Travel' days with adjusted tracking and streak protection.
    *   **Multi-Level Roadmap:** View and plan across daily, weekly, and monthly/yearly horizons.

## Code Quality
- Use TypeScript, Functional Components, Custom Hooks.
- Avoid large files, inline styles, repeated logic, magic numbers.
- Ensure accessibility (a11y).

## Folder Structure
`src/` -> `components/`, `pages/`, `hooks/`, `services/`, `types/`, `utils/`, `constants/`, `assets/`
