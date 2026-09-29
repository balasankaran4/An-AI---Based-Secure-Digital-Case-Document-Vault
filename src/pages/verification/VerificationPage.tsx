import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDocuments, resetIntegritySimulation, simulateIntegrityChange, verifyDocument } from '../../services/api'
import { Breadcrumbs, PageHeader, PrototypeNote, StatusBadge } from '../../components/common/ui'
import { BlockchainStatus, VerificationChain } from '../../components/security/SecurityWidgets'
import type { DocumentRecord } from '../../types'

export function VerificationPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<DocumentRecord[]>([])
  const [id, setId] = useState('DOC-FIR-001')
  const [result, setResult] = useState<{ verified: boolean; doc: DocumentRecord; status: string } | null>(null)

  useEffect(() => {
    if (!user) return
    void getDocuments(user).then((d) => {
      setDocs(d)
      if (d.length && !d.some((x) => x.id === id)) setId(d[0].id)
    })
  }, [user, id])

  async function run() {
    if (!user) return
    const r = await verifyDocument(user, id)
    setResult(r)
  }

  const doc = result?.doc ?? docs.find((d) => d.id === id)

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Verification' }]} />
      <PageHeader title="Document verification" subtitle="Compare stored hash with permissioned ledger representation." />
      <PrototypeNote />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border border-line bg-white p-4">
          <label className="block text-sm">
            Select document
            <select className="mt-1 w-full border border-line px-2 py-2" value={id} onChange={(e) => setId(e.target.value)}>
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id})
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="mt-3 bg-navy px-3 py-2 text-sm text-white" onClick={() => void run()}>
            Verify
          </button>
          <button
            type="button"
            className="ml-2 mt-3 border border-danger px-3 py-2 text-sm text-danger"
            onClick={() => {
              void simulateIntegrityChange().then(() => void run())
            }}
          >
            Simulate Integrity Change
          </button>
          <button
            type="button"
            className="ml-2 mt-3 border border-line px-3 py-2 text-sm"
            onClick={() => {
              void resetIntegritySimulation().then(() => void run())
            }}
          >
            Reset simulation
          </button>
          {doc ? (
            <div className="mt-4 space-y-1 text-sm">
              <p className="font-mono text-xs break-all">SHA-256: {doc.sha256}</p>
              <p>Timestamp: {doc.blockchainTimestamp}</p>
              <p>
                Digital signature: <StatusBadge value={doc.signatureStatus} />
              </p>
              <p>
                Integrity:{' '}
                <StatusBadge value={result?.status ?? doc.integrity} />
              </p>
            </div>
          ) : null}
        </div>
        <div>
          <VerificationChain highlight={result && !result.verified ? 'SHA-256 Hash' : undefined} />
          {doc ? (
            <div className="mt-4">
              <BlockchainStatus status={doc.blockchainStatus} anchorId={doc.blockchainAnchorId} timestamp={doc.blockchainTimestamp} />
            </div>
          ) : null}
          {result ? (
            <p className="mt-3 text-sm font-semibold text-navy">
              Result: {result.verified ? 'VERIFIED' : 'INTEGRITY MISMATCH'} · Blockchain verification:{' '}
              {result.verified ? 'VERIFIED' : 'FAILED'}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
