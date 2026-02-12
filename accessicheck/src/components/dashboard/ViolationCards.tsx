import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface ViolationCardsProps {
  critical: number;
  major: number;
  minor: number;
}

const cards = [
  {
    key: "critical" as const,
    label: "Critiques",
    icon: AlertTriangle,
    border: "border-l-red-600",
    bg: "bg-red-50",
    text: "text-red-700",
    count: "text-red-800",
  },
  {
    key: "major" as const,
    label: "Majeures",
    icon: AlertCircle,
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    count: "text-amber-800",
  },
  {
    key: "minor" as const,
    label: "Mineures",
    icon: Info,
    border: "border-l-yellow-500",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    count: "text-yellow-800",
  },
];

export default function ViolationCards({ critical, major, minor }: ViolationCardsProps) {
  const values = { critical, major, minor };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = values[card.key];

        return (
          <div
            key={card.key}
            role="group"
            aria-label={`${value} violations ${card.label.toLowerCase()}`}
            className={`rounded-xl border-l-4 ${card.border} ${card.bg} p-4 shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-5 w-5 ${card.text}`} aria-hidden="true" />
              <span className={`text-sm font-medium ${card.text}`}>
                {card.label}
              </span>
            </div>
            <p className={`text-3xl font-bold ${card.count}`}>
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
