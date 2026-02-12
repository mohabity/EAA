"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  Globe,
  Scan,
  FileText,
  Coins,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  href: string
  labelKey: "dashboard" | "sites" | "audits" | "documents" | "subsidies"
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/sites", labelKey: "sites", icon: Globe },
  { href: "/audits", labelKey: "audits", icon: Scan },
  { href: "/documents", labelKey: "documents", icon: FileText },
  { href: "/subsidies", labelKey: "subsidies", icon: Coins },
]

interface SidebarNavProps {
  isCollapsed: boolean
}

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const tA11y = useTranslations("accessibility")

  return (
    <nav aria-label={tA11y("mainNavigation")}>
      <ul role="list" className="space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          const label = t(item.labelKey)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-sidebar-bg
                  ${isActive
                    ? "bg-white/10 text-sidebar-text-active border-l-[3px] border-accent"
                    : "text-sidebar-text hover:bg-white/5 hover:text-sidebar-text-active"
                  }`}
                title={isCollapsed ? label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
