import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import User from "./pages/User";
import SignIn from "./pages/SignIn";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/user" element={<User />} />
      <Route path="/signin" element={<SignIn />}/>
      <Route path="private" element={<AdminLogin/>}/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}