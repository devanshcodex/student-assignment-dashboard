import { seed } from './seed'

const DB_KEY = 'ard.db'
const TOKEN_KEY = 'ard.token'
const SESSION_MS = 2 * 60 * 60 * 1000

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const fail = (status, message) => {
  throw new ApiError(status, message)
}
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
const newId = (prefix) => prefix + Math.random().toString(36).slice(2, 9)

// Not secure, only here so passwords are not stored in plain text in the mock db.
export function hash(text) {
  let h = 5381
  for (const ch of text) h = ((h << 5) + h) ^ ch.charCodeAt(0)
  return (h >>> 0).toString(36)
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through and reseed
  }
  const fresh = seed(hash)
  localStorage.setItem(DB_KEY, JSON.stringify(fresh))
  return fresh
}

const saveDb = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db))

// ---- session token (JWT-shaped, simulated) ----

const encode = (obj) => btoa(JSON.stringify(obj))

function startSession(user) {
  const claims = { sub: user.id, role: user.role, exp: Date.now() + SESSION_MS }
  const token = [encode({ alg: 'HS256', typ: 'JWT' }), encode(claims), hash(user.id + claims.exp)].join('.')
  localStorage.setItem(TOKEN_KEY, token)
  return { user: publicUser(user) }
}

function readClaims() {
  try {
    const [, body, signature] = (localStorage.getItem(TOKEN_KEY) ?? '').split('.')
    const claims = JSON.parse(atob(body))
    if (signature !== hash(claims.sub + claims.exp)) return null
    return claims.exp > Date.now() ? claims : null
  } catch {
    return null
  }
}

// ---- helpers ----

const byId = (list, id) => list.find((item) => item.id === id)
const nameOf = (db, id) => byId(db.users, id)?.name ?? 'Unknown'
const publicUser = ({ id, name, email, role }) => ({ id, name, email, role })
const courseSummary = ({ id, code, name, semester }) => ({ id, code, name, semester })

function requireUser(db, role) {
  const claims = readClaims()
  const user = claims && byId(db.users, claims.sub)
  if (!user) {
    window.dispatchEvent(new Event('session-expired'))
    fail(401, 'Your session has expired. Please sign in again.')
  }
  if (role && user.role !== role) fail(403, 'You do not have access to this page.')
  return user
}

function courseFor(db, user, courseId) {
  const course = byId(db.courses, courseId)
  if (!course) fail(404, 'Course not found.')
  const allowed = user.role === 'professor' ? course.professorId === user.id : course.studentIds.includes(user.id)
  if (!allowed) fail(403, 'You do not have access to this course.')
  return course
}

const groupOf = (db, courseId, userId) =>
  db.groups.find((g) => g.courseId === courseId && g.memberIds.includes(userId))

function groupView(db, group) {
  return {
    id: group.id,
    name: group.name,
    leaderId: group.leaderId,
    leaderName: nameOf(db, group.leaderId),
    members: group.memberIds.map((id) => ({ id, name: nameOf(db, id) })),
  }
}

function statusFor(db, assignment, userId) {
  if (assignment.type === 'individual') {
    const ack = db.acks.find((a) => a.assignmentId === assignment.id && a.studentId === userId)
    return { done: !!ack, ack: ack ? { by: nameOf(db, ack.by), at: ack.at } : null, group: null, canAck: !ack }
  }
  const group = groupOf(db, assignment.courseId, userId)
  if (!group) return { done: false, ack: null, group: null, canAck: false }
  const ack = db.acks.find((a) => a.assignmentId === assignment.id && a.groupId === group.id)
  return {
    done: !!ack,
    ack: ack ? { by: nameOf(db, ack.by), at: ack.at } : null,
    group: groupView(db, group),
    canAck: !ack && group.leaderId === userId,
  }
}

function progressFor(db, assignment, course) {
  let rows
  if (assignment.type === 'individual') {
    rows = course.studentIds.map((id) => {
      const ack = db.acks.find((a) => a.assignmentId === assignment.id && a.studentId === id)
      return { id, name: nameOf(db, id), detail: null, done: !!ack, at: ack?.at ?? null }
    })
  } else {
    rows = db.groups
      .filter((g) => g.courseId === course.id)
      .map((g) => {
        const ack = db.acks.find((a) => a.assignmentId === assignment.id && a.groupId === g.id)
        const detail = g.memberIds
          .map((id) => nameOf(db, id) + (id === g.leaderId ? ' (leader)' : ''))
          .join(', ')
        return { id: g.id, name: g.name, detail, done: !!ack, at: ack?.at ?? null }
      })
  }
  rows.sort((a, b) => a.name.localeCompare(b.name))
  const grouped = new Set(db.groups.filter((g) => g.courseId === course.id).flatMap((g) => g.memberIds))
  return {
    total: rows.length,
    done: rows.filter((r) => r.done).length,
    rows,
    ungrouped: assignment.type === 'group' ? course.studentIds.filter((id) => !grouped.has(id)).length : 0,
  }
}

function checkAssignment(data) {
  if (!data.title?.trim()) fail(400, 'Title is required.')
  if (!data.deadline || Number.isNaN(new Date(data.deadline).getTime())) fail(400, 'Pick a valid deadline.')
  try {
    new URL(data.driveLink)
  } catch {
    fail(400, 'Enter a valid OneDrive link.')
  }
  if (!['individual', 'group'].includes(data.type)) fail(400, 'Choose a submission type.')
}

// Every call waits a little and reads the db fresh, like a network request would.
const endpoint = (handler) => async (...args) => {
  await wait()
  return handler(loadDb(), ...args)
}

export const api = {
  hasToken: () => readClaims() !== null,
  logout: () => localStorage.removeItem(TOKEN_KEY),

  register: endpoint((db, { name, email, password, role }) => {
    const clean = email.trim().toLowerCase()
    if (db.users.some((u) => u.email === clean)) fail(409, 'An account with this email already exists.')
    if (!['student', 'professor'].includes(role)) fail(400, 'Choose a role.')
    const user = { id: newId('u'), name: name.trim(), email: clean, passwordHash: hash(password), role }
    db.users.push(user)
    // new students join every course of the semester
    if (role === 'student') db.courses.forEach((c) => c.studentIds.push(user.id))
    saveDb(db)
    return startSession(user)
  }),

  login: endpoint((db, { email, password }) => {
    const user = db.users.find((u) => u.email === email.trim().toLowerCase())
    if (!user || user.passwordHash !== hash(password)) fail(401, 'Incorrect email or password.')
    return startSession(user)
  }),

  me: endpoint((db) => publicUser(requireUser(db))),

  listCourses: endpoint((db) => {
    const user = requireUser(db)
    if (user.role === 'professor') {
      return db.courses
        .filter((c) => c.professorId === user.id)
        .map((c) => ({
          ...courseSummary(c),
          studentCount: c.studentIds.length,
          assignmentCount: db.assignments.filter((a) => a.courseId === c.id).length,
        }))
    }
    return db.courses
      .filter((c) => c.studentIds.includes(user.id))
      .map((c) => {
        const list = db.assignments.filter((a) => a.courseId === c.id)
        return {
          ...courseSummary(c),
          professorName: nameOf(db, c.professorId),
          assignmentCount: list.length,
          doneCount: list.filter((a) => statusFor(db, a, user.id).done).length,
        }
      })
  }),

  createCourse: endpoint((db, { code, name }) => {
    const user = requireUser(db, 'professor')
    if (!code?.trim() || !name?.trim()) fail(400, 'Course code and name are required.')
    const course = {
      id: newId('c'),
      code: code.trim().toUpperCase(),
      name: name.trim(),
      semester: 'Fall 2026',
      professorId: user.id,
      studentIds: db.users.filter((u) => u.role === 'student').map((u) => u.id),
    }
    db.courses.push(course)
    saveDb(db)
    return courseSummary(course)
  }),

  courseView: endpoint((db, courseId) => {
    const user = requireUser(db)
    const course = courseFor(db, user, courseId)
    const list = db.assignments
      .filter((a) => a.courseId === courseId)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
    const base = { course: { ...courseSummary(course), professorName: nameOf(db, course.professorId) } }

    if (user.role === 'professor') {
      return { ...base, assignments: list.map((a) => ({ ...a, progress: progressFor(db, a, course) })) }
    }
    const groups = db.groups.filter((g) => g.courseId === courseId).map((g) => groupView(db, g))
    return {
      ...base,
      groups,
      myGroup: groups.find((g) => g.members.some((m) => m.id === user.id)) ?? null,
      assignments: list.map((a) => ({ ...a, status: statusFor(db, a, user.id) })),
    }
  }),

  createAssignment: endpoint((db, courseId, data) => {
    const user = requireUser(db, 'professor')
    courseFor(db, user, courseId)
    checkAssignment(data)
    const assignment = {
      id: newId('a'),
      courseId,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      driveLink: data.driveLink.trim(),
      type: data.type,
    }
    db.assignments.push(assignment)
    saveDb(db)
    return assignment
  }),

  updateAssignment: endpoint((db, id, data) => {
    const user = requireUser(db, 'professor')
    const assignment = byId(db.assignments, id)
    if (!assignment) fail(404, 'Assignment not found.')
    courseFor(db, user, assignment.courseId)
    checkAssignment(data)
    const hasAcks = db.acks.some((a) => a.assignmentId === id)
    if (data.type !== assignment.type && hasAcks) {
      fail(409, 'The submission type cannot change after students have acknowledged.')
    }
    Object.assign(assignment, {
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      driveLink: data.driveLink.trim(),
      type: data.type,
    })
    saveDb(db)
    return assignment
  }),

  acknowledge: endpoint((db, assignmentId) => {
    const user = requireUser(db, 'student')
    const assignment = byId(db.assignments, assignmentId)
    if (!assignment) fail(404, 'Assignment not found.')
    courseFor(db, user, assignment.courseId)
    const at = new Date().toISOString()

    if (assignment.type === 'individual') {
      if (db.acks.some((a) => a.assignmentId === assignmentId && a.studentId === user.id)) {
        fail(409, 'You have already acknowledged this assignment.')
      }
      db.acks.push({ assignmentId, studentId: user.id, by: user.id, at })
    } else {
      const group = groupOf(db, assignment.courseId, user.id)
      if (!group) fail(400, 'You are not part of any group.')
      if (group.leaderId !== user.id) fail(403, 'Only the group leader can acknowledge this assignment.')
      if (db.acks.some((a) => a.assignmentId === assignmentId && a.groupId === group.id)) {
        fail(409, 'Your group has already acknowledged this assignment.')
      }
      db.acks.push({ assignmentId, groupId: group.id, by: user.id, at })
    }
    saveDb(db)
    return { at }
  }),

  createGroup: endpoint((db, courseId, name) => {
    const user = requireUser(db, 'student')
    courseFor(db, user, courseId)
    if (!name?.trim()) fail(400, 'Give your group a name.')
    if (groupOf(db, courseId, user.id)) fail(409, 'You are already in a group for this course.')
    const taken = db.groups.some((g) => g.courseId === courseId && g.name.toLowerCase() === name.trim().toLowerCase())
    if (taken) fail(409, 'A group with that name already exists in this course.')
    const group = { id: newId('g'), courseId, name: name.trim(), leaderId: user.id, memberIds: [user.id] }
    db.groups.push(group)
    saveDb(db)
    return groupView(db, group)
  }),

  joinGroup: endpoint((db, groupId) => {
    const user = requireUser(db, 'student')
    const group = byId(db.groups, groupId)
    if (!group) fail(404, 'Group not found.')
    courseFor(db, user, group.courseId)
    if (groupOf(db, group.courseId, user.id)) fail(409, 'You are already in a group for this course.')
    group.memberIds.push(user.id)
    saveDb(db)
    return groupView(db, group)
  }),
}
