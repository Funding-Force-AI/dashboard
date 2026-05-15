import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { money } from "@/lib/helpers";

export default function UserForceAiNote({ scenario }) {
  return (
    <Card className="rounded-[2rem] border-cyan-300/20 bg-cyan-300/[0.04] text-white shadow-[0_0_50px_rgba(103,232,249,0.06)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/10">
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Force AI · Scenario read
            </p>
            <h2 className="mt-2 text-xl font-medium">
              Conservative — but you can move faster.
            </h2>
          </div>
        </div>

        <p className="text-sm italic leading-7 text-white/70">
          At {money(scenario.deployAmount)} you’ll see steady growth. Cash flow
          can absorb the strain without overleveraging. Worth modeling a{" "}
          <span className="text-white">$15K</span> to{" "}
          <span className="text-white">$20K</span> path if the priority is
          faster acquisition.
        </p>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
          <div className="mb-2 flex justify-between text-xs text-white/40">
            <span>Risk pressure</span>
            <span>Low/moderate</span>
          </div>
          <Progress value={38} className="h-1.5 bg-white/[0.08]" />
        </div>
      </CardContent>
    </Card>
  );
}