const TRUST_ITEMS = [
  { icon: "🔒", label: "Security-first monitoring" },
  { icon: "📋", label: "Public incident transparency" },
  { icon: "🏢", label: "No tenant data exposed" },
  { icon: "🎫", label: "Support escalation available" },
  { icon: "📊", label: "Evidence and audit systems monitored" },
];

export function TrustPanel() {
  return (
    <section
      className="rounded-xl border px-5 py-4"
      style={{ background: "#1d1d1d", borderColor: "#2b2b2b" }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-sm" aria-hidden="true">{item.icon}</span>
            <span className="text-xs" style={{ color: "#9a9a94" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
