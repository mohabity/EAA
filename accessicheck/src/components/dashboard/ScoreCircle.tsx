"use client"

import { useTranslations } from "next-intl"

interface ScoreCircleProps {
  score: number
}

// Détermine la couleur et le statut de conformité selon le score
function getScoreConfig(score: number) {
  if (score < 40) {
    return {
      color: "#B91C1C",
      badgeKey: "nonConforme" as const,
      badgeBg: "bg-red-100 text-red-800 border-red-200",
    }
  }
  if (score <= 70) {
    return {
      color: "#B45309",
      badgeKey: "partiel" as const,
      badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
    }
  }
  return {
    color: "#047857",
    badgeKey: "conforme" as const,
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
  }
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const t = useTranslations("dashboard")

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const { color, badgeKey, badgeBg } = getScoreConfig(score)

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-foreground/10 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-foreground/60">
        {t("globalScore")}
      </p>

      <svg
        width={120}
        height={120}
        viewBox="0 0 120 120"
        role="img"
        aria-label={t("scoreLabel", { score })}
      >
        {/* Cercle de fond (piste) */}
        <circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={8}
        />
        {/* Cercle de progression */}
        <circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
        {/* Score au centre */}
        <text
          x={60}
          y={55}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={28}
          fontWeight={700}
          fill="#1E293B"
        >
          {score}
        </text>
        <text
          x={60}
          y={78}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fill="#64748B"
        >
          / 100
        </text>
      </svg>

      {/* Badge de conformité */}
      <span
        role="status"
        className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${badgeBg}`}
      >
        {t(`conformity.${badgeKey}`)}
      </span>
    </div>
  )
}
