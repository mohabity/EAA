import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SkipNavLink from "@/components/layout/SkipNavLink";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  );
}
