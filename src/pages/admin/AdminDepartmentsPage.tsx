import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { canManageUsers, hasPermission } from '../../auth/permissions'
import { departments } from '../../data/departments'
import { Breadcrumbs, DataTable, PageHeader } from '../../components/common/ui'

export function AdminDepartmentsPage() {
  const { user } = useAuth()
  if (!user) return null
  if (!hasPermission(user, 'VIEW_ADMIN') && !canManageUsers(user)) return <Navigate to="/access-denied" replace />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Administration', to: '/admin' }, { label: 'Departments' }]} />
      <PageHeader title="Department management" />
      <DataTable headers={['Department', 'Users', 'Cases', 'Documents', 'Pending Requests']}>
        {departments.map((d) => (
          <tr key={d.id}>
            <td className="border-b border-line px-3 py-2">
              <p className="font-semibold">{d.name}</p>
              <p className="text-xs text-muted">{d.description}</p>
            </td>
            <td className="border-b border-line px-3 py-2">{d.userCount}</td>
            <td className="border-b border-line px-3 py-2">{d.caseCount}</td>
            <td className="border-b border-line px-3 py-2">{d.documentCount}</td>
            <td className="border-b border-line px-3 py-2">{d.pendingRequests}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
