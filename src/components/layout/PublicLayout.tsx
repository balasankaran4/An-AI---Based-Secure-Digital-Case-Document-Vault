import { Outlet } from 'react-router-dom'
import { GovernmentFooter } from '../government/GovernmentFooter'
import { GovernmentHeader } from '../government/GovernmentHeader'
import { Toast } from '../common/ui'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <GovernmentHeader variant="public" />
      <main id="main-content" className="page-enter flex-1">
        <Outlet />
      </main>
      <GovernmentFooter />
      <Toast />
    </div>
  )
}
