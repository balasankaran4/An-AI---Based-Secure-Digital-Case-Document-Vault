import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createShareRequest, getApprovals, getDocuments } from '../../services/api'
import { users } from '../../data/users'
import { departments } from '../../data/departments'
import { Breadcrumbs, DataTable, PageHeader, StatusBadge } from '../../components/common/ui'
import { useUI } from '../../context/UIContext'
import type { AccessRequest, DepartmentId, DocumentRecord, SharePermission } from '../../types'

export function SharingPage() {
  const { user } = useAuth()
  const { showToast } = useUI()
  const [docs, setDocs] = useState<DocumentRecord[]>([])
  const [reqs, setReqs] = useState<AccessRequest[]>([])
  const [documentId, setDocumentId] = useState('DOC-LEG-001')
  const [targetDepartment, setTargetDepartment] = useState<DepartmentId>('LEGAL')
  const [targetOfficerId, setTargetOfficerId] = useState('u-inv')
  const [permission, setPermission] = useState<SharePermission>('VIEW')
  const [durationDays, setDurationDays] = useState(7)
  const [reason, setReason] = useState('Need authorized context for CASE-2026-001.')

  useEffect(() => {
    if (!user) return
    void getDocuments(user).then(setDocs)
    void getApprovals().then((r) => setReqs(r.filter((x) => x.requesterId === user.id)))
  }, [user])

  if (!user) return null

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Sharing' }]} />
      <PageHeader
        title="Cross-department sharing"
        subtitle="Request controlled access. Approvals create audit events. Restricted documents are not listed if unauthorized."
      />
      <form
        className="grid gap-3 border border-line bg-white p-4 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          void createShareRequest(user, {
            documentId,
            targetDepartment,
            targetOfficerId,
            permission,
            durationDays,
            reason,
          }).then(() => {
            showToast('Access request submitted.')
            void getApprovals().then((r) => setReqs(r.filter((x) => x.requesterId === user.id)))
          })
        }}
      >
        <label className="text-sm">
          Document
          <select className="mt-1 w-full border border-line px-2 py-2" value={documentId} onChange={(e) => setDocumentId(e.target.value)}>
            {docs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
            <option value="DOC-LEG-001">Legal-Opinion-001 (may be restricted — request still allowed)</option>
          </select>
        </label>
        <label className="text-sm">
          Target Department
          <select
            className="mt-1 w-full border border-line px-2 py-2"
            value={targetDepartment}
            onChange={(e) => setTargetDepartment(e.target.value as DepartmentId)}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Target Officer
          <select className="mt-1 w-full border border-line px-2 py-2" value={targetOfficerId} onChange={(e) => setTargetOfficerId(e.target.value)}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.officerId})
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Permission
          <select className="mt-1 w-full border border-line px-2 py-2" value={permission} onChange={(e) => setPermission(e.target.value as SharePermission)}>
            <option>VIEW</option>
            <option>DOWNLOAD</option>
            <option>COMMENT</option>
            <option>MODIFY</option>
            <option>RESHARE</option>
          </select>
        </label>
        <label className="text-sm">
          Access duration (days)
          <input type="number" className="mt-1 w-full border border-line px-2 py-2" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
        </label>
        <label className="text-sm md:col-span-2">
          Reason
          <textarea className="mt-1 w-full border border-line px-2 py-2" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <button className="bg-navy px-3 py-2 text-sm text-white" type="submit">
          Submit request
        </button>
      </form>
      <p className="mt-4 text-sm">
        Restricted legal document demo: Investigation Officer should open{' '}
        <Link className="text-navy underline" to="/documents/DOC-LEG-001">
          Legal-Opinion-001
        </Link>{' '}
        to see Access Restricted, then request access. Higher Authority approves on Approvals.
      </p>
      <h2 className="mt-6 text-sm font-semibold text-navy">My requests</h2>
      <DataTable headers={['Request ID', 'Document', 'Permission', 'Status', 'Date']}>
        {reqs.map((r) => (
          <tr key={r.id}>
            <td className="border-b border-line px-3 py-2">{r.id}</td>
            <td className="border-b border-line px-3 py-2">{r.documentId}</td>
            <td className="border-b border-line px-3 py-2">{r.permission}</td>
            <td className="border-b border-line px-3 py-2">
              <StatusBadge value={r.status} />
            </td>
            <td className="border-b border-line px-3 py-2">{r.date}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
