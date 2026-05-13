import { useEffect, useMemo, useState } from "react";
import { Bell, Filter, Plus, Search, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import MetricsStrip from "@/components/admin/MetricsStrip";
import CapitalQueue from "@/components/admin/CapitalQueue";
import CapitalAllocationCard from "@/components/admin/CapitalAllocationCard";

import { getClients } from "@/lib/client";

function normalizeClient(client) {
  return {
    ...client,

    // keep Payload internal DB id available
    payloadId: client.payloadId || client.id,

    // app-facing id stays FF-2841, FF-2842, etc.
    id: client.externalId || client.id,

    vendors: client.vendors || [],
    history: client.history || [],
  };
}

export default function Admin() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [clientError, setClientError] = useState("");

  async function loadClients() {
    try {
      setClientError("");
      setIsLoadingClients(true);

      const data = await getClients();
      const normalizedClients = (data.clients || []).map(normalizeClient);

      setClients(normalizedClients);

      setSelectedClientId((currentSelectedId) => {
        const stillExists = normalizedClients.some(
          (client) => client.id === currentSelectedId
        );

        if (currentSelectedId && stillExists) {
          return currentSelectedId;
        }

        return normalizedClients[0]?.id || "";
      });
    } catch (error) {
      setClientError(error.message || "Failed to load clients.");
    } finally {
      setIsLoadingClients(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const selectedClient = useMemo(() => {
    return (
      clients.find((client) => client.id === selectedClientId) ||
      clients[0] ||
      null
    );
  }, [clients, selectedClientId]);

  function handleClientUpdate(updatedClient) {
    const normalizedUpdatedClient = normalizeClient(updatedClient);

    setClients((prev) =>
      prev.map((client) =>
        client.id === normalizedUpdatedClient.id
          ? normalizedUpdatedClient
          : client
      )
    );

    setSelectedClientId(normalizedUpdatedClient.id);
  }

  function handleClientDelete(clientId) {
    setClients((prev) => {
      const nextClients = prev.filter((client) => client.id !== clientId);

      if (selectedClientId === clientId) {
        setSelectedClientId(nextClients[0]?.id || "");
      }

      return nextClients;
    });
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-20rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[#fe8200]/10 blur-[130px]" />
        <div className="absolute right-[-12rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-[#161c2d]/80 blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-5 px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Shield className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                Merbi <span className="text-[#fe8200]">AI</span>
              </p>
              <p className="text-xs text-white/40">Treasury operations</p>
            </div>
          </div>

          <div className="relative ml-8 hidden w-full max-w-md md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input
              placeholder="Search capital, vendors, merchants..."
              className="h-10 rounded-xl border-white/[0.08] bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/35"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-400/10">
              Live
            </Badge>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-xl text-white/60 hover:bg-white/[0.06] hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#161c2d] text-xs font-semibold">
              EB
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
        <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-[#fe8200]">
              Admin Treasury
            </p>

            <h1 className="max-w-3xl text-5xl font-medium tracking-[-0.055em] text-white md:text-6xl">
              Capital movement, controlled.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
              Select a merchant, allocate capital, tag the purpose, and track
              every disbursement from initiation to settlement.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-xl border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>

            <Button className="h-10 rounded-xl bg-[#fe8200] px-5 font-semibold text-black hover:bg-[#ff9a2f]">
              <Plus className="mr-2 h-4 w-4" />
              New disbursement
            </Button>
          </div>
        </section>

        {clientError && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {clientError}
          </div>
        )}

        {isLoadingClients ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-white/50">
            Loading clients from Payload...
          </div>
        ) : (
          <>
            <MetricsStrip clients={clients} />

            <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <CapitalQueue
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
                onClientUpdate={handleClientUpdate}
                onClientDelete={handleClientDelete}
                onRefreshClients={loadClients}
              />

              <div className="grid gap-6 2xl:grid-cols-[1fr_340px]">
                {selectedClient ? (
                  <CapitalAllocationCard
                    key={selectedClient.id}
                    client={selectedClient}
                    onSelectClient={setSelectedClientId}
                    onClientUpdate={handleClientUpdate}
                  />
                ) : (
                  <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-white/50">
                    No clients found. Seed clients or create a new client.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}