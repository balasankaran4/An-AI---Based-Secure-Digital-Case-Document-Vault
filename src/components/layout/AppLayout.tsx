import { Outlet } from 'react-router-dom'
import { GovernmentFooter } from '../government/GovernmentFooter'
import { GovernmentHeader } from '../government/GovernmentHeader'
import { Sidebar } from './Sidebar'
import { Toast } from '../common/ui'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <GovernmentHeader variant="app" />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col md:flex-row">
        <Sidebar />
        <main id="main-content" className="page-enter min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <GovernmentFooter />
      <Toast />
    </div>
  )
}
