"use client"

import { useTranslations } from "next-intl"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"

interface ViolationCardsProps {
  critical: number
  major: number
  minor: number
}

const SEVERITY_CONFIG = [
  {
    key: "critical" as const,
    Icon: AlertTriangle,
    textColor: "text-red-700",
    borderColor: "border-l-red-600",
    bgColor: "bg-red-50",
  },
  {
    key: "major" as const,
    Icon: AlertCircle,
    textColor: "text-amber-700",
    borderColor: "border-l-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    key: "minor" as const,
    Icon: Info,
    textColor: "text-emerald-700",
    borderColor: "border-l-emerald-600",
    bgColor: "bg-emerald-50",
  },
] as const

export default function ViolationCards({ critical, major, minor }: ViolationCardsProps) {
  const t = useTranslations("dashboard")

  const counts = { critical, major, minor }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {SEVERITY_CONFIG.map(({ key, Icon, textColor, borderColor, bgColor }) => (
        <div
          key={key}
          role="group"
          aria-label={t("violations.label", {
            count: counts[key],
            level: t(`violations.${key}`),
          })}
          className={`rounded-xl border border-foreground/10 border-l-4 ${borderColor} ${bgColor} p-5 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
            <span className="text-sm font-medium text-foreground/60">
              {t(`violations.${key}`)}
            </span>
          </div>
          <p className={`mt-2 text-3xl font-bold ${textColor}`}>
            {counts[key]}
          </p>
        </div>
      ))}
    </div>
  )
}
