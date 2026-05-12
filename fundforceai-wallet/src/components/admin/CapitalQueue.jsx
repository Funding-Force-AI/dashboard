import { useState } from "react";
import { ChevronRight, RefreshCw } from "lucide-react";

import UserProfileModal from "@/components/admin/UserProfileModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function CapitalQueue({
  clients,
  selectedClientId,
  onSelectClient,
  onClientUpdate,
  onClientDelete,
  onRefreshClients,
}) {
  const [profileClient, setProfileClient] = useState(null);

  function handleOpenProfile(client) {
    setProfileClient(client);
  }

  function handleProfileUpdate(updatedClient) {
    onClientUpdate?.(updatedClient);
    onSelectClient(updatedClient.id);
    setProfileClient(updatedClient);
  }

  function handleProfileDelete(clientId) {
    onClientDelete?.(clientId);
    setProfileClient(null);
  }

  return (
    <>
      <Card className="rounded-3xl border-white/[0.08] bg-[#0b0d12] text-white">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
            <div>
              <h2 className="text-lg font-medium tracking-tight">
                Capital queue
              </h2>
              <p className="mt-1 text-xs text-white/40">
                Single click to select · double click to manage
              </p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={onRefreshClients}
              className="rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="no-scrollbar max-h-[720px] overflow-y-auto p-3 pr-2">
            {clients.map((client) => {
              const isActive = client.id === selectedClientId;
              const totalAmount = (client.vendors || []).reduce(
                (sum, vendor) => sum + Number(vendor.amount || 0),
                0
              );

              return (
                <button
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  onDoubleClick={() => handleOpenProfile(client)}
                  className={`group mb-2 w-full rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-[#fe8200]/50 bg-[#fe8200]/10"
                      : "border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-[#fe8200] text-black"
                          : "bg-white/[0.06] text-white"
                      }`}
                    >
                      {initials(client.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-white">
                          {client.name}
                        </p>

                        <ChevronRight
                          className={`h-4 w-4 transition ${
                            isActive
                              ? "text-[#fe8200]"
                              : "text-white/25 group-hover:translate-x-0.5 group-hover:text-white/60"
                          }`}
                        />
                      </div>

                      <p className="mt-1 text-xs text-white/40">
                        {client.id} · {client.category}
                      </p>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-lg font-medium tracking-tight">
                            {money(totalAmount)}
                          </p>
                          <p className="mt-1 text-xs text-white/35">
                            {client.signedAt?.replace("Signed ", "")}
                          </p>
                        </div>

                        <Badge
                          className={`rounded-full px-2.5 py-1 text-[10px] ${
                            isActive
                              ? "bg-[#fe8200]/15 text-[#fe8200]"
                              : client.status === "Ready"
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-white/[0.06] text-white/45"
                          } hover:bg-white/[0.06]`}
                        >
                          {isActive ? "Selected" : client.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <UserProfileModal
        open={Boolean(profileClient)}
        client={profileClient}
        onOpenChange={(open) => {
          if (!open) setProfileClient(null);
        }}
        onClientUpdate={handleProfileUpdate}
        onClientDelete={handleProfileDelete}
      />
    </>
  );
}