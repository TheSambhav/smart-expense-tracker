import Link from "next/link";
import { LayoutDashboard, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Smart Expense Tracker" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg tracking-tight">Smart Expense Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next-Gen Personal Finance
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Master Your Money <br /> with AI Intelligence
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Track spending, analyze habits, and chat with your personal AI finance assistant.
              Import CSVs and get insights in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-white text-gray-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
              >
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg border border-gray-800 hover:bg-gray-800 transition-all"
              >
                Live Demo
              </Link>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="pt-16">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] flex">
                  {/* Mock Sidebar */}
                  <div className="w-16 md:w-48 border-r border-gray-800 bg-gray-950 p-4 hidden sm:flex flex-col gap-6">
                    <div className="h-4 w-2/3 bg-gray-800 rounded-full mb-4 opacity-50" />
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-800 rounded-md" />
                        <div className="h-2 w-1/2 bg-gray-800 rounded-full hidden md:block" />
                      </div>
                    ))}
                  </div>

                  {/* Mock Content */}
                  <div className="flex-1 p-4 md:p-8 space-y-6 overflow-hidden bg-gray-900/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-6 w-32 bg-gray-800 rounded-lg" />
                      <div className="h-8 w-24 bg-blue-600/50 rounded-lg" />
                    </div>

                    {/* Mock Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-950 border border-gray-800 p-4 rounded-xl space-y-3">
                          <div className="w-8 h-8 bg-blue-500/10 rounded-lg" />
                          <div className="h-2 w-full bg-gray-800 rounded-full" />
                          <div className="h-4 w-2/3 bg-white/10 rounded-full" />
                        </div>
                      ))}
                    </div>

                    {/* Mock Chart Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                      <div className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded-xl p-6 relative overflow-hidden h-48 md:h-64">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent" />
                        <div className="flex items-end justify-between h-full gap-2 px-2">
                          {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75, 40, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-600/40 rounded-t-sm" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 hidden lg:block">
                        <div className="w-24 h-24 rounded-full border-[10px] border-gray-800 border-t-blue-500 mx-auto" />
                        <div className="mt-6 space-y-3">
                          <div className="h-2 w-full bg-gray-800 rounded-full" />
                          <div className="h-2 w-2/3 bg-gray-800 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-900/30 border-y border-gray-900">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Bank-Grade Security</h3>
              <p className="text-gray-400">Your data is encrypted and protected with industry-leading security protocols.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Instant CSV Import</h3>
              <p className="text-gray-400">Upload your bank statements and watch your dashboard come alive instantly.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Insights</h3>
              <p className="text-gray-400">Ask our AI anything about your spending. "How much did I spend on coffee this month?"</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 text-center text-gray-500 text-sm">
        <p>© 2026 FinTrace. Built for the modern builder.</p>
      </footer>
    </div>
  );
}
