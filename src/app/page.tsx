import Link from "next/link";
import { LayoutDashboard, ArrowRight, Shield, Zap, BarChart3, PieChart, TrendingUp, CreditCard, Wallet, Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Smart Expense Tracker" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg tracking-tight">Smart Expense Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next-Gen Personal Finance
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight">
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
                Start
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>

            {/* HIGH-FIDELITY DASHBOARD MOCKUP */}
            <div className="pt-16">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] flex text-left">
                  {/* Mock Sidebar */}
                  <div className="w-16 md:w-56 border-r border-gray-800 bg-gray-950 p-6 hidden sm:flex flex-col gap-8">
                    <div className="flex items-center gap-3 mb-2">
                      <img src="/logo.png" className="w-6 h-6 invert opacity-50" alt="S" />
                      <span className="font-bold text-xs text-gray-400 hidden md:block">SmartTracker</span>
                    </div>
                    <div className="space-y-6">
                      {["Dashboard", "Analytics", "Transactions", "Settings"].map((label, i) => (
                        <div key={i} className={`flex items-center gap-4 ${i === 0 ? "text-blue-500" : "text-gray-600"}`}>
                          <div className={`w-5 h-5 rounded ${i === 0 ? "bg-blue-500/20" : "bg-gray-800"}`} />
                          <div className={`h-2 w-20 rounded-full hidden md:block ${i === 0 ? "bg-blue-500/20" : "bg-gray-800"}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="flex-1 p-6 md:p-10 space-y-8 overflow-hidden bg-gray-900/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-6 w-40 bg-gray-800 rounded-lg" />
                      <div className="h-10 w-28 bg-blue-600 rounded-xl" />
                    </div>

                    {/* Mock Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { l: "Balance", v: "₹1,42k", c: "text-emerald-500" },
                        { l: "Spending", v: "₹42k", c: "text-rose-500" },
                        { l: "Savings", v: "28%", c: "text-blue-500" },
                        { l: "Forecast", v: "₹1,3k", c: "text-purple-500" }
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-950 border border-gray-800 p-5 rounded-2xl space-y-3">
                          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="h-2 w-12 bg-gray-800 rounded-full" />
                          <div className={`text-lg font-black ${item.c}`}>{item.v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Mock Chart Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                      <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden h-64 md:h-80 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                          <div className="h-4 w-32 bg-white/10 rounded-full" />
                          <div className="flex gap-2">
                            <div className="h-2 w-8 bg-blue-500 rounded-full" />
                            <div className="h-2 w-8 bg-gray-700 rounded-full" />
                          </div>
                        </div>
                        <div className="flex-1 relative">
                          {/* SVG Area Chart */}
                          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="mock-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                              </linearGradient>
                            </defs>
                            <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,20 L400,100 L0,100 Z" fill="url(#mock-grad)" />
                            <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,20" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M0,60 Q50,80 100,40 T200,60 T300,30 T400,50" fill="none" stroke="#374151" strokeWidth="1.5" strokeDasharray="4 2" />
                          </svg>
                        </div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded-3xl p-8 hidden lg:flex flex-col items-center">
                        <div className="relative w-36 h-36">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#1f2937" strokeWidth="3" />
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="60 100" />
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="30 100" strokeDashoffset="-60" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Total</span>
                            <span className="text-lg font-black text-white">₹84k</span>
                          </div>
                        </div>
                        <div className="mt-8 space-y-3 w-full">
                          {[
                            { label: "Food", color: "bg-blue-500", val: "45%" },
                            { label: "Rent", color: "bg-indigo-500", val: "30%" }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{item.label}</span>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400">{item.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
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

      <footer className="py-12 border-t border-gray-900 text-center text-gray-500 text-sm">
        <p>© 2026 Smart Expense Tracker. Built for the modern builder.</p>
      </footer>
    </div>
  );
}
