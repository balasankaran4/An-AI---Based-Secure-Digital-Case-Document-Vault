export type Language = 'en' | 'hi'
export type FontScale = 'sm' | 'md' | 'lg'

export type Role =
  | 'SYSTEM_ADMIN'
  | 'DEPT_ADMIN'
  | 'HIGHER_AUTHORITY'
  | 'SENIOR_OFFICER'
  | 'INVESTIGATION_OFFICER'
  | 'FORENSIC_OFFICER'
  | 'LEGAL_OFFICER'
  | 'RECORDS_OFFICER'
  | 'AUDIT_OFFICER'

export type DepartmentId =
  | 'POLICE'
  | 'FORENSICS'
  | 'LEGAL'
  | 'COURT_RECORDS'
  | 'ADMINISTRATION'

export type Clearance = 'L1' | 'L2' | 'L3' | 'L4'
export type Classification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET'
export type CaseStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'FORENSIC_REVIEW' | 'LEGAL_REVIEW' | 'CLOSED'
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type CaseType = 'INVESTIGATION' | 'CYBERCRIME' | 'FORENSIC' | 'LEGAL' | 'COURT'
export type DocumentType =
  | 'FIR'
  | 'INVESTIGATION_REPORT'
  | 'EVIDENCE_REPORT'
  | 'FORENSIC_REPORT'
  | 'LEGAL_OPINION'
  | 'WITNESS_STATEMENT'
  | 'CHARGE_SHEET'
  | 'COURT_FILING'
  | 'OTHER'
export type IntegrityStatus = 'VERIFIED' | 'PENDING' | 'REVIEW_REQUIRED' | 'ACCESS_RESTRICTED' | 'INTEGRITY_MISMATCH'
export type AccessStatus = 'AUTHORIZED' | 'RESTRICTED'
export type SignatureStatus = 'VERIFIED' | 'PENDING' | 'UNSIGNED'
export type BlockchainStatus = 'ANCHORED' | 'PENDING' | 'FAILED'
export type EncryptionStatus = 'ENCRYPTED' | 'PENDING'
export type SharePermission = 'VIEW' | 'DOWNLOAD' | 'COMMENT' | 'MODIFY' | 'RESHARE'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
export type EvidenceStatus = 'IN_CUSTODY' | 'TRANSFERRED' | 'ANALYZED' | 'ARCHIVED'
export type UserStatus = 'ACTIVE' | 'DISABLED'
export type NavKey =
  | 'dashboard'
  | 'cases'
  | 'documents'
  | 'evidence'
  | 'search'
  | 'verification'
  | 'sharing'
  | 'approvals'
  | 'reports'
  | 'audit'
  | 'security'
  | 'admin'
  | 'help'

export interface User {
  id: string
  officerId: string
  name: string
  nameHi: string
  password: string
  department: DepartmentId
  designation: string
  designationHi: string
  role: Role
  jurisdiction: string
  clearance: Clearance
  status: UserStatus
  lastLogin: string
  mfaEnabled: boolean
  assignedCaseIds: string[]
}

export interface Department {
  id: DepartmentId
  name: string
  nameHi: string
  description: string
  userCount: number
  caseCount: number
  documentCount: number
  pendingRequests: number
}

export interface CaseRecord {
  id: string
  title: string
  type: CaseType
  department: DepartmentId
  assignedOfficerIds: string[]
  status: CaseStatus
  classification: Classification
  jurisdiction: string
  priority: CasePriority
  openedOn: string
  lastUpdated: string
  summary: string
}

export interface DocumentVersion {
  version: number
  modifiedBy: string
  date: string
  changeDescription: string
  hash: string
  isCurrent: boolean
}

export interface DocumentRecord {
  id: string
  name: string
  fileName: string
  type: DocumentType
  caseId: string
  department: DepartmentId
  classification: Classification
  version: number
  integrity: IntegrityStatus
  lastUpdated: string
  uploadedBy: string
  description: string
  retentionPolicy: string
  sha256: string
  originalSha256: string
  encryption: EncryptionStatus
  blockchainStatus: BlockchainStatus
  blockchainAnchorId: string
  blockchainTimestamp: string
  signatureStatus: SignatureStatus
  signedBy?: string
  allowedDepartments: DepartmentId[]
  minClearance: Clearance
  previewText: string
  versions: DocumentVersion[]
}

export interface CustodyEvent {
  id: string
  officerId: string
  officerName: string
  department: DepartmentId
  timestamp: string
  action: string
  signature: string
  hash: string
}

export interface EvidenceRecord {
  id: string
  caseId: string
  type: string
  custodian: string
  department: DepartmentId
  status: EvidenceStatus
  integrity: IntegrityStatus
  lastTransfer: string
  description: string
  chainOfCustody: CustodyEvent[]
}

export interface AuditEvent {
  id: string
  timestamp: string
  userId: string
  userName: string
  department: DepartmentId
  action: string
  resource: string
  caseId?: string
  sessionId: string
  result: 'SUCCESS' | 'DENIED' | 'FAILED'
  details: string
}

export interface AccessRequest {
  id: string
  documentId: string
  requesterId: string
  requesterName: string
  requesterDepartment: DepartmentId
  targetDepartment: DepartmentId
  targetOfficerId: string
  permission: SharePermission
  durationDays: number
  reason: string
  date: string
  status: RequestStatus
  reviewedBy?: string
  reviewedOn?: string
}

export interface AppNotification {
  id: string
  title: string
  titleHi: string
  body: string
  bodyHi: string
  type: 'CASE' | 'ACCESS' | 'VERIFY' | 'SHARE' | 'SIGN' | 'INTEGRITY' | 'SECURITY'
  createdAt: string
  read: boolean
  href?: string
  audienceRoles?: Role[]
  audienceUserIds?: string[]
}

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'VIEW_CASES'
  | 'MANAGE_CASES'
  | 'VIEW_DOCUMENTS'
  | 'UPLOAD_DOCUMENTS'
  | 'EDIT_DOCUMENTS'
  | 'SHARE_DOCUMENTS'
  | 'SIGN_DOCUMENTS'
  | 'VERIFY_DOCUMENTS'
  | 'SEARCH_DOCUMENTS'
  | 'VIEW_EVIDENCE'
  | 'UPDATE_EVIDENCE'
  | 'REQUEST_ACCESS'
  | 'APPROVE_REQUESTS'
  | 'VIEW_REPORTS'
  | 'VIEW_AUDIT'
  | 'MANAGE_USERS'
  | 'MANAGE_DEPARTMENTS'
  | 'MANAGE_POLICIES'
  | 'VIEW_SECURITY'
  | 'VIEW_ADMIN'
  | 'MANAGE_METADATA'
  | 'PREPARE_LEGAL'
  | 'UPDATE_FORENSIC'
  | 'REVIEW_WORKFLOWS'

export interface SessionState {
  currentUserId: string | null
  authStatus: 'anonymous' | 'password' | 'authenticated'
  mfaStatus: 'pending' | 'verified'
}
