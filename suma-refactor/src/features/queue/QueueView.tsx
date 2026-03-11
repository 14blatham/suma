import { useState, useEffect } from 'react';
import { Video, Settings, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Routes } from '../../router/routes';

type QueueStatus = 'idle' | 'searching' | 'countdown';

export function QueueView() {
  const [status, setStatus] = useState<QueueStatus>('idle');
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== 'countdown') return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'countdown' && countdown <= 0) {
      navigate(Routes.CALLING);
    }
  }, [countdown, status, navigate]);

  const startMatching = () => {
    setStatus('searching');
    setTimeout(() => {
      setStatus('countdown');
      setCountdown(10);
    }, 2500);
  };

  return (
    <div className="p-8 flex flex-col h-full bg-[#FAF7F2]">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-2xl font-bold text-[#3A4145]">Discover</h2>
          <p className="text-[#A8BA9A] text-sm font-medium">Safe & Kind Connections</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#F4F1EC] flex items-center justify-center text-[#6B7280]">
          <Settings className="w-5 h-5" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-16">
          {status === 'searching' && (
            <div className="relative w-72 h-72 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#7FB3D5]/20 animate-pulse" />
              <div className="absolute inset-8 rounded-full border-2 border-[#7FB3D5]/10" />
              <div className="w-56 h-56 rounded-full bg-white flex items-center justify-center shadow-lg border border-[#EFEAE4]">
                <Loader2 className="w-16 h-16 text-[#7FB3D5] animate-spin" />
              </div>
            </div>
          )}

          {status === 'countdown' && (
            <div className="relative w-80 h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#E5B7B7]/10 animate-ping" />
              <div className="w-64 h-64 rounded-full bg-white border-8 border-[#E5B7B7]/30 flex flex-col items-center justify-center shadow-xl">
                <Sparkles className="text-[#E5B7B7] w-6 h-6 mb-4" />
                <span className="text-8xl font-black text-[#3A4145] tabular-nums tracking-tighter">
                  {countdown}
                </span>
                <span className="text-[#A8BA9A] text-xs mt-4 font-bold uppercase tracking-widest">A friend is waiting</span>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <div className="w-64 h-64 rounded-[3rem] bg-[#F4F1EC] flex items-center justify-center border-2 border-[#EFEAE4]">
              <Video className="w-20 h-20 text-[#A8BA9A]/40" />
            </div>
          )}
        </div>

        <div className="text-center h-32">
          {status === 'searching' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-[#3A4145] mb-2">Connecting to the hub...</h3>
              <p className="text-[#6B7280] text-sm">We're looking for a peaceful match.</p>
            </div>
          )}

          {status === 'countdown' && (
            <div className="animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-bold text-[#3A4145] mb-1">Time to shine</h3>
              <p className="text-[#6B7280]">Connecting in a moment...</p>
            </div>
          )}

          {status === 'idle' && (
            <div className="animate-in fade-in duration-700">
              <h3 className="text-xl font-bold text-[#3A4145] mb-6">Ready to find warmth?</h3>
              <Button className="w-56 py-4 mx-auto" onClick={startMatching}>
                Start Matching
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
