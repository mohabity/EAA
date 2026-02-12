interface ComplianceBadgeProps {
  level: "full" | "partial" | "non_compliant";
}

const badgeConfig = {
  full: {
    label: "Conforme",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  partial: {
    label: "Partiellement conforme",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  non_compliant: {
    label: "Non conforme",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export default function ComplianceBadge({ level }: ComplianceBadgeProps) {
  const config = badgeConfig[level];

  return (
    <span
      role="status"
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
