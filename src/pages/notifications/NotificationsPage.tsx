import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNotifications, markNotificationRead } from '../../services/api'
import { Breadcrumbs, PageHeader, StatusBadge } from '../../components/common/ui'
import type { AppNotification } from '../../types'

export function NotificationsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<AppNotification[]>([])

  useEffect(() => {
    if (!user) return
    void getNotifications(user).then(setRows)
  }, [user])

  if (!user) return null

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Notifications' }]} />
      <PageHeader title="Notification centre" />
      <ul className="divide-y divide-line border border-line bg-white">
        {rows.map((n) => (
          <li key={n.id} className={`p-4 text-sm ${n.read ? 'bg-white' : 'bg-sand'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-navy">{n.title}</p>
              <StatusBadge value={n.read ? 'READ' : 'UNREAD'} />
            </div>
            <p className="mt-1">{n.body}</p>
            <p className="text-xs text-muted">{n.createdAt}</p>
            <div className="mt-2 flex gap-3">
              {n.href ? (
                <Link className="text-navy underline" to={n.href}>
                  Open
                </Link>
              ) : null}
              {!n.read ? (
                <button
                  type="button"
                  className="text-navy underline"
                  onClick={() => {
                    void markNotificationRead(n.id).then(() => setRows((r) => r.map((x) => (x.id === n.id ? { ...x, read: true } : x))))
                  }}
                >
                  Mark read
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
