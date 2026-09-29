import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DEMO_OTP } from '../../config/app'

const STEPS = ['Identity Verification', 'Password Verification', 'MFA Verification', 'Access Policy Verification']

export function MfaPage() {
  const { verifyMfa, user, authStatus } = useAuth()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(2)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      setProgress(3)
      await verifyMfa(otp)
      setProgress(4)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MFA failed')
      setProgress(2)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Multi-Factor Authentication</h1>
      <p className="mt-1 text-sm text-muted">
        Officer {user?.officerId ?? ''} — password stage: {authStatus}. Demo OTP: {DEMO_OTP}
      </p>
      <ol className="mt-6 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s} className={`border px-2 py-2 ${i < progress ? 'border-navy bg-sand font-semibold text-navy' : 'border-line text-muted'}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      <div className="mt-4 h-2 bg-line">
        <div className="h-2 bg-navy transition-all" style={{ width: `${(progress / 4) * 100}%` }} />
      </div>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 border border-line bg-white p-5">
        <label className="block text-sm">
          6-digit OTP
          <input
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="mt-1 w-full border border-line px-3 py-2 tracking-[0.4em]"
            aria-describedby="otp-help"
          />
        </label>
        <p id="otp-help" className="mt-1 text-xs text-muted">
          Enter 123456 for this prototype.
        </p>
        {error ? (
          <p role="alert" className="mt-2 text-sm text-danger">
            {error}
          </p>
        ) : null}
        <button disabled={busy || otp.length !== 6} className="mt-4 w-full bg-navy py-2 text-sm font-semibold text-white disabled:opacity-50" type="submit">
          Verify and continue
        </button>
      </form>
    </div>
  )
}
