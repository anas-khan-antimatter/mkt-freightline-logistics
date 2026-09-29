"use client";

const caseStudies = [
  {
    company: "Great Lakes Steel",
    industry: "Metals & Mining",
    challenge: "Consistent steel coil shipments from Gary, IN to 12 distribution centers across the Southeast with 48-hour delivery windows.",
    solution: "Dedicated FTL fleet with real-time load tracking, drop-and-hook trailer pools, and priority rail intermodal for longer hauls.",
    results: ["22% reduction in transit time", "99.1% on-time delivery", "$1.8M annual freight savings"],
  },
  {
    company: "Pioneer Ag Supply",
    industry: "Agriculture",
    challenge: "Seasonal fertilizer and chemical shipments from Gulf Coast ports to Midwest farm co-ops requiring hazmat compliance.",
    solution: "Fully certified hazmat fleet, flexible surge capacity for Q2-Q3 seasons, and port-drayage integration.",
    results: ["40% faster port-to-farm transit", "100% hazmat compliance audit score", "3x seasonal capacity scaling"],
  },
  {
    company: "Apex Auto Parts",
    industry: "Automotive",
    challenge: "Just-in-time delivery of 800+ SKUs from Mexican maquiladoras to Michigan assembly plants with <1hr delivery windows.",
    solution: "Cross-border dedicated fleet with customs pre-clearance, temperature-controlled trailers, and AI route optimization.",
    results: ["99.7% JIT window accuracy", "35% reduction in inventory buffer", "Integrated cross-border in 2.5hrs avg"],
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="relative border-b border-[#3a3530]/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            / Case Studies
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Proven Results
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            How Freightline transforms supply chains for industrial leaders.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <div
              key={cs.company}
              className="industrial-border group rounded-sm bg-[#1a1a1a] p-6 transition-colors hover:bg-[#1f1c18]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#3a3530]/50 bg-[#121212]">
                  <span className="font-mono text-xs font-bold text-primary">
                    {cs.company.split(" ").map((w) => w[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{cs.company}</p>
                  <p className="font-mono text-xs text-muted-foreground">{cs.industry}</p>
                </div>
              </div>

              <div className="mb-4 space-y-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Challenge</p>
                  <p className="mt-1 text-sm text-muted-foreground">{cs.challenge}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Solution</p>
                  <p className="mt-1 text-sm text-muted-foreground">{cs.solution}</p>
                </div>
              </div>

              <div className="border-t border-[#3a3530]/30 pt-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Results</p>
                <ul className="space-y-1.5">
                  {cs.results.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-primary">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}