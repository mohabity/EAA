"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fermer le menu au clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu du profil"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-xs font-bold"
          aria-hidden="true"
        >
          MD
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:block">
          Marie Dupont
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Options du profil"
          className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg py-1 z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-foreground">Marie Dupont</p>
            <p className="text-xs text-gray-500">marie@accessicheck.be</p>
            <p className="text-xs text-gray-400">TechBelgique SA</p>
          </div>
          <button
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-50
              focus:outline-none focus:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            Profil
          </button>
          <button
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-50
              focus:outline-none focus:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Paramètres
          </button>
          <div className="border-t border-gray-100">
            <button
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50
                focus:outline-none focus:bg-red-50"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
