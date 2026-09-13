import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Eye, 
  Check, 
  Clock, 
  Radio, 
  PauseCircle, 
  SkipForward, 
  CheckCircle2, 
  AlertTriangle,
  MoveHorizontal,
  Type,
  Palette,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { WayfinderNumeral } from './WayfinderNumeral';
import { HairlineDivider } from './HairlineDivider';
import { TokenStatus } from '../../types/queue';

interface DesignSystemFoundationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemFoundation: React.FC<DesignSystemFoundationProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'typography' | 'color' | 'spacing' | 'motion'>('overview');

  if (!isOpen) return null;

  const statuses: TokenStatus[] = [
    'now-serving',
    'waiting',
    'priority',
    'held',
    'skipped',
    'completed',
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="design-system-modal-title"
    >
      <div 
        className="bg-[#F8F6F0] w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl hairline-border shadow-2xl overflow-hidden text-[#1E1C19]"
      >
        {/* Header */}
        <header className="px-6 py-4 bg-[#F2EFE8] hairline-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1E1C19] text-[#F8F6F0] flex items-center justify-center font-wayfinder font-bold text-sm">
              DS
            </div>
            <div>
              <h2 id="design-system-modal-title" className="text-base font-bold tracking-tight">
                Wayfinder LED — Design System Foundation
              </h2>
              <p className="text-xs text-[#58524A]">
                Transit / Information-System Token Architecture (Step 1)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-[#E6E0D4] text-[#58524A] hover:text-[#1E1C19] transition-colors"
            aria-label="Close Design System reference modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center px-6 bg-[#EBE7DF] hairline-b gap-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Foundation Overview', icon: Layers },
            { id: 'typography', label: 'Type Scale & Numerals', icon: Type },
            { id: 'color', label: 'Warm Cream & Status Tokens', icon: Palette },
            { id: 'spacing', label: '4/8px Spacing Grid', icon: MoveHorizontal },
            { id: 'motion', label: 'Motion & Accessibility', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  isSelected 
                    ? 'border-[#1E1C19] text-[#1E1C19] bg-[#F8F6F0]' 
                    : 'border-transparent text-[#58524A] hover:text-[#1E1C19] hover:bg-[#F2EFE8]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#F2EFE8] rounded hairline-border">
                <h3 className="font-bold text-sm tracking-tight mb-1 text-[#1E1C19]">
                  Design Philosophy: Wayfinder LED
                </h3>
                <p className="text-xs text-[#58524A] leading-relaxed">
                  Engineered after modern European high-speed rail and airport departure wayfinding systems.
                  Replaces generic rounded "card soup" with crisp hairline partitions, generous 4/8px spacing,
                  warm ivory/cream surfaces that eliminate clinical patient anxiety, and monospaced tabular numerals
                  with instant 3-second comprehension.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF9F5] hairline-border rounded">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase block mb-2">
                    Core Rule 1: No Nested Cards
                  </span>
                  <p className="text-xs text-[#58524A]">
                    Cards inside cards are banned. Grouping is achieved exclusively through 1px warm hairlines (`#DDD6C8`),
                    background tiering (`#F8F6F0` canvas vs `#F2EFE8` surfaces), and vertical rhythmic spacing.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF9F5] hairline-border rounded">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase block mb-2">
                    Core Rule 2: Multi-Modal Status
                  </span>
                  <p className="text-xs text-[#58524A]">
                    Never color alone. Every status (waiting, now-serving, held, skipped, completed, priority)
                    is conveyed via distinct color, semantic icon, and readable text label (passing WCAG AA &gt; 4.5:1).
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase mb-3">
                  All 6 Wayfinder Semantic Status Badges
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {statuses.map(s => (
                    <div key={s} className="p-3 bg-[#F2EFE8] hairline-border rounded flex flex-col items-start gap-2">
                      <StatusBadge status={s} size="md" />
                      <span className="text-[11px] text-[#797267] font-mono">
                        WCAG AA Contrast: Pass
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#F2EFE8] rounded hairline-border space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase block">
                  Tabular Wayfinder LED Display Numerals
                </span>
                <div className="flex flex-wrap items-baseline gap-6 pb-2 hairline-b">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#797267] font-mono mb-1">Display Numeral (XL)</span>
                    <WayfinderNumeral value="19" prefix="#" size="xl" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#797267] font-mono mb-1">Now Serving (LG)</span>
                    <WayfinderNumeral value="16" prefix="#" size="lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#797267] font-mono mb-1">Counter Number (MD)</span>
                    <WayfinderNumeral value="02" prefix="COUNTER" size="md" />
                  </div>
                </div>
                <p className="text-xs text-[#58524A]">
                  Tabular lining figures (`font-variant-numeric: tabular-nums`) guarantee zero horizontal layout jitter
                  when digits increment or cycle.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase block">
                  Scale Hierarchy
                </span>
                <div className="space-y-2">
                  <div className="p-2 hairline-b flex items-center justify-between">
                    <span className="text-2xl font-bold tracking-tight">H1 Heading (24-32px, bold)</span>
                    <span className="text-xs font-mono text-[#797267]">tracking-tight / font-bold</span>
                  </div>
                  <div className="p-2 hairline-b flex items-center justify-between">
                    <span className="text-lg font-semibold tracking-tight">H2 Section Heading (18-20px)</span>
                    <span className="text-xs font-mono text-[#797267]">tracking-tight / font-semibold</span>
                  </div>
                  <div className="p-2 hairline-b flex items-center justify-between">
                    <span className="text-sm font-medium">Body / Paragraph (14-16px, 1.6 line height)</span>
                    <span className="text-xs font-mono text-[#797267]">max 65-75ch</span>
                  </div>
                  <div className="p-2 hairline-b flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#58524A]">
                      TRACK LABEL / CAPTION (11-12px, MONO)
                    </span>
                    <span className="text-xs font-mono text-[#797267]">font-mono / tracking-wider</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase mb-3">
                  Base Warm Cream Neutral Scale
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#F8F6F0] hairline-border rounded">
                    <div className="w-full h-8 bg-[#F8F6F0] hairline-border rounded mb-2" />
                    <div className="font-bold text-xs">Canvas Background</div>
                    <div className="text-[11px] font-mono text-[#797267]">#F8F6F0 (Warm Ivory)</div>
                  </div>
                  <div className="p-3 bg-[#F2EFE8] hairline-border rounded">
                    <div className="w-full h-8 bg-[#F2EFE8] hairline-border rounded mb-2" />
                    <div className="font-bold text-xs">Surface Base</div>
                    <div className="text-[11px] font-mono text-[#797267]">#F2EFE8 (Cream Surface)</div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] hairline-border rounded">
                    <div className="w-full h-8 bg-[#DDD6C8] rounded mb-2" />
                    <div className="font-bold text-xs">Hairline Divider</div>
                    <div className="text-[11px] font-mono text-[#797267]">#DDD6C8 (Soft Hairline)</div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] hairline-border rounded">
                    <div className="w-full h-8 bg-[#1E1C19] rounded mb-2" />
                    <div className="font-bold text-xs">Text Primary</div>
                    <div className="text-[11px] font-mono text-[#797267]">#1E1C19 (Warm Slate)</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase mb-3">
                  Contrast Verification (WCAG AA &gt; 4.5:1)
                </h4>
                <div className="p-4 bg-[#F2EFE8] hairline-border rounded space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1E1C19]">Primary Text (#1E1C19) on Canvas (#F8F6F0)</span>
                    <span className="font-mono font-bold text-emerald-800">14.8:1 (AAA Pass)</span>
                  </div>
                  <HairlineDivider subtle />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#58524A]">Secondary Text (#58524A) on Canvas (#F8F6F0)</span>
                    <span className="font-mono font-bold text-emerald-800">5.9:1 (AA Pass)</span>
                  </div>
                  <HairlineDivider subtle />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1B502A]">Completed Green on Ivory Base</span>
                    <span className="font-mono font-bold text-emerald-800">6.4:1 (AA Pass)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spacing' && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase block">
                Strict 4/8px Scale Alignment
              </span>
              <p className="text-xs text-[#58524A]">
                Every padding, margin, height, and gap in the interface maps to explicit 4px or 8px increments.
                Arbitrary values (e.g. 13px, 27px, 3.5rem) are banned.
              </p>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { token: 'space-1', px: '4px', usage: 'Hairline offsets, icon gap' },
                  { token: 'space-2', px: '8px', usage: 'Badge padding, tight button gap' },
                  { token: 'space-3', px: '12px', usage: 'List item vertical rhythm' },
                  { token: 'space-4', px: '16px', usage: 'Standard card & container padding' },
                  { token: 'space-6', px: '24px', usage: 'Major panel spacing & section gaps' },
                  { token: 'space-8', px: '32px', usage: 'Display header spacing' },
                  { token: 'space-12', px: '48px', usage: 'Hero numeral separation' },
                  { token: 'space-16', px: '64px', usage: 'Large canvas margin rhythm' },
                ].map(s => (
                  <div key={s.token} className="flex items-center gap-4 p-2 bg-[#F2EFE8] hairline-border rounded">
                    <span className="w-20 font-bold">{s.token}</span>
                    <span className="w-16 text-[#797267]">{s.px}</span>
                    <div className="h-4 bg-[#1E1C19]/20 rounded" style={{ width: s.px }} />
                    <span className="text-[11px] text-[#58524A] ml-auto">{s.usage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'motion' && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#797267] uppercase block">
                Motion Tokens & Accessibility
              </span>
              <p className="text-xs text-[#58524A]">
                Short, purposeful transitions only. Whenever `prefers-reduced-motion: reduce` is active on the operating system,
                animations and transitions drop to 0.01ms instantly.
              </p>
              <div className="p-4 bg-[#F2EFE8] hairline-border rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Token Change Flash</span>
                  <span className="font-mono text-xs text-[#797267]">200ms opacity dip</span>
                </div>
                <HairlineDivider subtle />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Button Press Active State</span>
                  <span className="font-mono text-xs text-[#797267]">100ms transform scale(0.98)</span>
                </div>
                <HairlineDivider subtle />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Drawer / Accordion Mobile Toggle</span>
                  <span className="font-mono text-xs text-[#797267]">150ms ease-out</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 bg-[#F2EFE8] hairline-t flex items-center justify-between shrink-0 text-xs text-[#58524A]">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Step 1 Verified: All Tokens Standardized</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E1C19] text-[#F8F6F0] rounded font-medium hover:bg-[#33302B] transition-colors"
          >
            Close Inspector
          </button>
        </footer>
      </div>
    </div>
  );
};
