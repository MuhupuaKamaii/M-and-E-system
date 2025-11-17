import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Test_Login from "./Test/login/Login";
import OMA_Dashboard from "./Test/dashboard/oma-dashboard";
<<<<<<< HEAD
=======
import NPC_Dashboard from "./Test/dashboard/npc-dashboard";
>>>>>>> 09097befc6c6b0373fe111c092978c847dc03b5d
import AdminDashboard from "./Test/dashboard/admin-dashboard";
import AddUserReport from "./Test/pages/AddUserReport";
import AddUser from "./Test/pages/AddUser";
import TestForm from "./Test/pages/TestForm";
import RoleRoute from "./Test/components/RoleRoute";
import NpcDashboard from "./pages/NpcDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Test_Login />} />
        <Route path="/oma-dashboard" element={<OMA_Dashboard />} />
        <Route path="/npc-dashboard" element={<NpcDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/test-form" element={<TestForm />} />
        <Route
          path="/addUserReport"
          element={
            <RoleRoute allowedRoles={["Admin", "OMA"]}>
              {/* frontend this ensures only Admin and OMA can access that page. */}
              <AddUserReport />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
