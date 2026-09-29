import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CheckCircle2, Clock3, Info, LockKeyhole, XCircle } from 'lucide-react'
import { useUI } from '../../context/UIContext'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 h-1 w-12 bg-orange" aria-hidden />
        <h1 className="text-xl font-semibold tracking-tight text-navy md:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-xs text-muted">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {i > 0 ? <span className="mx-1">/</span> : null}
          {item.to ? (
            <Link className="text-navy underline-offset-2 hover:underline" to={item.to}>
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <label className="block w-full">
      <span className="sr-only">{placeholder}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-line bg-white px-3 py-2 text-sm text-ink"
      />
    </label>
  )
}

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toUpperCase()
  const success = normalized.includes('VERIF') || ['APPROVED', 'ACTIVE', 'ANCHORED', 'SUCCESS', 'SECURE', 'ENABLED', 'ENCRYPTED', 'VALID', 'CURRENT', 'AUTHORIZED'].includes(normalized)
  const warning = normalized.includes('PENDING') || normalized === 'REVIEW' || normalized.includes('REVIEW') || normalized.includes('REQUIRED')
  const danger = normalized.includes('DENIED') || normalized.includes('FAIL') || normalized.includes('MISMATCH') || ['REJECTED', 'DISABLED'].includes(normalized)
  const tone = success ? 'border-success text-success' : warning ? 'border-warning text-warning' : danger ? 'border-danger text-danger' : normalized.includes('RESTRICTED') ? 'border-navy text-navy' : 'border-info text-info'
  const Icon = success ? CheckCircle2 : warning ? Clock3 : danger ? XCircle : normalized.includes('RESTRICTED') ? LockKeyhole : Info
  return <span className={`badge ${tone}`}><Icon size={12} aria-hidden />{value.replaceAll('_', ' ')}</span>
}

export function SecurityBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-sand px-3 py-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-navy">{value}</p>
    </div>
  )
}

export function PermissionBadge({ allowed }: { allowed: boolean }) {
  return <StatusBadge value={allowed ? 'AUTHORIZED' : 'RESTRICTED'} />
}

export function StatsCard({ label, value, hint, icon, tone = 'navy' }: { label: string; value: string | number; hint?: string; icon?: ReactNode; tone?: 'navy' | 'orange' | 'green' }) {
  return (
    <div className={`panel border-l-4 p-4 ${tone === 'orange' ? 'border-l-orange' : tone === 'green' ? 'border-l-success' : 'border-l-navy'}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        {icon ? <span className={tone === 'green' ? 'text-success' : tone === 'orange' ? 'text-orange' : 'text-navy'} aria-hidden>{icon}</span> : null}
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

export function LoadingState({ label = 'Loading authorized records…' }: { label?: string }) {
  return (
    <div role="status" className="panel flex items-center justify-center gap-2 bg-sand px-4 py-8 text-center text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-navy" aria-hidden />
      {label}
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-line bg-white px-4 py-10 text-center">
      <p className="font-semibold text-navy">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="border border-danger bg-white px-4 py-4 text-sm text-danger">
      {message}
    </div>
  )
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto border border-line bg-white p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold text-navy">
            {title}
          </h2>
          <button type="button" className="border border-line px-2 py-1 text-xs" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-ink">{body}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="border border-line px-3 py-2 text-sm" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="bg-navy px-3 py-2 text-sm text-white" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export function Toast() {
  const { toast } = useUI()
  if (!toast) return null
  return (
    <div role="status" className="fixed bottom-4 right-4 z-50 border border-navy bg-white px-4 py-3 text-sm text-navy shadow-sm">
      {toast}
    </div>
  )
}

export function DataTable({
  headers,
  children,
  caption,
}: {
  headers: string[]
  children: ReactNode
  caption?: string
}) {
  return (
    <div className="table-wrap rounded border border-line">
      <table className="w-full border-collapse text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-sand text-[0.72rem] uppercase tracking-wide">
          <tr>
            {headers.map((h) => (
              <th key={h} className="border-b border-line px-3 py-2 font-semibold text-navy">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function FileUpload({ onFile }: { onFile: (name: string) => void }) {
  return (
    <label className="block border border-dashed border-line bg-sand px-4 py-8 text-center text-sm">
      <span className="font-semibold text-navy">Select document (prototype)</span>
      <p className="mt-1 text-muted">PDF, scanned image, or office document. File is not uploaded to a server.</p>
      <input
        type="file"
        className="mt-3 text-sm"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f.name)
        }}
      />
    </label>
  )
}

export function PrototypeNote({ children }: { children?: ReactNode }) {
  return (
    <p className="border border-line bg-sand px-3 py-2 text-xs text-muted">
      {children ?? 'Prototype simulation — security states represent planned backend services (FastAPI), not client-side cryptography.'}
    </p>
  )
}
