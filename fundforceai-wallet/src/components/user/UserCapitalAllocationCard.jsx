import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { money, normalizeStatus } from "@/lib/helpers";

export default function UserCapitalAllocationCard({ vendors }) {
  return (
    <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
      <CardContent className="p-0">
        <div className="border-b border-white/[0.08] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium tracking-tight">
                Capital allocation
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Vendor lines attached to this projection.
              </p>
            </div>

            <Badge className="rounded-full bg-[#fe8200]/10 text-[#fe8200] hover:bg-[#fe8200]/10">
              {vendors.length} vendors
            </Badge>
          </div>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {vendors.map((vendor) => (
            <div
              key={vendor.id || vendor.vendorId}
              className="grid gap-4 p-6 md:grid-cols-[1fr_130px_110px_110px] md:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#161c2d]">
                  <Building2 className="h-4 w-4 text-white/60" />
                </div>

                <div>
                  <p className="text-sm font-semibold">{vendor.name}</p>
                  <p className="mt-1 text-xs text-white/40">{vendor.purpose}</p>
                </div>
              </div>

              <p className="font-mono text-sm font-semibold">
                {money(vendor.amount)}
              </p>

              <p className="text-xs text-white/45">{vendor.method}</p>

              <Badge
                className={`w-fit rounded-full ${
                  normalizeStatus(vendor.status) === "completed"
                    ? "bg-emerald-400/10 text-emerald-300"
                    : normalizeStatus(vendor.status) === "processing"
                      ? "bg-[#fe8200]/10 text-[#fe8200]"
                      : "bg-white/[0.05] text-white/50"
                } hover:bg-white/[0.05]`}
              >
                {vendor.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}