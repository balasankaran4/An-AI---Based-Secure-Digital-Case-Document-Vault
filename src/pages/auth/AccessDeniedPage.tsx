import { Link, useLocation } from 'react-router-dom'
import { useUI } from '../../context/UIContext'

export function AccessDeniedPage() {
  const { t } = useUI()
  const location = useLocation()
  const reason = (location.state as { reason?: string } | null)?.reason

  return (
    <div className="mx-auto max-w-xl border border-line bg-white p-6">
      <h1 className="text-2xl font-semibold text-navy">{t('denied.title')}</h1>
      <p className="mt-3 text-sm">{t('denied.body')}</p>
      <p className="mt-3 text-sm font-semibold text-navy">
        {reason ?? 'User does not satisfy the required department/case/document access policy.'}
      </p>
      <p className="mt-2 text-xs text-muted">Restricted document contents are not displayed.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/dashboard" className="bg-navy px-4 py-2 text-sm font-semibold text-white">
          {t('denied.return')}
        </Link>
        <Link to="/sharing" className="border border-navy px-4 py-2 text-sm font-semibold text-navy">
          {t('denied.request')}
        </Link>
      </div>
    </div>
  )
}
