import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import HomePage from "./pages/HomePage";


import Test_Login from "./Test/login/Login"
=======
import HomePage from "./Test/pages/HomePage";
import Test_Login from "./Test/login/Login";
>>>>>>> 267e924 (NPC Components and Dashboard)
import OMA_Dashboard from "./Test/dashboard/oma-dashboard";
import AdminDashboard from "./Test/dashboard/admin-dashboard";
import AddUserReport from "./Test/pages/AddUserReport";
import AddUser from "./Test/pages/AddUser";
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
  )
}

export default App
