import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PageLoader } from './components/ui/PageLoader'

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const RegisterSuccessPage = lazy(() =>
  import('./pages/auth/RegisterSuccessPage').then((m) => ({ default: m.RegisterSuccessPage })),
)
const ForgotPasswordEmailPage = lazy(() =>
  import('./pages/auth/ForgotPasswordEmailPage').then((m) => ({ default: m.ForgotPasswordEmailPage })),
)
const ForgotPasswordCodePage = lazy(() =>
  import('./pages/auth/ForgotPasswordCodePage').then((m) => ({ default: m.ForgotPasswordCodePage })),
)
const ForgotPasswordNewPage = lazy(() =>
  import('./pages/auth/ForgotPasswordNewPage').then((m) => ({ default: m.ForgotPasswordNewPage })),
)
const ForgotPasswordSuccessPage = lazy(() =>
  import('./pages/auth/ForgotPasswordSuccessPage').then((m) => ({
    default: m.ForgotPasswordSuccessPage,
  })),
)

const DashboardLayout = lazy(() =>
  import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })),
)
const DashboardPage = lazy(() =>
  import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const CrimeMapPage = lazy(() =>
  import('./pages/dashboard/CrimeMapPage').then((m) => ({ default: m.CrimeMapPage })),
)
const PredictionsPage = lazy(() =>
  import('./pages/dashboard/PredictionsPage').then((m) => ({ default: m.PredictionsPage })),
)
const AnalysisPage = lazy(() =>
  import('./pages/dashboard/AnalysisPage').then((m) => ({ default: m.AnalysisPage })),
)
const GnnNetworkPage = lazy(() =>
  import('./pages/dashboard/GnnNetworkPage').then((m) => ({ default: m.GnnNetworkPage })),
)
const ModelMetricsPage = lazy(() =>
  import('./pages/dashboard/ModelMetricsPage').then((m) => ({ default: m.ModelMetricsPage })),
)
const MonitorPage = lazy(() =>
  import('./pages/dashboard/MonitorPage').then((m) => ({ default: m.MonitorPage })),
)
const AdminPage = lazy(() =>
  import('./pages/dashboard/AdminPage').then((m) => ({ default: m.AdminPage })),
)
const ReportCrimePage = lazy(() =>
  import('./pages/dashboard/ReportCrimePage').then((m) => ({ default: m.ReportCrimePage })),
)
const InboxPage = lazy(() =>
  import('./pages/dashboard/InboxPage').then((m) => ({ default: m.InboxPage })),
)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Ruta ciudadana pública */}
            <Route path="/reportar-denuncia" element={<ReportCrimePage />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register/success" element={<RegisterSuccessPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordEmailPage />} />
              <Route path="/forgot-password/code" element={<ForgotPasswordCodePage />} />
              <Route path="/forgot-password/new" element={<ForgotPasswordNewPage />} />
              <Route path="/forgot-password/success" element={<ForgotPasswordSuccessPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="mapa" element={<CrimeMapPage />} />
                <Route path="predicciones" element={<PredictionsPage />} />
                <Route path="analisis" element={<AnalysisPage />} />
                <Route path="red-gnn" element={<GnnNetworkPage />} />
                <Route path="metricas" element={<ModelMetricsPage />} />
                <Route path="monitor" element={<MonitorPage />} />
                <Route path="administracion" element={<AdminPage />} />
                <Route path="denuncias" element={<InboxPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
