# Assignment Desk

Responsive student-assignment dashboard with Student and Professor (Admin) roles.
Built with React 18, Tailwind CSS v4 and Vite. No backend: data lives in `localStorage`.

## Run

```bash
npm install
npm run dev
```

## Demo users
Pick any user on the first screen: 2 professors (Meera Sharma, Arjun Rao) and 5 students.

## Structure
```
src/
  components/  Header, Modal, ConfirmDialog, ProgressBar, StatusBadge, Toolbar, EmptyState, AssignmentForm
  context/     AppContext.jsx  (state, localStorage persistence, actions)
  data/        seed.js         (seeded users, assignments, submissions)
  utils/       helpers.js      (dates, overdue check, search/filter/sort)
  views/       Login, StudentDashboard, AdminDashboard
```

## Features
- Role-based views; students see only assignments assigned to them, professors only those they created
- Two-step submission: "Yes, I have submitted" then a confirmation dialog
- Progress: "X of Y submitted" for students, class completion bar and per-student status for professors
- Create / edit / delete assignments, assign to all or selected students, Drive link
- Loading, empty and error states (reset button if stored data is corrupt)
- Bonus: search, status filter, sorting, overdue highlighting, dark mode, keyboard-accessible native dialogs, labelled form fields, reduced-motion support

## Reset data
Clear the `assignment-desk:v1` key in DevTools > Application > Local Storage.
