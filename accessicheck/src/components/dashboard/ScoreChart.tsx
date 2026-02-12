"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ChartDataPoint {
  audit: string;
  score: number;
}

interface ScoreChartProps {
  data: ChartDataPoint[];
}

export default function ScoreChart({ data }: ScoreChartProps) {
  // Résumé textuel pour les lecteurs d'écran
  const summary = data.map((d) => `${d.audit} : ${d.score}`).join(", ");

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-foreground/60 mb-4">
        Évolution du score
      </h2>

      {/* Texte alternatif pour les lecteurs d'écran */}
      <p className="sr-only">
        Scores des 6 derniers audits : {summary}
      </p>

      {/* Graphique masqué pour les lecteurs d'écran */}
      <div aria-hidden="true" className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="audit"
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#047857"
              strokeWidth={2.5}
              dot={{ fill: "#047857", r: 4 }}
              activeDot={{ r: 6, fill: "#047857" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
