# Secure Digital Case & Document Vault

SIH 2026 prototype frontend for SIH26190 — Secure Digital Document Management System for Legal and Investigation Documents.

This is **not** an official Government of India service.

## Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite (typically http://localhost:5173).

## Demo credentials

Password for all users: `demo123`  
MFA OTP: `123456`

| Officer ID | Role |
|---|---|
| SYS-ADMIN | System Administrator |
| DEPT-ADMIN | Department Administrator |
| AUTH-01 | Higher Authority |
| SNR-01 | Senior Officer |
| INV-01 | Investigation Officer |
| FOR-01 | Forensic Officer |
| LEG-01 | Legal Officer |
| REC-01 | Records Officer |
| AUD-01 | Audit / Compliance Officer |

## Suggested demo

1. Login as **INV-01** → MFA → dashboard → CASE-2026-001 → document vault.
2. Open **Legal-Opinion-001** (access denied) → Request Access on Sharing.
3. Sign out, login as **AUTH-01**, approve the request.
4. Return as **INV-01** and open the legal opinion.
5. Verification page: FIR-001 → Verify → Simulate Integrity Change.
"# An-AI---Based-Secure-Digital-Case-Document-Vault" 
