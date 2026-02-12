"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Scan,
  FileText,
  Coins,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sites", label: "Mes Sites", icon: Globe },
  { href: "/audits", label: "Audits", icon: Scan },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/subsidies", label: "Subsides", icon: Coins },
];

interface SidebarNavProps {
  isCollapsed: boolean;
}

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale">
      <ul className="space-y-1 px-3" role="list">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-sidebar-bg
                  ${isActive
                    ? "bg-white/10 text-sidebar-active border-l-[3px] border-accent"
                    : "text-sidebar-text hover:bg-white/5 hover:text-sidebar-active"
                  }
                  ${isCollapsed ? "justify-center px-2" : ""}
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && <span className="sr-only">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
