import Link from "next/link";
import { Scan, FileText, Download } from "lucide-react";

export default function QuickActions() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-foreground/60 mb-4">
        Actions rapides
      </h2>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/audits/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white
            hover:bg-accent-hover transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <Scan className="h-4 w-4" aria-hidden="true" />
          Lancer un audit
        </Link>
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-foreground
            hover:bg-gray-50 transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Voir le rapport
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-foreground
            hover:bg-gray-50 transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Exporter PDF
        </button>
      </div>
    </section>
  );
}
