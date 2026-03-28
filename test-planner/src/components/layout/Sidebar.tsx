import Link from "next/link";
import { 
  Sparkles,
  LayoutDashboard,
  Bot
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 flex flex-col bg-[#111827] text-slate-300 h-screen py-4 border-r border-slate-800 flex-shrink-0 relative">
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
          <Sparkles className="w-5 h-5 text-yellow-200" />
        </div>
        <div>
          <h1 className="text-white font-bold text-base tracking-wide flex items-center gap-1">TestGenie</h1>
          <p className="text-xs text-slate-400">Testing Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-4">
          Main
        </div>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-slate-800"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-8">
          Planning & Strategy
        </div>
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary-600 text-white transition-colors"
        >
          <Bot className="w-4 h-4" />
          <span>Intelligent Test Planning</span>
        </Link>
      </nav>
    </div>
  );
}
