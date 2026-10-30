import { useRef, type ClipboardEvent } from 'react'

type OtpInputProps = {
  digits: string[]
  onChange: (digits: string[]) => void
  disabled: boolean
}

export function OtpInput({ digits, onChange, disabled }: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  function updateDigit(index: number, rawValue: string) {
    const value = rawValue.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = value
    onChange(next)
    if (value && index < digits.length - 1) inputs.current[index + 1]?.focus()
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits.length)
    if (!pasted) return
    event.preventDefault()
    const next = Array.from({ length: digits.length }, (_, index) => pasted[index] ?? '')
    onChange(next)
    inputs.current[Math.min(pasted.length, digits.length - 1)]?.focus()
  }

  return (
    <div className="otp-inputs" onPaste={handlePaste} role="group" aria-label="Six-digit verification code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => { inputs.current[index] = element }}
          className={`otp-digit ${digit ? 'has-value' : ''}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${digits.length}`}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digits[index] && index > 0) {
              inputs.current[index - 1]?.focus()
            }
            if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
            if (event.key === 'ArrowRight' && index < digits.length - 1) inputs.current[index + 1]?.focus()
          }}
        />
      ))}
    </div>
  )
}
