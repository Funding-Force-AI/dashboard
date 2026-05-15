import { Bell, Search, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { initials } from "@/lib/helpers";

export default function UserTopNav({ client, onOpenAccount }) {
  return (
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
            <p className="text-xs text-white/40">Client capital portal</p>
          </div>
        </div>

        <div className="relative ml-8 hidden w-full max-w-md md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <Input
            placeholder="Search funding, vendors, account activity..."
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

          <button
            onClick={onOpenAccount}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#161c2d] text-xs font-semibold text-white transition hover:bg-[#20283d]"
          >
            {initials(client.pointOfContact || client.name)}
          </button>
        </div>
      </div>
    </header>
  );
}