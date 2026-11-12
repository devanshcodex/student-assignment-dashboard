const hoursFromNow = (h) => new Date(Date.now() + h * 3600 * 1000).toISOString()
const drive = 'https://1drv.ms/f/s!AkDemoFolder'

export function seed(hash) {
  const pw = hash('password123')
  const person = (id, name, role) => ({
    id, name, role, email: `${name.split(' ')[0].toLowerCase()}@college.edu`, passwordHash: pw,
  })

  return {
    users: [
      person('p1', 'Meera Sharma', 'professor'),
      person('p2', 'Arjun Rao', 'professor'),
      person('s1', 'Aarav Singh', 'student'),
      person('s2', 'Diya Verma', 'student'),
      person('s3', 'Kabir Khan', 'student'),
      person('s4', 'Isha Gupta', 'student'),
      person('s5', 'Rohan Mehta', 'student'),
    ],
    courses: [
      { id: 'c1', code: 'CS101', name: 'Web Development', semester: 'Fall 2026', professorId: 'p1', studentIds: ['s1', 's2', 's3', 's4', 's5'] },
      { id: 'c2', code: 'CS204', name: 'Data Structures', semester: 'Fall 2026', professorId: 'p1', studentIds: ['s1', 's2', 's3'] },
      { id: 'c3', code: 'CS310', name: 'Database Systems', semester: 'Fall 2026', professorId: 'p2', studentIds: ['s1', 's4', 's5'] },
      { id: 'c4', code: 'HU120', name: 'Technical Writing', semester: 'Fall 2026', professorId: 'p2', studentIds: ['s2', 's3', 's4', 's5'] },
    ],
    assignments: [
      { id: 'a1', courseId: 'c1', title: 'Responsive Portfolio', description: 'Build a one-page portfolio that works from 360px to 1440px wide.', deadline: hoursFromNow(72), driveLink: drive, type: 'individual' },
      { id: 'a2', courseId: 'c1', title: 'Team Landing Page', description: 'Design and build a landing page for a product of your choice.', deadline: hoursFromNow(120), driveLink: drive, type: 'group' },
      { id: 'a3', courseId: 'c1', title: 'React Hooks Essay', description: 'Write 800 words comparing useState and useReducer.', deadline: hoursFromNow(-30), driveLink: drive, type: 'individual' },
      { id: 'a4', courseId: 'c2', title: 'Linked List Implementation', description: 'Implement a doubly linked list with insert, delete and reverse.', deadline: hoursFromNow(48), driveLink: drive, type: 'individual' },
      { id: 'a5', courseId: 'c2', title: 'Graph Traversal Project', description: 'Compare BFS and DFS on a real road network dataset.', deadline: hoursFromNow(200), driveLink: drive, type: 'group' },
      { id: 'a6', courseId: 'c3', title: 'ER Diagram', description: 'Model a library management system and export the diagram as PDF.', deadline: hoursFromNow(96), driveLink: drive, type: 'individual' },
      { id: 'a7', courseId: 'c3', title: 'Normalization Worksheet', description: 'Normalize the given tables up to 3NF.', deadline: hoursFromNow(-50), driveLink: drive, type: 'individual' },
      { id: 'a8', courseId: 'c4', title: 'Project Report Draft', description: 'First draft of the final report, with references.', deadline: hoursFromNow(150), driveLink: drive, type: 'group' },
    ],
    groups: [
      { id: 'g1', courseId: 'c1', name: 'Team Alpha', leaderId: 's1', memberIds: ['s1', 's2'] },
      { id: 'g2', courseId: 'c1', name: 'Team Beta', leaderId: 's3', memberIds: ['s3'] },
      { id: 'g3', courseId: 'c2', name: 'Graph Gang', leaderId: 's1', memberIds: ['s1', 's2'] },
      { id: 'g4', courseId: 'c4', name: 'Report Crew', leaderId: 's2', memberIds: ['s2', 's3'] },
    ],
    acks: [
      { assignmentId: 'a1', studentId: 's1', by: 's1', at: hoursFromNow(-5) },
      { assignmentId: 'a1', studentId: 's2', by: 's2', at: hoursFromNow(-3) },
      { assignmentId: 'a2', groupId: 'g1', by: 's1', at: hoursFromNow(-2) },
      { assignmentId: 'a3', studentId: 's1', by: 's1', at: hoursFromNow(-40) },
      { assignmentId: 'a3', studentId: 's2', by: 's2', at: hoursFromNow(-33) },
      { assignmentId: 'a3', studentId: 's4', by: 's4', at: hoursFromNow(-31) },
      { assignmentId: 'a4', studentId: 's2', by: 's2', at: hoursFromNow(-1) },
      { assignmentId: 'a7', studentId: 's1', by: 's1', at: hoursFromNow(-60) },
      { assignmentId: 'a7', studentId: 's4', by: 's4', at: hoursFromNow(-55) },
    ],
  }
}
