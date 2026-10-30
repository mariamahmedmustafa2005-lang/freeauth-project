import { Check } from 'lucide-react'
import { getPasswordStrength } from '../lib/auth'

type PasswordStrengthProps = {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password)
  const hints = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Symbol', met: /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <div className="strength" aria-live="polite">
      <div className="strength-heading">
        <span>Password strength</span>
        <span className={`strength-label strength-${strength.score}`}>{password ? strength.label : 'Add a password'}</span>
      </div>
      <div className="strength-bars" aria-label={`Password strength: ${strength.label}`}>
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={`strength-bar ${index < strength.score ? `is-active strength-${strength.score}` : ''}`}
          />
        ))}
      </div>
      <div className="strength-hints">
        {hints.map((hint) => (
          <span className={hint.met ? 'hint is-met' : 'hint'} key={hint.label}>
            <Check size={12} strokeWidth={2.5} aria-hidden="true" />
            {hint.label}
          </span>
        ))}
      </div>
    </div>
  )
}
