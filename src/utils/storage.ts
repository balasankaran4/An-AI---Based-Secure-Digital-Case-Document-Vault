import type { AuditEvent, AccessRequest, AppNotification, DocumentRecord, SessionState, User } from '../types'
import { accessRequests as seedRequests } from '../data/accessRequests'
import { auditEvents as seedAudit } from '../data/audit'
import { documents as seedDocs } from '../data/documents'
import { notifications as seedNotes } from '../data/notifications'
import { users } from '../data/users'

const KEY = {
  session: 'sdcdv.session',
  grants: 'sdcdv.grants',
  requests: 'sdcdv.requests',
  audit: 'sdcdv.audit',
  docs: 'sdcdv.docs',
  notes: 'sdcdv.notes',
  mismatch: 'sdcdv.mismatch',
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getSession(): SessionState {
  return readJson<SessionState>(KEY.session, {
    currentUserId: null,
    authStatus: 'anonymous',
    mfaStatus: 'pending',
  })
}

export function setSession(session: SessionState) {
  writeJson(KEY.session, session)
}

export function clearSession() {
  localStorage.removeItem(KEY.session)
}

export function getGrants(): string[] {
  return readJson<string[]>(KEY.grants, ['u-leg:DOC-FOR-001'])
}

export function setGrants(grants: string[]) {
  writeJson(KEY.grants, grants)
}

export function getRequests(): AccessRequest[] {
  return readJson<AccessRequest[]>(KEY.requests, seedRequests)
}

export function setRequests(items: AccessRequest[]) {
  writeJson(KEY.requests, items)
}

export function getAudit(): AuditEvent[] {
  return readJson<AuditEvent[]>(KEY.audit, seedAudit)
}

export function appendAudit(event: AuditEvent) {
  const all = [event, ...getAudit()]
  writeJson(KEY.audit, all)
}

export function getLiveDocuments(): DocumentRecord[] {
  return readJson<DocumentRecord[]>(KEY.docs, seedDocs)
}

export function setLiveDocuments(docs: DocumentRecord[]) {
  writeJson(KEY.docs, docs)
}

export function getLiveNotifications(): AppNotification[] {
  return readJson<AppNotification[]>(KEY.notes, seedNotes)
}

export function setLiveNotifications(items: AppNotification[]) {
  writeJson(KEY.notes, items)
}

export function isIntegrityTampered(): boolean {
  return localStorage.getItem(KEY.mismatch) === '1'
}

export function setIntegrityTampered(value: boolean) {
  localStorage.setItem(KEY.mismatch, value ? '1' : '0')
}

export function currentUserFromSession(): User | null {
  const s = getSession()
  if (!s.currentUserId || s.authStatus !== 'authenticated') return null
  return users.find((u) => u.id === s.currentUserId) ?? null
}
