import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  QueueToken, 
  ServiceOption, 
  CounterInfo, 
  QueueDepartment, 
  SystemMetrics,
  TokenStatus
} from '../types/queue';

export const INITIAL_SERVICES: ServiceOption[] = [
  {
    id: 'consultation',
    code: 'GP',
    name: 'General Consultation',
    description: 'Routine physician assessment, triage & follow-up care',
    counterId: 'c-1',
    estimatedWaitPerPerson: 4,
  },
  {
    id: 'pharmacy',
    code: 'RX',
    name: 'Prescription & Pharmacy',
    description: 'Medication collection, dosage consultation & refills',
    counterId: 'c-2',
    estimatedWaitPerPerson: 3,
  },
  {
    id: 'laboratory',
    code: 'LAB',
    name: 'Laboratory & Diagnostics',
    description: 'Blood chemistry, cultures, vitals & imaging tests',
    counterId: 'c-3',
    estimatedWaitPerPerson: 5,
  },
  {
    id: 'specialist',
    code: 'SP',
    name: 'Specialist Referral',
    description: 'Cardiology, oncology, neurology & orthopedic clinics',
    counterId: 'c-4',
    estimatedWaitPerPerson: 6,
  },
];

export const INITIAL_QUEUES: QueueDepartment[] = [
  {
    id: 'consultation',
    name: 'General Practice',
    code: 'GP',
    prefix: 'A',
    openCountersCount: 2,
    activeCounterName: 'Counter 1 & 2',
    avgWaitMinutes: 12,
    totalWaiting: 4,
    totalServedToday: 42,
  },
  {
    id: 'pharmacy',
    name: 'Prescription & Pharmacy',
    code: 'RX',
    prefix: 'B',
    openCountersCount: 1,
    activeCounterName: 'Counter 2',
    avgWaitMinutes: 8,
    totalWaiting: 2,
    totalServedToday: 68,
  },
  {
    id: 'laboratory',
    name: 'Diagnostic Laboratory',
    code: 'LAB',
    prefix: 'C',
    openCountersCount: 1,
    activeCounterName: 'Counter 3',
    avgWaitMinutes: 15,
    totalWaiting: 3,
    totalServedToday: 29,
  },
  {
    id: 'specialist',
    name: 'Specialist Referrals',
    code: 'SP',
    prefix: 'D',
    openCountersCount: 1,
    activeCounterName: 'Counter 4',
    avgWaitMinutes: 20,
    totalWaiting: 1,
    totalServedToday: 18,
  },
];

export const INITIAL_COUNTERS: CounterInfo[] = [
  { id: 'c-1', name: 'Counter 1', staffName: 'Dr. Evans', isOpen: true, currentQueueId: 'consultation', activeTokenId: 't-16' },
  { id: 'c-2', name: 'Counter 2', staffName: 'Pharm. Lin', isOpen: true, currentQueueId: 'consultation', activeTokenId: 't-16' },
  { id: 'c-3', name: 'Counter 3', staffName: 'Tech. Marcus', isOpen: true, currentQueueId: 'laboratory', activeTokenId: 't-12' },
  { id: 'c-4', name: 'Counter 4', staffName: 'Dr. Sarah K.', isOpen: false, currentQueueId: 'specialist' },
];

const INITIAL_TOKENS: QueueToken[] = [
  {
    id: 't-16',
    displayNumber: '#16',
    numericalValue: 16,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'now-serving',
    joinedAt: Date.now() - 18 * 60000,
    calledAt: Date.now() - 2 * 60000,
    counterAssigned: 'Counter 2',
  },
  {
    id: 't-17',
    displayNumber: '#17',
    numericalValue: 17,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'waiting',
    joinedAt: Date.now() - 14 * 60000,
  },
  {
    id: 't-18',
    displayNumber: '#18',
    numericalValue: 18,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'priority',
    priority: true,
    joinedAt: Date.now() - 11 * 60000,
  },
  {
    id: 't-19',
    displayNumber: '#19',
    numericalValue: 19,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'waiting',
    joinedAt: Date.now() - 8 * 60000,
  },
  {
    id: 't-20',
    displayNumber: '#20',
    numericalValue: 20,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'waiting',
    joinedAt: Date.now() - 4 * 60000,
  },
  {
    id: 't-15',
    displayNumber: '#15',
    numericalValue: 15,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'completed',
    joinedAt: Date.now() - 32 * 60000,
    calledAt: Date.now() - 16 * 60000,
    completedAt: Date.now() - 2 * 60000,
    counterAssigned: 'Counter 2',
  },
  {
    id: 't-14',
    displayNumber: '#14',
    numericalValue: 14,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'held',
    joinedAt: Date.now() - 38 * 60000,
    notes: 'Awaiting lab blood panel verification',
  },
  {
    id: 't-13',
    displayNumber: '#13',
    numericalValue: 13,
    serviceId: 'consultation',
    serviceName: 'General Consultation',
    serviceCode: 'GP',
    status: 'skipped',
    joinedAt: Date.now() - 45 * 60000,
    notes: 'No response after 3 audio announcements',
  },
];

interface QueueContextType {
  tokens: QueueToken[];
  queues: QueueDepartment[];
  counters: CounterInfo[];
  selectedQueueId: string;
  activeCounterId: string;
  nowServingToken: QueueToken | null;
  patientTokenId: string;
  soundAlertsEnabled: boolean;
  metrics: SystemMetrics;
  
  // Actions
  setSelectedQueueId: (queueId: string) => void;
  setActiveCounterId: (counterId: string) => void;
  setPatientTokenId: (tokenId: string) => void;
  toggleCounterStatus: (counterId: string) => void;
  toggleSoundAlerts: () => void;
  
  // Queue Operations
  generateToken: (serviceId: string) => QueueToken;
  callNextToken: () => void;
  skipCurrentToken: () => void;
  recallCurrentToken: () => void;
  completeCurrentToken: () => void;
  togglePriority: (tokenId: string) => void;
  holdToken: (tokenId: string) => void;
  transferToken: (tokenId: string, targetQueueId: string) => void;
  resetQueueDemo: () => void;
  
  // Helpers
  getQueueStatsForToken: (tokenId: string) => {
    token: QueueToken | null;
    peopleAhead: number;
    estimatedWaitMinutes: number;
    nowServing: QueueToken | null;
    counterAssigned: string;
  };
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const STORAGE_KEY = 'smartqueue_state_v2';

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const [tokens, setTokens] = useState<QueueToken[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.tokens)) return parsed.tokens;
      }
    } catch {
      // ignore
    }
    return INITIAL_TOKENS;
  });

  const [queues, setQueues] = useState<QueueDepartment[]>(INITIAL_QUEUES);
  const [counters, setCounters] = useState<CounterInfo[]>(INITIAL_COUNTERS);
  const [selectedQueueId, setSelectedQueueId] = useState<string>('consultation');
  const [activeCounterId, setActiveCounterId] = useState<string>('c-2');
  const [patientTokenId, setPatientTokenId] = useState<string>('t-19');
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(true);

  // Broadcast channel for multi-tab sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tokens }));
    } catch {
      // storage unavailable
    }
  }, [tokens]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed.tokens)) {
            setTokens(parsed.tokens);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Now serving token for active counter / selected queue
  const nowServingToken = useMemo(() => {
    const activeCounter = counters.find(c => c.id === activeCounterId);
    if (activeCounter && activeCounter.activeTokenId) {
      const tok = tokens.find(t => t.id === activeCounter.activeTokenId);
      if (tok && tok.status === 'now-serving') return tok;
    }
    return tokens.find(t => t.status === 'now-serving' && t.serviceId === selectedQueueId) ||
           tokens.find(t => t.status === 'now-serving') || null;
  }, [counters, activeCounterId, tokens, selectedQueueId]);

  const activeCounter = counters.find(c => c.id === activeCounterId);

  // Sound chime helper
  const playChime = useCallback(() => {
    if (!soundAlertsEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio not permitted or failed
    }
  }, [soundAlertsEnabled]);

  // Generate new token
  const generateToken = useCallback((serviceId: string): QueueToken => {
    const service = INITIAL_SERVICES.find(s => s.id === serviceId) || INITIAL_SERVICES[0];
    const highestNum = tokens.reduce((max, t) => Math.max(max, t.numericalValue), 19);
    const newNum = highestNum + 1;
    const newToken: QueueToken = {
      id: `t-${newNum}`,
      displayNumber: `#${newNum}`,
      numericalValue: newNum,
      serviceId: service.id,
      serviceName: service.name,
      serviceCode: service.code,
      status: 'waiting',
      joinedAt: Date.now(),
    };

    setTokens(prev => [...prev, newToken]);
    setPatientTokenId(newToken.id);
    return newToken;
  }, [tokens]);

  // Call Next Token
  const callNextToken = useCallback(() => {
    setTokens(prev => {
      // Complete currently serving token if there is one on this counter
      const currentServing = prev.find(t => t.id === activeCounter?.activeTokenId && t.status === 'now-serving');
      
      // Find candidate next token in selected queue:
      // Priority tokens come first, then oldest waiting
      const queueWaiting = prev.filter(t => t.serviceId === selectedQueueId && (t.status === 'waiting' || t.status === 'priority'));
      
      // Sort priority first, then joinedAt
      const sortedWaiting = [...queueWaiting].sort((a, b) => {
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        return a.joinedAt - b.joinedAt;
      });

      const nextToServe = sortedWaiting[0];
      if (!nextToServe) return prev;

      playChime();

      return prev.map(t => {
        if (currentServing && t.id === currentServing.id) {
          return {
            ...t,
            status: 'completed',
            completedAt: Date.now(),
          };
        }
        if (t.id === nextToServe.id) {
          return {
            ...t,
            status: 'now-serving',
            calledAt: Date.now(),
            counterAssigned: activeCounter?.name || 'Counter 2',
          };
        }
        return t;
      });
    });

    // Update activeCounter's activeTokenId
    setCounters(prev => prev.map(c => {
      if (c.id === activeCounterId) {
        // Find next token id
        const nextTok = tokens.find(t => t.serviceId === selectedQueueId && (t.status === 'waiting' || t.status === 'priority'));
        return { ...c, activeTokenId: nextTok?.id };
      }
      return c;
    }));
  }, [activeCounter, activeCounterId, selectedQueueId, playChime, tokens]);

  // Skip current token
  const skipCurrentToken = useCallback(() => {
    if (!nowServingToken) return;
    setTokens(prev => prev.map(t => {
      if (t.id === nowServingToken.id) {
        return { ...t, status: 'skipped', notes: 'Skipped by counter operator' };
      }
      return t;
    }));
  }, [nowServingToken]);

  // Recall current token (triggers chime and flash)
  const recallCurrentToken = useCallback(() => {
    if (!nowServingToken) return;
    playChime();
    setTokens(prev => prev.map(t => {
      if (t.id === nowServingToken.id) {
        return { ...t, calledAt: Date.now() };
      }
      return t;
    }));
  }, [nowServingToken, playChime]);

  // Complete current token
  const completeCurrentToken = useCallback(() => {
    if (!nowServingToken) return;
    setTokens(prev => prev.map(t => {
      if (t.id === nowServingToken.id) {
        return { ...t, status: 'completed', completedAt: Date.now() };
      }
      return t;
    }));
  }, [nowServingToken]);

  // Toggle Priority
  const togglePriority = useCallback((tokenId: string) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        const isCurrentlyPriority = t.status === 'priority' || t.priority;
        return {
          ...t,
          priority: !isCurrentlyPriority,
          status: !isCurrentlyPriority ? 'priority' : 'waiting',
        };
      }
      return t;
    }));
  }, []);

  // Hold token
  const holdToken = useCallback((tokenId: string) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        const isHeld = t.status === 'held';
        return {
          ...t,
          status: isHeld ? 'waiting' : 'held',
          notes: isHeld ? undefined : 'Placed on administrative hold',
        };
      }
      return t;
    }));
  }, []);

  // Transfer token
  const transferToken = useCallback((tokenId: string, targetQueueId: string) => {
    const targetService = INITIAL_SERVICES.find(s => s.id === targetQueueId) || INITIAL_SERVICES[0];
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          serviceId: targetService.id,
          serviceName: targetService.name,
          serviceCode: targetService.code,
          status: 'waiting',
          notes: `Transferred to ${targetService.name}`,
        };
      }
      return t;
    }));
  }, []);

  // Toggle Counter Open/Closed
  const toggleCounterStatus = useCallback((counterId: string) => {
    setCounters(prev => prev.map(c => {
      if (c.id === counterId) {
        return { ...c, isOpen: !c.isOpen };
      }
      return c;
    }));
  }, []);

  // Toggle sound
  const toggleSoundAlerts = useCallback(() => {
    setSoundAlertsEnabled(prev => !prev);
  }, []);

  // Reset to initial demo state
  const resetQueueDemo = useCallback(() => {
    setTokens(INITIAL_TOKENS);
    setCounters(INITIAL_COUNTERS);
    setQueues(INITIAL_QUEUES);
    setPatientTokenId('t-19');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Calculate stats for a patient token
  const getQueueStatsForToken = useCallback((tokenId: string) => {
    const token = tokens.find(t => t.id === tokenId) || null;
    if (!token) {
      return {
        token: null,
        peopleAhead: 0,
        estimatedWaitMinutes: 0,
        nowServing: nowServingToken,
        counterAssigned: 'Counter 2',
      };
    }

    const currentServing = tokens.find(t => t.status === 'now-serving' && t.serviceId === token.serviceId) || nowServingToken;

    // Tokens in same queue ahead of this token
    const waitingSameQueue = tokens.filter(
      t => t.serviceId === token.serviceId && (t.status === 'waiting' || t.status === 'priority')
    );

    // Sort priority first, then joinedAt
    const sorted = [...waitingSameQueue].sort((a, b) => {
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      return a.joinedAt - b.joinedAt;
    });

    const index = sorted.findIndex(t => t.id === token.id);
    const peopleAhead = index >= 0 ? index : 0;
    
    // Calculate wait: ~3-4 min per person ahead
    const waitPerPerson = INITIAL_SERVICES.find(s => s.id === token.serviceId)?.estimatedWaitPerPerson || 4;
    const estimatedWaitMinutes = Math.max(1, (peopleAhead + 1) * waitPerPerson);

    return {
      token,
      peopleAhead,
      estimatedWaitMinutes,
      nowServing: currentServing,
      counterAssigned: currentServing?.counterAssigned || 'Counter 2',
    };
  }, [tokens, nowServingToken]);

  // Overall system metrics
  const metrics: SystemMetrics = useMemo(() => {
    const completed = tokens.filter(t => t.status === 'completed').length;
    const waiting = tokens.filter(t => t.status === 'waiting' || t.status === 'priority').length;
    return {
      averageWaitTimeMin: 12,
      longestCurrentWaitMin: 19,
      totalServedToday: 139 + completed,
      completionRatePercent: 94.2,
      currentThroughputPerHour: 18,
    };
  }, [tokens]);

  return (
    <QueueContext.Provider
      value={{
        tokens,
        queues,
        counters,
        selectedQueueId,
        activeCounterId,
        nowServingToken,
        patientTokenId,
        soundAlertsEnabled,
        metrics,
        setSelectedQueueId,
        setActiveCounterId,
        setPatientTokenId,
        toggleCounterStatus,
        toggleSoundAlerts,
        generateToken,
        callNextToken,
        skipCurrentToken,
        recallCurrentToken,
        completeCurrentToken,
        togglePriority,
        holdToken,
        transferToken,
        resetQueueDemo,
        getQueueStatsForToken,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
