import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  MapPin, 
  Volume2, 
  ArrowRight,
  Maximize,
  Minimize,
  Sparkles
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { WayfinderNumeral } from '../common/WayfinderNumeral';
import { StatusBadge } from '../common/StatusBadge';

export const DisplayBoardScreen: React.FC = () => {
  const { tokens, counters, queues, nowServingToken } = useQueue();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen toggle for true 1920x1080 display mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Up next waiting tokens
  const upNextTokens = tokens.filter(
    t => t.status === 'waiting' || t.status === 'priority'
  ).sort((a, b) => {
    if (a.status === 'priority' && b.status !== 'priority') return -1;
    if (a.status !== 'priority' && b.status === 'priority') return 1;
    return a.joinedAt - b.joinedAt;
  }).slice(0, 4);

  return (
    <main 
      id="display-board-screen"
      className="min-h-[calc(100vh-3.5rem)] bg-[#151412] text-[#F8F4EB] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ========================================================= */}
      {/* ZONE A: TOP TRANSIT DEPARTURE HEADER                      */}
      {/* ========================================================= */}
      <header className="px-6 py-4 bg-[#1E1C19] border-b border-[#36322C] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-amber-400 font-mono font-bold text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            <span>WAYFINDER DISPLAY &bull; 1080P</span>
          </div>

          <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-[#FAF6ED] uppercase">
            Central Concourse &bull; Passenger & Patient Status
          </h1>
        </div>

        {/* Live Clock & Fullscreen Switch */}
        <div className="flex items-center gap-6">
          <div className="text-right flex flex-col">
            <span className="font-mono text-xs text-[#A8A196] uppercase tracking-wider">
              {currentDate || 'LIVE SYSTEM'}
            </span>
            <span className="font-wayfinder text-xl sm:text-2xl font-bold tracking-tight text-amber-400">
              {currentTime || '00:00:00'}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded bg-[#2B2824] hover:bg-[#38342F] text-[#A8A196] hover:text-[#FAF6ED] border border-[#36322C] transition-colors"
            title="Toggle Fullscreen (1920x1080 Public Mode)"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN DEPARTURE CANVAS: FIXED ZONES (NO SCROLLING)         */}
      {/* ========================================================= */}
      <div className="flex-1 p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 max-w-[1920px] w-full mx-auto items-stretch">
        
        {/* ========================================================= */}
        {/* ZONE B: HERO "NOW SERVING" STAGE (Left 7 Cols)            */}
        {/* High-contrast, readable from meters away                  */}
        {/* ========================================================= */}
        <section 
          aria-label="Now Serving Main Announcement"
          className="lg:col-span-7 bg-[#201E1B] border-2 border-[#3A3631] rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Transit LED Grid Texture Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#332F2A_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-[#36322C] pb-4 sm:pb-6 relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-mono font-black tracking-widest text-amber-400 uppercase">
                NOW SERVING
              </h2>
            </div>
            
            <div className="px-3 py-1 rounded bg-[#2D2A26] border border-[#443F37] text-xs sm:text-sm font-mono font-bold text-[#FAF6ED] uppercase tracking-wider">
              {nowServingToken?.counterAssigned || 'COUNTER 2'}
            </div>
          </div>

          {/* MASSIVE TOKEN NUMERAL (Largest element, readable from distance) */}
          <div className="my-auto py-6 sm:py-10 flex flex-col items-center justify-center text-center relative z-10">
            <span className="text-xs sm:text-sm font-mono text-[#A8A196] uppercase tracking-widest mb-2">
              TOKEN NUMBER
            </span>
            
            <div className="transition-transform duration-300">
              <WayfinderNumeral 
                value={nowServingToken ? nowServingToken.displayNumber.replace('#', '') : '16'}
                prefix="#"
                size="display"
                theme="display-amber"
                flashOnChange={true}
                className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-black"
                ariaLabel={`Now Serving Token ${nowServingToken?.displayNumber || '#16'}`}
              />
            </div>

            <div className="mt-4 px-4 py-1.5 rounded-full bg-[#2B2824] border border-[#3E3A33] text-sm sm:text-base font-semibold text-[#FAF6ED]">
              {nowServingToken?.serviceName || 'General Consultation & Triage'}
            </div>
          </div>

          {/* Huge Counter Callout Banner */}
          <div className="bg-[#2B2824] border border-[#3E3A33] rounded-xl p-4 sm:p-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-400 text-[#151412] flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#A8A196] uppercase tracking-wider">
                  ACTION DIRECTIVE
                </span>
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#FAF6ED]">
                  PROCEED TO {nowServingToken?.counterAssigned?.toUpperCase() || 'COUNTER 2'}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-amber-400 font-mono text-sm font-bold">
              <span>GATE OPEN</span>
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ZONE C: "NEXT IN QUEUE" & STATION OVERVIEW (Right 5 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">
          
          {/* Upper Board: IMMEDIATE NEXT PREPARATION */}
          <section 
            aria-label="Next Tokens in Queue"
            className="bg-[#201E1B] border-2 border-[#3A3631] rounded-2xl p-6 sm:p-7 flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[#36322C] pb-3 mb-4">
              <span className="text-sm font-mono font-bold tracking-widest text-amber-400 uppercase">
                UP NEXT &bull; PREPARE TO ENTER
              </span>
              <span className="text-xs font-mono text-[#A8A196]">
                Position 1–{upNextTokens.length}
              </span>
            </div>

            <div className="divide-y divide-[#36322C] flex flex-col">
              {upNextTokens.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#797267] w-4">
                      {idx + 1}
                    </span>
                    <WayfinderNumeral 
                      value={item.displayNumber}
                      size="md"
                      theme="display-cream"
                      className="font-bold text-2xl"
                    />
                    <span className="text-xs text-[#A8A196] truncate max-w-[140px] sm:max-w-[180px]">
                      {item.serviceName}
                    </span>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lower Board: ALL COUNTERS STATUS (Departure Station Matrix) */}
          <section 
            aria-label="All Service Station Counters"
            className="bg-[#201E1B] border-2 border-[#3A3631] rounded-2xl p-6 sm:p-7 flex flex-col shadow-xl flex-1"
          >
            <div className="flex items-center justify-between border-b border-[#36322C] pb-3 mb-4">
              <span className="text-sm font-mono font-bold tracking-widest text-[#FAF6ED] uppercase">
                STATION DIRECTORY
              </span>
              <span className="text-xs font-mono text-[#A8A196]">
                Active Counters
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {counters.map(counter => (
                <div 
                  key={counter.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    counter.isOpen 
                      ? 'bg-[#2B2824] border-[#3E3A33]' 
                      : 'bg-[#1A1816] border-[#292622] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[#FAF6ED]">
                      {counter.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${counter.isOpen ? 'bg-emerald-400' : 'bg-stone-600'}`} />
                  </div>

                  <div className="my-2">
                    <span className="text-[11px] font-mono text-[#A8A196] uppercase block">
                      SERVING
                    </span>
                    <span className="text-xl font-wayfinder font-extrabold text-amber-400">
                      {counter.isOpen ? (counter.activeTokenId ? `#${counter.activeTokenId.replace('t-', '')}` : '#16') : 'CLOSED'}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#A8A196] truncate">
                    {counter.isOpen ? counter.staffName : 'Station Offline'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ZONE D: BOTTOM TICKER STRIP (Warm High-Contrast)          */}
      {/* ========================================================= */}
      <footer className="bg-[#1E1C19] border-t border-[#36322C] px-6 py-3 flex items-center justify-between text-xs text-[#A8A196] font-mono shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-bold shrink-0">
            NOTICE
          </span>
          <span className="truncate text-[#E2DCD3]">
            Please hold your token receipt ready &bull; Audio chimes will repeat on token recall &bull; Wheelchair escort available at Gate A
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Volume2 className="w-3.5 h-3.5" />
            <span>PA SYSTEM ACTIVE</span>
          </span>
          <span>&bull;</span>
          <span>STATION ID: CENTRAL-01</span>
        </div>
      </footer>
    </main>
  );
};
