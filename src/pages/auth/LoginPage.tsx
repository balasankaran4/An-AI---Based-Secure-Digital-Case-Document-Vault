import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_PASSWORD, users } from '../../data/users'
import { departments } from '../../data/departments'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'

export function LoginPage() {
  const { login } = useAuth()
  const { t, showToast } = useUI()
  const navigate = useNavigate()
  const [officerId, setOfficerId] = useState('INV-01')
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [department, setDepartment] = useState('POLICE')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(officerId, password)
      navigate('/mfa')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Secure Officer Login</h1>
      <p className="mt-1 text-sm text-muted">
        Selected department is for demonstration only and does not grant permissions. Access follows the officer&apos;s
        stored role and attributes.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4 border border-line bg-white p-5">
        <label className="block text-sm">
          Officer ID
          <input
            required
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            className="mt-1 w-full border border-line px-3 py-2"
            autoComplete="username"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-line px-3 py-2"
            autoComplete="current-password"
          />
        </label>
        <label className="block text-sm">
          Department
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 w-full border border-line px-3 py-2">
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        <button disabled={busy} className="w-full bg-navy py-2 text-sm font-semibold text-white disabled:opacity-60" type="submit">
          {busy ? 'Verifying…' : t('secureLogin')}
        </button>
        <div className="flex justify-between text-xs text-navy">
          <button type="button" className="underline" onClick={() => showToast('Contact department administrator (prototype).')}>
            Forgot Password?
          </button>
          <Link to="/help-public" className="underline">
            Help
          </Link>
        </div>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted">{t('auth.only')}</p>
      </form>

      <div className="mt-6 border border-line bg-sand p-4">
        <p className="text-sm font-semibold text-navy">Development demo panel</p>
        <p className="text-xs text-muted">Password for all demo users: {DEMO_PASSWORD}. Not a production credential store.</p>
        <div className="mt-3 table-wrap">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                <th className="py-1">Officer ID</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="py-1 font-mono">{u.officerId}</td>
                  <td>{u.designation}</td>
                  <td>
                    <button
                      type="button"
                      className="text-navy underline"
                      onClick={() => {
                        setOfficerId(u.officerId)
                        setPassword(DEMO_PASSWORD)
                        setDepartment(u.department)
                      }}
                    >
                      Use
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
