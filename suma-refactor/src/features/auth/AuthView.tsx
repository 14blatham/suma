import { BarChart2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAppContext } from '../../context/AppContext';
import { Routes } from '../../router/routes';

export function AuthView() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ id: '1', name: 'Alex' });
    navigate(Routes.DASHBOARD);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-[#F5F0E8]">
      <div className="w-20 h-20 bg-[#EDE6D6] border border-[#D6CCB8] rounded-xl flex items-center justify-center mb-10">
        <BarChart2 className="text-[#8B7355] w-9 h-9" />
      </div>

      <h1 className="text-3xl font-bold text-[#2C2420] mb-3">Suma Insights</h1>
      <p className="text-[#7A6B5D] mb-12 max-w-[260px] leading-relaxed text-sm">
        Calm, focused analytics for understanding wellbeing at scale.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button className="w-full py-3" onClick={handleLogin}>
          Sign in
        </Button>
        <div className="flex items-center justify-center gap-2 text-[#7A6B5D]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs tracking-wide">Privacy-first platform</span>
        </div>
      </div>
    </div>
  );
}
