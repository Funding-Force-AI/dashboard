import { ArrowRight, Bolt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { money } from "@/lib/userDashboard";

export default function UserDeployScenarioCard({ scenario }) {
  return (
    <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white shadow-2xl shadow-black/40">
      <CardContent className="p-0">
        <div className="border-b border-white/[0.08] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                Deploy this much
              </p>
              <h2 className="mt-3 text-5xl font-semibold tracking-[-0.055em] text-[#fe8200]">
                {money(scenario.deployAmount)}
              </h2>
            </div>

            <Button className="h-12 rounded-2xl bg-[#fe8200] px-6 font-semibold text-black shadow-[0_0_32px_rgba(254,130,0,0.25)] hover:bg-[#ff9b2f]">
              <Bolt className="mr-2 h-4 w-4" />
              Lock in this scenario
              <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8">
            <div className="relative h-2 rounded-full bg-white/[0.08]">
              <div className="absolute left-0 top-0 h-2 w-[16%] rounded-full bg-[#fe8200]" />
              <div className="absolute left-[15%] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-[#050505] bg-[#fe8200] shadow-[0_0_30px_rgba(254,130,0,0.6)]" />
            </div>

            <div className="mt-4 flex justify-between text-xs font-medium text-white/35">
              <span>$5K</span>
              <span>$15K</span>
              <span>$30K</span>
              <span>$50K</span>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/[0.06] md:grid-cols-4">
          <OutcomeCard
            label="Revenue lift"
            value={money(scenario.revenueLift, true)}
            sub={`range ${scenario.revenueRange}`}
            tone="cyan"
          />
          <OutcomeCard
            label="Net equity gain"
            value={`+${money(scenario.netEquityGain, true)}`}
            sub="rev lift − capital cost"
            tone="green"
          />
          <OutcomeCard
            label="Cost of capital"
            value={money(scenario.costOfCapital)}
            sub="0.18 factor premium"
            tone="white"
          />
          <OutcomeCard
            label="Daily ACH"
            value={money(scenario.dailyAch)}
            sub={`for ${scenario.dailyAchTerm}`}
            tone="orange"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function OutcomeCard({ label, value, sub, tone }) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan-300"
      : tone === "green"
        ? "text-emerald-300"
        : tone === "orange"
          ? "text-[#fe8200]"
          : "text-white";

  return (
    <div className="bg-[#0b0d12] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold tracking-[-0.05em] ${toneClass}`}>
        {value}
      </p>
      <p className="mt-2 text-xs text-white/35">{sub}</p>
    </div>
  );
}