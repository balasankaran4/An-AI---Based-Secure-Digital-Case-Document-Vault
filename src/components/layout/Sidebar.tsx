import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  FileText,
  FolderLock,
  LayoutDashboard,
  LockKeyhole,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
  UserCog,
  Users,
} from 'lucide-react'
import type { NavKey } from '../../types'
import { ROLE_NAV, hasPermission } from '../../auth/permissions'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'

type SidebarItem = { key: NavKey; to: string; label: string; icon: typeof LayoutDashboard }
type SidebarSection = { label: string; items: SidebarItem[] }

const SECTIONS: SidebarSection[] = [
  { label: 'Overview', items: [{ key: 'dashboard', to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }] },
  {
    label: 'Case Management',
    items: [
      { key: 'cases', to: '/cases', icon: FileCheck2, label: 'Cases' },
      { key: 'documents', to: '/documents', icon: FileText, label: 'Case Documents' },
      { key: 'evidence', to: '/evidence', icon: ClipboardCheck, label: 'Evidence' },
    ],
  },
  {
    label: 'Document Services',
    items: [
      { key: 'documents', to: '/documents', icon: FolderLock, label: 'Document Vault' },
      { key: 'documents', to: '/documents/upload', icon: UploadCloud, label: 'Upload Document' },
      { key: 'search', to: '/search', icon: Search, label: 'AI Search' },
      { key: 'verification', to: '/verification', icon: ShieldCheck, label: 'Verification' },
    ],
  },
  {
    label: 'Workflow',
    items: [
      { key: 'sharing', to: '/sharing', icon: Share2, label: 'Controlled Sharing' },
      { key: 'approvals', to: '/approvals', icon: FileSearch, label: 'Approvals' },
    ],
  },
  {
    label: 'Security & Compliance',
    items: [
      { key: 'audit', to: '/audit', icon: FileSearch, label: 'Audit Trail' },
      { key: 'security', to: '/security', icon: LockKeyhole, label: 'Security Center' },
      { key: 'verification', to: '/verification', icon: ShieldCheck, label: 'Integrity Verification' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { key: 'admin', to: '/admin/users', icon: Users, label: 'Users' },
      { key: 'admin', to: '/admin/departments', icon: UserCog, label: 'Departments' },
      { key: 'admin', to: '/admin', icon: SlidersHorizontal, label: 'Roles & Permissions' },
      { key: 'reports', to: '/reports', icon: FileText, label: 'Reports' },
      { key: 'admin', to: '/admin', icon: Settings, label: 'System Settings' },
    ],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const { t } = useUI()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  if (!user) return null
  const allowed = ROLE_NAV[user.role]

  const renderNavigation = (compact = false) => (
    <>
      <div className="flex items-center justify-between border-b border-line px-3 py-3">
        {!compact ? <span className="section-kicker">Officer workspace</span> : <LockKeyhole size={17} className="text-navy" aria-label="Officer workspace" />}
        <button type="button" className="hidden rounded p-1 text-muted hover:bg-sand hover:text-navy md:block" onClick={() => setCollapsed((value) => !value)} aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}>
          {compact ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
        <button type="button" className="rounded p-1 text-muted hover:bg-sand hover:text-navy md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
          <ChevronLeft size={17} />
        </button>
      </div>
      <nav aria-label="Officer navigation" className="px-2 py-3">
        {SECTIONS.map((section) => {
          const items = section.items.filter((item) => allowed.includes(item.key) && (item.to !== '/documents/upload' || hasPermission(user, 'UPLOAD_DOCUMENTS')))
          if (items.length === 0) return null
          return (
            <div key={section.label} className="mb-4">
              {!compact ? <p className="px-2 pb-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted">{section.label}</p> : null}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={`${item.label}-${item.to}`}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/documents' || item.to === '/admin'}
                        onClick={() => setMobileOpen(false)}
                        title={compact ? item.label : undefined}
                        className={({ isActive }) => `relative flex items-center gap-2 rounded px-2.5 py-2 text-sm ${compact ? 'justify-center' : ''} ${isActive ? 'border-l-4 border-orange bg-white pl-[0.4rem] font-semibold text-navy shadow-sm' : 'border-l-4 border-transparent text-ink hover:bg-sand hover:text-navy'}`}
                      >
                        <Icon size={17} aria-hidden />
                        {!compact ? <span>{item.label}</span> : null}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
        <div className="border-t border-line pt-3">
          <NavLink to="/notifications" onClick={() => setMobileOpen(false)} title={collapsed ? 'Notifications' : undefined} className={({ isActive }) => `flex items-center gap-2 rounded border-l-4 px-2.5 py-2 text-sm ${collapsed ? 'justify-center' : ''} ${isActive ? 'border-orange bg-white font-semibold text-navy shadow-sm' : 'border-transparent text-ink hover:bg-sand hover:text-navy'}`}>
            <Bell size={17} aria-hidden />
            {!compact ? 'Notifications' : null}
          </NavLink>
          <NavLink to="/profile" onClick={() => setMobileOpen(false)} title={collapsed ? 'Profile' : undefined} className={({ isActive }) => `mt-0.5 flex items-center gap-2 rounded border-l-4 px-2.5 py-2 text-sm ${collapsed ? 'justify-center' : ''} ${isActive ? 'border-orange bg-white font-semibold text-navy shadow-sm' : 'border-transparent text-ink hover:bg-sand hover:text-navy'}`}>
            <Users size={17} aria-hidden />
            {!compact ? 'Profile' : null}
          </NavLink>
          {!compact ? <p className="mt-4 px-2 text-[0.68rem] leading-5 text-muted">Access is evaluated by role, department, jurisdiction, clearance and assignment.</p> : null}
          <button type="button" className={`mt-3 flex w-full items-center gap-2 rounded border border-line px-2.5 py-2 text-left text-sm text-ink hover:border-navy hover:text-navy ${compact ? 'justify-center' : ''}`} onClick={() => void logout()} title={compact ? 'Sign out' : undefined}>
            <span aria-hidden>↪</span>
            {!compact ? t('logout') : null}
          </button>
        </div>
      </nav>
    </>
  )

  return (
    <>
      <div className="border-b border-line bg-white px-4 py-2 md:hidden">
        <button type="button" className="btn-secondary min-h-0 px-3 py-1.5 text-xs" onClick={() => setMobileOpen(true)}>
          <SlidersHorizontal size={15} aria-hidden />
          Open navigation
        </button>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-navy/35 md:hidden" role="presentation" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-[min(86vw,320px)] overflow-y-auto bg-white shadow-xl" aria-label="Officer navigation" onClick={(e) => e.stopPropagation()}>
            {renderNavigation(false)}
          </aside>
        </div>
      ) : null}
      <aside className={`hidden shrink-0 border-r border-line bg-white md:block ${collapsed ? 'w-16' : 'w-64'}`} aria-label="Officer navigation">
        {renderNavigation(collapsed)}
      </aside>
    </>
  )
}
