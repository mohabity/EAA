"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { User, Settings, LogOut } from "lucide-react"

export default function ProfileMenu() {
  const t = useTranslations("header")
  const tProfile = useTranslations("profile")
  const tA11y = useTranslations("accessibility")
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Escape ferme le menu et remet le focus sur le bouton
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={tA11y("profileMenu")}
        className="flex items-center gap-2 rounded-lg p-2 hover:bg-foreground/5
          focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-sm font-medium">
          MD
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {tProfile("mockName")}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-foreground/10 bg-white py-2 shadow-lg"
        >
          <div className="px-4 py-3 border-b border-foreground/10">
            <p className="text-sm font-medium text-foreground">
              {tProfile("mockName")}
            </p>
            <p className="text-xs text-foreground/60">
              {tProfile("mockEmail")}
            </p>
            <p className="text-xs text-foreground/40 mt-0.5">
              {tProfile("mockOrg")}
            </p>
          </div>

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground
              hover:bg-foreground/5 focus:outline-none focus:bg-foreground/5 transition-colors"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            {t("profile")}
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground
              hover:bg-foreground/5 focus:outline-none focus:bg-foreground/5 transition-colors"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            {t("settings")}
          </button>

          <div className="border-t border-foreground/10 mt-1 pt-1">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600
                hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
