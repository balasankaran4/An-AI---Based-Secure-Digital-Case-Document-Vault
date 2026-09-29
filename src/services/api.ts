import type {
  AccessRequest,
  AppNotification,
  AuditEvent,
  CaseRecord,
  Department,
  DocumentRecord,
  EvidenceRecord,
  SharePermission,
  User,
} from '../types'
import { canViewCase, canViewDocument, evaluateDocumentAccess } from '../auth/permissions'
import { cases } from '../data/cases'
import { departments } from '../data/departments'
import { DEMO_PASSWORD, users } from '../data/users'
import { evidence } from '../data/evidence'
import { FIR_HASH } from '../data/documents'
import {
  appendAudit,
  getAudit,
  getGrants,
  getLiveDocuments,
  getLiveNotifications,
  getRequests,
  isIntegrityTampered,
  setGrants,
  setIntegrityTampered,
  setLiveDocuments,
  setLiveNotifications,
  setRequests,
  setSession,
} from '../utils/storage'

const wait = <T>(data: T, ms = 280): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), ms)
  })

function applyTamper(docs: DocumentRecord[]): DocumentRecord[] {
  if (!isIntegrityTampered()) return docs
  return docs.map((d) =>
    d.id === 'DOC-FIR-001'
      ? {
          ...d,
          sha256: 'FFFFFFFF00000000TAMPEREDHASHSIMULATION00000000FFFFFFFFD000',
          integrity: 'INTEGRITY_MISMATCH',
          blockchainStatus: 'FAILED',
        }
      : d,
  )
}

function sessionId() {
  return `SES-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

function audit(partial: Omit<AuditEvent, 'id' | 'timestamp' | 'sessionId'> & { sessionId?: string }) {
  appendAudit({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    sessionId: partial.sessionId ?? sessionId(),
    ...partial,
  })
}

export async function login(officerId: string, password: string) {
  const user = users.find((u) => u.officerId.toLowerCase() === officerId.toLowerCase())
  if (!user || password !== DEMO_PASSWORD || user.status !== 'ACTIVE') {
    audit({
      userId: user?.id ?? 'unknown',
      userName: user?.name ?? officerId,
      department: user?.department ?? 'ADMINISTRATION',
      action: 'LOGIN',
      resource: 'AUTH',
      result: 'DENIED',
      details: 'Invalid credentials or disabled account.',
    })
    throw new Error('Invalid Officer ID or password.')
  }
  setSession({ currentUserId: user.id, authStatus: 'password', mfaStatus: 'pending' })
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'LOGIN',
    resource: 'AUTH',
    result: 'SUCCESS',
    details: 'Password verified. MFA pending.',
  })
  return wait(user)
}

export async function verifyMFA(code: string) {
  if (code !== '123456') throw new Error('Invalid OTP. Demo OTP is 123456.')
  const { getSession } = await import('../utils/storage')
  const s = getSession()
  if (!s.currentUserId) throw new Error('Session expired. Please login again.')
  setSession({ currentUserId: s.currentUserId, authStatus: 'authenticated', mfaStatus: 'verified' })
  const user = users.find((u) => u.id === s.currentUserId)!
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'LOGIN',
    resource: 'MFA',
    result: 'SUCCESS',
    details: 'MFA verified. Access policy evaluation completed (prototype).',
  })
  return wait(user)
}

export async function logout() {
  setSession({ currentUserId: null, authStatus: 'anonymous', mfaStatus: 'pending' })
  return wait(true)
}

export async function getDashboard(user: User) {
  const docs = applyTamper(getLiveDocuments()).filter((d) => canViewDocument(user, d, getGrants()))
  const myCases = cases.filter((c) => canViewCase(user, c.id))
  const reqs = getRequests().filter((r) => r.status === 'PENDING')
  return wait({
    cases: myCases.length,
    documents: docs.length,
    pendingApprovals: ['HIGHER_AUTHORITY', 'DEPT_ADMIN', 'SYSTEM_ADMIN', 'SENIOR_OFFICER'].includes(user.role)
      ? reqs.length
      : 0,
    accessRequests: reqs.filter((r) => r.requesterId === user.id).length,
    activity: getAudit().slice(0, 6),
  })
}

export async function getCases(user: User): Promise<CaseRecord[]> {
  return wait(cases.filter((c) => canViewCase(user, c.id)))
}

export async function getCase(user: User, id: string) {
  const rec = cases.find((c) => c.id === id)
  if (!rec || !canViewCase(user, rec.id)) return wait(null)
  return wait(rec)
}

export async function getDocuments(user: User): Promise<DocumentRecord[]> {
  return wait(applyTamper(getLiveDocuments()).filter((d) => canViewDocument(user, d, getGrants())))
}

export async function getDocument(user: User, id: string) {
  const doc = applyTamper(getLiveDocuments()).find((d) => d.id === id)
  if (!doc) return wait({ doc: null as DocumentRecord | null, decision: null })
  const decision = evaluateDocumentAccess(user, doc, getGrants())
  if (!decision.allowed) {
    audit({
      userId: user.id,
      userName: user.name,
      department: user.department,
      action: 'VIEW',
      resource: id,
      caseId: doc.caseId,
      result: 'DENIED',
      details: decision.reason,
    })
    return wait({ doc: null, decision })
  }
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'VIEW',
    resource: id,
    caseId: doc.caseId,
    result: 'SUCCESS',
    details: 'Authorized document view.',
  })
  return wait({ doc, decision })
}

export async function uploadDocument(
  user: User,
  payload: {
    name: string
    caseId: string
    type: DocumentRecord['type']
    department: DocumentRecord['department']
    classification: DocumentRecord['classification']
    description: string
    retentionPolicy: string
  },
) {
  const hash = `SIM${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`.slice(0, 64).toUpperCase()
  const id = `DOC-UPL-${Date.now()}`
  const doc: DocumentRecord = {
    id,
    name: payload.name || 'Uploaded-Document',
    fileName: `${payload.name || 'upload'}.pdf`,
    type: payload.type,
    caseId: payload.caseId,
    department: payload.department,
    classification: payload.classification,
    version: 1,
    integrity: 'VERIFIED',
    lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19),
    uploadedBy: user.id,
    description: payload.description,
    retentionPolicy: payload.retentionPolicy,
    sha256: hash.padEnd(64, '0'),
    originalSha256: hash.padEnd(64, '0'),
    encryption: 'ENCRYPTED',
    blockchainStatus: 'ANCHORED',
    blockchainAnchorId: `BLK-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
    blockchainTimestamp: new Date().toLocaleString('en-GB').replace(',', ''),
    signatureStatus: 'UNSIGNED',
    allowedDepartments: [payload.department, 'ADMINISTRATION'],
    minClearance: payload.classification === 'SECRET' || payload.classification === 'TOP_SECRET' ? 'L3' : 'L2',
    previewText: payload.description || 'Uploaded document (prototype simulation).',
    versions: [
      {
        version: 1,
        modifiedBy: `${user.name} (${user.officerId})`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 19),
        changeDescription: 'Initial upload',
        hash: hash.slice(0, 12) + '...',
        isCurrent: true,
      },
    ],
  }
  setLiveDocuments([doc, ...getLiveDocuments()])
  const eventId = `AUD-${Date.now()}`
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'UPLOAD',
    resource: id,
    caseId: payload.caseId,
    result: 'SUCCESS',
    details: 'Document securely registered (prototype simulation).',
  })
  return wait({ doc, eventId }, 400)
}

export async function searchDocuments(user: User, query: string) {
  const q = query.toLowerCase()
  const results = applyTamper(getLiveDocuments())
    .filter((d) => canViewDocument(user, d, getGrants()))
    .map((d) => {
      const hay = `${d.name} ${d.description} ${d.previewText} ${d.caseId} ${d.type}`.toLowerCase()
      const hit = !q || hay.includes(q) || q.includes('vehicle') && d.caseId === 'CASE-2026-001'
      const score = hit ? (hay.includes(q) ? 92 : 81) : 0
      return {
        document: d,
        score,
        snippet: d.previewText.slice(0, 160),
        access: 'AUTHORIZED' as const,
      }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
  return wait(results)
}

export async function verifyDocument(user: User, id: string) {
  const docs = applyTamper(getLiveDocuments())
  const doc = docs.find((d) => d.id === id)
  if (!doc || !canViewDocument(user, doc, getGrants())) throw new Error('Document not available.')
  const verified =
    id === 'DOC-FIR-001' ? !isIntegrityTampered() && doc.sha256 === FIR_HASH : doc.sha256 === doc.originalSha256
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'VERIFY',
    resource: id,
    caseId: doc.caseId,
    result: verified ? 'SUCCESS' : 'FAILED',
    details: verified ? 'Integrity verified (prototype simulation).' : 'Hash mismatch against ledger anchor.',
  })
  return wait({
    verified,
    doc,
    status: verified ? 'VERIFIED' : 'INTEGRITY_MISMATCH',
  })
}

export async function simulateIntegrityChange() {
  setIntegrityTampered(true)
  const docs = getLiveDocuments().map((d) =>
    d.id === 'DOC-FIR-001'
      ? { ...d, integrity: 'INTEGRITY_MISMATCH' as const, blockchainStatus: 'FAILED' as const }
      : d,
  )
  setLiveDocuments(docs)
  return wait(true)
}

export async function resetIntegritySimulation() {
  setIntegrityTampered(false)
  const docs = getLiveDocuments().map((d) =>
    d.id === 'DOC-FIR-001'
      ? {
          ...d,
          sha256: FIR_HASH,
          originalSha256: FIR_HASH,
          integrity: 'VERIFIED' as const,
          blockchainStatus: 'ANCHORED' as const,
        }
      : d,
  )
  setLiveDocuments(docs)
  return wait(true)
}

export async function createShareRequest(
  user: User,
  payload: {
    documentId: string
    targetDepartment: AccessRequest['targetDepartment']
    targetOfficerId: string
    permission: SharePermission
    durationDays: number
    reason: string
  },
) {
  const req: AccessRequest = {
    id: `REQ-${Date.now()}`,
    documentId: payload.documentId,
    requesterId: user.id,
    requesterName: user.name,
    requesterDepartment: user.department,
    targetDepartment: payload.targetDepartment,
    targetOfficerId: payload.targetOfficerId,
    permission: payload.permission,
    durationDays: payload.durationDays,
    reason: payload.reason,
    date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    status: 'PENDING',
  }
  setRequests([req, ...getRequests()])
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'ACCESS_REQUEST',
    resource: payload.documentId,
    result: 'SUCCESS',
    details: payload.reason,
  })
  return wait(req)
}

export async function getApprovals() {
  return wait(getRequests())
}

export async function approveRequest(user: User, id: string) {
  const items = getRequests().map((r) =>
    r.id === id
      ? {
          ...r,
          status: 'APPROVED' as const,
          reviewedBy: user.id,
          reviewedOn: new Date().toISOString().replace('T', ' ').slice(0, 19),
        }
      : r,
  )
  setRequests(items)
  const req = items.find((r) => r.id === id)!
  const grants = getGrants()
  const grant = `${req.targetOfficerId}:${req.documentId}`
  if (!grants.includes(grant)) setGrants([...grants, grant])
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'ACCESS_APPROVED',
    resource: req.documentId,
    result: 'SUCCESS',
    details: `Approved ${id} for ${req.requesterName}`,
  })
  return wait(req)
}

export async function rejectRequest(user: User, id: string) {
  const items = getRequests().map((r) =>
    r.id === id
      ? {
          ...r,
          status: 'REJECTED' as const,
          reviewedBy: user.id,
          reviewedOn: new Date().toISOString().replace('T', ' ').slice(0, 19),
        }
      : r,
  )
  setRequests(items)
  const req = items.find((r) => r.id === id)!
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'ACCESS_DENIED',
    resource: req.documentId,
    result: 'SUCCESS',
    details: `Rejected ${id}`,
  })
  return wait(req)
}

export async function getAuditLogs() {
  return wait(getAudit())
}

export async function getUsers(): Promise<User[]> {
  return wait(users)
}

export async function getDepartments(): Promise<Department[]> {
  return wait(departments)
}

export async function getEvidence(user: User): Promise<EvidenceRecord[]> {
  const allowedCases = cases.filter((c) => canViewCase(user, c.id)).map((c) => c.id)
  return wait(evidence.filter((e) => allowedCases.includes(e.caseId)))
}

export async function getNotifications(user: User): Promise<AppNotification[]> {
  const items = getLiveNotifications().filter((n) => {
    if (n.audienceUserIds && !n.audienceUserIds.includes(user.id)) return false
    if (n.audienceRoles && !n.audienceRoles.includes(user.role)) return false
    return true
  })
  return wait(items)
}

export async function markNotificationRead(id: string) {
  setLiveNotifications(getLiveNotifications().map((n) => (n.id === id ? { ...n, read: true } : n)))
  return wait(true)
}

export async function signDocument(user: User, id: string) {
  const docs = getLiveDocuments().map((d) =>
    d.id === id ? { ...d, signatureStatus: 'VERIFIED' as const, signedBy: user.id } : d,
  )
  setLiveDocuments(docs)
  audit({
    userId: user.id,
    userName: user.name,
    department: user.department,
    action: 'SIGN',
    resource: id,
    result: 'SUCCESS',
    details: 'Digital signature recorded (prototype simulation).',
  })
  return wait(true)
}

export { FIR_HASH }
