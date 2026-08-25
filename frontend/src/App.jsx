import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { AdminRoute, ProtectedRoute } from './components/RouteGuards'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import EmployeeDashboard from './pages/EmployeeDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProblemStatementPage from './pages/ProblemStatementPage'
import ProposedSolutionPage from './pages/ProposedSolutionPage'
import AboutDeveloperPage from './pages/AboutDeveloperPage'
import NotFoundPage from './pages/NotFoundPage'

// The route table. Login sits on its own so it can be full height, while
// everything else shares the navbar and footer through Layout. Guards wrap
// the two dashboards to enforce the role rules.
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/problem-statement" element={<ProblemStatementPage />} />
        <Route path="/proposed-solution" element={<ProposedSolutionPage />} />
        <Route path="/about-developer" element={<AboutDeveloperPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
