import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { RegisterSuccessPage } from './pages/auth/RegisterSuccessPage'
import { ForgotPasswordEmailPage } from './pages/auth/ForgotPasswordEmailPage'
import { ForgotPasswordCodePage } from './pages/auth/ForgotPasswordCodePage'
import { ForgotPasswordNewPage } from './pages/auth/ForgotPasswordNewPage'
import { ForgotPasswordSuccessPage } from './pages/auth/ForgotPasswordSuccessPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { CrimeMapPage } from './pages/dashboard/CrimeMapPage'
import { PredictionsPage } from './pages/dashboard/PredictionsPage'
import { AnalysisPage } from './pages/dashboard/AnalysisPage'
import { GnnNetworkPage } from './pages/dashboard/GnnNetworkPage'
import { ModelMetricsPage } from './pages/dashboard/ModelMetricsPage'
import { MonitorPage } from './pages/dashboard/MonitorPage'
import { AdminPage } from './pages/dashboard/AdminPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/success" element={<RegisterSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordEmailPage />} />
        <Route path="/forgot-password/code" element={<ForgotPasswordCodePage />} />
        <Route path="/forgot-password/new" element={<ForgotPasswordNewPage />} />
        <Route path="/forgot-password/success" element={<ForgotPasswordSuccessPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="mapa" element={<CrimeMapPage />} />
          <Route path="predicciones" element={<PredictionsPage />} />
          <Route path="analisis" element={<AnalysisPage />} />
          <Route path="red-gnn" element={<GnnNetworkPage />} />
          <Route path="metricas" element={<ModelMetricsPage />} />
          <Route path="monitor" element={<MonitorPage />} />
          <Route path="administracion" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
