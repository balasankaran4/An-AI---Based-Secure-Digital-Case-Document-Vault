import { Accessibility, Bell, Landmark, LockKeyhole, LogOut } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { PUBLIC_NAV } from '../../config/app'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'

const APP_NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/cases', label: 'Cases' },
  { to: '/documents', label: 'Documents' },
  { to: '/evidence', label: 'Evidence' },
  { to: '/search', label: 'Search' },
  { to: '/verification', label: 'Verification' },
  { to: '/sharing', label: 'Sharing' },
  { to: '/approvals', label: 'Approvals' },
  { to: '/audit', label: 'Audit' },
]

export function GovernmentHeader({ variant = 'public' }: { variant?: 'public' | 'app' }) {
  const { language, setLanguage, fontScale, setFontScale, highContrast, setHighContrast, t } = useUI()
  const { user, logout } = useAuth()
  const isApp = variant === 'app'

  return (
    <header className={isApp ? 'border-b border-white/15 bg-navy text-white' : 'border-b border-line bg-white'}>
      <a href="#main-content" className="skip-link">
        {t('skip')}
      </a>
      <div className={isApp ? 'bg-navy-800 text-white/90' : 'bg-navy text-white'}>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs md:px-6">
          <p>
            <span className="font-semibold">{t('gov.india.hi')}</span>
            <span className="mx-2 opacity-60">|</span>
            <span>{t('gov.india')}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Language">
              <button type="button" className={`px-1 ${language === 'en' ? 'font-bold underline' : ''}`} onClick={() => setLanguage('en')}>
                English
              </button>
              <span className="mx-1 opacity-60">|</span>
              <button type="button" className={`px-1 ${language === 'hi' ? 'font-bold underline' : ''}`} onClick={() => setLanguage('hi')}>
                हिन्दी
              </button>
            </div>
            <div role="group" aria-label="Text size" className="flex items-center gap-1">
              {(['lg', 'md', 'sm'] as const).map((s) => (
                <button key={s} type="button" className={`border border-white/40 px-1.5 ${fontScale === s ? 'bg-white text-navy' : ''}`} onClick={() => setFontScale(s)} aria-pressed={fontScale === s}>
                  {s === 'lg' ? 'A+' : s === 'md' ? 'A' : 'A-'}
                </button>
              ))}
            </div>
            <button type="button" className="inline-flex items-center gap-1" onClick={() => setHighContrast(!highContrast)} aria-pressed={highContrast}>
              <Accessibility size={14} aria-hidden />
              {t('accessibility')}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-3 md:px-6">
        <Link to={isApp ? '/dashboard' : '/'} className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current/40" aria-hidden>
            <Landmark size={24} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold uppercase tracking-wide">{t('app.title')}</p>
            <p className={`truncate text-xs ${isApp ? 'text-white/70' : 'text-muted'}`}>{t('app.subtitle')}</p>
            <p className={`mt-1 inline-block border px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide ${isApp ? 'border-white/25 text-white/75' : 'border-line text-muted'}`}>
              {t('app.prototype')}
            </p>
          </div>
        </Link>

        {isApp && user ? (
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="hidden items-center gap-1.5 border-r border-white/20 pr-3 text-white/80 sm:inline-flex">
              <LockKeyhole size={14} aria-hidden />
              Session secure
            </span>
            <Link to="/notifications" className="inline-flex items-center gap-1.5 text-white/90 hover:text-white" aria-label="Notifications">
              <Bell size={17} aria-hidden />
              <span className="hidden sm:inline">Notifications</span>
            </Link>
            <Link to="/profile" className="hidden text-right sm:block">
              <span className="block font-semibold">{user.name}</span>
              <span className="block text-white/65">{user.department} · {user.officerId}</span>
            </Link>
            <button type="button" className="inline-flex items-center gap-1 border border-white/35 px-2 py-1.5 text-white hover:bg-white/10" onClick={() => void logout()}>
              <LogOut size={14} aria-hidden />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : null}
      </div>

      {isApp ? (
        <nav className="border-t border-white/15 bg-navy-700" aria-label="Primary application navigation">
          <div className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-4 md:px-6">
            {APP_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold ${isActive ? 'border-orange text-white' : 'border-transparent text-white/70 hover:border-white/50 hover:text-white'}`}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : (
        <nav className="border-t border-line bg-sand" aria-label="Primary">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {PUBLIC_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => `py-1 ${isActive ? 'font-semibold text-navy underline decoration-orange decoration-2 underline-offset-4' : 'text-ink hover:text-navy'}`} end={item.to === '/'}>
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link to="/login" className="btn-primary min-h-0 px-3 py-1.5 text-xs">
              {t('login')}
            </Link>
          </div>
        </nav>
      )}
      <div className="h-0.5 bg-gradient-to-r from-orange via-white to-green" aria-hidden />
    </header>
  )
}
