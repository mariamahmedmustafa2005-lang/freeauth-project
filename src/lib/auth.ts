import type { PasswordStrength } from '../types/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return { score: 0, label: 'Too short' }
  if (password.length < 8) return { score: 1, label: 'Too short' }

  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const labels: PasswordStrength['label'][] = ['Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score] }
}

export function mockRequest<T>(result: T, delay = 850): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(result), delay)
  })
}
