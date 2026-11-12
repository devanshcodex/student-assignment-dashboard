const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function checkEmail(email, errors) {
  if (!email.trim()) errors.email = 'Enter your email.'
  else if (!emailPattern.test(email.trim())) errors.email = 'Enter a valid email address.'
}

export function validateLogin({ email, password }) {
  const errors = {}
  checkEmail(email, errors)
  if (!password) errors.password = 'Enter your password.'
  return errors
}

export function validateRegister({ name, email, password, confirm, role }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Enter your full name.'
  checkEmail(email, errors)
  if (password.length < 8) errors.password = 'Use at least 8 characters.'
  else if (!/\d/.test(password)) errors.password = 'Include at least one number.'
  if (confirm !== password) errors.confirm = 'Passwords do not match.'
  if (!role) errors.role = 'Choose Student or Professor.'
  return errors
}

export function validateAssignment({ title, deadline, driveLink }) {
  const errors = {}
  if (!title.trim()) errors.title = 'Enter a title.'
  if (!deadline) errors.deadline = 'Pick a deadline.'
  try {
    const url = new URL(driveLink)
    if (!/^https?:$/.test(url.protocol)) throw new Error()
  } catch {
    errors.driveLink = 'Enter a full link, for example https://1drv.ms/...'
  }
  return errors
}

export function validateCourse({ code, name }) {
  const errors = {}
  if (!code.trim()) errors.code = 'Enter a course code.'
  if (!name.trim()) errors.name = 'Enter a course name.'
  return errors
}
