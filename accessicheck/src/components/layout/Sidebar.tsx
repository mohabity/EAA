"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import SidebarNav from "./SidebarNav"
import LanguageSwitch from "./LanguageSwitch"

export default function Sidebar() {
  const t = useTranslations("accessibility")
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Réduire automatiquement sur mobile au chargement
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    setIsCollapsed(mediaQuery.matches)

    function handleChange(e: MediaQueryListEvent) {
      setIsCollapsed(e.matches)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return (
    <aside
      className={`flex flex-col bg-sidebar-bg text-sidebar-text h-screen sticky top-0 transition-[width] duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        {isCollapsed ? (
          <span className="text-lg font-bold text-white mx-auto" aria-hidden="true">
            AC
          </span>
        ) : (
          <span className="text-lg font-bold text-white tracking-tight">
            AccessiCheck
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      {/* Bas de la sidebar : langue + toggle */}
      <div className="border-t border-white/10 p-3 space-y-2 shrink-0">
        {!isCollapsed && <LanguageSwitch />}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={t("sidebarToggle")}
          className="flex items-center justify-center w-full p-2 rounded-lg text-sidebar-text
            hover:bg-white/5 hover:text-sidebar-text-active
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-sidebar-bg
            transition-colors"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  )
}
