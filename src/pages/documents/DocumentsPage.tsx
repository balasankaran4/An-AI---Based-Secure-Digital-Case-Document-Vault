import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDocuments } from '../../services/api'
import { hasPermission } from '../../auth/permissions'
import { Breadcrumbs, DataTable, EmptyState, LoadingState, PageHeader, SearchBar, StatusBadge } from '../../components/common/ui'
import type { DocumentRecord } from '../../types'

export function DocumentsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [cls, setCls] = useState('')
  const [dept, setDept] = useState('')
  const [integrity, setIntegrity] = useState('')

  useEffect(() => {
    if (!user) return
    void getDocuments(user).then((d) => {
      setRows(d)
      setLoading(false)
    })
  }, [user])

  const filtered = useMemo(() => {
    return rows.filter((d) => {
      if (cls && d.classification !== cls) return false
      if (dept && d.department !== dept) return false
      if (integrity && d.integrity !== integrity) return false
      return `${d.id} ${d.name} ${d.caseId} ${d.type}`.toLowerCase().includes(q.toLowerCase())
    })
  }, [rows, q, cls, dept, integrity])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Documents' }]} />
      <PageHeader
        title="Secure Document Vault"
        subtitle="Centralized storage with department, role, and document-level authorization."
        actions={
          user && hasPermission(user, 'UPLOAD_DOCUMENTS') ? (
            <Link to="/documents/upload" className="bg-navy px-3 py-2 text-sm font-semibold text-white">
              Upload Document
            </Link>
          ) : null
        }
      />
      <div className="mb-4 grid gap-2 md:grid-cols-2 lg:grid-cols-5">
        <SearchBar value={q} onChange={setQ} placeholder="Search documents by keyword or natural language" />
        <select className="border border-line px-2 py-2 text-sm" value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="">Department</option>
          <option value="POLICE">Police</option>
          <option value="FORENSICS">Forensics</option>
          <option value="LEGAL">Legal</option>
        </select>
        <select className="border border-line px-2 py-2 text-sm" value={cls} onChange={(e) => setCls(e.target.value)}>
          <option value="">Classification</option>
          <option value="CONFIDENTIAL">Confidential</option>
          <option value="SECRET">Secret</option>
          <option value="TOP_SECRET">Top Secret</option>
        </select>
        <select className="border border-line px-2 py-2 text-sm" value={integrity} onChange={(e) => setIntegrity(e.target.value)}>
          <option value="">Verification status</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="INTEGRITY_MISMATCH">Integrity mismatch</option>
          <option value="ACCESS_RESTRICTED">Access restricted</option>
        </select>
        <select className="border border-line px-2 py-2 text-sm" defaultValue="">
          <option value="">Document type / date</option>
          <option>FIR</option>
          <option>Forensic report</option>
        </select>
      </div>
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState title="No documents found." body="Your search did not return any authorized records." />
      ) : (
        <DataTable
          caption="Authorized vault documents"
          headers={['Document ID', 'Document Name', 'Type', 'Case', 'Department', 'Classification', 'Version', 'Integrity', 'Last Updated', 'Actions']}
        >
          {filtered.map((d) => (
            <tr key={d.id}>
              <td className="border-b border-line px-3 py-2 font-mono text-xs">{d.id}</td>
              <td className="border-b border-line px-3 py-2">{d.name}</td>
              <td className="border-b border-line px-3 py-2">{d.type}</td>
              <td className="border-b border-line px-3 py-2">{d.caseId}</td>
              <td className="border-b border-line px-3 py-2">{d.department}</td>
              <td className="border-b border-line px-3 py-2">{d.classification}</td>
              <td className="border-b border-line px-3 py-2">V{d.version}</td>
              <td className="border-b border-line px-3 py-2">
                <StatusBadge value={d.integrity} />
              </td>
              <td className="border-b border-line px-3 py-2 text-xs">{d.lastUpdated}</td>
              <td className="border-b border-line px-3 py-2">
                <Link className="text-navy underline" to={`/documents/${d.id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  )
}
