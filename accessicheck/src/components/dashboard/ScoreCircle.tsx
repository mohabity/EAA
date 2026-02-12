interface ScoreCircleProps {
  score: number;
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  // Couleur selon le score
  const color = score > 70 ? "#047857" : score >= 40 ? "#B45309" : "#B91C1C";

  // Calcul du cercle SVG (rayon 50, périmètre ~314)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-foreground/60 mb-4">
        Score global
      </h2>
      <div className="flex justify-center">
        <svg
          width="140"
          height="140"
          viewBox="0 0 120 120"
          role="img"
          aria-label={`Score d'accessibilité : ${score} sur 100`}
        >
          {/* Cercle de fond */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="10"
          />
          {/* Cercle de progression */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          {/* Score au centre */}
          <text
            x="60"
            y="55"
            textAnchor="middle"
            className="text-3xl font-bold"
            fill={color}
            fontSize="28"
            fontWeight="bold"
          >
            {score}
          </text>
          <text
            x="60"
            y="75"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="12"
          >
            / 100
          </text>
        </svg>
      </div>
    </div>
  );
}
