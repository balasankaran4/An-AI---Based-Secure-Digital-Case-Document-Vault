import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hasPermission } from '../../auth/permissions'
import { Breadcrumbs, PageHeader, StatsCard } from '../../components/common/ui'
import { departments } from '../../data/departments'

export function AdminPage() {
  const { user } = useAuth()
  if (!user) return null
  if (!hasPermission(user, 'VIEW_ADMIN')) return <Navigate to="/access-denied" replace />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Administration' }]} />
      <PageHeader title="Administration" subtitle="Authorized administrators only. Evidence records are not modified from this panel." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link className="border border-line bg-white p-4 text-sm font-semibold text-navy" to="/admin/users">
          Users
        </Link>
        <Link className="border border-line bg-white p-4 text-sm font-semibold text-navy" to="/admin/departments">
          Departments
        </Link>
        <div className="border border-line bg-white p-4 text-sm">
          <p className="font-semibold text-navy">Roles</p>
          <p className="text-muted">Nine demo roles with distinct permissions.</p>
        </div>
        <div className="border border-line bg-white p-4 text-sm">
          <p className="font-semibold text-navy">Permissions</p>
          <p className="text-muted">RBAC matrix in src/auth/permissions.ts</p>
        </div>
        <div className="border border-line bg-white p-4 text-sm">
          <p className="font-semibold text-navy">Access Policies</p>
          <p className="text-muted">ABAC: department, jurisdiction, assignment, clearance, classification.</p>
        </div>
        <div className="border border-line bg-white p-4 text-sm">
          <p className="font-semibold text-navy">Retention Policies</p>
          <p className="text-muted">10–15 year legal hold (prototype labels).</p>
        </div>
        <div className="border border-line bg-white p-4 text-sm">
          <p className="font-semibold text-navy">Security Configuration</p>
          <p className="text-muted">MFA required · session mock in LocalStorage.</p>
        </div>
        <div className="border border-line bg-white p-4 text-sm">
          <p className="font-semibold text-navy">System Health</p>
          <p className="text-success font-semibold">Prototype services: OPERATIONAL</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {departments.map((d) => (
          <StatsCard key={d.id} label={d.name} value={d.userCount} hint={`${d.documentCount} documents`} />
        ))}
      </div>
    </div>
  )
}
