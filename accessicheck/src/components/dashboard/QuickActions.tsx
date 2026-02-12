"use client"

import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { Scan, Download, FileText } from "lucide-react"

interface QuickActionsProps {
  lastAuditDate: string
}

export default function QuickActions({ lastAuditDate }: QuickActionsProps) {
  const t = useTranslations("dashboard")
  const locale = useLocale()

  // Formater la date selon la locale active (FR ou NL)
  const formattedDate = new Intl.DateTimeFormat(locale === "nl" ? "nl-BE" : "fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(lastAuditDate))

  return (
    <section className="rounded-xl border border-foreground/10 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("actions.title")}
      </h2>

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white
            transition-colors hover:bg-accent-hover
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <Scan className="h-4 w-4" aria-hidden="true" />
          {t("actions.newAudit")}
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 px-5 py-2.5 text-sm font-semibold text-foreground
            transition-colors hover:bg-foreground/5
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {t("actions.downloadDeclaration")}
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 px-5 py-2.5 text-sm font-semibold text-foreground
            transition-colors hover:bg-foreground/5
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          {t("actions.generateVpat")}
        </button>
      </div>

      <p className="mt-4 text-sm text-foreground/60">
        {t("actions.lastAudit", { date: formattedDate })}
      </p>
    </section>
  )
}
