export type AuthView = 'login' | 'register' | 'otp'

export type Notice = {
  kind: 'error' | 'success'
  message: string
} | null

export type PasswordStrength = {
  score: number
  label: 'Too short' | 'Weak' | 'Fair' | 'Good' | 'Strong'
}
