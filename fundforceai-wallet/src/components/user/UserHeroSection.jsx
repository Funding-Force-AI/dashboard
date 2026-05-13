import { Building2, CheckCircle2, DollarSign } from "lucide-react";

import { money } from "@/lib/userDashboard";

export default function UserHeroSection({ client, totalPlanned }) {
  return (
    <div className="flex min-h-[520px] flex-col justify-between rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 shadow-2xl shadow-black/50">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
          Client growth model
        </p>

        <h1 className="max-w-3xl text-5xl font-medium tracking-[-0.06em] md:text-7xl">
          See your brand,{" "}
          <span className="text-[#fe8200]">ninety days</span> from now.
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-6 text-white/50">
          Funding Force models the impact of deployed capital across vendors,
          campaigns, cost of capital, and projected outcomes for{" "}
          <span className="text-white">{client.name}</span>.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <MiniStat
          label="Merchant"
          value={client.name}
          sub={client.category}
          icon={Building2}
        />
        <MiniStat
          label="Current plan"
          value={money(totalPlanned)}
          sub="vendor-directed capital"
          icon={DollarSign}
        />
        <MiniStat
          label="Status"
          value={client.status}
          sub={client.signedAt}
          icon={CheckCircle2}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <Icon className="mb-5 h-4 w-4 text-white/40" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className="mt-2 truncate text-lg font-semibold tracking-[-0.03em]">
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-white/35">{sub}</p>
    </div>
  );
}