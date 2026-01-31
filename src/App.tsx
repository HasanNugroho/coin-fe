import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { KantongList } from './pages/kantong/KantongList';
import { TransactionList } from './pages/transactions/TransactionList';
import { Reports } from './pages/reports/Reports';
import { Profile } from './pages/profile/Profile';
import PlatformManagement from './pages/platform/PlatformManagement';
import AllocationManagement from './pages/allocation/AllocationManagement';
import LiabilityManagement from './pages/liability/LiabilityManagement';
import SavingTargetManagement from './pages/saving-target/SavingTargetManagement';
import AutoAllocationPage from './pages/settings/AutoAllocationPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { PocketTemplateManagement } from './pages/admin/PocketTemplateManagement';
import { PlatformManagement as AdminPlatformManagement } from './pages/admin/PlatformManagement';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';
import { useAuthStore } from './store/auth.store';

function App() {
  const { isAuthenticated, restoreSession } = useAuthStore();

  useEffect(() => {
    const initializeSession = async () => {
      await restoreSession();
    };
    initializeSession();
  }, [restoreSession]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="kantong" element={<KantongList />} />
            <Route path="transactions" element={<TransactionList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="platforms" element={<PlatformManagement />} />
            <Route path="allocations" element={<AllocationManagement />} />
            <Route path="liabilities" element={<LiabilityManagement />} />
            <Route path="saving-targets" element={<SavingTargetManagement />} />
            <Route path="settings/auto-allocation" element={<AutoAllocationPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="pocket-templates" element={<PocketTemplateManagement />} />
            <Route path="platforms" element={<AdminPlatformManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
