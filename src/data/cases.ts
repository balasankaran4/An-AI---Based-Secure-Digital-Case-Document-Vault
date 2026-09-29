import type { CaseRecord } from '../types'

export const cases: CaseRecord[] = [
  {
    id: 'CASE-2026-001',
    title: 'Vehicle seizure and related investigation',
    type: 'INVESTIGATION',
    department: 'POLICE',
    assignedOfficerIds: ['u-inv', 'u-snr', 'u-for', 'u-leg', 'u-dept'],
    status: 'UNDER_INVESTIGATION',
    classification: 'CONFIDENTIAL',
    jurisdiction: 'Delhi NCT',
    priority: 'HIGH',
    openedOn: '2026-09-12',
    lastUpdated: '2026-09-29 10:32:14',
    summary:
      'Authorized investigation concerning vehicle seizure, associated documentary evidence, and inter-departmental forensic and legal review.',
  },
  {
    id: 'CASE-2026-002',
    title: 'Cyber complaint — unauthorized access attempt',
    type: 'CYBERCRIME',
    department: 'POLICE',
    assignedOfficerIds: ['u-snr', 'u-auth'],
    status: 'OPEN',
    classification: 'SECRET',
    jurisdiction: 'Delhi NCT',
    priority: 'CRITICAL',
    openedOn: '2026-09-20',
    lastUpdated: '2026-09-27 14:10:00',
    summary: 'Restricted cyber investigation. Access limited to assigned senior officers and higher authority.',
  },
]
