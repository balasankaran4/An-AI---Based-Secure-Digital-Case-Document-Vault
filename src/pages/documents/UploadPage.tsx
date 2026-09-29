import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hasPermission } from '../../auth/permissions'
import { uploadDocument } from '../../services/api'
import { Breadcrumbs, FileUpload, PageHeader, PrototypeNote } from '../../components/common/ui'
import type { Classification, DocumentType } from '../../types'

const STEPS = ['Select Document', 'Validate', 'Extract Metadata', 'Classify', 'Encrypt', 'Generate Hash', 'Store', 'Anchor Integrity', 'Complete']

export function UploadPage() {
  const { user } = useAuth()
  const [fileName, setFileName] = useState('')
  const [caseId, setCaseId] = useState('CASE-2026-001')
  const [type, setType] = useState<DocumentType>('FIR')
  const [classification, setClassification] = useState<Classification>('CONFIDENTIAL')
  const [description, setDescription] = useState('')
  const [retention, setRetention] = useState('Retain 10 years / legal hold')
  const [step, setStep] = useState(-1)
  const [done, setDone] = useState<{ id: string; hash: string; enc: string; chain: string; audit: string } | null>(null)

  if (!user) return null
  if (!hasPermission(user, 'UPLOAD_DOCUMENTS')) return <Navigate to="/access-denied" replace />
  const currentUser = user

  async function run() {
    setDone(null)
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i)
      await new Promise((r) => setTimeout(r, 420))
    }
    const res = await uploadDocument(currentUser, {
      name: fileName.replace(/\.[^.]+$/, '') || 'New-Document',
      caseId,
      type,
      department: currentUser.department,
      classification,
      description,
      retentionPolicy: retention,
    })
    setDone({
      id: res.doc.id,
      hash: res.doc.sha256,
      enc: 'AES-256 Encryption: ENABLED',
      chain: `${res.doc.blockchainAnchorId} · ANCHORED`,
      audit: res.eventId,
    })
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Documents', to: '/documents' }, { label: 'Upload' }]} />
      <PageHeader title="Secure document registration" subtitle="Simulated pipeline: upload, validation, OCR, classification, encryption, hash, ledger anchor." />
      <PrototypeNote />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <form
          className="space-y-3 border border-line bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault()
            void run()
          }}
        >
          <FileUpload onFile={setFileName} />
          {fileName ? <p className="text-xs">Selected: {fileName}</p> : null}
          <label className="block text-sm">
            Case ID
            <input className="mt-1 w-full border border-line px-2 py-2" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
          </label>
          <label className="block text-sm">
            Document Type
            <select className="mt-1 w-full border border-line px-2 py-2" value={type} onChange={(e) => setType(e.target.value as DocumentType)}>
              <option value="FIR">FIR</option>
              <option value="INVESTIGATION_REPORT">Investigation report</option>
              <option value="FORENSIC_REPORT">Forensic report</option>
              <option value="EVIDENCE_REPORT">Evidence report</option>
              <option value="LEGAL_OPINION">Legal opinion</option>
            </select>
          </label>
          <label className="block text-sm">
            Department
            <input className="mt-1 w-full border border-line px-2 py-2" value={currentUser.department} readOnly />
          </label>
          <label className="block text-sm">
            Classification
            <select className="mt-1 w-full border border-line px-2 py-2" value={classification} onChange={(e) => setClassification(e.target.value as Classification)}>
              <option>CONFIDENTIAL</option>
              <option>SECRET</option>
              <option>INTERNAL</option>
            </select>
          </label>
          <label className="block text-sm">
            Description
            <textarea className="mt-1 w-full border border-line px-2 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="block text-sm">
            Retention Policy
            <input className="mt-1 w-full border border-line px-2 py-2" value={retention} onChange={(e) => setRetention(e.target.value)} />
          </label>
          <button className="bg-navy px-4 py-2 text-sm font-semibold text-white" type="submit">
            Start secure registration
          </button>
        </form>
        <div className="border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">Processing</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {STEPS.map((s, i) => (
              <li key={s} className={i <= step ? 'font-semibold text-navy' : 'text-muted'}>
                {i + 1}. {s} {i === step && !done ? '…' : i < step || done ? '✓' : ''}
              </li>
            ))}
          </ol>
          {done ? (
            <div className="mt-4 border border-success p-3 text-sm">
              <p className="font-semibold text-success">Document securely registered</p>
              <p>Document ID: {done.id}</p>
              <p className="break-all">SHA-256 hash: {done.hash}</p>
              <p>{done.enc}</p>
              <p>Blockchain: {done.chain}</p>
              <p>Audit event ID: {done.audit}</p>
              <Link className="mt-2 inline-block text-navy underline" to={`/documents/${done.id}`}>
                Open document
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
