import React, { useState } from 'react';
import { Stethoscope, Pill, FlaskConical, UserCheck, ArrowRight, Check } from 'lucide-react';
import { useQueue, INITIAL_SERVICES } from '../../context/QueueContext';
import { HairlineDivider } from '../common/HairlineDivider';

interface JoinScreenProps {
  onTokenGenerated: (tokenId: string) => void;
}

export const JoinScreen: React.FC<JoinScreenProps> = ({ onTokenGenerated }) => {
  const { generateToken } = useQueue();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('consultation');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const serviceIcons: Record<string, React.FC<{ className?: string }>> = {
    consultation: Stethoscope,
    pharmacy: Pill,
    laboratory: FlaskConical,
    specialist: UserCheck,
  };

  const handleGetToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Smooth transition
    setTimeout(() => {
      const newToken = generateToken(selectedServiceId);
      setIsSubmitting(false);
      onTokenGenerated(newToken.id);
    }, 150);
  };

  return (
    <main 
      id="join-screen-container"
      className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center px-4 py-6 sm:py-10 bg-[#F8F6F0] text-[#1E1C19]"
    >
      <div className="w-full max-w-lg mx-auto flex flex-col">
        {/* Track Label & Single Question */}
        <header className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded bg-[#EBE7DF] border border-[#CCC4B5] text-xs font-mono font-bold tracking-widest text-[#58524A] uppercase">
            <span>TERMINAL A &bull; SELF CHECK-IN</span>
          </div>
          <h1 
            id="service-question-heading" 
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E1C19] leading-tight"
          >
            What service do you need?
          </h1>
          <p className="mt-2 text-sm text-[#58524A] max-w-md mx-auto">
            Select a care department to receive your queue token number.
          </p>
        </header>

        {/* Form with Tappable Service Options */}
        <form onSubmit={handleGetToken} className="flex flex-col gap-4">
          <div 
            role="radiogroup" 
            aria-labelledby="service-question-heading"
            className="flex flex-col gap-2.5 sm:gap-3"
          >
            {INITIAL_SERVICES.map(service => {
              const isSelected = selectedServiceId === service.id;
              const Icon = serviceIcons[service.id] || Stethoscope;

              return (
                <label
                  key={service.id}
                  htmlFor={`service-option-${service.id}`}
                  className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-lg cursor-pointer transition-all min-h-[58px] sm:min-h-[64px] select-none ${
                    isSelected
                      ? 'bg-[#E7E2D7] border-2 border-[#1E1C19] shadow-sm'
                      : 'bg-[#F2EFE8] border border-[#DDD6C8] hover:border-[#CCC4B5] hover:bg-[#EBE7DF]'
                  }`}
                >
                  <input
                    type="radio"
                    id={`service-option-${service.id}`}
                    name="service"
                    value={service.id}
                    checked={isSelected}
                    onChange={() => setSelectedServiceId(service.id)}
                    className="sr-only"
                    aria-describedby={`service-desc-${service.id}`}
                  />
                  
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div 
                      className={`w-10 h-10 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-[#1E1C19] text-[#F8F6F0]' 
                          : 'bg-[#E5DFD3] text-[#58524A]'
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-[#1E1C19] tracking-tight">
                          {service.name}
                        </span>
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#DDD6C8]/60 text-[#58524A]">
                          {service.code}
                        </span>
                      </div>
                      <span 
                        id={`service-desc-${service.id}`} 
                        className="text-xs text-[#58524A] truncate max-w-[220px] sm:max-w-xs"
                      >
                        {service.description}
                      </span>
                    </div>
                  </div>

                  {/* Radio / Selection Indicator */}
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'border-[#1E1C19] bg-[#1E1C19] text-[#F8F6F0]'
                        : 'border-[#CCC4B5] bg-[#F8F6F0]'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="pt-2">
            {/* One primary action: Get Token */}
            <button
              id="btn-get-token"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 rounded-lg bg-[#1E1C19] hover:bg-[#33302B] active:scale-[0.99] text-[#F8F6F0] font-bold text-base sm:text-lg tracking-wide transition-all shadow-sm min-h-[52px]"
            >
              <span>{isSubmitting ? 'Issuing Token...' : 'Get Token'}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>

            <p className="mt-3 text-center text-xs text-[#797267] font-mono">
              Printed & digital receipt generated instantly &bull; No registration required
            </p>
          </div>
        </form>
      </div>
    </main>
  );
};
