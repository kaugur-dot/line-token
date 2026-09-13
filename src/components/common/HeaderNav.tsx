import React from 'react';
import { 
  UserPlus, 
  Ticket, 
  SlidersHorizontal, 
  Tv, 
  Volume2, 
  VolumeX, 
  RotateCcw
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';

export type AppRoute = '/join' | '/queue' | '/admin' | '/display';

interface HeaderNavProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentRoute,
  onRouteChange,
}) => {
  const { soundAlertsEnabled, toggleSoundAlerts, resetQueueDemo, patientTokenId } = useQueue();

  const routes: { path: AppRoute; label: string; icon: React.FC<{ className?: string }> }[] = [
    { path: '/join', label: '1. Join', icon: UserPlus },
    { path: '/queue', label: `2. Patient View`, icon: Ticket },
    { path: '/admin', label: '3. Admin Console', icon: SlidersHorizontal },
    { path: '/display', label: '4. Public Display (1080p)', icon: Tv },
  ];

  return (
    <header 
      id="app-header-nav"
      className="bg-[#F2EFE8] hairline-b text-[#1E1C19] sticky top-0 z-40 transition-colors"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Brand & Wayfinder Label */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1E1C19] text-[#F8F6F0] rounded font-wayfinder font-bold text-xs tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            <span>SMARTQUEUE</span>
          </div>
          <span className="hidden md:inline-block text-xs font-mono font-medium text-[#797267] tracking-wider uppercase">
            Transit Wayfinder LED
          </span>
        </div>

        {/* Route Selector Pills */}
        <nav 
          aria-label="Screen Navigation" 
          className="flex items-center gap-1 sm:gap-1.5 bg-[#E7E2D7] p-1 rounded-lg hairline-border overflow-x-auto"
        >
          {routes.map(r => {
            const Icon = r.icon;
            const isActive = currentRoute === r.path;
            return (
              <button
                key={r.path}
                id={`nav-btn-${r.path.replace('/', '')}`}
                onClick={() => onRouteChange(r.path)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1E1C19] text-[#F8F6F0] shadow-sm'
                    : 'text-[#58524A] hover:text-[#1E1C19] hover:bg-[#DDD6C8]/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleSoundAlerts}
            className="p-1.5 text-xs font-medium bg-[#E7E2D7] hover:bg-[#DDD6C8] text-[#1E1C19] rounded hairline-border transition-colors"
            title={soundAlertsEnabled ? 'Sound announcements enabled' : 'Muted'}
            aria-label={soundAlertsEnabled ? 'Disable chime announcements' : 'Enable chime announcements'}
          >
            {soundAlertsEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-800" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#797267]" />
            )}
          </button>

          <button
            onClick={resetQueueDemo}
            className="p-1.5 text-xs font-medium bg-[#E7E2D7] hover:bg-[#DDD6C8] text-[#58524A] hover:text-[#1E1C19] rounded hairline-border transition-colors"
            title="Reset queue to demo initial state"
            aria-label="Reset Queue Demo Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
