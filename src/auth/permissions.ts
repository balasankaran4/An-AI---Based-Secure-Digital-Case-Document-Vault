import type {
  Classification,
  Clearance,
  DepartmentId,
  DocumentRecord,
  NavKey,
  Permission,
  Role,
  User,
} from '../types'
import { cases } from '../data/cases'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SYSTEM_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VIEW_EVIDENCE',
    'VIEW_REPORTS',
    'VIEW_AUDIT',
    'MANAGE_USERS',
    'MANAGE_DEPARTMENTS',
    'MANAGE_POLICIES',
    'VIEW_SECURITY',
    'VIEW_ADMIN',
  ],
  DEPT_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'SHARE_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VIEW_EVIDENCE',
    'REQUEST_ACCESS',
    'APPROVE_REQUESTS',
    'VIEW_REPORTS',
    'VIEW_SECURITY',
    'MANAGE_USERS',
    'VIEW_ADMIN',
  ],
  HIGHER_AUTHORITY: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'SHARE_DOCUMENTS',
    'SIGN_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VIEW_EVIDENCE',
    'APPROVE_REQUESTS',
    'VIEW_REPORTS',
    'VIEW_AUDIT',
    'VIEW_SECURITY',
    'REVIEW_WORKFLOWS',
  ],
  SENIOR_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'MANAGE_CASES',
    'VIEW_DOCUMENTS',
    'UPLOAD_DOCUMENTS',
    'EDIT_DOCUMENTS',
    'SHARE_DOCUMENTS',
    'SIGN_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VIEW_EVIDENCE',
    'REQUEST_ACCESS',
    'VIEW_REPORTS',
    'REVIEW_WORKFLOWS',
  ],
  INVESTIGATION_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'UPLOAD_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'VIEW_EVIDENCE',
    'REQUEST_ACCESS',
    'SHARE_DOCUMENTS',
  ],
  FORENSIC_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'UPLOAD_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'VIEW_EVIDENCE',
    'UPDATE_EVIDENCE',
    'UPDATE_FORENSIC',
    'REQUEST_ACCESS',
    'SIGN_DOCUMENTS',
  ],
  LEGAL_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'REQUEST_ACCESS',
    'PREPARE_LEGAL',
    'SIGN_DOCUMENTS',
  ],
  RECORDS_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'MANAGE_METADATA',
    'SEARCH_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'VIEW_EVIDENCE',
  ],
  AUDIT_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_CASES',
    'VIEW_DOCUMENTS',
    'SEARCH_DOCUMENTS',
    'VERIFY_DOCUMENTS',
    'VIEW_AUDIT',
    'VIEW_REPORTS',
    'VIEW_SECURITY',
  ],
}

export const ROLE_NAV: Record<Role, NavKey[]> = {
  SYSTEM_ADMIN: [
    'dashboard',
    'cases',
    'documents',
    'evidence',
    'search',
    'verification',
    'sharing',
    'approvals',
    'reports',
    'audit',
    'security',
    'admin',
    'help',
  ],
  DEPT_ADMIN: [
    'dashboard',
    'cases',
    'documents',
    'evidence',
    'search',
    'verification',
    'sharing',
    'approvals',
    'reports',
    'security',
    'admin',
    'help',
  ],
  HIGHER_AUTHORITY: [
    'dashboard',
    'cases',
    'documents',
    'evidence',
    'search',
    'verification',
    'sharing',
    'approvals',
    'reports',
    'audit',
    'security',
    'help',
  ],
  SENIOR_OFFICER: [
    'dashboard',
    'cases',
    'documents',
    'evidence',
    'search',
    'verification',
    'sharing',
    'approvals',
    'reports',
    'help',
  ],
  INVESTIGATION_OFFICER: [
    'dashboard',
    'cases',
    'documents',
    'evidence',
    'search',
    'verification',
    'sharing',
    'help',
  ],
  FORENSIC_OFFICER: [
    'dashboard',
    'cases',
    'documents',
    'evidence',
    'search',
    'verification',
    'sharing',
    'help',
  ],
  LEGAL_OFFICER: ['dashboard', 'cases', 'documents', 'search', 'verification', 'sharing', 'help'],
  RECORDS_OFFICER: ['dashboard', 'cases', 'documents', 'evidence', 'search', 'verification', 'help'],
  AUDIT_OFFICER: ['dashboard', 'cases', 'documents', 'search', 'verification', 'audit', 'reports', 'security', 'help'],
}

const CLEARANCE_RANK: Record<Clearance, number> = { L1: 1, L2: 2, L3: 3, L4: 4 }
const CLASS_RANK: Record<Classification, number> = {
  PUBLIC: 1,
  INTERNAL: 2,
  CONFIDENTIAL: 3,
  SECRET: 4,
  TOP_SECRET: 5,
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  return ROLE_PERMISSIONS[user.role].includes(permission)
}

export function checkDepartment(user: User, doc: DocumentRecord): boolean {
  if (user.role === 'SYSTEM_ADMIN' || user.role === 'HIGHER_AUTHORITY' || user.role === 'AUDIT_OFFICER') return true
  return doc.allowedDepartments.includes(user.department) || doc.department === user.department
}

export function checkJurisdiction(user: User, jurisdiction: string): boolean {
  if (user.role === 'SYSTEM_ADMIN' || user.role === 'HIGHER_AUTHORITY' || user.role === 'AUDIT_OFFICER') return true
  if (user.jurisdiction === 'National Prototype' || user.jurisdiction === 'National Oversight') return true
  return user.jurisdiction === jurisdiction || jurisdiction.includes('Delhi')
}

export function checkCaseAssignment(user: User, caseId: string): boolean {
  if (['SYSTEM_ADMIN', 'HIGHER_AUTHORITY', 'AUDIT_OFFICER', 'DEPT_ADMIN', 'RECORDS_OFFICER'].includes(user.role)) {
    return true
  }
  return user.assignedCaseIds.includes(caseId)
}

export function checkSecurityClearance(user: User, min: Clearance): boolean {
  return CLEARANCE_RANK[user.clearance] >= CLEARANCE_RANK[min]
}

export function checkDocumentClassification(user: User, classification: Classification): boolean {
  if (user.role === 'INVESTIGATION_OFFICER' && (classification === 'SECRET' || classification === 'TOP_SECRET')) {
    return false
  }
  if (user.role === 'RECORDS_OFFICER' && classification === 'TOP_SECRET') return false
  return CLASS_RANK[classification] <= (CLEARANCE_RANK[user.clearance] + 1)
}

export function canViewCase(user: User | null, caseId: string): boolean {
  if (!user) return false
  if (!hasPermission(user, 'VIEW_CASES')) return false
  const rec = cases.find((c) => c.id === caseId)
  if (!rec) return false
  if (!checkJurisdiction(user, rec.jurisdiction)) return false
  if (user.role === 'FORENSIC_OFFICER' && !user.assignedCaseIds.includes(caseId)) return false
  if (user.role === 'LEGAL_OFFICER' && !user.assignedCaseIds.includes(caseId)) return false
  if (user.role === 'INVESTIGATION_OFFICER' && !user.assignedCaseIds.includes(caseId)) return false
  if (user.role === 'SENIOR_OFFICER' && !user.assignedCaseIds.includes(caseId) && rec.department !== user.department) {
    return false
  }
  return true
}

export interface AccessDecision {
  allowed: boolean
  reason: string
}

export function evaluateDocumentAccess(
  user: User | null,
  doc: DocumentRecord,
  extraGrants: string[],
): AccessDecision {
  if (!user) return { allowed: false, reason: 'Not authenticated.' }
  if (!hasPermission(user, 'VIEW_DOCUMENTS')) {
    return { allowed: false, reason: 'Role does not include document view permission.' }
  }
  if (extraGrants.includes(`${user.id}:${doc.id}`)) {
    return { allowed: true, reason: 'Temporary approved access grant.' }
  }
  if (user.role === 'SYSTEM_ADMIN') {
    return { allowed: true, reason: 'System administrator metadata access (prototype).' }
  }
  if (user.role === 'AUDIT_OFFICER') {
    return { allowed: true, reason: 'Audit officer read-only access (prototype).' }
  }
  if (user.role === 'HIGHER_AUTHORITY') {
    return { allowed: true, reason: 'Higher authority authorized oversight.' }
  }
  if (!checkCaseAssignment(user, doc.caseId)) {
    return { allowed: false, reason: 'User is not assigned to this case.' }
  }
  if (!checkSecurityClearance(user, doc.minClearance)) {
    return { allowed: false, reason: 'Security clearance is insufficient.' }
  }
  if (!checkDocumentClassification(user, doc.classification)) {
    return { allowed: false, reason: 'Document classification exceeds role policy.' }
  }
  if (!checkDepartment(user, doc)) {
    return {
      allowed: false,
      reason: 'User does not satisfy the required department/case/document access policy.',
    }
  }
  return { allowed: true, reason: 'RBAC + ABAC checks passed.' }
}

export function canViewDocument(user: User | null, doc: DocumentRecord, extraGrants: string[]): boolean {
  return evaluateDocumentAccess(user, doc, extraGrants).allowed
}

export function canEditDocument(user: User | null, doc: DocumentRecord, extraGrants: string[]): boolean {
  if (!user || !canViewDocument(user, doc, extraGrants)) return false
  if (user.role === 'AUDIT_OFFICER' || user.role === 'SYSTEM_ADMIN') return false
  return hasPermission(user, 'EDIT_DOCUMENTS') || hasPermission(user, 'MANAGE_METADATA') || hasPermission(user, 'UPLOAD_DOCUMENTS')
}

export function canShareDocument(user: User | null, doc: DocumentRecord, extraGrants: string[]): boolean {
  if (!user || !canViewDocument(user, doc, extraGrants)) return false
  return hasPermission(user, 'SHARE_DOCUMENTS') || hasPermission(user, 'REQUEST_ACCESS')
}

export function canApproveRequest(user: User | null): boolean {
  return hasPermission(user, 'APPROVE_REQUESTS')
}

export function canViewAudit(user: User | null): boolean {
  return hasPermission(user, 'VIEW_AUDIT')
}

export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, 'MANAGE_USERS')
}

export function canSignDocument(user: User | null, doc: DocumentRecord, extraGrants: string[]): boolean {
  if (!user || !canViewDocument(user, doc, extraGrants)) return false
  return hasPermission(user, 'SIGN_DOCUMENTS')
}

export function routeAllowed(user: User | null, path: string): boolean {
  if (!user) return false
  const nav = ROLE_NAV[user.role]
  if (path.startsWith('/admin')) return nav.includes('admin')
  if (path.startsWith('/cases')) return nav.includes('cases')
  if (path.startsWith('/documents')) return nav.includes('documents')
  if (path.startsWith('/evidence')) return nav.includes('evidence')
  if (path.startsWith('/search')) return nav.includes('search')
  if (path.startsWith('/verification')) return nav.includes('verification')
  if (path.startsWith('/sharing')) return nav.includes('sharing')
  if (path.startsWith('/approvals')) return nav.includes('approvals')
  if (path.startsWith('/reports')) return nav.includes('reports')
  if (path.startsWith('/audit')) return nav.includes('audit')
  if (path.startsWith('/security') && path !== '/security-public') return nav.includes('security')
  if (path.startsWith('/dashboard')) return nav.includes('dashboard')
  if (path.startsWith('/notifications') || path.startsWith('/profile') || path.startsWith('/help')) return true
  return true
}

export function departmentLabel(id: DepartmentId): string {
  const map: Record<DepartmentId, string> = {
    POLICE: 'Police Department',
    FORENSICS: 'Forensic Department',
    LEGAL: 'Legal Department',
    COURT_RECORDS: 'Court / Legal Records',
    ADMINISTRATION: 'Administration',
  }
  return map[id]
}
