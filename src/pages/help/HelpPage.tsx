import { Breadcrumbs, PageHeader } from '../../components/common/ui'

const sections = [
  { title: 'User Guide', body: 'Login with demo Officer ID, complete MFA with 123456, then use only menu items shown for your role.' },
  { title: 'Document Upload Guide', body: 'Investigation, senior, and forensic officers can register documents. The pipeline is a simulation of OCR, classification, encryption, hashing, and anchoring.' },
  { title: 'Access Control Guide', body: 'RBAC limits menus. ABAC limits documents by department, jurisdiction, case assignment, clearance, and classification.' },
  { title: 'Document Verification', body: 'Open Verification, select FIR-001, verify, then Simulate Integrity Change to see mismatch.' },
  { title: 'AI Search', body: 'Use the example vehicle seizure query. Results are mocked from authorized records only.' },
  { title: 'Sharing', body: 'Request view access to Legal-Opinion-001 as INV-01. Approve as AUTH-01.' },
  { title: 'Security', body: 'Labels represent planned FastAPI controls. This UI does not encrypt with AES-256 locally.' },
  { title: 'FAQ', body: 'Why can I not see a document? Because centralized storage still enforces least privilege.' },
]

export function HelpPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Help' }]} />
      <PageHeader title="Help" />
      <div className="space-y-3">
        {sections.map((s) => (
          <section key={s.title} className="border border-line bg-white p-4">
            <h2 className="text-sm font-semibold text-navy">{s.title}</h2>
            <p className="mt-1 text-sm">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
