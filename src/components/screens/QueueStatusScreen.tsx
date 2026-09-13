import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle, 
  ArrowLeft,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { WayfinderNumeral } from '../common/WayfinderNumeral';
import { StatusBadge } from '../common/StatusBadge';
import { HairlineDivider } from '../common/HairlineDivider';

interface QueueStatusScreenProps {
  queueId?: string;
  onBackToJoin?: () => void;
}

export const QueueStatusScreen: React.FC<QueueStatusScreenProps> = ({
  queueId,
  onBackToJoin,
}) => {
  const { tokens, patientTokenId, getQueueStatsForToken, nowServingToken } = useQueue();
  
  // Use queueId or current patientTokenId
  const activeTokenId = queueId || patientTokenId || 't-19';
  const { token, peopleAhead, estimatedWaitMinutes, nowServing, counterAssigned } = getQueueStatsForToken(activeTokenId);

  // Fallback representation if token not found
  const displayTokenNumber = token ? token.displayNumber : '#19';
  const displayStatus = token ? token.status : 'waiting';
  const isNowServingMe = token?.status === 'now-serving';
  const isCompleted = token?.status === 'completed';

  const [hasNotifiedServing, setHasNotifiedServing] = useState(false);

  useEffect(() => {
    if (isNowServingMe && !hasNotifiedServing) {
      setHasNotifiedServing(true);
    }
  }, [isNowServingMe, hasNotifiedServing]);

  return (
    <main 
      id="patient-status-container"
      className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center px-4 py-4 sm:py-8 bg-[#F8F6F0] text-[#1E1C19]"
    >
      <div className="w-full max-w-md mx-auto flex flex-col">
        
        {/* Navigation & Header Info */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {onBackToJoin ? (
            <button
              onClick={onBackToJoin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58524A] hover:text-[#1E1C19] py-1 px-2 rounded hover:bg-[#EBE7DF] transition-colors"
              aria-label="Back to service selection"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>New Token</span>
            </button>
          ) : (
            <div className="text-xs font-mono font-bold tracking-wider text-[#797267] uppercase">
              SMARTQUEUE PASS
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-mono font-semibold text-[#58524A] uppercase">
              Live Sync
            </span>
          </div>
        </div>

        {/* Urgent Alert Banner if Patient's Token is Now Serving */}
        {isNowServingMe && (
          <div 
            role="alert" 
            aria-live="assertive"
            className="mb-4 p-3.5 sm:p-4 rounded-lg bg-[#1A3628] text-[#EAF6EE] border border-[#142B20] flex items-center gap-3 animate-bounce shadow-md"
          >
            <div className="w-9 h-9 rounded-full bg-amber-400 text-[#1E1C19] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-tight">
                IT'S YOUR TURN NOW!
              </div>
              <div className="text-xs text-[#C5E3D1]">
                Please proceed directly to <strong className="text-white underline">{counterAssigned}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Strict Visual Hierarchy: Single Column, Generous Vertical Rhythm */}
        <section 
          aria-label="Patient Queue Position"
          className="bg-[#F2EFE8] rounded-xl hairline-border p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 shadow-sm"
        >
          {/* 1. MY TOKEN — Largest element on page */}
          <div className="flex flex-col items-center text-center">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#58524A] uppercase mb-1">
              MY TOKEN
            </span>
            
            <div className="py-1">
              <WayfinderNumeral 
                value={displayTokenNumber.replace('#', '')} 
                prefix="#"
                size="giant"
                flashOnChange={true}
                className="text-[#1E1C19] text-7xl sm:text-8xl font-black"
                ariaLabel={`Your Token Number: ${displayTokenNumber}`}
              />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={displayStatus} size="md" />
              {token?.serviceName && (
                <span className="text-xs font-medium text-[#58524A]">
                  &bull; {token.serviceName}
                </span>
              )}
            </div>
          </div>

          <HairlineDivider />

          {/* 2. NOW SERVING — #16 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase">
                NOW SERVING
              </span>
              <span className="text-xs text-[#797267]">
                At active counters
              </span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <WayfinderNumeral 
                value={nowServing ? nowServing.displayNumber : '#16'} 
                size="lg"
                flashOnChange={true}
                className="text-[#1E1C19]"
                ariaLabel={`Now serving token ${nowServing?.displayNumber || '#16'}`}
              />
            </div>
          </div>

          <HairlineDivider />

          {/* 3. PEOPLE AHEAD — 3 PEOPLE AHEAD */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#E5DFD3] flex items-center justify-center text-[#58524A] shrink-0">
                <Users className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase">
                  PEOPLE AHEAD
                </span>
                <span className="text-xs text-[#797267]">
                  Waiting in queue
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold font-wayfinder text-[#1E1C19]">
                {peopleAhead}
              </span>
              <span className="text-xs font-medium text-[#58524A] ml-1">
                {peopleAhead === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>

          <HairlineDivider />

          {/* 4. ESTIMATED WAIT — 12 min */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#E5DFD3] flex items-center justify-center text-[#58524A] shrink-0">
                <Clock className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase">
                  ESTIMATED WAIT
                </span>
                <span className="text-xs text-[#797267]">
                  Approximate wait time
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold font-wayfinder text-[#1E1C19]">
                {estimatedWaitMinutes}
              </span>
              <span className="text-xs font-medium text-[#58524A] ml-1">
                min
              </span>
            </div>
          </div>

          <HairlineDivider />

          {/* 5. COUNTER — 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#E5DFD3] flex items-center justify-center text-[#58524A] shrink-0">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-wider text-[#58524A] uppercase">
                  COUNTER
                </span>
                <span className="text-xs text-[#797267]">
                  Assigned station
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl sm:text-2xl font-bold font-wayfinder text-[#1E1C19] bg-[#E5DFD3]/70 px-3 py-1 rounded">
                {counterAssigned.replace('Counter ', 'COUNTER ')}
              </span>
            </div>
          </div>
        </section>

        {/* Footer reassurance */}
        <p className="mt-4 text-center text-xs text-[#797267] font-mono leading-relaxed">
          Audio announcements will sound when called &bull; Screen updates automatically in real-time
        </p>
      </div>
    </main>
  );
};
