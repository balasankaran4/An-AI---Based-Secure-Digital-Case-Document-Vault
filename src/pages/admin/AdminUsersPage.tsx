import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsers } from '../../services/api'
import { canManageUsers } from '../../auth/permissions'
import { Breadcrumbs, DataTable, Modal, PageHeader, StatusBadge } from '../../components/common/ui'
import { useUI } from '../../context/UIContext'
import type { User } from '../../types'

export function AdminUsersPage() {
  const { user } = useAuth()
  const { showToast } = useUI()
  const [rows, setRows] = useState<User[]>([])
  const [view, setView] = useState<User | null>(null)

  useEffect(() => {
    void getUsers().then(setRows)
  }, [])

  if (!user) return null
  if (!canManageUsers(user)) return <Navigate to="/access-denied" replace />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Administration', to: '/admin' }, { label: 'Users' }]} />
      <PageHeader title="User management" />
      <DataTable headers={['Officer ID', 'Name', 'Department', 'Role', 'Jurisdiction', 'Clearance', 'Status', 'Last Login', 'Actions']}>
        {rows.map((u) => (
          <tr key={u.id}>
            <td className="border-b border-line px-3 py-2 font-mono text-xs">{u.officerId}</td>
            <td className="border-b border-line px-3 py-2">{u.name}</td>
            <td className="border-b border-line px-3 py-2">{u.department}</td>
            <td className="border-b border-line px-3 py-2">{u.role}</td>
            <td className="border-b border-line px-3 py-2">{u.jurisdiction}</td>
            <td className="border-b border-line px-3 py-2">{u.clearance}</td>
            <td className="border-b border-line px-3 py-2">
              <StatusBadge value={u.status} />
            </td>
            <td className="border-b border-line px-3 py-2 text-xs">{u.lastLogin}</td>
            <td className="border-b border-line px-3 py-2 text-xs">
              <button type="button" className="text-navy underline" onClick={() => setView(u)}>
                View
              </button>
              <button type="button" className="ml-2 text-navy underline" onClick={() => showToast('Edit is simulated in this prototype.')}>
                Edit
              </button>
              <button type="button" className="ml-2 text-danger underline" onClick={() => showToast('Disable is simulated. Demo users remain available.')}>
                Disable
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
      <Modal open={!!view} title={view?.name ?? ''} onClose={() => setView(null)}>
        {view ? (
          <div className="text-sm">
            <p>{view.officerId}</p>
            <p>{view.designation}</p>
            <p>
              {view.department} · {view.clearance}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
