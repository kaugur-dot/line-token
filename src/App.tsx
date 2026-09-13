import React, { useState, useEffect } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { HeaderNav, AppRoute } from './components/common/HeaderNav';
import { JoinScreen } from './components/screens/JoinScreen';
import { QueueStatusScreen } from './components/screens/QueueStatusScreen';
import { AdminConsoleScreen } from './components/screens/AdminConsoleScreen';
import { DisplayBoardScreen } from './components/screens/DisplayBoardScreen';

function MainAppContent() {
  const { patientTokenId, setPatientTokenId } = useQueue();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/join');
  const [activeQueueTokenId, setActiveQueueTokenId] = useState<string>('t-19');

  // Synchronize route with window.location.pathname
  useEffect(() => {
    const syncRouteFromPath = () => {
      const path = window.location.pathname;
      if (path.startsWith('/queue')) {
        setCurrentRoute('/queue');
        const parts = path.split('/');
        if (parts[2]) {
          setActiveQueueTokenId(parts[2]);
          setPatientTokenId(parts[2]);
        }
      } else if (path === '/admin') {
        setCurrentRoute('/admin');
      } else if (path === '/display') {
        setCurrentRoute('/display');
      } else {
        // Default to /join
        setCurrentRoute('/join');
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, [setPatientTokenId]);

  const handleRouteChange = (route: AppRoute) => {
    setCurrentRoute(route);
    let targetPath: string = route;
    if (route === '/queue') {
      targetPath = `/queue/${activeQueueTokenId || patientTokenId || 't-19'}`;
    }
    window.history.pushState({}, '', targetPath);
  };

  const handleTokenGenerated = (tokenId: string) => {
    setActiveQueueTokenId(tokenId);
    setPatientTokenId(tokenId);
    setCurrentRoute('/queue');
    window.history.pushState({}, '', `/queue/${tokenId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] selection:bg-[#DDD6C8] selection:text-[#1E1C19]">
      {/* Route Switcher & Wayfinder Navigation */}
      <HeaderNav
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
      />

      {/* Screen Render based on active route */}
      <div className="flex-1 flex flex-col">
        {currentRoute === '/join' && (
          <JoinScreen onTokenGenerated={handleTokenGenerated} />
        )}

        {currentRoute === '/queue' && (
          <QueueStatusScreen
            queueId={activeQueueTokenId || patientTokenId}
            onBackToJoin={() => handleRouteChange('/join')}
          />
        )}

        {currentRoute === '/admin' && (
          <AdminConsoleScreen />
        )}

        {currentRoute === '/display' && (
          <DisplayBoardScreen />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueueProvider>
      <MainAppContent />
    </QueueProvider>
  );
}
