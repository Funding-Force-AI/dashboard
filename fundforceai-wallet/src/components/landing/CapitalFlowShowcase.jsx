import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Landmark,
  LineChart,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const slides = [
  {
    eyebrow: "01 · Capital visibility",
    title: "Earn",
    body: "Give every merchant a clean account view: available capital, funding history, vendor allocations, and what is ready to move next.",
    visual: "account",
    accent: "Account balance",
  },
  {
    eyebrow: "02 · Vendor-directed funding",
    title: "Send",
    body: "Track capital releases by vendor, amount, method, purpose, and status — without turning the product into a payment processor.",
    visual: "send",
    accent: "Vendor payout",
  },
  {
    eyebrow: "03 · Capital commitments",
    title: "Raise",
    body: "Show what has been committed, what is pending, and what capital is expected to do over the next 30, 60, and 90 days.",
    visual: "raise",
    accent: "Growth scenario",
  },
  {
    eyebrow: "04 · Client mirror",
    title: "Mirror",
    body: "Clients see the same story the admin sees: funded amount, pending capital, vendor lines, tags, history, and projected outcomes.",
    visual: "mirror",
    accent: "Client portal",
  },
];

export default function CapitalFlowShowcase() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;

      const rawProgress = Math.min(
        Math.max(-rect.top / Math.max(scrollableDistance, 1), 0),
        0.999
      );

      const nextIndex = Math.floor(rawProgress * slides.length);
      setActiveIndex(Math.min(nextIndex, slides.length - 1));
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-black text-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-y border-white/[0.08] bg-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[14%] top-[12%] h-[34rem] w-[34rem] rounded-full bg-[#161c2d]/55 blur-[120px]" />
          <div className="absolute right-[14%] top-[22%] h-[30rem] w-[30rem] rounded-full bg-[#fe8200]/10 blur-[140px]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#161c2d]/45 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid h-full w-full max-w-[1500px] grid-cols-1 items-center gap-12 px-8 py-16 lg:grid-cols-[0.95fr_1fr]">
          <div className="relative hidden h-[72vh] min-h-[560px] rounded-[2rem] border border-white/[0.08] bg-[#e9e4dd] shadow-2xl shadow-black/60 lg:flex lg:items-center lg:justify-center">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(254,130,0,0.08),transparent_35%)]" />

            <div
              key={activeSlide.visual}
              className="relative z-10 w-full animate-[fadeInUp_450ms_ease-out_both]"
            >
              {activeSlide.visual === "account" && <AccountVisual />}
              {activeSlide.visual === "send" && <SendVisual />}
              {activeSlide.visual === "raise" && <RaiseVisual />}
              {activeSlide.visual === "mirror" && <MirrorVisual />}
            </div>
          </div>

          <div className="relative flex min-h-[72vh] items-center">
            <div
              key={activeSlide.title}
              className="w-full animate-[fadeInUp_450ms_ease-out_both]"
            >
              <ShowcaseCopy slide={activeSlide} />
            </div>

            <div className="absolute bottom-8 left-0 hidden w-full max-w-[720px] items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.06] px-4 py-3 backdrop-blur-xl xl:flex">
              <div className="flex items-center gap-3">
                {slides.map((slide, index) => (
                  <div key={slide.title} className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                        index === activeIndex
                          ? "border-[#fe8200]/40 bg-[#fe8200] text-black"
                          : "border-white/[0.08] bg-black/40 text-white/70"
                      }`}
                    >
                      {index === 0 && <Wallet className="h-4 w-4" />}
                      {index === 1 && <Send className="h-4 w-4" />}
                      {index === 2 && <Landmark className="h-4 w-4" />}
                      {index === 3 && <LineChart className="h-4 w-4" />}
                    </div>

                    {index !== slides.length - 1 && (
                      <span className="h-5 w-px bg-white/[0.12]" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-white/55">
                <span>Dashboard</span>
                <span>Clients</span>
                <span>Funding</span>
                <Button className="h-9 rounded-xl bg-[#fe8200] px-5 font-semibold text-black hover:bg-[#ff9b2f]">
                  Start
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCopy({ slide }) {
  return (
    <div className="flex flex-col justify-center">
      <Badge className="mb-6 w-fit rounded-full border border-[#fe8200]/20 bg-[#fe8200]/10 px-4 py-2 text-[#fe8200] hover:bg-[#fe8200]/10">
        {slide.eyebrow}
      </Badge>

      <h2 className="text-7xl font-medium tracking-[-0.07em] text-white md:text-8xl">
        {slide.title}
      </h2>

      <p className="mt-6 max-w-md text-lg leading-7 text-white/55">
        {slide.body}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Button className="h-12 rounded-full bg-[#fe8200] px-7 font-semibold text-black hover:bg-[#ff9b2f]">
          Explore flow
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="text-sm text-white/35">{slide.accent}</p>
      </div>
    </div>
  );
}

function AccountVisual() {
  return (
    <div className="mx-auto w-[54%] min-w-[360px] space-y-6">
      <div className="rounded-[2rem] border border-black/10 bg-[#ece8e1] p-7 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/35">
          Available now
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl text-black/35">$</span>
          <h3 className="text-5xl font-semibold tracking-[-0.06em] text-black">
            805,428.51
          </h3>
        </div>

        <button className="mt-8 h-12 w-full rounded-xl border border-black/10 bg-transparent text-sm font-semibold text-black">
          Account Details
        </button>

        <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white shadow-xl">
          <Send className="h-4 w-4" />
          Send a payment
        </button>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#ece8e1] p-7 shadow-xl">
        <h4 className="text-xl font-semibold text-black">Transactions</h4>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/30">
          Completed
        </p>

        <div className="mt-5 space-y-5">
          <TransactionRow
            name="Sigma Digital"
            tag="SEO Foundation"
            amount="+ $2,800"
          />
          <TransactionRow
            name="Google LSA"
            tag="Local Services"
            amount="+ $2,000"
          />
        </div>
      </div>
    </div>
  );
}

function SendVisual() {
  return (
    <div className="mx-auto w-[56%] min-w-[390px] rounded-[2rem] border border-black/10 bg-[#ece8e1] p-8 shadow-xl">
      <h3 className="text-2xl font-semibold text-black">Choose an amount</h3>

      <div className="mt-8 rounded-2xl border border-black/50 bg-transparent p-5">
        <p className="text-xs font-semibold text-black/50">Amount</p>
        <p className="mt-1 text-2xl font-semibold text-black">$25,000</p>
      </div>

      <div className="mt-5 rounded-2xl border border-black/10 p-5">
        <p className="text-lg text-black/35">Memo</p>
      </div>

      <button className="ml-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl">
        <ArrowRight className="h-6 w-6" />
      </button>
    </div>
  );
}

function RaiseVisual() {
  return (
    <div className="mx-auto flex h-full w-full items-center justify-center">
      <div className="rounded-[2rem] border border-black/10 bg-[#ece8e1] px-16 py-12 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/35">
          Total committed
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl text-black/35">$</span>
          <h3 className="text-6xl font-semibold tracking-[-0.06em] text-black">
            645,000
          </h3>
        </div>
      </div>
    </div>
  );
}

function MirrorVisual() {
  return (
    <div className="mx-auto w-[58%] min-w-[410px] rounded-[2rem] border border-black/10 bg-[#ece8e1] p-7 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/35">
            Client mirror
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-black">
            Crown Treez Landscaping
          </h3>
        </div>

        <ShieldCheck className="h-6 w-6 text-black" />
      </div>

      <div className="grid gap-3">
        <MirrorRow label="Funded amount" value="$0" />
        <MirrorRow label="Pending amount" value="$7,300" accent />
        <MirrorRow label="Total planned" value="$7,300" />
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-black">
            Sigma Digital
          </span>
          <span className="text-sm font-semibold text-black">$2,800</span>
        </div>
        <p className="text-sm text-black/45">Local SEO Foundation</p>
      </div>
    </div>
  );
}

function TransactionRow({ name, tag, amount }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
          <Building2 className="h-4 w-4" />
        </div>

        <div>
          <p className="font-semibold text-black">{name}</p>
          <p className="text-sm text-black/40">{tag}</p>
        </div>
      </div>

      <p className="font-semibold text-black">{amount}</p>
    </div>
  );
}

function MirrorRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-4">
      <p className="text-sm text-black/45">{label}</p>
      <p className={`font-semibold ${accent ? "text-[#fe8200]" : "text-black"}`}>
        {value}
      </p>
    </div>
  );
}