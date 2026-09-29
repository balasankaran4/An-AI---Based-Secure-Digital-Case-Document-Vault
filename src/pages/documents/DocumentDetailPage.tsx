import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDocument, signDocument } from '../../services/api'
import { canShareDocument, canSignDocument, hasPermission, type AccessDecision } from '../../auth/permissions'
import { getGrants } from '../../utils/storage'
import { users } from '../../data/users'
import { Breadcrumbs, PageHeader, PrototypeNote, StatusBadge } from '../../components/common/ui'
import { BlockchainStatus, DocumentSecurityStrip } from '../../components/security/SecurityWidgets'
import type { DocumentRecord } from '../../types'
import { useUI } from '../../context/UIContext'

export function DocumentDetailPage() {
  const { documentId } = useParams()
  const { user } = useAuth()
  const { showToast } = useUI()
  const navigate = useNavigate()
  const [doc, setDoc] = useState<DocumentRecord | null>(null)
  const [decision, setDecision] = useState<AccessDecision | null>(null)

  useEffect(() => {
    if (!user || !documentId) return
    void getDocument(user, documentId).then((res) => {
      if (!res.doc) {
        navigate('/access-denied', { replace: true, state: { reason: res.decision?.reason, from: `/documents/${documentId}` } })
        return
      }
      setDoc(res.doc)
      setDecision(res.decision)
    })
  }, [user, documentId, navigate])

  if (!user || !doc) return <p className="text-sm text-muted">Loading authorized document…</p>
  const signer = users.find((u) => u.id === doc.signedBy)
  const grants = getGrants()
  const canSign = canSignDocument(user, doc, grants)
  const canShare = canShareDocument(user, doc, grants)
  const canVerify = hasPermission(user, 'VERIFY_DOCUMENTS')

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Documents', to: '/documents' }, { label: doc.id }]} />
      <PageHeader
        title={doc.name}
        subtitle={`${doc.fileName} · ${doc.caseId}`}
        actions={
          <>
            {canVerify ? (
              <Link className="border border-navy px-3 py-2 text-sm text-navy" to="/verification">
                Verify
              </Link>
            ) : null}
            {canShare ? (
              <Link className="border border-navy px-3 py-2 text-sm text-navy" to="/sharing">
                Share
              </Link>
            ) : null}
            {canSign ? (
              <button
                type="button"
                className="bg-navy px-3 py-2 text-sm text-white"
                onClick={() => {
                  void signDocument(user, doc.id).then(() => {
                    showToast('Digital signature recorded (prototype simulation).')
                    setDoc({ ...doc, signatureStatus: 'VERIFIED', signedBy: user.id })
                  })
                }}
              >
                Sign
              </button>
            ) : null}
          </>
        }
      />
      <PrototypeNote />
      <div className="mt-4">
        <DocumentSecurityStrip
          encryption="Encrypted"
          integrity={doc.integrity === 'VERIFIED' ? 'Verified' : doc.integrity}
          blockchain={doc.blockchainStatus === 'ANCHORED' ? 'Anchored' : doc.blockchainStatus}
          access="Authorized"
          signature={doc.signatureStatus === 'VERIFIED' ? 'Verified' : doc.signatureStatus}
          version={`V${doc.version}`}
        />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-navy">Metadata</h2>
          <p>Type: {doc.type}</p>
          <p>Department: {doc.department}</p>
          <p>Classification: {doc.classification}</p>
          <p>Retention: {doc.retentionPolicy}</p>
          <p>Uploaded by: {users.find((u) => u.id === doc.uploadedBy)?.name}</p>
          <p className="mt-2">{doc.description}</p>
          <p className="mt-2 text-xs text-muted">Policy: {decision?.reason}</p>
        </section>
        <section className="border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-navy">Preview placeholder</h2>
          <div className="mt-2 min-h-32 border border-dashed border-line bg-sand p-3">{doc.previewText}</div>
          <p className="mt-2 font-mono text-xs break-all">SHA-256: {doc.sha256}</p>
        </section>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <BlockchainStatus status={doc.blockchainStatus} anchorId={doc.blockchainAnchorId} timestamp={doc.blockchainTimestamp} />
        <section className="border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-navy">Digital signature</h2>
          <p>
            Status: <StatusBadge value={doc.signatureStatus} />
          </p>
          <p>Signed by: {signer?.name ?? '—'}</p>
        </section>
      </div>
      <section className="mt-4 border border-line bg-white p-4">
        <h2 className="text-sm font-semibold text-navy">Version history</h2>
        <p className="text-xs text-muted">Previous versions are retained. Nothing is deleted in this prototype.</p>
        <ul className="mt-2 text-sm">
          {doc.versions.map((v) => (
            <li key={v.version} className="border-b border-line py-2">
              Version {v.version} — {v.isCurrent ? 'Current Version' : 'Previous Version'} — {v.modifiedBy} — {v.date}
              <br />
              {v.changeDescription} · Hash {v.hash} · <StatusBadge value={v.isCurrent ? 'CURRENT' : 'RETAINED'} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
