import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function UserProjectionCard({ scenario }) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white shadow-2xl shadow-black/40">
      <CardContent className="p-0">
        <div className="border-b border-white/[0.08] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                Brand build score
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                90-day projection
              </h2>
            </div>

            <Badge className="rounded-full bg-cyan-300/10 text-cyan-300 hover:bg-cyan-300/10">
              +{scenario.scoreGain} pts
            </Badge>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <ScoreBlock label="Today" value={scenario.todayScore} />
            <ScoreBlock label="Day 90" value={scenario.day90Score} accent />
          </div>
        </div>

        <div className="p-6">
          <div className="relative h-72 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#161c2d]/45 p-6">
            <div className="absolute inset-x-8 bottom-20 h-px bg-white/[0.07]" />
            <div className="absolute inset-x-8 bottom-32 h-px bg-white/[0.04]" />
            <div className="absolute inset-x-8 bottom-44 h-px bg-white/[0.04]" />

            <div className="absolute bottom-20 left-8 right-8 h-32 rounded-[50%] bg-[#fe8200]/10 blur-2xl" />

            <svg
              viewBox="0 0 600 220"
              className="absolute bottom-14 left-6 right-6 h-44 w-[calc(100%-3rem)]"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 160 C 120 160, 160 150, 230 125 C 320 92, 410 72, 600 54 L 600 220 L 0 220 Z"
                fill="rgba(254,130,0,0.18)"
              />
              <path
                d="M 0 160 C 120 160, 160 150, 230 125 C 320 92, 410 72, 600 54"
                fill="none"
                stroke="rgba(254,130,0,0.85)"
                strokeWidth="4"
              />
              <path
                d="M 0 160 C 110 160, 190 155, 280 140 C 390 120, 470 106, 600 106"
                fill="none"
                stroke="rgba(103,232,249,0.9)"
                strokeWidth="3"
              />
            </svg>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-white/35">
              <span>Today</span>
              <span>Day 30</span>
              <span>Day 60</span>
              <span>Day 90</span>
            </div>

            <div className="absolute bottom-20 left-8 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.9)]" />
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-cyan-300" />
              <p className="text-sm leading-6 text-white/65">
                Modeled on{" "}
                <span className="font-semibold text-white">
                  1,247 similar merchants
                </span>{" "}
                in Commercial Landscaping.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreBlock({ label, value, accent }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>
      <p
        className={`mt-3 text-5xl font-semibold tracking-[-0.06em] ${
          accent ? "text-[#fe8200]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}