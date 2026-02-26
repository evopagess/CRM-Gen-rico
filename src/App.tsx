/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Schedule } from './pages/Schedule';
import { Clients } from './pages/Clients';
import { Quotes } from './pages/Quotes';
import { Settings } from './pages/Settings';
import { Onboarding } from './components/Onboarding';
import { Tutorial } from './pages/Tutorial';
import { Earnings } from './pages/Earnings';
import { useAppStore } from './context/AppContext';

export default function App() {
  const { settings } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'schedule':
        return <Schedule />;
      case 'clients':
        return <Clients />;
      case 'quotes':
        return <Quotes />;
      case 'earnings':
        return <Earnings />;
      case 'tutorial':
        return <Tutorial onNavigate={setActiveTab} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  if (!settings.onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

