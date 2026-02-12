import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("nav")

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {t("dashboard")}
      </h1>
      <p className="mt-2 text-foreground/60">
        AccessiCheck — European Accessibility Act
      </p>
    </div>
  )
}
