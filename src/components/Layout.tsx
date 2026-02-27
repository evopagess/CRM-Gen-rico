import React from 'react';
import { Calendar, Users, FileText, Home, Menu, Settings, HelpCircle, DollarSign } from 'lucide-react';
import { cn } from '../utils/cn';

import { useAppStore } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { settings } = useAppStore();
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'schedule', label: 'Agenda', icon: Calendar },
    { id: 'quotes', label: 'Orçamentos', icon: FileText },
    { id: 'earnings', label: 'Recebidos', icon: DollarSign },
    { id: 'tutorial', label: 'Passo a Passo', icon: HelpCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-zinc-50 flex-col md:flex-row">
      {/* Mobile Header */}
      {/* Mobile Header */}
      <header className="md:hidden gradient-brand text-white p-5 flex items-center justify-between shadow-premium z-10 transition-all">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden flex items-center justify-center p-1 shadow-inner">
            {settings.logo ? (
              <img src={settings.logo} alt="Empresa" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <Users className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h1 className="font-poppins font-bold text-lg tracking-tight leading-tight uppercase line-clamp-1">{settings.companyName || 'Minha Empresa'}</h1>
            <p className="text-[10px] text-brand-100 font-medium uppercase tracking-[0.2em] opacity-80">Painel Administrativo</p>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-zinc-200/60 shadow-xl relative z-30">
        {/* Top Section - User Profile */}
        <div className="p-8 border-b border-zinc-100 flex items-center gap-4 bg-zinc-50/50">
          <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden flex items-center justify-center p-1 shrink-0">
            {settings.logo ? (
              <img src={settings.logo} alt="Empresa" className="h-full w-full object-cover rounded-xl" />
            ) : (
              <Users className="h-6 w-6 text-zinc-400" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-zinc-900 leading-tight uppercase italic tracking-tighter truncate">{settings.companyName || 'Minha Empresa'}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-premium shadow-brand-500/10 ring-1 ring-brand-200/50"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <Icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-brand-600" : "text-zinc-400 group-hover:text-zinc-600"
                )} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section - LOOM Branding */}
        <div className="p-6 border-t border-zinc-100 bg-zinc-50/30">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0">
              <img src="/loom_logo.png" alt="LOOM" className="h-full w-full object-contain" />
            </div>
            <span className="text-[16px] font-poppins font-semibold text-gradient-gold uppercase tracking-tighter leading-none">LOOM</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8 w-full">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-20 p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full rounded-2xl transition-all active:scale-90",
                isActive ? "text-brand-600 bg-brand-50/50 shadow-premium shadow-brand-500/5" : "text-zinc-400"
              )}
            >
              <Icon size={24} className={cn(isActive ? "text-brand-600" : "text-zinc-400")} />
              <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
