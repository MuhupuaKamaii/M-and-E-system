import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Test_Login from "./Test/login/Login";
import OMA_Dashboard from "./Test/dashboard/oma-dashboard";
import NPC_Dashboard from "./Test/dashboard/npc-dashboard";
import AdminDashboard from "./Test/dashboard/admin-dashboard"; 
import AddUserReport from "./Test/pages/AddUserReport"; 
import AddUser from "./Test/pages/AddUser";
import RoleRoute from "./Test/components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Test_Login />} />

        <Route 
          path="/admin-dashboard" 
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route 
          path="/oma-dashboard" 
          element={
            <RoleRoute allowedRoles={["OMA"]}>
              <OMA_Dashboard />
            </RoleRoute>
          }
        />

        <Route 
          path="/npc-dashboard" 
          element={
            <RoleRoute allowedRoles={["NPC"]}>
              <NPC_Dashboard />
            </RoleRoute>
          }
        />

        <Route 
          path="/addUser" 
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AddUser />
            </RoleRoute>
          }
        />

        <Route
          path="/addUserReport"
          element={
            <RoleRoute allowedRoles={["ADMIN", "OMA"]}>  
              <AddUserReport />
            </RoleRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
