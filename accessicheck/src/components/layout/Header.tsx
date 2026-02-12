import Link from "next/link";
import { Scan } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <h2 className="text-sm font-medium text-foreground/60">
        Tableau de bord
      </h2>
      <div className="flex items-center gap-4">
        <Link
          href="/audits/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white
            hover:bg-accent-hover transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <Scan className="h-4 w-4" aria-hidden="true" />
          Lancer un audit
        </Link>
        <ProfileMenu />
      </div>
    </header>
  );
}
