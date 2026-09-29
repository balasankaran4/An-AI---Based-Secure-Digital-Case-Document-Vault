import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { searchDocuments } from '../../services/api'
import { Breadcrumbs, EmptyState, PageHeader, PrototypeNote, StatusBadge } from '../../components/common/ui'
import type { DocumentRecord } from '../../types'

export function SearchPage() {
  const { user } = useAuth()
  const [q, setQ] = useState('Find investigation documents related to vehicle seizure in Case 2026-001')
  const [busy, setBusy] = useState(false)
  const [rows, setRows] = useState<{ document: DocumentRecord; score: number; snippet: string; access: string }[] | null>(null)

  async function run(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setBusy(true)
    const res = await searchDocuments(user, q)
    setRows(res)
    setBusy(false)
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'AI Search' }]} />
      <PageHeader title="Intelligent Document Search" subtitle="Prototype AI Search — AI-assisted semantic retrieval interface. A live model is not running." />
      <PrototypeNote>Prototype AI Search. Ranked results are mocked from authorized documents only.</PrototypeNote>
      <form onSubmit={(e) => void run(e)} className="mt-4">
        <label className="block text-sm font-semibold text-navy">
          Natural language query
          <textarea className="mt-1 w-full border border-line px-3 py-3 text-base" rows={3} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <button className="mt-2 bg-navy px-4 py-2 text-sm font-semibold text-white" type="submit">
          {busy ? 'Retrieving…' : 'Search authorized records'}
        </button>
      </form>
      {rows && rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No documents found." body="Your search did not return any authorized records." />
        </div>
      ) : null}
      {rows && rows.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.document.id} className="border border-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-navy">{r.document.name}</p>
                <StatusBadge value={`RELEVANCE ${r.score}%`} />
              </div>
              <p className="text-xs text-muted">
                {r.document.caseId} · {r.document.type} · Access {r.access}
              </p>
              <p className="mt-2 text-sm">Matching snippet: {r.snippet}</p>
              <div className="mt-3 flex gap-2 text-sm">
                <Link className="border border-navy px-2 py-1 text-navy" to={`/documents/${r.document.id}`}>
                  View Document
                </Link>
                <Link className="border border-navy px-2 py-1 text-navy" to="/verification">
                  Verify Integrity
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
