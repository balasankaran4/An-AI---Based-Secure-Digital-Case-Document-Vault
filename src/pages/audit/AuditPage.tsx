import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAuditLogs } from '../../services/api'
import { canViewAudit } from '../../auth/permissions'
import { Breadcrumbs, DataTable, EmptyState, LoadingState, PageHeader, SearchBar, StatusBadge } from '../../components/common/ui'
import type { AuditEvent } from '../../types'

export function AuditPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<AuditEvent[]>([])
  const [q, setQ] = useState('')
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getAuditLogs().then((a) => {
      setRows(a)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (action && r.action !== action) return false
        return `${r.userName} ${r.resource} ${r.action} ${r.caseId}`.toLowerCase().includes(q.toLowerCase())
      }),
    [rows, q, action],
  )

  if (!user) return null
  if (!canViewAudit(user)) return <Navigate to="/access-denied" replace />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Audit Trail' }]} />
      <PageHeader title="Audit trail" subtitle="Audit records are append-only in this prototype." />
      <div className="mb-3 grid gap-2 md:grid-cols-2">
        <SearchBar value={q} onChange={setQ} placeholder="Search user, resource, case" />
        <select className="border border-line px-2 py-2 text-sm" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">All actions</option>
          {['LOGIN', 'UPLOAD', 'VIEW', 'DOWNLOAD', 'SHARE', 'SIGN', 'VERIFY', 'ACCESS_REQUEST', 'ACCESS_APPROVED', 'ACCESS_DENIED', 'VERSION_CREATED'].map(
            (a) => (
              <option key={a}>{a}</option>
            ),
          )}
        </select>
      </div>
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState title="No audit records." body="No matching append-only events." />
      ) : (
        <DataTable headers={['Timestamp', 'User', 'Department', 'Action', 'Resource', 'Case ID', 'IP/Session ID', 'Result']}>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td className="border-b border-line px-3 py-2 text-xs">{r.timestamp}</td>
              <td className="border-b border-line px-3 py-2">{r.userName}</td>
              <td className="border-b border-line px-3 py-2">{r.department}</td>
              <td className="border-b border-line px-3 py-2">{r.action}</td>
              <td className="border-b border-line px-3 py-2">{r.resource}</td>
              <td className="border-b border-line px-3 py-2">{r.caseId ?? '—'}</td>
              <td className="border-b border-line px-3 py-2 font-mono text-xs">{r.sessionId}</td>
              <td className="border-b border-line px-3 py-2">
                <StatusBadge value={r.result} />
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  )
}
