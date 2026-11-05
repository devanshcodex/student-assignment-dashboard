# Assignment Desk

A responsive student-assignment dashboard with two roles: **Student** and **Admin (Professor)**.
Built with React, Tailwind CSS and Vite. There is no backend: all data is saved in `localStorage` and survives a page refresh.

**Live demo:** https://student-assignment-dashboard-iota.vercel.app/

<img width="1912" height="912" alt="Screenshot 2026-11-05 140317" src="https://github.com/user-attachments/assets/e951ba74-14d4-4467-bb65-383d8b6968b9" />


## Try it

1. Open the live demo.
2. Pick any demo user on the first screen. No password is needed.
3. Try a student (for example **Aarav Singh**): submit an assignment using "Yes, I have submitted" and confirm in the dialog.
4. Click **Switch user** and sign in as **Prof. Meera Sharma** to see the class completion bar and each student's status update.

## Features

**Student**
- Sees only the assignments assigned to them
- Title, description, due date, status and Drive link on every assignment
- Two-step submission: "Yes, I have submitted", then a final confirmation dialog
- Overall progress, for example "3 of 5 submitted", with a progress bar

**Admin (Professor)**
- Sees only the assignments they created
- Create, edit and delete assignments, each with a Drive link
- Assign to all students or to selected students
- Class completion progress bar and every student's submitted / not submitted status

**General**
- Fully responsive on mobile and desktop
- Loading, empty and error states (with a reset option if stored data is corrupt)
- Search, status filter, sorting and overdue highlighting
- Dark mode
- Keyboard-accessible dialogs, labelled form fields and reduced-motion support

## Tech stack

- React 18 (hooks and Context API)
- Tailwind CSS v4
- Vite
- Data: seeded JSON persisted to `localStorage`

## Run locally

```bash
git clone https://github.com/devanshcodex/student-assignment-dashboard.git
cd student-assignment-dashboard
npm install
npm run dev
```

Build for production with `npm run build`.

## Project structure

```
src/
  components/   Header, Modal, ConfirmDialog, ProgressBar, StatusBadge,
                Toolbar, EmptyState, AssignmentForm
  context/      AppContext.jsx   app state, localStorage persistence, actions
  data/         seed.js          seeded users, assignments and submissions
  utils/        helpers.js       date helpers, overdue check, search/filter/sort
  views/        Login, StudentDashboard, AdminDashboard
docs/           screenshot
```

## Notes

- Data is stored in each visitor's own browser, so changes are not shared between people.
- To reset the demo data, clear the `assignment-desk:v1` key in DevTools > Application > Local Storage.
