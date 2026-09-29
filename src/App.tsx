import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import { PublicLayout } from './components/layout/PublicLayout'
import { AppLayout } from './components/layout/AppLayout'
import { PasswordGate, ProtectedRoute } from './components/navigation/ProtectedRoute'
import {
  AboutPage,
  ContactPage,
  HomePage,
  PublicHelpPage,
  PublicSecurityPage,
  ResourcesPage,
  ServicesPage,
} from './pages/public/HomePage'
import { LoginPage } from './pages/auth/LoginPage'
import { MfaPage } from './pages/auth/MfaPage'
import { AccessDeniedPage } from './pages/auth/AccessDeniedPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { CasesPage } from './pages/cases/CasesPage'
import { CaseDetailPage } from './pages/cases/CaseDetailPage'
import { DocumentsPage } from './pages/documents/DocumentsPage'
import { UploadPage } from './pages/documents/UploadPage'
import { DocumentDetailPage } from './pages/documents/DocumentDetailPage'
import { SearchPage } from './pages/search/SearchPage'
import { VerificationPage } from './pages/verification/VerificationPage'
import { SharingPage } from './pages/sharing/SharingPage'
import { ApprovalsPage } from './pages/approvals/ApprovalsPage'
import { EvidencePage } from './pages/evidence/EvidencePage'
import { AuditPage } from './pages/audit/AuditPage'
import { ReportsPage } from './pages/reports/ReportsPage'
import { SecurityCenterPage } from './pages/security/SecurityCenterPage'
import { AdminPage } from './pages/admin/AdminPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { HelpPage } from './pages/help/HelpPage'
import { NotificationsPage } from './pages/notifications/NotificationsPage'

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/security-public" element={<PublicSecurityPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/help-public" element={<PublicHelpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<PasswordGate />}>
                <Route path="/mfa" element={<MfaPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/cases/:caseId" element={<CaseDetailPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/documents/upload" element={<UploadPage />} />
                <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/sharing" element={<SharingPage />} />
                <Route path="/approvals" element={<ApprovalsPage />} />
                <Route path="/evidence" element={<EvidencePage />} />
                <Route path="/audit" element={<AuditPage />} />
                <Route path="/security" element={<SecurityCenterPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
                <Route path="/access-denied" element={<AccessDeniedPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </UIProvider>
  )
}
