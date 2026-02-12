import { useTranslations } from "next-intl"
import Link from "next/link"
import Breadcrumbs from "./Breadcrumbs"
import ProfileMenu from "./ProfileMenu"

export default function Header() {
  const t = useTranslations("header")
  const tBreadcrumbs = useTranslations("breadcrumbs")

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-background border-b border-foreground/10">
      <Breadcrumbs
        items={[{ label: tBreadcrumbs("home"), href: "/dashboard" }]}
      />

      <div className="flex items-center gap-4">
        <Link
          href="/audits/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white
            hover:bg-accent-hover transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          {t("launchAudit")}
        </Link>
        <ProfileMenu />
      </div>
    </header>
  )
}
