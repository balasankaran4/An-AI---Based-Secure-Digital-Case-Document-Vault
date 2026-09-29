import { ArchitectureDiagram, SecurityStatusGrid } from '../../components/security/SecurityWidgets'
import { Breadcrumbs, PageHeader, PrototypeNote } from '../../components/common/ui'

export function SecurityCenterPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Security Center' }]} />
      <PageHeader title="Security Center" subtitle="Represented backend controls. Frontend does not perform AES-256 or ledger writes." />
      <PrototypeNote>Backend API: Secure (planned FastAPI). Prototype Simulation.</PrototypeNote>
      <div className="mt-4">
        <SecurityStatusGrid />
      </div>
      <h2 className="mt-6 text-sm font-semibold text-navy">Architecture (frontend diagram)</h2>
      <ArchitectureDiagram />
    </div>
  )
}
