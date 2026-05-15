import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Edit3,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getClients, getUsers } from "@/lib/api";
import { money, normalizeStatus, getClientTotal, getRelatedClientName } from "@/lib/helpers";

function getClientContact(client) {
  return client?.pointOfContact || "—";
}

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState("users");
  const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadManagementData() {
    try {
      setError("");
      setIsLoading(true);

      const [usersData, clientsData] = await Promise.all([
        getUsers(),
        getClients(),
      ]);

      setUsers(usersData.docs || usersData.users || []);
      setClients(clientsData.clients || []);
    } catch (error) {
      setError(error.message || "Failed to load management data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadManagementData();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return users;

    return users.filter((user) => {
      return [
        user.email,
        user.fullName,
        user.role,
        getRelatedClientName(user),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value);
    });
  }, [users, query]);

  const filteredClients = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return clients;

    return clients.filter((client) => {
      return [
        client.externalId,
        client.name,
        client.category,
        client.status,
        client.email,
        client.pointOfContact,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value);
    });
  }, [clients, query]);

  const totalClientCapital = useMemo(() => {
    return clients.reduce((sum, client) => sum + getClientTotal(client), 0);
  }, [clients]);

  return (
    <main className="relative min-h-screen bg-[#050505] px-8 py-8 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[10%] top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-[#161c2d]/70 blur-[120px]" />
        <div className="absolute right-[-12rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-[#fe8200]/10 blur-[130px]" />
        <div className="absolute bottom-[-18rem] left-[35%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/5 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <section className="mb-6 rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-7 shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
                Admin control center
              </p>

              <h1 className="text-5xl font-medium tracking-[-0.065em]">
                Users & Clients
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                Manage account access, client records, linked users, funding
                mirrors, and operational controls from one protected workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="h-11 rounded-2xl bg-white px-5 font-semibold text-black hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Create user
              </Button>

              <Button className="h-11 rounded-2xl bg-[#fe8200] px-5 font-semibold text-black hover:bg-[#ff9b2f]">
                <Plus className="mr-2 h-4 w-4" />
                Create client
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ManagementStat
              icon={Users}
              label="Total users"
              value={users.length}
              sub="active access records"
              tone="white"
            />
            <ManagementStat
              icon={Building2}
              label="Clients"
              value={clients.length}
              sub="business accounts"
              tone="orange"
            />
            <ManagementStat
              icon={Shield}
              label="Tracked capital"
              value={money(totalClientCapital)}
              sub="from vendor allocations"
              tone="green"
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] shadow-2xl shadow-black/40">
          <div className="border-b border-white/[0.08] p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex w-fit overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 p-1">
                <TabButton
                  active={activeTab === "users"}
                  onClick={() => setActiveTab("users")}
                >
                  Users
                </TabButton>

                <TabButton
                  active={activeTab === "clients"}
                  onClick={() => setActiveTab("clients")}
                >
                  Clients
                </TabButton>
              </div>

              <div className="flex w-full flex-col gap-3 md:flex-row xl:w-auto">
                <div className="relative w-full md:w-[360px]">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={
                      activeTab === "users"
                        ? "Search users, roles, clients..."
                        : "Search clients, contacts, status..."
                    }
                    className="h-11 rounded-2xl border-white/[0.08] bg-black/25 pl-11 text-white placeholder:text-white/25"
                  />
                </div>

                <Button
                  variant="ghost"
                  onClick={loadManagementData}
                  className="h-11 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 text-sm text-white/45">
              Loading management records...
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            </div>
          ) : activeTab === "users" ? (
            <UsersTable users={filteredUsers} />
          ) : (
            <ClientsTable clients={filteredClients} />
          )}
        </section>
      </div>
    </main>
  );
}

function ManagementStat({ icon: Icon, label, value, sub, tone }) {
  const toneClass =
    tone === "orange"
      ? "text-[#fe8200]"
      : tone === "green"
        ? "text-emerald-300"
        : "text-white";

  return (
    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] text-white">
      <CardContent className="p-5">
        <Icon className="mb-5 h-4 w-4 text-white/35" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
          {label}
        </p>

        <p className={`mt-2 text-3xl font-semibold tracking-[-0.05em] ${toneClass}`}>
          {value}
        </p>

        <p className="mt-1 text-xs text-white/35">{sub}</p>
      </CardContent>
    </Card>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-xl px-5 text-sm font-semibold transition ${
        active
          ? "bg-[#fe8200] text-black shadow-[0_0_28px_rgba(254,130,0,0.22)]"
          : "text-white/45 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function UsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px]">
        <thead>
          <tr className="border-b border-white/[0.08] text-left">
            <Th>User</Th>
            <Th>Role</Th>
            <Th>Related client</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-white/[0.06] transition hover:bg-white/[0.025]"
            >
              <Td>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#161c2d]">
                    <User className="h-4 w-4 text-white/50" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user.fullName || "No full name"}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </div>
              </Td>

              <Td>
                <RoleBadge role={user.role} />
              </Td>

              <Td>
                <p className="max-w-[260px] truncate text-sm text-white/65">
                  {getRelatedClientName(user)}
                </p>
              </Td>

              <Td>
                <Badge className="rounded-full bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                  Active
                </Badge>
              </Td>

              <Td>
                <p className="text-sm text-white/45">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </Td>

              <Td align="right">
                <ActionButtons />
              </Td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-sm text-white/40">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ClientsTable({ clients }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="border-b border-white/[0.08] text-left">
            <Th>Client</Th>
            <Th>Contact</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Category</Th>
            <Th>Total planned</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-white/[0.06] transition hover:bg-white/[0.025]"
            >
              <Td>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#161c2d]">
                    <Building2 className="h-4 w-4 text-white/50" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {client.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#fe8200]">
                      {client.externalId || client.id}
                    </p>
                  </div>
                </div>
              </Td>

              <Td>
                <p className="text-sm text-white/65">
                  {getClientContact(client)}
                </p>
              </Td>

              <Td>
                <p className="max-w-[260px] truncate text-sm text-white/45">
                  {client.email || "—"}
                </p>
              </Td>

              <Td>
                <ClientStatusBadge status={client.status} />
              </Td>

              <Td>
                <p className="text-sm text-white/45">{client.category || "—"}</p>
              </Td>

              <Td>
                <p className="font-mono text-sm font-semibold text-white">
                  {money(getClientTotal(client))}
                </p>
              </Td>

              <Td align="right">
                <ActionButtons />
              </Td>
            </tr>
          ))}

          {clients.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-sm text-white/40">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      className={`px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return (
    <td
      className={`px-6 py-4 align-middle ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  );
}

function RoleBadge({ role }) {
  const normalized = normalizeStatus(role);

  const className =
    normalized === "super_admin"
      ? "bg-[#fe8200]/10 text-[#fe8200]"
      : normalized === "admin"
        ? "bg-cyan-300/10 text-cyan-300"
        : "bg-emerald-400/10 text-emerald-300";

  const label =
    normalized === "super_admin"
      ? "Super Admin"
      : normalized === "admin"
        ? "Admin"
        : "Client";

  return (
    <Badge className={`rounded-full px-3 py-1 text-xs ${className}`}>
      {label}
    </Badge>
  );
}

function ClientStatusBadge({ status }) {
  const normalized = normalizeStatus(status);

  const className =
    normalized === "completed"
      ? "bg-emerald-400/10 text-emerald-300"
      : normalized === "ready"
        ? "bg-[#fe8200]/10 text-[#fe8200]"
        : normalized === "review"
          ? "bg-cyan-300/10 text-cyan-300"
          : "bg-white/[0.06] text-white/50";

  return (
    <Badge className={`rounded-full px-3 py-1 text-xs ${className}`}>
      {status || "Unknown"}
    </Badge>
  );
}

function ActionButtons() {
  return (
    <div className="flex justify-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white"
      >
        <Edit3 className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-xl text-red-300/60 hover:bg-red-500/10 hover:text-red-200"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-xl text-white/35 hover:bg-white/[0.06] hover:text-white"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}