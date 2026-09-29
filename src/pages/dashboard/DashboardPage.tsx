import { useEffect, useState } from 'react'
import { FileCheck2, FileText, FolderKanban, ShieldCheck, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDashboard } from '../../services/api'
import { departmentLabel, hasPermission } from '../../auth/permissions'
import { LoadingState, PageHeader, StatsCard, StatusBadge } from '../../components/common/ui'
import { SecurityStatusGrid } from '../../components/security/SecurityWidgets'
import type { AuditEvent } from '../../types'

export function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ cases: 0, documents: 0, pendingApprovals: 0, accessRequests: 0, activity: [] as AuditEvent[] })

  useEffect(() => {
    if (!user) return
    void getDashboard(user).then((d) => {
      setStats(d)
      setLoading(false)
    })
  }, [user])

  if (!user) return null

  return (
    <div>
      <PageHeader
        title="Security & Case Management Dashboard"
        subtitle="Centralized monitoring of authorized cases, documents, evidence and security activity."
        actions={hasPermission(user, 'UPLOAD_DOCUMENTS') ? <Link to="/documents/upload" className="btn-accent"><UploadCloud size={16} aria-hidden />Upload document</Link> : undefined}
      />

      <section className="panel mb-5 border-l-4 border-l-orange bg-white p-4" aria-label="Officer context">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-kicker">Authorized officer session</p>
            <p className="mt-1 text-sm font-semibold text-navy">{user.name} <span className="font-normal text-muted">· {user.officerId}</span></p>
          </div>
          <div className="grid gap-2 text-xs sm:grid-cols-3 lg:min-w-[560px]">
            <div><span className="text-muted">Department</span><p className="font-semibold text-ink">{departmentLabel(user.department)}</p></div>
            <div><span className="text-muted">Jurisdiction</span><p className="font-semibold text-ink">{user.jurisdiction}</p></div>
            <div><span className="text-muted">Clearance / MFA</span><p className="font-semibold text-ink">{user.clearance} · <span className="text-success">ENABLED</span></p></div>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingState label="Loading authorized dashboard records…" />
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Dashboard summary">
          <StatsCard label="Active cases" value={stats.cases} hint="Assigned and jurisdiction-approved" icon={<FolderKanban size={19} />} />
          <StatsCard label="Documents" value={stats.documents} hint="Authorized vault records" icon={<FileText size={19} />} tone="orange" />
          <StatsCard label="Evidence records" value="06" hint="Chain-of-custody entries" icon={<FileCheck2 size={19} />} tone="green" />
          <StatsCard label="Pending approvals" value={stats.pendingApprovals} hint={`${stats.accessRequests} access request(s) from you`} icon={<ShieldCheck size={19} />} tone="orange" />
        </section>
      )}

      <section className="mt-6" aria-labelledby="security-heading">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="section-kicker">System controls</p>
            <h2 id="security-heading" className="mt-1 text-lg font-semibold text-navy">System Security Status</h2>
          </div>
          <Link to="/security" className="text-xs font-semibold text-navy underline underline-offset-4">Open security center</Link>
        </div>
        <SecurityStatusGrid />
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="panel p-4" aria-labelledby="activity-heading">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Traceability</p>
              <h2 id="activity-heading" className="mt-1 text-lg font-semibold text-navy">Recent security activity</h2>
            </div>
            <Link to="/audit" className="text-xs font-semibold text-navy underline underline-offset-4">View audit trail</Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {stats.activity.length === 0 ? <p className="py-6 text-sm text-muted">No recent activity for this session.</p> : stats.activity.map((a) => (
              <div key={a.id} className="flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0"><p className="font-semibold text-ink">{a.action} <span className="font-normal text-muted">· {a.resource}</span></p><p className="text-xs text-muted">{a.timestamp} · {a.userName}</p></div>
                <StatusBadge value={a.result} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-4" aria-labelledby="workflow-heading">
          <p className="section-kicker">Controlled workflow</p>
          <h2 id="workflow-heading" className="mt-1 text-lg font-semibold text-navy">Secure case operations</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Use the authorized services below to register, review and verify case records without exposing restricted content.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Link to="/cases" className="btn-secondary justify-start"><FolderKanban size={16} aria-hidden />Review cases</Link>
            <Link to="/documents" className="btn-secondary justify-start"><FileText size={16} aria-hidden />Open document vault</Link>
            <Link to="/search" className="btn-secondary justify-start"><ShieldCheck size={16} aria-hidden />Search authorized content</Link>
          </div>
          <div className="mt-4 border-t border-line pt-3 text-xs text-muted">Department connectivity: Police · Forensics · Legal · Court Records · Administration</div>
        </section>
      </div>
    </div>
  )
}
