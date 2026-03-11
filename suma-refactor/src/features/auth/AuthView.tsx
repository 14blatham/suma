import { Video, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAppContext } from '../../context/AppContext';
import { Routes } from '../../router/routes';

export function AuthView() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ id: '1', name: 'Alex' });
    navigate(Routes.LOBBY);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#FAF7F2]">
      <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-md border border-[#EFEAE4]">
        <div className="w-16 h-16 bg-[#A8BA9A]/20 rounded-full flex items-center justify-center">
          <Video className="text-[#A8BA9A] w-8 h-8" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-[#3A4145] mb-4">A Kinder Connection</h1>
      <p className="text-[#6B7280] mb-12 max-w-[280px] leading-relaxed">
        A safe, calm space to meet new friends through high-quality video.
      </p>
      <div className="w-full max-w-sm space-y-4">
        <Button className="w-full py-4" onClick={handleLogin}>
          Enter Peaceful Space
        </Button>
        <div className="flex items-center justify-center gap-2 text-[#A8BA9A]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Safety First Environment</span>
        </div>
      </div>
    </div>
  );
}
