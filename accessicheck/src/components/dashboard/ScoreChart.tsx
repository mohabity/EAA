"use client"

import { useTranslations } from "next-intl"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ScoreChartProps {
  data: Array<{ audit: number; score: number }>
}

export default function ScoreChart({ data }: ScoreChartProps) {
  const t = useTranslations("dashboard")

  // Résumé textuel pour les lecteurs d'écran
  const summary = data
    .map((d) => `${t("chart.audit", { number: d.audit })} : ${d.score}`)
    .join(", ")

  return (
    <section className="rounded-xl border border-foreground/10 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("chart.title")}
      </h2>

      {/* Description textuelle accessible (masquée visuellement) */}
      <p className="sr-only">
        {t("chart.description", { summary })}
      </p>

      {/* Graphique masqué pour les lecteurs d'écran (alternative textuelle au-dessus) */}
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="audit"
              tickFormatter={(value: number) =>
                t("chart.audit", { number: value })
              }
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={{ stroke: "#E2E8F0" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
              labelFormatter={(label) =>
                t("chart.audit", { number: Number(label) })
              }
              formatter={(value) => [String(value), t("chart.score")]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#047857"
              strokeWidth={2}
              dot={{ fill: "#047857", r: 4 }}
              activeDot={{
                r: 6,
                stroke: "#047857",
                strokeWidth: 2,
                fill: "#FFFFFF",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
