import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { routeAllowed } from '../../auth/permissions'

export function ProtectedRoute() {
  const { user, authStatus } = useAuth()
  const location = useLocation()

  if (authStatus === 'password') return <Navigate to="/mfa" replace state={{ from: location.pathname }} />
  if (!user || authStatus !== 'authenticated') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!routeAllowed(user, location.pathname)) {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

export function PasswordGate() {
  const { authStatus } = useAuth()
  if (authStatus === 'anonymous') return <Navigate to="/login" replace />
  if (authStatus === 'authenticated') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
