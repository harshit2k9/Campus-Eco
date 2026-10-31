import { useState, useEffect } from 'react';
import { useStore, startSimulationLoop, stopSimulationLoop } from './store/useStore';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EquipmentManager from './components/EquipmentManager';
import Alerts from './components/Alerts';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';

export default function App() {
  const { isAuthenticated } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Auto-start simulation on mount
  useEffect(() => {
    if (isAuthenticated) {
      startSimulationLoop();
    }
    return () => {
      stopSimulationLoop();
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'equipment': return <EquipmentManager />;
      case 'alerts': return <Alerts />;
      case 'leaderboard': return <Leaderboard />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
