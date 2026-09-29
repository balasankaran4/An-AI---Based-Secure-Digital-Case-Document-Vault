import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getEvidence } from '../../services/api'
import { Breadcrumbs, DataTable, EmptyState, LoadingState, PageHeader, StatusBadge } from '../../components/common/ui'
import { Timeline } from '../../components/security/SecurityWidgets'
import type { EvidenceRecord } from '../../types'

export function EvidencePage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<EvidenceRecord[]>([])
  const [sel, setSel] = useState<EvidenceRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    void getEvidence(user).then((e) => {
      setRows(e)
      setSel(e[0] ?? null)
      setLoading(false)
    })
  }, [user])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Evidence' }]} />
      <PageHeader title="Evidence management" subtitle="Chain of custody is append-only in this prototype." />
      {loading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState title="No evidence found." body="No authorized evidence records for your assignments." />
      ) : (
        <DataTable headers={['Evidence ID', 'Case ID', 'Evidence Type', 'Custodian', 'Department', 'Status', 'Integrity', 'Last Transfer']}>
          {rows.map((e) => (
            <tr key={e.id} className="cursor-pointer" onClick={() => setSel(e)}>
              <td className="border-b border-line px-3 py-2">{e.id}</td>
              <td className="border-b border-line px-3 py-2">{e.caseId}</td>
              <td className="border-b border-line px-3 py-2">{e.type}</td>
              <td className="border-b border-line px-3 py-2">{e.custodian}</td>
              <td className="border-b border-line px-3 py-2">{e.department}</td>
              <td className="border-b border-line px-3 py-2">
                <StatusBadge value={e.status} />
              </td>
              <td className="border-b border-line px-3 py-2">
                <StatusBadge value={e.integrity} />
              </td>
              <td className="border-b border-line px-3 py-2 text-xs">{e.lastTransfer}</td>
            </tr>
          ))}
        </DataTable>
      )}
      {sel ? (
        <section className="mt-6 border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">Chain of custody — {sel.id}</h2>
          <p className="text-sm">{sel.description}</p>
          <div className="mt-4">
            <Timeline
              items={sel.chainOfCustody.map((c) => ({
                title: c.action,
                meta: `${c.timestamp} · ${c.officerName} · ${c.department}`,
                body: `Signature ${c.signature} · Hash ${c.hash}`,
              }))}
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}
