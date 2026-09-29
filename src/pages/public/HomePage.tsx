import { Link } from 'react-router-dom'
import { FileCheck, FileSearch, FolderLock, Scale, ShieldCheck, Signature } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { SecurityStatusGrid } from '../../components/security/SecurityWidgets'

const services = [
  { title: 'Case Management', icon: Scale, to: '/login' },
  { title: 'Secure Document Vault', icon: FolderLock, to: '/login' },
  { title: 'Evidence Management', icon: FileCheck, to: '/login' },
  { title: 'AI Document Search', icon: FileSearch, to: '/login' },
  { title: 'Document Verification', icon: ShieldCheck, to: '/login' },
  { title: 'Digital Signature', icon: Signature, to: '/login' },
]

const notices = [
  'New investigation document uploaded',
  'Document integrity verification completed',
  'Cross-department access request received',
  'New forensic report available',
  'Digital signature verification completed',
]

export function HomePage() {
  const { t } = useUI()
  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t('app.prototype')}</p>
            <h1 className="mt-2 text-3xl font-semibold text-navy md:text-4xl">{t('app.title')}</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink md:text-base">{t('hero.desc')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login" className="bg-navy px-4 py-2 text-sm font-semibold text-white">
                {t('cta.login')}
              </Link>
              <Link to="/about" className="border border-navy px-4 py-2 text-sm font-semibold text-navy">
                {t('cta.explore')}
              </Link>
            </div>
          </div>
          <div className="border border-line bg-sand p-5">
            <p className="text-sm font-semibold text-navy">Centralized vault · Controlled access</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Attribute-Based Access Control (ABAC)</li>
              <li>Document-level permissions</li>
              <li>Department connectivity without unrestricted sharing</li>
            </ul>
            <p className="mt-4 text-xs text-muted">
              This portal is a hackathon prototype. It is not an official Ministry of Home Affairs, NCRB, or eCourts website.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-xl font-semibold text-navy">Digital Services</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.title} to={s.to} className="border border-line bg-white p-4 hover:border-navy">
                <Icon className="text-navy" size={22} aria-hidden />
                <p className="mt-2 font-semibold text-navy">{s.title}</p>
                <p className="text-xs text-muted">Officer login required</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-xl font-semibold text-navy">What&apos;s New</h2>
          <ul className="mt-4 divide-y divide-line border border-line bg-white">
            {notices.map((n) => (
              <li key={n} className="px-4 py-3 text-sm">
                <span className="mr-2 text-xs font-semibold text-navy">NOTICE</span>
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-xl font-semibold text-navy">System Capabilities</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {['Confidentiality', 'Integrity', 'Traceability', 'Productivity', 'Controlled Collaboration'].map((c) => (
            <div key={c} className="border border-line p-4 text-sm font-semibold text-navy">
              {c}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-xl font-semibold text-navy">Security Architecture</h2>
          <p className="mt-1 text-sm text-muted">Backend security states as represented in this prototype.</p>
          <div className="mt-4">
            <SecurityStatusGrid />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-xl font-semibold text-navy">Department Connectivity</h2>
        <p className="mt-1 text-sm text-muted">Interconnected departments with independent access policies.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {['Police Department', 'Forensic Department', 'Legal Department', 'Court / Legal Records', 'Administration'].map(
            (d) => (
              <div key={d} className="border border-line bg-white p-4 text-sm font-semibold text-navy">
                {d}
              </div>
            ),
          )}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-xl font-semibold text-navy">Important Links</h2>
          <ul className="mt-3 grid gap-2 text-sm text-navy md:grid-cols-2">
            <li>
              <Link className="underline" to="/help-public">
                User guides
              </Link>
            </li>
            <li>
              <Link className="underline" to="/security-public">
                Security overview
              </Link>
            </li>
            <li>
              <Link className="underline" to="/resources">
                Policies and resources
              </Link>
            </li>
            <li>
              <Link className="underline" to="/contact">
                Technical helpdesk (demo)
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">About the System</h1>
      <p className="mt-4 text-sm leading-relaxed">
        Law enforcement agencies, courts, legal departments, and investigative organizations handle FIRs, investigation
        records, witness statements, charge sheets, court filings, evidence records, forensic reports, and judgments.
        Fragmented storage creates unauthorized access risk, weak version control, and poor auditability.
      </p>
      <p className="mt-3 text-sm leading-relaxed">
        This prototype demonstrates a centralized document vault with department-based, role-based, and attribute-based
        access. A centralized vault does not mean unrestricted access. Officers see only records allowed by role,
        department, designation, jurisdiction, case assignment, clearance, classification, and purpose.
      </p>
    </article>
  )
}

export function ServicesPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Digital Services</h1>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
        <li>Secure officer authentication with MFA simulation</li>
        <li>Case and evidence management with chain of custody</li>
        <li>Document registration with represented encryption, hashing, and ledger anchoring</li>
        <li>Controlled cross-department sharing and approvals</li>
        <li>Prototype AI semantic search interface</li>
      </ul>
    </article>
  )
}

export function PublicSecurityPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Security</h1>
      <p className="mt-2 text-sm text-muted">Represented controls for SIH 2026 demonstration. Backend API: Secure (planned).</p>
      <div className="mt-6">
        <SecurityStatusGrid />
      </div>
    </article>
  )
}

export function ResourcesPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Resources</h1>
      <ul className="mt-4 space-y-2 text-sm">
        <li>Access control policy (prototype)</li>
        <li>Retention and archival guidelines (prototype)</li>
        <li>Evidence handling SOP (prototype)</li>
        <li>Audit and compliance checklist (prototype)</li>
      </ul>
    </article>
  )
}

export function ContactPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Contact</h1>
      <p className="mt-4 text-sm">Prototype helpdesk (demo only): vault-help@sih2026.example</p>
      <p className="mt-2 text-sm">This is not an official Government of India contact channel.</p>
    </article>
  )
}

export function PublicHelpPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Help</h1>
      <p className="mt-4 text-sm">Use Officer Login with demo credentials listed on the login page. After password verification, enter OTP 123456.</p>
    </article>
  )
}
