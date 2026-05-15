import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  UsersRound,
  Zap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { logoutUser } from "@/lib/api";

const adminLinks = [
  {
    label: "Overview",
    to: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users & Clients",
    to: "/admin/manage",
    icon: UsersRound,
  },
  {
    label: "Payments",
    to: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      navigate("/");
    }
  }

  return (
    <aside className="group fixed left-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-20 flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0b0d12]/95 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 hover:w-72">
      <div className="flex items-center gap-3 border-b border-white/[0.08] p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fe8200] text-black">
          <Zap className="h-5 w-5" />
        </div>

        <div className="min-w-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="whitespace-nowrap text-sm font-black uppercase tracking-[0.22em] text-white">
            Merbi
          </p>
          <p className="whitespace-nowrap text-xs text-white/40">
            Admin console
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-3">
        <p className="mb-2 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/25 group-hover:block">
          Admin
        </p>

        {adminLinks.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}

        <div className="my-4 h-px bg-white/[0.08]" />

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-[#fe8200]" />
            <div>
              <p className="text-xs font-semibold text-white">MVP mode</p>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Auth, clients, users, payments, and settings shell active.
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="border-t border-white/[0.08] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-white/50 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
            <LogOut className="h-4 w-4" />
          </div>

          <span className="whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/admin"}
      className={({ isActive }) =>
        `flex h-12 items-center gap-3 rounded-2xl px-3 transition ${
          isActive
            ? "bg-[#fe8200] text-black shadow-[0_0_28px_rgba(254,130,0,0.24)]"
            : "text-white/45 hover:bg-white/[0.06] hover:text-white"
        }`
      }
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/10">
        <Icon className="h-4 w-4" />
      </div>

      <span className="whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {item.label}
      </span>
    </NavLink>
  );
}