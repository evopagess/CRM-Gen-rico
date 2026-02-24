import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Client, Job, Quote } from '../types';

interface AppContextType extends AppState {
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  updateSettings: (settings: AppState['settings']) => void;
}

const defaultState: AppState = {
  clients: [],
  jobs: [],
  quotes: [],
  settings: {
    companyName: 'AeroDesk',
    onboardingCompleted: false
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('hvac_app_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          settings: {
            ...defaultState.settings,
            ...(parsed.settings || {})
          }
        };
      } catch (e) {
        console.error('Failed to parse state from local storage', e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('hvac_app_state', JSON.stringify(state));
  }, [state]);

  const addClient = (client: Client) => setState(s => ({ ...s, clients: [...s.clients, client] }));
  const updateClient = (client: Client) => setState(s => ({ ...s, clients: s.clients.map(c => c.id === client.id ? client : c) }));
  const deleteClient = (id: string) => setState(s => ({ ...s, clients: s.clients.filter(c => c.id !== id) }));

  const addJob = (job: Job) => setState(s => ({ ...s, jobs: [...s.jobs, job] }));
  const updateJob = (job: Job) => setState(s => ({ ...s, jobs: s.jobs.map(j => j.id === job.id ? job : j) }));
  const deleteJob = (id: string) => setState(s => ({ ...s, jobs: s.jobs.filter(j => j.id !== id) }));

  const addQuote = (quote: Quote) => setState(s => ({ ...s, quotes: [...s.quotes, quote] }));
  const updateQuote = (quote: Quote) => setState(s => ({ ...s, quotes: s.quotes.map(q => q.id === quote.id ? quote : q) }));
  const deleteQuote = (id: string) => setState(s => ({ ...s, quotes: s.quotes.filter(q => q.id !== id) }));
  const updateSettings = (settings: AppState['settings']) => setState(s => ({ ...s, settings }));

  return (
    <AppContext.Provider value={{
      ...state,
      addClient, updateClient, deleteClient,
      addJob, updateJob, deleteJob,
      addQuote, updateQuote, deleteQuote,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within an AppProvider');
  return context;
};
