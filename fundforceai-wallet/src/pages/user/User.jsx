import { useEffect, useMemo, useState } from "react";

import UserPageShell from "@/components/user/UserPageShell";
import UserTopNav from "@/components/user/UserTopNav";
import UserHeroSection from "@/components/user/UserHeroSection";
import UserProjectionCard from "@/components/user/UserProjectionCard";
import UserDeployScenarioCard from "@/components/user/UserDeployScenarioCard";
import UserForceAiNote from "@/components/user/UserForceAiNote";
import UserCapitalAllocationCard from "@/components/user/UserCapitalAllocationCard";
import UserFundingSummaryCard from "@/components/user/UserFundingSummaryCard";
import UserAccountModal from "@/components/user/UserAccountModal";

import { getClients } from "@/lib/api";
import {
  buildScenario,
  getClientFundingStats,
  normalizeClient,
} from "@/lib/helpers";

export default function User() {
  const [client, setClient] = useState(null);
  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const [clientError, setClientError] = useState("");
  const [showAccountModal, setShowAccountModal] = useState(false);

  async function loadClient() {
    try {
      setClientError("");

      const data = await getClients();
      const normalizedClients = (data.clients || []).map(normalizeClient);

      // Auth-based behavior:
      // - client role: backend should only return that user's relatedClient
      // - super_admin role: backend may return all clients, so we use first one for preview/testing
      const signedInClient = normalizedClients[0] || null;

      setClient(signedInClient);
    } catch (error) {
      setClientError(error.message || "Failed to load client data.");
    } finally {
      setIsLoadingClient(false);
    }
  }

  useEffect(() => {
    loadClient();

    const intervalId = window.setInterval(() => {
      loadClient();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const scenario = useMemo(() => {
    return buildScenario(client);
  }, [client]);

  const {
    vendors,
    totalPlanned,
    completedTotal,
    pendingTotal,
    completedCount,
  } = useMemo(() => {
    return getClientFundingStats(client);
  }, [client]);

  if (isLoadingClient) {
    return (
      <UserPageShell>
        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 text-white/50">
            Loading live funding model...
          </div>
        </main>
      </UserPageShell>
    );
  }

  if (clientError || !client) {
    return (
      <UserPageShell>
        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-red-500/30 bg-red-500/10 p-8 text-red-200">
            {clientError || "No client record found for this account."}
          </div>
        </main>
      </UserPageShell>
    );
  }

  return (
    <UserPageShell>
      <UserTopNav
        client={client}
        onOpenAccount={() => setShowAccountModal(true)}
      />

      <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
        <section className="mb-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <UserHeroSection client={client} totalPlanned={totalPlanned} />
          <UserProjectionCard scenario={scenario} />
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1fr_420px]">
          <UserDeployScenarioCard scenario={scenario} />
          <UserForceAiNote scenario={scenario} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <UserCapitalAllocationCard vendors={vendors} />

          <UserFundingSummaryCard
            client={client}
            totalPlanned={totalPlanned}
            completedTotal={completedTotal}
            pendingTotal={pendingTotal}
            completedCount={completedCount}
            vendorCount={vendors.length}
          />
        </section>
      </main>

      <UserAccountModal
        open={showAccountModal}
        client={client}
        onOpenChange={setShowAccountModal}
      />
    </UserPageShell>
  );
}