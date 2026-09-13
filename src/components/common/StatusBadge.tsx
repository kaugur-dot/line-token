import React from 'react';
import { 
  Clock, 
  Radio, 
  PauseCircle, 
  SkipForward, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { TokenStatus } from '../../types/queue';

interface StatusBadgeProps {
  status: TokenStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const config = {
    waiting: {
      label: 'WAITING',
      icon: Clock,
      bg: 'bg-[#EBE7DF]',
      text: 'text-[#3D3831]',
      border: 'border-[#CCC4B5]',
    },
    'now-serving': {
      label: 'NOW SERVING',
      icon: Radio,
      bg: 'bg-[#1A3628]',
      text: 'text-[#EAF6EE]',
      border: 'border-[#142B20]',
    },
    held: {
      label: 'ON HOLD',
      icon: PauseCircle,
      bg: 'bg-[#FBF0DB]',
      text: 'text-[#7A4B0A]',
      border: 'border-[#E8CF9E]',
    },
    skipped: {
      label: 'SKIPPED',
      icon: SkipForward,
      bg: 'bg-[#FBEDE9]',
      text: 'text-[#8F271E]',
      border: 'border-[#E9BDB6]',
    },
    completed: {
      label: 'SERVED',
      icon: CheckCircle2,
      bg: 'bg-[#EAF4ED]',
      text: 'text-[#1B502A]',
      border: 'border-[#BCD9C2]',
    },
    priority: {
      label: 'PRIORITY',
      icon: AlertTriangle,
      bg: 'bg-[#FDE8E8]',
      text: 'text-[#9B1C1C]',
      border: 'border-[#F8B4B4]',
    },
  }[status];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  const Icon = config.icon;

  return (
    <span
      id={`status-badge-${status}`}
      className={`inline-flex items-center rounded border tracking-wider uppercase font-wayfinder whitespace-nowrap select-none ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};
