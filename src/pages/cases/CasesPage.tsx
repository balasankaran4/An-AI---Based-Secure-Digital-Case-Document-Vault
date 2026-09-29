import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getCases } from '../../services/api'
import { departmentLabel } from '../../auth/permissions'
import { users } from '../../data/users'
import { Breadcrumbs, DataTable, EmptyState, LoadingState, PageHeader, SearchBar, StatusBadge } from '../../components/common/ui'
import type { CaseRecord } from '../../types'

export function CasesPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<CaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [dept, setDept] = useState('')

  useEffect(() => {
    if (!user) return
    void getCases(user).then((c) => {
      setRows(c)
      setLoading(false)
    })
  }, [user])

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      if (status && c.status !== status) return false
      if (dept && c.department !== dept) return false
      const hay = `${c.id} ${c.title} ${c.type} ${c.jurisdiction}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
  }, [rows, q, status, dept])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Cases' }]} />
      <PageHeader title="Case Management" subtitle="Only cases permitted by assignment, department, and jurisdiction are listed." />
      <div className="mb-4 grid gap-2 md:grid-cols-4">
        <SearchBar value={q} onChange={setQ} placeholder="Search Case ID, type, jurisdiction" />
        <select className="border border-line px-2 py-2 text-sm" value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="">Department</option>
          <option value="POLICE">Police</option>
          <option value="FORENSICS">Forensics</option>
          <option value="LEGAL">Legal</option>
        </select>
        <select className="border border-line px-2 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_INVESTIGATION">Under investigation</option>
          <option value="CLOSED">Closed</option>
        </select>
        <p className="self-center text-xs text-muted">Filters: Case ID · Department · Type · Status · Jurisdiction · Date · Priority</p>
      </div>
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState title="No cases found." body="Your search did not return any authorized records." />
      ) : (
        <DataTable
          caption="Authorized cases"
          headers={['Case ID', 'Case Type', 'Department', 'Assigned Officer', 'Status', 'Classification', 'Last Updated', 'Actions']}
        >
          {filtered.map((c) => {
            const lead = users.find((u) => u.id === c.assignedOfficerIds[0])
            return (
              <tr key={c.id} className="odd:bg-white even:bg-sand/50">
                <td className="border-b border-line px-3 py-2 font-mono">{c.id}</td>
                <td className="border-b border-line px-3 py-2">{c.type}</td>
                <td className="border-b border-line px-3 py-2">{departmentLabel(c.department)}</td>
                <td className="border-b border-line px-3 py-2">{lead?.name ?? '—'}</td>
                <td className="border-b border-line px-3 py-2">
                  <StatusBadge value={c.status} />
                </td>
                <td className="border-b border-line px-3 py-2">{c.classification}</td>
                <td className="border-b border-line px-3 py-2">{c.lastUpdated}</td>
                <td className="border-b border-line px-3 py-2">
                  <Link className="text-navy underline" to={`/cases/${c.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            )
          })}
        </DataTable>
      )}
    </div>
  )
}
