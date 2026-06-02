import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Detect from "./pages/Detect";
import History from "./pages/History";

import AdminDashboard from "./pages/AdminDashboard";
import AdminHistory from "./pages/AdminHistory";
import UserManagement from "./pages/UserManagement";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Landing from "./pages/Landing";

function App() {

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Landing/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>

<Route
path="/dashboard"
element={
<Layout>
<ProtectedRoute>
<Dashboard/>
</ProtectedRoute>
</Layout>
}
/>

<Route
path="/detect"
element={
<Layout>
<ProtectedRoute>
<Detect/>
</ProtectedRoute>
</Layout>
}
/>

<Route
path="/history"
element={
<Layout>
<ProtectedRoute>
<History/>
</ProtectedRoute>
</Layout>
}
/>

<Route
path="/admin/dashboard"
element={
<AdminRoute>
<AdminDashboard/>
</AdminRoute>
}
/>

<Route
path="/admin/history"
element={
<AdminRoute>
<AdminHistory/>
</AdminRoute>
}
/>

<Route
path="/admin/users"
element={
<AdminRoute>
<UserManagement/>
</AdminRoute>
}
/>

</Routes>

</BrowserRouter>

);

}

export default App;