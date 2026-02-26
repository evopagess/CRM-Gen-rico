import React from 'react';
import { Calendar, Users, FileText, Home, Menu, Settings, HelpCircle } from 'lucide-react';
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
    { id: 'tutorial', label: 'Passo a Passo', icon: HelpCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50 flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-brand-700 text-white p-4 flex items-center justify-between shadow-premium z-10">
        <div className="flex items-center gap-2">
          {settings.logo ? (
            <div className="h-8 w-8 rounded-lg bg-white overflow-hidden p-0.5 shadow-inner-glow">
              <img src={settings.logo} alt="Logo" className="h-full w-full object-cover rounded-[5px]" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-white overflow-hidden p-0 shadow-inner-glow">
              <img src="/logo.png" alt="NEXUS Logo" className="h-full w-full object-containScale" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-tight text-white">NEXUS</h1>
            <p className="text-[10px] text-brand-100 font-medium truncate max-w-[120px]">{settings.companyName}</p>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200/60 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          {settings.logo ? (
            <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 overflow-hidden p-1">
              <img src={settings.logo} alt="Logo" className="h-full w-full object-cover rounded-[7px]" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 overflow-hidden p-0 flex items-center justify-center shadow-sm">
              <img src="/logo.png" alt="NEXUS Logo" className="h-full w-full object-contain scale-[1.2]" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-bold text-xl text-slate-900 tracking-tight leading-tight">NEXUS</h1>
            <p className="text-[10px] text-slate-500 font-semibold truncate uppercase tracking-wider">{settings.companyName}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-sm shadow-brand-100/50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={18} className={isActive ? "text-brand-600" : "text-slate-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>
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
                "flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all active:scale-90",
                isActive ? "text-brand-600 bg-brand-50/50 shadow-sm" : "text-slate-500"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-brand-600" : "text-slate-400")} />
              <span className="text-[9px] font-bold mt-1 uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
