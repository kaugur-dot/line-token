import React, { useState } from 'react';
import { 
  Megaphone, 
  SkipForward, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  PauseCircle, 
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Activity,
  Users,
  Clock,
  Check,
  Power,
  Sliders,
  MoreHorizontal,
  X
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { WayfinderNumeral } from '../common/WayfinderNumeral';
import { StatusBadge } from '../common/StatusBadge';
import { HairlineDivider } from '../common/HairlineDivider';
import { QueueToken } from '../../types/queue';

export const AdminConsoleScreen: React.FC = () => {
  const {
    tokens,
    queues,
    counters,
    selectedQueueId,
    activeCounterId,
    nowServingToken,
    metrics,
    setSelectedQueueId,
    setActiveCounterId,
    toggleCounterStatus,
    callNextToken,
    skipCurrentToken,
    recallCurrentToken,
    completeCurrentToken,
    togglePriority,
    holdToken,
    transferToken,
  } = useQueue();

  const [mobileShowTier3, setMobileShowTier3] = useState(false);
  const [mobileShowMetrics, setMobileShowMetrics] = useState(false);
  const [transferModalToken, setTransferModalToken] = useState<QueueToken | null>(null);

  const activeCounter = counters.find(c => c.id === activeCounterId) || counters[0];
  const activeQueue = queues.find(q => q.id === selectedQueueId) || queues[0];

  // Waiting list in the current queue (waiting or priority)
  const currentQueueWaiting = tokens.filter(
    t => t.serviceId === selectedQueueId && (t.status === 'waiting' || t.status === 'priority' || t.status === 'held')
  ).sort((a, b) => {
    // Priority first, then waiting, then held
    if (a.status === 'priority' && b.status !== 'priority') return -1;
    if (a.status !== 'priority' && b.status === 'priority') return 1;
    if (a.status === 'held' && b.status !== 'held') return 1;
    if (a.status !== 'held' && b.status === 'held') return -1;
    return a.joinedAt - b.joinedAt;
  });

  const allQueueHistory = tokens.filter(
    t => t.serviceId === selectedQueueId && (t.status === 'completed' || t.status === 'skipped')
  );

  return (
    <main 
      id="admin-console-container"
      className="min-h-[calc(100vh-3.5rem)] bg-[#F8F6F0] text-[#1E1C19] flex flex-col"
    >
      {/* Top Console Status Bar */}
      <div className="bg-[#F2EFE8] hairline-b px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold tracking-wider text-[#58524A] uppercase">
            OPERATIONS CONSOLE &bull; {activeCounter.name}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#E5DFD3] text-[#58524A] font-medium">
            Staff: {activeCounter.staffName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Metrics Collapsible Toggle */}
          <button
            onClick={() => setMobileShowMetrics(!mobileShowMetrics)}
            className="lg:hidden flex items-center gap-1.5 px-2 py-1 rounded hairline-border bg-[#FAF9F5] text-xs font-semibold text-[#58524A]"
            aria-expanded={mobileShowMetrics}
            aria-label="Toggle glanceable queue metrics"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Metrics</span>
            {mobileShowMetrics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#58524A]">
            <span className="w-2 h-2 rounded-full bg-emerald-600" aria-hidden="true" />
            LIVE STATION
          </span>
        </div>
      </div>

      {/* Mobile Collapsible Metrics Drawer */}
      {mobileShowMetrics && (
        <div className="lg:hidden bg-[#F2EFE8] hairline-b p-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-[#FAF9F5] hairline-border rounded">
            <span className="text-[11px] font-mono text-[#797267] uppercase block">Avg Wait</span>
            <span className="text-lg font-bold font-wayfinder text-[#1E1C19]">{metrics.averageWaitTimeMin} min</span>
          </div>
          <div className="p-2.5 bg-[#FAF9F5] hairline-border rounded">
            <span className="text-[11px] font-mono text-[#797267] uppercase block">Served Today</span>
            <span className="text-lg font-bold font-wayfinder text-[#1E1C19]">{metrics.totalServedToday}</span>
          </div>
          <div className="p-2.5 bg-[#FAF9F5] hairline-border rounded">
            <span className="text-[11px] font-mono text-[#797267] uppercase block">Longest Wait</span>
            <span className="text-lg font-bold font-wayfinder text-[#1E1C19]">{metrics.longestCurrentWaitMin} min</span>
          </div>
          <div className="p-2.5 bg-[#FAF9F5] hairline-border rounded">
            <span className="text-[11px] font-mono text-[#797267] uppercase block">Completion Rate</span>
            <span className="text-lg font-bold font-wayfinder text-[#1E1C19]">{metrics.completionRatePercent}%</span>
          </div>
        </div>
      )}

      {/* Three-Zone Layout for Desktop, Adaptive for Mobile */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
        
        {/* ========================================================= */}
        {/* ZONE 1: LEFT RAIL (persistent, low-noise)                  */}
        {/* ========================================================= */}
        <aside 
          aria-label="Queue & Counter Controls"
          className="lg:col-span-3 bg-[#F2EFE8] hairline-b lg:hairline-b-0 lg:hairline-r p-4 sm:p-5 flex flex-col gap-6"
        >
          {/* Queue Selector List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase">
                ACTIVE QUEUE
              </span>
              <span className="text-[11px] font-mono text-[#797267]">
                {queues.length} Departments
              </span>
            </div>

            <nav aria-label="Department Queues" className="flex flex-col gap-1">
              {queues.map(queue => {
                const isSelected = selectedQueueId === queue.id;
                const waitingCount = tokens.filter(
                  t => t.serviceId === queue.id && (t.status === 'waiting' || t.status === 'priority')
                ).length;

                return (
                  <button
                    key={queue.id}
                    id={`queue-select-${queue.id}`}
                    onClick={() => setSelectedQueueId(queue.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition-colors ${
                      isSelected
                        ? 'bg-[var(--fill-ghost-selected)] font-bold text-[#1E1C19] hairline-border'
                        : 'text-[#58524A] hover:bg-[#EBE7DF] hover:text-[#1E1C19]'
                    }`}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#DDD6C8]/60 text-[#1E1C19] shrink-0 font-bold">
                        {queue.code}
                      </span>
                      <span className="text-xs truncate">{queue.name}</span>
                    </div>

                    <span 
                      className={`text-xs font-wayfinder font-semibold px-2 py-0.5 rounded ${
                        waitingCount > 0 ? 'bg-[#DDD6C8] text-[#1E1C19]' : 'text-[#797267]'
                      }`}
                    >
                      {waitingCount} waiting
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <HairlineDivider />

          {/* Counter Status (Open/Closed) - Status Row with Icon + Text, NOT a badge-heavy card */}
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase block mb-2">
              STATION STATUS
            </span>

            <div className="flex flex-col gap-2">
              {counters.map(counter => {
                const isThisCounter = counter.id === activeCounterId;

                return (
                  <div
                    key={counter.id}
                    className={`flex items-center justify-between p-2.5 rounded transition-colors ${
                      isThisCounter ? 'bg-[#E7E2D7] hairline-border' : 'hover:bg-[#EBE7DF]'
                    }`}
                  >
                    <button
                      onClick={() => setActiveCounterId(counter.id)}
                      className="flex items-center gap-2 text-left min-w-0 flex-1"
                      aria-label={`Select ${counter.name}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${counter.isOpen ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#1E1C19]">
                          {counter.name} {isThisCounter && '(Active)'}
                        </span>
                        <span className="text-[11px] text-[#58524A] truncate">
                          {counter.staffName}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => toggleCounterStatus(counter.id)}
                      className={`px-2 py-1 text-[11px] font-mono font-semibold rounded hairline-border transition-colors ${
                        counter.isOpen
                          ? 'bg-[#EAF4ED] text-[#1B502A] border-[#BCD9C2] hover:bg-[#DDF0E2]'
                          : 'bg-[#FBEDE9] text-[#8F271E] border-[#E9BDB6] hover:bg-[#F8E1DC]'
                      }`}
                      aria-label={`Toggle status for ${counter.name}. Currently ${counter.isOpen ? 'OPEN' : 'CLOSED'}`}
                    >
                      {counter.isOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* ZONE 2: CENTER — TIERED ACTION ZONE & WAITING QUEUE LIST   */}
        {/* ========================================================= */}
        <section 
          aria-label="Action Zone and Waiting Queue"
          className="lg:col-span-6 p-4 sm:p-6 flex flex-col gap-5 overflow-y-auto"
        >
          {/* TIERED ACTION ZONE */}
          <div className="flex flex-col gap-4">
            
            {/* TIER 1 (Primary): Call Next with Full Visual Dominance */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[#F2EFE8] hairline-border p-4 sm:p-5 rounded-xl">
              
              {/* Current Token Display beside Call Next */}
              <div className="flex-1 flex flex-col justify-center sm:hairline-r sm:pr-4">
                <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase mb-0.5">
                  CURRENTLY AT STATION
                </span>
                <div className="flex items-baseline gap-3">
                  <WayfinderNumeral 
                    value={nowServingToken ? nowServingToken.displayNumber : '— —'}
                    size="lg"
                    flashOnChange={true}
                    className="text-[#1E1C19]"
                    ariaLabel={nowServingToken ? `Now Serving ${nowServingToken.displayNumber}` : 'No active token'}
                  />
                  {nowServingToken && (
                    <StatusBadge status={nowServingToken.status} size="sm" />
                  )}
                </div>
                <span className="text-xs text-[#58524A] mt-0.5">
                  {nowServingToken ? nowServingToken.serviceName : 'Counter ready for next patient'}
                </span>
              </div>

              {/* Tier 1 Primary Action: Call Next (Full visual dominance, filled background) */}
              <div className="sm:w-56 shrink-0">
                <button
                  id="btn-call-next"
                  onClick={callNextToken}
                  disabled={currentQueueWaiting.length === 0}
                  className="w-full h-14 sm:h-16 flex items-center justify-center gap-2 px-6 rounded-lg bg-[#1E1C19] hover:bg-[#33302B] disabled:bg-[#DDD6C8] disabled:text-[#797267] text-[#F8F6F0] font-extrabold text-base sm:text-lg tracking-wide transition-all shadow-md active:scale-[0.98] select-none"
                  aria-label="Call next waiting patient token"
                >
                  <Megaphone className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>CALL NEXT</span>
                </button>
                <div className="text-[11px] font-mono text-center text-[#797267] mt-1.5">
                  {currentQueueWaiting.length} in queue
                </div>
              </div>
            </div>

            {/* TIER 2 (Routine Per-Token Actions): Skip, Recall, Complete */}
            {/* Equal-weight buttons, grouped tightly together immediately below Call Next */}
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-action-skip"
                onClick={skipCurrentToken}
                disabled={!nowServingToken}
                className="h-11 sm:h-12 flex items-center justify-center gap-1.5 px-3 rounded-lg bg-[#FAF9F5] hover:bg-[#EBE7DF] disabled:opacity-50 text-[#1E1C19] font-bold text-xs sm:text-sm hairline-border transition-colors active:scale-[0.98]"
                aria-label="Skip current token"
              >
                <SkipForward className="w-4 h-4 text-[#8F271E]" aria-hidden="true" />
                <span>Skip</span>
              </button>

              <button
                id="btn-action-recall"
                onClick={recallCurrentToken}
                disabled={!nowServingToken}
                className="h-11 sm:h-12 flex items-center justify-center gap-1.5 px-3 rounded-lg bg-[#FAF9F5] hover:bg-[#EBE7DF] disabled:opacity-50 text-[#1E1C19] font-bold text-xs sm:text-sm hairline-border transition-colors active:scale-[0.98]"
                aria-label="Recall current token with audio chime"
              >
                <RotateCcw className="w-4 h-4 text-[#1E1C19]" aria-hidden="true" />
                <span>Recall</span>
              </button>

              <button
                id="btn-action-complete"
                onClick={completeCurrentToken}
                disabled={!nowServingToken}
                className="h-11 sm:h-12 flex items-center justify-center gap-1.5 px-3 rounded-lg bg-[#FAF9F5] hover:bg-[#EBE7DF] disabled:opacity-50 text-[#1E1C19] font-bold text-xs sm:text-sm hairline-border transition-colors active:scale-[0.98]"
                aria-label="Mark current token complete"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1B502A]" aria-hidden="true" />
                <span>Complete</span>
              </button>
            </div>

            {/* Hairline Divider separating Tier 2 from Tier 3 (NOT a new card!) */}
            <HairlineDivider />

            {/* TIER 3 (Exception Actions): Priority, Hold, Transfer */}
            {/* Desktop: lighter visual weight ghost style; Mobile: collapsible behind "more" */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-2">
              <button
                id="btn-action-priority"
                onClick={() => nowServingToken && togglePriority(nowServingToken.id)}
                disabled={!nowServingToken}
                className="h-10 flex items-center justify-center gap-1.5 px-2.5 rounded text-xs font-semibold text-[#58524A] hover:text-[#1E1C19] hover:bg-[#EBE7DF] disabled:opacity-40 transition-colors"
                aria-label="Flag as priority urgent"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                <span>Flag Priority</span>
              </button>

              <button
                id="btn-action-hold"
                onClick={() => nowServingToken && holdToken(nowServingToken.id)}
                disabled={!nowServingToken}
                className="h-10 flex items-center justify-center gap-1.5 px-2.5 rounded text-xs font-semibold text-[#58524A] hover:text-[#1E1C19] hover:bg-[#EBE7DF] disabled:opacity-40 transition-colors"
                aria-label="Put active token on hold"
              >
                <PauseCircle className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                <span>Hold Token</span>
              </button>

              <button
                id="btn-action-transfer"
                onClick={() => nowServingToken && setTransferModalToken(nowServingToken)}
                disabled={!nowServingToken}
                className="h-10 flex items-center justify-center gap-1.5 px-2.5 rounded text-xs font-semibold text-[#58524A] hover:text-[#1E1C19] hover:bg-[#EBE7DF] disabled:opacity-40 transition-colors"
                aria-label="Transfer token to different queue"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Transfer Queue</span>
              </button>
            </div>

            {/* Mobile Tier 3 Overflow Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileShowTier3(!mobileShowTier3)}
                className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-[#58524A] hover:text-[#1E1C19] bg-[#F2EFE8] rounded hairline-border"
                aria-expanded={mobileShowTier3}
              >
                <span className="flex items-center gap-1.5">
                  <MoreHorizontal className="w-4 h-4" />
                  <span>Exception Actions (Priority, Hold, Transfer)</span>
                </span>
                {mobileShowTier3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {mobileShowTier3 && (
                <div className="mt-2 grid grid-cols-3 gap-1.5 p-2 bg-[#F2EFE8] rounded hairline-border text-xs">
                  <button
                    onClick={() => nowServingToken && togglePriority(nowServingToken.id)}
                    disabled={!nowServingToken}
                    className="p-2 flex flex-col items-center gap-1 rounded bg-[#FAF9F5] text-[11px] font-bold"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Priority</span>
                  </button>
                  <button
                    onClick={() => nowServingToken && holdToken(nowServingToken.id)}
                    disabled={!nowServingToken}
                    className="p-2 flex flex-col items-center gap-1 rounded bg-[#FAF9F5] text-[11px] font-bold"
                  >
                    <PauseCircle className="w-4 h-4 text-amber-800" />
                    <span>Hold</span>
                  </button>
                  <button
                    onClick={() => nowServingToken && setTransferModalToken(nowServingToken)}
                    disabled={!nowServingToken}
                    className="p-2 flex flex-col items-center gap-1 rounded bg-[#FAF9F5] text-[11px] font-bold"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Transfer</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <HairlineDivider />

          {/* WAITING QUEUE AS A BORDERED LIST (NOT individual cards per row!) */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase">
                  WAITING QUEUE &bull; {activeQueue.name}
                </span>
                <span className="text-xs font-wayfinder font-semibold text-[#1E1C19]">
                  ({currentQueueWaiting.length})
                </span>
              </div>

              <span className="text-[11px] font-mono text-[#797267]">
                Ordered by Priority & Arrival
              </span>
            </div>

            {/* The Bordered List Container */}
            <div 
              role="list"
              aria-label="Queue tokens waiting for service"
              className="bg-[#FAF9F5] hairline-border rounded-lg divide-y divide-[#DDD6C8] overflow-hidden"
            >
              {currentQueueWaiting.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#797267] font-mono">
                  No patients currently waiting in {activeQueue.name}.
                </div>
              ) : (
                currentQueueWaiting.map((item, idx) => (
                  <div
                    key={item.id}
                    role="listitem"
                    className="p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-[#F2EFE8] transition-colors"
                  >
                    {/* Token Numeral & Order */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-[#797267] w-5 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <span className="font-wayfinder font-bold text-base sm:text-lg text-[#1E1C19] shrink-0">
                        {item.displayNumber}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-[#1E1C19] truncate">
                          {item.serviceName}
                        </span>
                        <span className="text-[11px] text-[#797267] font-mono">
                          Wait: {Math.max(1, Math.round((Date.now() - item.joinedAt) / 60000))}m
                        </span>
                      </div>
                    </div>

                    {/* Status & Quick Row Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={item.status} size="sm" />

                      {/* Quick Priority Toggle */}
                      <button
                        onClick={() => togglePriority(item.id)}
                        className={`p-1 rounded text-xs hover:bg-[#DDD6C8] transition-colors ${
                          item.priority ? 'text-rose-700' : 'text-[#797267]'
                        }`}
                        title={item.priority ? 'Remove priority' : 'Mark priority'}
                        aria-label={`Toggle priority for ${item.displayNumber}`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Transfer */}
                      <button
                        onClick={() => setTransferModalToken(item)}
                        className="p-1 rounded text-xs text-[#797267] hover:text-[#1E1C19] hover:bg-[#DDD6C8] transition-colors"
                        title="Transfer token"
                        aria-label={`Transfer ${item.displayNumber}`}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ZONE 3: RIGHT RAIL — GLANCEABLE METRICS ONLY               */}
        {/* (Plain stat blocks, NO interactive controls or buttons)   */}
        {/* ========================================================= */}
        <aside 
          aria-label="Queue Glanceable Metrics"
          className="hidden lg:flex lg:col-span-3 bg-[#F2EFE8] hairline-l p-5 flex-col gap-5"
        >
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase block mb-1">
              STATION PERFORMANCE
            </span>
            <p className="text-[11px] text-[#797267]">
              Real-time velocity & throughput metrics
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Plain Stat Block 1: Average Wait */}
            <div className="p-3.5 bg-[#FAF9F5] hairline-border rounded-lg">
              <span className="text-xs font-mono font-semibold text-[#797267] uppercase block">
                AVERAGE WAIT TIME
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-wayfinder text-[#1E1C19]">
                  {metrics.averageWaitTimeMin}
                </span>
                <span className="text-xs font-semibold text-[#58524A]">min</span>
              </div>
              <span className="text-[11px] text-[#797267] mt-0.5 block">
                Target: &lt; 15 min per patient
              </span>
            </div>

            {/* Plain Stat Block 2: Served Today Count */}
            <div className="p-3.5 bg-[#FAF9F5] hairline-border rounded-lg">
              <span className="text-xs font-mono font-semibold text-[#797267] uppercase block">
                TOTAL SERVED TODAY
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-wayfinder text-[#1E1C19]">
                  {metrics.totalServedToday}
                </span>
                <span className="text-xs font-semibold text-[#58524A]">patients</span>
              </div>
              <span className="text-[11px] text-[#797267] mt-0.5 block">
                Across all active stations
              </span>
            </div>

            {/* Plain Stat Block 3: Longest Waiting */}
            <div className="p-3.5 bg-[#FAF9F5] hairline-border rounded-lg">
              <span className="text-xs font-mono font-semibold text-[#797267] uppercase block">
                LONGEST CURRENT WAIT
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-wayfinder text-[#1E1C19]">
                  {metrics.longestCurrentWaitMin}
                </span>
                <span className="text-xs font-semibold text-[#58524A]">min</span>
              </div>
              <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">
                Routine triage range
              </span>
            </div>

            {/* Plain Stat Block 4: Service Completion Rate */}
            <div className="p-3.5 bg-[#FAF9F5] hairline-border rounded-lg">
              <span className="text-xs font-mono font-semibold text-[#797267] uppercase block">
                COMPLETION RATE
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-wayfinder text-[#1E1C19]">
                  {metrics.completionRatePercent}%
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 font-medium mt-0.5 block">
                Skipped rate &lt; 6%
              </span>
            </div>
          </div>

          <div className="mt-auto p-3 bg-[#E7E2D7] rounded hairline-border text-[11px] font-mono text-[#58524A]">
            Wayfinder Transit OS &bull; Synchronized via Broadcast Engine
          </div>
        </aside>
      </div>

      {/* Transfer Queue Modal */}
      {transferModalToken && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-modal-title"
        >
          <div className="bg-[#F8F6F0] w-full max-w-sm rounded-xl hairline-border p-5 shadow-xl text-[#1E1C19]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 id="transfer-modal-title" className="font-bold text-sm">
                  Transfer Token {transferModalToken.displayNumber}
                </h3>
                <p className="text-xs text-[#58524A]">
                  Select target department queue
                </p>
              </div>
              <button
                onClick={() => setTransferModalToken(null)}
                className="p-1 text-[#58524A] hover:text-[#1E1C19]"
                aria-label="Close transfer dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {queues
                .filter(q => q.id !== transferModalToken.serviceId)
                .map(q => (
                  <button
                    key={q.id}
                    onClick={() => {
                      transferToken(transferModalToken.id, q.id);
                      setTransferModalToken(null);
                    }}
                    className="p-3 text-left bg-[#F2EFE8] hover:bg-[#E7E2D7] rounded hairline-border text-xs font-semibold flex items-center justify-between"
                  >
                    <span>{q.name}</span>
                    <span className="font-mono text-[#797267]">{q.code}</span>
                  </button>
                ))}
            </div>

            <button
              onClick={() => setTransferModalToken(null)}
              className="w-full py-2 bg-[#E5DFD3] hover:bg-[#DDD6C8] text-xs font-semibold rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
