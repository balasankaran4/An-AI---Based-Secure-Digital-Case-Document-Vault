import { useAuth } from '../../context/AuthContext'
import { departmentLabel } from '../../auth/permissions'
import { Breadcrumbs, PageHeader, StatusBadge } from '../../components/common/ui'
import { useUI } from '../../context/UIContext'

export function ProfilePage() {
  const { user } = useAuth()
  const { showToast } = useUI()
  if (!user) return null
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Profile' }]} />
      <PageHeader title="Officer profile" />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="border border-line bg-white p-4 text-sm">
          <p>Officer Name: {user.name}</p>
          <p>Officer ID: {user.officerId}</p>
          <p>Department: {departmentLabel(user.department)}</p>
          <p>Designation: {user.designation}</p>
          <p>Role: {user.role}</p>
          <p>Jurisdiction: {user.jurisdiction}</p>
          <p>Security Clearance: {user.clearance}</p>
          <p>
            Authentication Status: <StatusBadge value="MFA ENABLED" />
          </p>
          <p>Last Login: {user.lastLogin}</p>
        </section>
        <section className="border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-navy">Security</h2>
          <button type="button" className="mt-2 border border-line px-3 py-2" onClick={() => showToast('Password change is simulated.')}>
            Change Password
          </button>
          <p className="mt-3">MFA Status: ENABLED</p>
          <p>Active Sessions: 1 (this browser · LocalStorage)</p>
        </section>
      </div>
    </div>
  )
}
