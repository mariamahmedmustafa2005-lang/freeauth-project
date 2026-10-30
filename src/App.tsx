import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { NoticeBanner } from './components/NoticeBanner'
import { OtpInput } from './components/OtpInput'
import { PasswordStrength } from './components/PasswordStrength'
import { isValidEmail, mockRequest } from './lib/auth'
import type { AuthView, Notice } from './types/auth'

const EMPTY_OTP = ['', '', '', '', '', '']

function App() {
  const [view, setView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP)
  const [notice, setNotice] = useState<Notice>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousView = useRef<AuthView>(view)

  useEffect(() => {
    if (previousView.current !== view) {
      previousView.current = view
      window.requestAnimationFrame(() => headingRef.current?.focus())
    }
  }, [view])

  function switchView(nextView: AuthView) {
    setNotice(null)
    setView(nextView)
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(null)
    if (!isValidEmail(email)) {
      setNotice({ kind: 'error', message: 'Enter a valid email address to continue.' })
      return
    }
    if (!password) {
      setNotice({ kind: 'error', message: 'Enter your password to continue.' })
      return
    }

    setIsSubmitting(true)
    await mockRequest(true)
    if (email.toLowerCase().includes('blocked') || password === 'wrong') {
      setNotice({ kind: 'error', message: 'Those details did not match. Check them and try again.' })
    } else {
      setNotice({ kind: 'success', message: 'You’re signed in. This is a simulated demo session.' })
    }
    setIsSubmitting(false)
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(null)
    if (!isValidEmail(email)) {
      setNotice({ kind: 'error', message: 'Enter a valid email address to create your account.' })
      return
    }
    if (password.length < 8) {
      setNotice({ kind: 'error', message: 'Use at least 8 characters for your password.' })
      return
    }
    if (password !== confirmPassword) {
      setNotice({ kind: 'error', message: 'Those passwords do not match yet.' })
      return
    }

    setIsSubmitting(true)
    await mockRequest(true)
    setIsSubmitting(false)
    if (email.toLowerCase().includes('taken')) {
      setNotice({ kind: 'error', message: 'That email is already registered. Try signing in instead.' })
      return
    }
    setOtp([...EMPTY_OTP])
    setView('otp')
    setNotice({ kind: 'success', message: `A verification code was sent to ${email}.` })
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(null)
    if (otp.some((digit) => !digit)) {
      setNotice({ kind: 'error', message: 'Enter all six digits to verify your email.' })
      return
    }

    setIsSubmitting(true)
    await mockRequest(true)
    if (otp.join('') !== '123456') {
      setNotice({ kind: 'error', message: 'That code did not match. For this demo, use 123456.' })
    } else {
      setNotice({ kind: 'success', message: 'Email verified. Your demo account is ready.' })
    }
    setIsSubmitting(false)
  }

  async function handleResend() {
    setIsResending(true)
    setNotice(null)
    await mockRequest(true, 650)
    setIsResending(false)
    setNotice({ kind: 'success', message: `A fresh demo code was sent to ${email}.` })
  }

  function goToLogin() {
    setPassword('')
    setConfirmPassword('')
    setOtp([...EMPTY_OTP])
    switchView('login')
  }

  const stepNumber = view === 'login' ? 1 : view === 'register' ? 2 : 3

  return (
    <main className="page-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-orbit ambient-orbit-one" aria-hidden="true" />
      <div className="ambient-orbit ambient-orbit-two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="FreeAuth home">
          <span className="brand-mark"><ShieldCheck size={21} strokeWidth={2.2} aria-hidden="true" /></span>
          <span className="brand-name">free<span>auth</span></span>
        </a>
        <div className="environment-pill"><span className="environment-dot" />FRONTEND DEMO</div>
      </header>

      <section className="auth-wrap" id="top" aria-label="Authentication demo">
        <div className="card-glow" aria-hidden="true" />
        <article className="auth-card">
          <div className="card-meta">
            <div className="secure-label"><span className="secure-mark"><Fingerprint size={15} aria-hidden="true" /></span>SECURE ACCESS</div>
            <span className="step-label">0{stepNumber} <span>/ 03</span></span>
          </div>

          <div className="step-indicator" aria-label={`Step ${stepNumber} of 3`}>
            {[1, 2, 3].map((step) => (
              <span className={`step-track ${step <= stepNumber ? 'step-active' : ''}`} key={step} />
            ))}
          </div>

          <div className="card-heading">
            {view === 'login' && <>
              <h1 ref={headingRef} id="auth-heading" tabIndex={-1}>Welcome back<span className="heading-period">.</span></h1>
              <p>Sign in to pick up right where you left off.</p>
            </>}
            {view === 'register' && <>
              <h1 ref={headingRef} id="auth-heading" tabIndex={-1}>Create your account<span className="heading-period">.</span></h1>
              <p>A few details, then we’ll verify your email.</p>
            </>}
            {view === 'otp' && <>
              <h1 ref={headingRef} id="auth-heading" tabIndex={-1}>Check your inbox<span className="heading-period">.</span></h1>
              <p>We sent a six-digit code to <strong className="email-emphasis">{email || 'your email'}</strong>.</p>
            </>}
          </div>

          {view === 'login' && (
            <form className="auth-form" onSubmit={handleLogin} noValidate aria-busy={isSubmitting}>
              <div className="field-group">
                <label htmlFor="login-email">Email address</label>
                <div className="input-shell">
                  <Mail size={17} className="input-icon" aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setNotice(null) }}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              <div className="field-group">
                <div className="label-row"><label htmlFor="login-password">Password</label><button className="text-button forgot-link" type="button" onClick={() => setNotice({ kind: 'success', message: 'Password reset is a UI-only placeholder in this demo.' })}>Forgot password?</button></div>
                <div className="input-shell">
                  <LockKeyhole size={17} className="input-icon" aria-hidden="true" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); setNotice(null) }}
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    className="visibility-button"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <NoticeBanner notice={notice} />
              <span className="sr-only" role="status" aria-live="polite">{isSubmitting ? 'Signing in…' : ''}</span>
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><LoaderCircle size={18} className="spinner" aria-hidden="true" />Signing in…</> : <>Sign in <ArrowRight size={17} aria-hidden="true" /></>}
              </button>
              <p className="form-switch">New to FreeAuth? <button type="button" className="text-button link-button" onClick={() => switchView('register')}>Create an account <ArrowRight size={14} aria-hidden="true" /></button></p>
            </form>
          )}

          {view === 'register' && (
            <form className="auth-form register-form" onSubmit={handleRegister} noValidate aria-busy={isSubmitting}>
              <div className="field-group">
                <label htmlFor="register-email">Email address</label>
                <div className="input-shell">
                  <Mail size={17} className="input-icon" aria-hidden="true" />
                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setNotice(null) }}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="register-password">Create password</label>
                <div className="input-shell">
                  <LockKeyhole size={17} className="input-icon" aria-hidden="true" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); setNotice(null) }}
                    disabled={isSubmitting}
                    required
                  />
                  <button className="visibility-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>
                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>
              <div className="field-group">
                <label htmlFor="confirm-password">Confirm password</label>
                <div className="input-shell">
                  <Check size={17} className="input-icon" aria-hidden="true" />
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(event) => { setConfirmPassword(event.target.value); setNotice(null) }}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              <NoticeBanner notice={notice} />
              <span className="sr-only" role="status" aria-live="polite">{isSubmitting ? 'Creating account…' : ''}</span>
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><LoaderCircle size={18} className="spinner" aria-hidden="true" />Creating account…</> : <>Create account <ArrowRight size={17} aria-hidden="true" /></>}
              </button>
              <p className="form-switch">Already have an account? <button type="button" className="text-button link-button" onClick={() => switchView('login')}>Sign in <ArrowRight size={14} aria-hidden="true" /></button></p>
            </form>
          )}

          {view === 'otp' && (
            <form className="auth-form otp-form" onSubmit={handleVerify} noValidate aria-busy={isSubmitting || isResending}>
              <div className="otp-label-row"><span>Verification code</span><span className="code-expiry"><span className="environment-dot" />EXPIRES IN 10:00</span></div>
              <OtpInput digits={otp} onChange={(next) => { setOtp(next); setNotice(null) }} disabled={isSubmitting} />
              <p className="demo-code"><span>DEMO CODE</span><code>123456</code></p>
              <NoticeBanner notice={notice} />
              <span className="sr-only" role="status" aria-live="polite">{isSubmitting ? 'Verifying email…' : isResending ? 'Sending a new verification code…' : ''}</span>
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><LoaderCircle size={18} className="spinner" aria-hidden="true" />Verifying…</> : <>Verify email <ArrowRight size={17} aria-hidden="true" /></>}
              </button>
              <div className="resend-row"><span>Didn’t receive a code?</span><button className="text-button" type="button" onClick={handleResend} disabled={isResending || isSubmitting}>{isResending ? 'Sending…' : 'Resend code'}</button></div>
              <button className="back-link" type="button" onClick={() => switchView('register')}><ArrowLeft size={14} aria-hidden="true" />Use a different email</button>
              {notice?.kind === 'success' && notice.message.includes('verified') && <button className="back-link return-link" type="button" onClick={goToLogin}>Return to sign in <ArrowRight size={14} aria-hidden="true" /></button>}
            </form>
          )}

          <div className="card-security"><ShieldCheck size={15} aria-hidden="true" /><span>Your information stays on this device for this demo.</span></div>
        </article>

        <div className="below-card"><span className="below-line" />Built for clarity. Designed for trust.<span className="below-line" /></div>
      </section>

      <footer className="page-footer"><span>FREEAUTH AUTH CARD</span><span>UI CONCEPT <span className="footer-separator">/</span> 2026</span></footer>
    </main>
  )
}

export default App
