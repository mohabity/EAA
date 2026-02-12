import Sidebar from "./Sidebar"
import Header from "./Header"
import SkipNavLink from "./SkipNavLink"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <SkipNavLink />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main id="main-content" className="flex-1 p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
