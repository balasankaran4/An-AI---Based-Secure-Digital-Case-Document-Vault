import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getCase, getDocuments, getEvidence, getAuditLogs } from '../../services/api'
import { canViewCase, departmentLabel } from '../../auth/permissions'
import { users } from '../../data/users'
import { Breadcrumbs, DataTable, LoadingState, PageHeader, StatusBadge } from '../../components/common/ui'
import { Timeline } from '../../components/security/SecurityWidgets'
import type { AuditEvent, CaseRecord, DocumentRecord, EvidenceRecord } from '../../types'

export function CaseDetailPage() {
  const { caseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rec, setRec] = useState<CaseRecord | null>(null)
  const [docs, setDocs] = useState<DocumentRecord[]>([])
  const [ev, setEv] = useState<EvidenceRecord[]>([])
  const [audit, setAudit] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !caseId) return
    if (!canViewCase(user, caseId)) {
      navigate('/access-denied', { replace: true, state: { from: `/cases/${caseId}` } })
      return
    }
    void Promise.all([getCase(user, caseId), getDocuments(user), getEvidence(user), getAuditLogs()]).then(
      ([c, d, e, a]) => {
        if (!c) {
          navigate('/access-denied', { replace: true })
          return
        }
        setRec(c)
        setDocs(d.filter((x) => x.caseId === caseId))
        setEv(e.filter((x) => x.caseId === caseId))
        setAudit(a.filter((x) => x.caseId === caseId).slice(0, 8))
        setLoading(false)
      },
    )
  }, [user, caseId, navigate])

  if (loading || !rec) return <LoadingState />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Cases', to: '/cases' }, { label: rec.id }]} />
      <PageHeader title={rec.id} subtitle={rec.title} />
      <div className="grid gap-3 md:grid-cols-2">
        <section className="border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-navy">Case information</h2>
          <p className="mt-2">{rec.summary}</p>
          <p className="mt-2">Department: {departmentLabel(rec.department)}</p>
          <p>Jurisdiction: {rec.jurisdiction}</p>
          <p>
            Status: <StatusBadge value={rec.status} /> Priority: {rec.priority}
          </p>
          <p>Classification: {rec.classification}</p>
        </section>
        <section className="border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-navy">Assigned officers</h2>
          <ul className="mt-2 space-y-1">
            {rec.assignedOfficerIds.map((id) => {
              const o = users.find((u) => u.id === id)
              return (
                <li key={id}>
                  {o?.name} — {o?.designation} ({o?.officerId})
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <h2 className="mt-6 text-sm font-semibold text-navy">Case documents</h2>
      <DataTable headers={['Document', 'Type', 'Classification', 'Integrity', 'Actions']}>
        {docs.map((d) => (
          <tr key={d.id}>
            <td className="border-b border-line px-3 py-2">{d.name}</td>
            <td className="border-b border-line px-3 py-2">{d.type}</td>
            <td className="border-b border-line px-3 py-2">{d.classification}</td>
            <td className="border-b border-line px-3 py-2">
              <StatusBadge value={d.integrity} />
            </td>
            <td className="border-b border-line px-3 py-2">
              <Link className="text-navy underline" to={`/documents/${d.id}`}>
                Open
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>

      <h2 className="mt-6 text-sm font-semibold text-navy">Evidence</h2>
      <ul className="border border-line bg-white p-4 text-sm">
        {ev.map((e) => (
          <li key={e.id}>
            <Link className="text-navy underline" to="/evidence">
              {e.id}
            </Link>{' '}
            — {e.type} ({e.status})
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-sm font-semibold text-navy">Timeline</h2>
      <div className="border border-line bg-white p-4">
        <Timeline
          items={audit.map((a) => ({
            title: a.action,
            meta: `${a.timestamp} · ${a.userName}`,
            body: a.details,
          }))}
        />
      </div>

      <h2 className="mt-6 text-sm font-semibold text-navy">Access permissions</h2>
      <p className="text-sm text-muted">
        Access is evaluated using RBAC (role) and ABAC (department, jurisdiction, assignment, clearance, classification).
      </p>
    </div>
  )
}
