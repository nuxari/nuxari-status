const TRUST_ITEMS = [
  { label: "Security-first monitoring" },
  { label: "Public incident transparency" },
  { label: "No tenant data exposed" },
  { label: "Support escalation available" },
  { label: "Evidence and audit systems monitored" },
];

export function TrustPanel() {
  return (
    <section
      className="border px-5 py-4"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[10px] font-bold" style={{ color: "#2f4bff" }}>—</span>
            <span className="text-xs" style={{ color: "#5b5b54" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
