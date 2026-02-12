import ScoreCircle from "@/components/dashboard/ScoreCircle";
import ComplianceBadge from "@/components/dashboard/ComplianceBadge";
import ViolationCards from "@/components/dashboard/ViolationCards";
import ScoreChart from "@/components/dashboard/ScoreChart";
import QuickActions from "@/components/dashboard/QuickActions";

// Données mock pour le graphique d'évolution
const chartData = [
  { audit: "Jan 25", score: 42 },
  { audit: "Fév 25", score: 48 },
  { audit: "Mar 25", score: 55 },
  { audit: "Avr 25", score: 51 },
  { audit: "Mai 25", score: 62 },
  { audit: "Juin 25", score: 67 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Tableau de bord
        </h1>
        <ComplianceBadge level="partial" />
      </div>

      {/* Score + Violations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <ScoreCircle score={67} />
        </div>
        <div className="lg:col-span-9">
          <ViolationCards critical={12} major={34} minor={56} />
        </div>
      </div>

      {/* Graphique d'évolution */}
      <ScoreChart data={chartData} />

      {/* Actions rapides */}
      <QuickActions />
    </div>
  );
}
