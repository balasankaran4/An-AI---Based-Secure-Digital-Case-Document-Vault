import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'

export function GovernmentFooter() {
  const { t } = useUI()
  return (
    <footer className="mt-auto border-t border-navy bg-navy text-white">
      <div className="h-1 bg-gradient-to-r from-orange via-white to-green" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-4">
        <div>
          <p className="font-semibold">{t('app.title')}</p>
          <p className="mt-1 text-xs text-white/80">{t('app.prototype')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Quick Links</p>
          <ul className="mt-2 space-y-1 text-sm text-white/85">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/services">Digital Services</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Support</p>
          <ul className="mt-2 space-y-1 text-sm text-white/85">
            <li>
              <Link to="/security-public">Security</Link>
            </li>
            <li>
              <Link to="/help-public">Help</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Policies</p>
          <ul className="mt-2 space-y-1 text-sm text-white/85">
            <li>Privacy (prototype)</li>
            <li>Accessibility</li>
            <li>Disclaimer</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 px-4 py-3 text-center text-xs text-white/90">{t('footer.notice')}</div>
    </footer>
  )
}
