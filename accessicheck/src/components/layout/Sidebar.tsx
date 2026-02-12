"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Shield } from "lucide-react";
import SidebarNav from "./SidebarNav";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`
        flex flex-col bg-sidebar-bg text-sidebar-text transition-all duration-200
        ${isCollapsed ? "w-16" : "w-64"}
      `}
      aria-label="Barre latérale"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-white/10">
        <Shield className="h-7 w-7 text-accent flex-shrink-0" aria-hidden="true" />
        {!isCollapsed && (
          <span className="text-lg font-bold text-sidebar-active">
            AccessiCheck
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-y-auto">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      {/* Bouton plier/déplier */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-text
            hover:bg-white/5 hover:text-sidebar-active transition-colors w-full
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-sidebar-bg
            ${isCollapsed ? "justify-center px-2" : ""}
          `}
          aria-label={isCollapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
              <span>Replier</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
