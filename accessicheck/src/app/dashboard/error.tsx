"use client"

export default function DashboardError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="p-6 rounded-xl bg-red-50 border border-red-200">
      <h2 className="text-lg font-bold text-red-800">
        Erreur Dashboard
      </h2>
      <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
        {error.message}
      </pre>
      <pre className="mt-2 text-xs text-red-500 whitespace-pre-wrap">
        {error.stack}
      </pre>
    </div>
  )
}
