import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Test_Login from "./Test/login/Login";
import OMA_Dashboard from "./Test/dashboard/oma-dashboard";
import AdminDashboard from "./Test/dashboard/admin-dashboard";
import AddUserReport from "./Test/pages/AddUserReport";
import AddUser from "./Test/pages/AddUser";
import TestForm from "./Test/pages/TestForm";
import RoleRoute from "./Test/components/RoleRoute";
import NpcDashboard from "./pages/NpcDashboard";
import NpcDashboardPro from "./pages/NpcDashboardPro";
import AtRiskOmas from "./pages/AtRiskOmas";
import OMADashboard from "./Test/dashboard/OMADashboard";
import Reports from "./components/common/Reports.jsx";  
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<Test_Login />} />
          <Route path="/oma-dashboard" element={<OMA_Dashboard />} />
          <Route path="/omaDashboard" element={<OMADashboard />} />
          <Route path="/npc-dashboard" element={<NpcDashboard />} />
          <Route path="/npc-pro" element={<NpcDashboardPro />} />
          <Route path="/at-risk-omas" element={<AtRiskOmas />} />
          <Route path="/npc_dashboard" element={<Navigate to="/npc-dashboard" replace />} />
          <Route path="*" element={<Navigate to="/npc-dashboard" replace />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/test-form" element={<TestForm />} />
          <Route path="/omaReports" element={<Reports />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/addUserReport"
            element={
              <RoleRoute allowedRoles={["Admin", "OMA"]}>
                <AddUserReport />
              </RoleRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;