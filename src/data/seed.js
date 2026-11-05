const day = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const USERS = [
  { id: 'a1', name: 'Prof. Meera Sharma', role: 'admin' },
  { id: 'a2', name: 'Prof. Arjun Rao', role: 'admin' },
  { id: 's1', name: 'Aarav Singh', role: 'student' },
  { id: 's2', name: 'Diya Verma', role: 'student' },
  { id: 's3', name: 'Kabir Khan', role: 'student' },
  { id: 's4', name: 'Isha Gupta', role: 'student' },
  { id: 's5', name: 'Rohan Mehta', role: 'student' },
]

const DRIVE = 'https://drive.google.com/drive/my-drive'

export const seedAssignments = () => [
  { id: 't1', title: 'React Hooks Essay', description: 'Write 800 words comparing useState and useReducer.', dueDate: day(-2), driveLink: DRIVE, createdBy: 'a1', assignedTo: 'all' },
  { id: 't2', title: 'Responsive Portfolio', description: 'Build a one-page portfolio that works from 360px to 1440px.', dueDate: day(4), driveLink: DRIVE, createdBy: 'a1', assignedTo: 'all' },
  { id: 't3', title: 'CSS Grid Lab', description: 'Recreate the magazine layout from the handout using CSS Grid.', dueDate: day(9), driveLink: DRIVE, createdBy: 'a1', assignedTo: ['s1', 's2', 's3'] },
  { id: 't4', title: 'Accessibility Audit', description: 'Audit a public website with Lighthouse and list five fixes.', dueDate: day(14), driveLink: DRIVE, createdBy: 'a2', assignedTo: 'all' },
  { id: 't5', title: 'JavaScript Quiz Report', description: 'Summarise the mistakes you made in the in-class quiz.', dueDate: day(-5), driveLink: DRIVE, createdBy: 'a2', assignedTo: ['s1', 's4', 's5'] },
]

export const seedSubmissions = () => ({
  't1:s1': true, 't1:s2': true, 't1:s4': true,
  't2:s1': true,
  't3:s2': true,
  't5:s1': true, 't5:s4': true,
})
