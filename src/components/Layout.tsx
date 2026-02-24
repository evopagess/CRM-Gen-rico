import React from 'react';
import { Calendar, Users, FileText, Home, Menu, Settings } from 'lucide-react';
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
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-2">
          {settings.logo ? (
            <div className="h-8 w-8 rounded-md bg-white overflow-hidden p-0.5">
              <img src={settings.logo} alt="Logo" className="h-full w-full object-cover rounded-[3px]" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-md bg-white overflow-hidden">
              <img src="/logo.png" alt="AeroDesk Logo" className="h-full w-full object-contain" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-tight">AeroDesk</h1>
            <p className="text-[10px] text-blue-100 font-medium truncate max-w-[120px]">{settings.companyName}</p>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          {settings.logo ? (
            <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 overflow-hidden p-0.5">
              <img src={settings.logo} alt="Logo" className="h-full w-full object-cover rounded-[5px]" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-lg bg-white border border-gray-100 overflow-hidden">
              <img src="/logo.png" alt="AeroDesk Logo" className="h-full w-full object-contain" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-bold text-xl text-gray-900 tracking-tight leading-tight">AeroDesk</h1>
            <p className="text-xs text-gray-500 font-medium truncate">{settings.companyName}</p>
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
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg min-w-[64px] transition-colors",
                isActive ? "text-blue-600" : "text-gray-500"
              )}
            >
              <Icon size={24} className={cn("mb-1", isActive ? "text-blue-600" : "text-gray-400")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
