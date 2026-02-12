import { useTranslations } from "next-intl"

export default function SkipNavLink() {
  const t = useTranslations("accessibility")

  return (
    <a href="#main-content" className="skip-nav-link">
      {t("skipToContent")}
    </a>
  )
}
