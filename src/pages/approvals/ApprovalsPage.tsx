import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { approveRequest, getApprovals, rejectRequest } from '../../services/api'
import { canApproveRequest } from '../../auth/permissions'
import { Breadcrumbs, ConfirmDialog, DataTable, PageHeader, StatusBadge } from '../../components/common/ui'
import { useUI } from '../../context/UIContext'
import type { AccessRequest } from '../../types'

export function ApprovalsPage() {
  const { user } = useAuth()
  const { showToast } = useUI()
  const [rows, setRows] = useState<AccessRequest[]>([])
  const [confirm, setConfirm] = useState<{ id: string; mode: 'approve' | 'reject' } | null>(null)

  useEffect(() => {
    void getApprovals().then(setRows)
  }, [])

  if (!user) return null
  if (!canApproveRequest(user)) return <Navigate to="/access-denied" replace />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Approvals' }]} />
      <PageHeader title="Approval workflow" subtitle="Approve or reject creates append-only audit events (prototype)." />
      <DataTable headers={['Request ID', 'Requester', 'Department', 'Document', 'Permission', 'Reason', 'Date', 'Status', 'Actions']}>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="border-b border-line px-3 py-2 text-xs">{r.id}</td>
            <td className="border-b border-line px-3 py-2">{r.requesterName}</td>
            <td className="border-b border-line px-3 py-2">{r.requesterDepartment}</td>
            <td className="border-b border-line px-3 py-2">{r.documentId}</td>
            <td className="border-b border-line px-3 py-2">{r.permission}</td>
            <td className="border-b border-line px-3 py-2 text-xs">{r.reason}</td>
            <td className="border-b border-line px-3 py-2 text-xs">{r.date}</td>
            <td className="border-b border-line px-3 py-2">
              <StatusBadge value={r.status} />
            </td>
            <td className="border-b border-line px-3 py-2">
              {r.status === 'PENDING' ? (
                <div className="flex flex-col gap-1">
                  <button type="button" className="text-left text-xs text-navy underline" onClick={() => setConfirm({ id: r.id, mode: 'approve' })}>
                    Approve
                  </button>
                  <button type="button" className="text-left text-xs text-danger underline" onClick={() => setConfirm({ id: r.id, mode: 'reject' })}>
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-xs">View Details</span>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.mode === 'approve' ? 'Approve request' : 'Reject request'}
        body="This action is recorded in the append-only audit trail."
        confirmLabel="Confirm"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return
          const fn = confirm.mode === 'approve' ? approveRequest : rejectRequest
          void fn(user, confirm.id).then(() => {
            showToast(confirm.mode === 'approve' ? 'Access approved. Grant issued.' : 'Request rejected.')
            void getApprovals().then(setRows)
            setConfirm(null)
          })
        }}
      />
    </div>
  )
}
