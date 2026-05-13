import { Outlet } from "react-router-dom";

import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminDashboardLayout() {
  return (
    <main className="relative min-h-screen bg-[#050505] py-8 pl-28 pr-8 text-white">
      <AdminSidebar />

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[10%] top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-[#161c2d]/70 blur-[120px]" />
        <div className="absolute right-[-12rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-[#fe8200]/10 blur-[130px]" />
        <div className="absolute bottom-[-18rem] left-[35%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/5 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <Outlet />
      </div>
    </main>
  );
}