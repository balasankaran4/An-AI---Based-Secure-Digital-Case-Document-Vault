import type { ReactNode } from 'react'
import { StatusBadge } from '../common/ui'

function SecurityCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-2">
      <p className="text-[0.65rem] uppercase text-muted">{label}</p>
      <p className="text-xs font-semibold text-navy">{value}</p>
    </div>
  )
}

function ArchitectureBox({ children }: { children: ReactNode }) {
  return <div className="border border-navy bg-white px-3 py-2 text-center text-xs font-semibold text-navy">{children}</div>
}

export function Timeline({ items }: { items: { title: string; meta: string; body?: string }[] }) {
  return (
    <ol className="relative border-l-2 border-orange pl-5">
      {items.map((item) => (
        <li key={`${item.title}-${item.meta}`} className="relative mb-5 last:mb-0">
          <span className="absolute -left-[1.55rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-navy" aria-hidden />
          <p className="text-sm font-semibold text-navy">{item.title}</p>
          <p className="text-xs text-muted">{item.meta}</p>
          {item.body ? <p className="mt-1 text-sm">{item.body}</p> : null}
        </li>
      ))}
    </ol>
  )
}

export function BlockchainStatus({ status, anchorId, timestamp }: { status: string; anchorId: string; timestamp: string }) {
  return (
    <div className="panel border-t-4 border-t-orange p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">Permissioned ledger (represented)</p>
        <StatusBadge value={status} />
      </div>
      <p className="mt-2 break-all font-mono text-xs">Anchor ID: {anchorId}</p>
      <p className="text-xs text-muted">Timestamp: {timestamp}</p>
      <p className="mt-2 text-[0.7rem] text-muted">Prototype simulation — no live blockchain network is connected.</p>
    </div>
  )
}

export function SecurityStatusGrid() {
  const items = [
    ['Authentication', 'SECURE', 'MFA enabled'],
    ['Document encryption', 'AES-256 ENABLED', 'Represented backend control'],
    ['Integrity verification', 'SHA-256 ENABLED', 'Hash verification active'],
    ['Audit logging', 'ACTIVE', 'Append-only event trail'],
    ['RBAC / ABAC', 'ACTIVE', 'Role and attribute policy'],
    ['Blockchain anchor', 'PROTOTYPE', 'No production ledger connected'],
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([k, v, note]) => (
        <div key={k} className="panel border-t-2 border-t-orange p-4">
          <p className="text-[0.65rem] font-semibold uppercase text-muted">{k}</p>
          <p className={`mt-1 text-sm font-bold ${v === 'PROTOTYPE' ? 'text-navy' : 'text-success'}`}>{v}</p>
          <p className="mt-1 text-xs text-muted">{note}</p>
        </div>
      ))}
    </div>
  )
}

export function VerificationChain({ highlight }: { highlight?: string }) {
  const steps = ['Document', 'SHA-256 Hash', 'Blockchain Anchor', 'Timestamp', 'Signature', 'Audit Event']
  return (
    <div className="panel bg-white p-4">
      {steps.map((step, i) => (
        <div key={step} className="text-center">
          <div className={`inline-block border px-3 py-1 text-sm ${highlight === step ? 'border-danger text-danger' : 'border-navy text-navy'}`}>
            {step}
          </div>
          {i < steps.length - 1 ? <div className="py-1 text-navy">↓</div> : null}
        </div>
      ))}
    </div>
  )
}

export function DocumentSecurityStrip({
  encryption,
  integrity,
  blockchain,
  access,
  signature,
  version,
}: {
  encryption: string
  integrity: string
  blockchain: string
  access: string
  signature: string
  version: string
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
      <SecurityCell label="Encryption" value={encryption} />
      <SecurityCell label="Integrity" value={integrity} />
      <SecurityCell label="Blockchain" value={blockchain} />
      <SecurityCell label="Access" value={access} />
      <SecurityCell label="Signature" value={signature} />
      <SecurityCell label="Version" value={version} />
    </div>
  )
}

export function ArchitectureDiagram() {
  return (
    <div className="space-y-2 bg-sand p-4">
      <ArchitectureBox>Officer client (this prototype UI)</ArchitectureBox>
      <p className="text-center text-navy">↓ TLS (represented)</p>
      <ArchitectureBox>API gateway / FastAPI (planned)</ArchitectureBox>
      <p className="text-center text-navy">↓</p>
      <div className="grid gap-2 md:grid-cols-4">
        <ArchitectureBox>RBAC + ABAC policy engine</ArchitectureBox>
        <ArchitectureBox>Encrypted object storage (AES-256 represented)</ArchitectureBox>
        <ArchitectureBox>PostgreSQL metadata</ArchitectureBox>
        <ArchitectureBox>Permissioned ledger + SHA-256</ArchitectureBox>
      </div>
      <p className="text-center text-navy">↓</p>
      <ArchitectureBox>Append-only audit trail</ArchitectureBox>
    </div>
  )
}
