"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import ScoreCircle from "@/components/dashboard/ScoreCircle"
import ViolationCards from "@/components/dashboard/ViolationCards"
import QuickActions from "@/components/dashboard/QuickActions"

// Recharts nécessite le DOM — chargement client uniquement
const ScoreChart = dynamic(
  () => import("@/components/dashboard/ScoreChart"),
  { ssr: false }
)

// Données fictives pour la démo
const MOCK_SCORE = 67
const MOCK_VIOLATIONS = { critical: 3, major: 12, minor: 28 }
const MOCK_HISTORY = [
  { audit: 1, score: 42 },
  { audit: 2, score: 51 },
  { audit: 3, score: 55 },
  { audit: 4, score: 60 },
  { audit: 5, score: 63 },
  { audit: 6, score: 67 },
]
const MOCK_LAST_AUDIT_DATE = "2025-07-15"

export default function DashboardPage() {
  const t = useTranslations("dashboard")

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">
        {t("title")}
      </h1>

      {/* Section haut : score global + violations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ScoreCircle score={MOCK_SCORE} />
        </div>
        <div className="lg:col-span-3">
          <ViolationCards
            critical={MOCK_VIOLATIONS.critical}
            major={MOCK_VIOLATIONS.major}
            minor={MOCK_VIOLATIONS.minor}
          />
        </div>
      </div>

      {/* Section milieu : graphique d'évolution */}
      <ScoreChart data={MOCK_HISTORY} />

      {/* Section bas : actions rapides */}
      <QuickActions lastAuditDate={MOCK_LAST_AUDIT_DATE} />
    </div>
  )
}
