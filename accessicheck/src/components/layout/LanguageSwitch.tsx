"use client"

import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

export default function LanguageSwitch() {
  const locale = useLocale()
  const t = useTranslations("language")
  const router = useRouter()

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`
    router.refresh()
  }

  return (
    <div role="radiogroup" aria-label={t("switch")} className="flex gap-1 p-1">
      <button
        type="button"
        role="radio"
        aria-checked={locale === "fr"}
        onClick={() => switchLocale("fr")}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-sidebar-bg
          ${locale === "fr"
            ? "bg-accent text-white"
            : "text-sidebar-text hover:text-sidebar-text-active"
          }`}
      >
        {t("fr")}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={locale === "nl"}
        onClick={() => switchLocale("nl")}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-sidebar-bg
          ${locale === "nl"
            ? "bg-accent text-white"
            : "text-sidebar-text hover:text-sidebar-text-active"
          }`}
      >
        {t("nl")}
      </button>
    </div>
  )
}
