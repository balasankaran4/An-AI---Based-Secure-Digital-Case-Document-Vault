import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hasPermission } from '../../auth/permissions'
import { Breadcrumbs, PageHeader } from '../../components/common/ui'

const bars = [
  { label: 'Case Summary', value: 72 },
  { label: 'Document Activity', value: 64 },
  { label: 'Access Report', value: 48 },
  { label: 'Security Report', value: 88 },
  { label: 'Evidence Report', value: 55 },
  { label: 'Audit Report', value: 70 },
  { label: 'Department Activity', value: 61 },
]

export function ReportsPage() {
  const { user } = useAuth()
  if (!user) return null
  if (!hasPermission(user, 'VIEW_REPORTS')) return <Navigate to="/access-denied" replace />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Reports' }]} />
      <PageHeader title="Reports" subtitle="Simple activity indicators from mock data. Not a live analytics platform." />
      <div className="space-y-4 border border-line bg-white p-4">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{b.label}</span>
              <span>{b.value}%</span>
            </div>
            <div className="h-3 bg-sand">
              <div className="h-3 bg-navy" style={{ width: `${b.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
