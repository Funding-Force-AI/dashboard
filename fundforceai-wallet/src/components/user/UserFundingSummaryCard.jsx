import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { money } from "@/lib/helpers";

export default function UserFundingSummaryCard({
  client,
  totalPlanned,
  completedTotal,
  pendingTotal,
  completedCount,
  vendorCount,
}) {
  return (
    <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
      <CardContent className="p-0">
        <div className="border-b border-white/[0.08] p-6">
          <h2 className="text-xl font-medium tracking-tight">
            Funding summary
          </h2>
          <p className="mt-1 text-sm text-white/40">What has happened so far.</p>
        </div>

        <div className="grid gap-4 p-6">
          <SummaryRow label="Funded" value={money(completedTotal)} tone="green" />
          <SummaryRow label="Pending" value={money(pendingTotal)} tone="orange" />
          <SummaryRow label="Total planned" value={money(totalPlanned)} tone="white" />

          <div className="mt-2">
            <div className="mb-2 flex justify-between text-xs text-white/40">
              <span>Funding progress</span>
              <span>
                {completedCount} / {vendorCount} sent
              </span>
            </div>
            <Progress
              value={(completedCount / Math.max(vendorCount, 1)) * 100}
              className="h-1.5 bg-white/[0.08]"
            />
          </div>
        </div>

        <div className="border-t border-white/[0.08] p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
            Timeline
          </p>

          <div className="space-y-3">
            {(client.history || []).map((item) => (
              <div
                key={item.id || item.eventId}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
              >
                <p className="text-sm text-white/70">{item.action}</p>
                <p className="mt-1 text-xs text-white/35">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value, tone }) {
  const toneClass =
    tone === "green"
      ? "text-emerald-300"
      : tone === "orange"
        ? "text-[#fe8200]"
        : "text-white";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-4">
      <p className="text-sm text-white/45">{label}</p>
      <p className={`font-mono text-sm font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}