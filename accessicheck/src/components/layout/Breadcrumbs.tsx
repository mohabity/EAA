import { useTranslations } from "next-intl"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations("accessibility")

  return (
    <nav aria-label={t("breadcrumbNav")}>
      <ol className="flex items-center gap-1.5 text-sm text-foreground/60">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-foreground" : ""}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors underline-offset-4 hover:underline
                    focus:outline-none focus:ring-2 focus:ring-accent focus:rounded-sm"
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
