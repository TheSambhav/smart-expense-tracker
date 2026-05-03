import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { ClientLogout } from "./ClientLogout";
import { ChatPanel } from "./components/ChatPanel";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Smart Expense Tracker" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Smart Expense Tracker</h1>
            <p className="text-xs text-gray-400">Welcome back, {session.user.name}</p>
          </div>
        </div>
        <ClientLogout />
      </header>
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <ChatPanel />
      </main>
    </div>
  );
}
