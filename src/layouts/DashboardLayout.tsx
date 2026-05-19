import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/dashboard/Sidebar'
import { UserManagementModal } from '../components/dashboard/UserManagementModal'
import { UserModalProvider } from '../contexts/UserModalContext'

export function DashboardLayout() {
  return (
    <UserModalProvider>
      <div className="dash">
        <Sidebar />
        <div className="dash-main">
          <Outlet />
        </div>
        <UserManagementModal />
      </div>
    </UserModalProvider>
  )
}
