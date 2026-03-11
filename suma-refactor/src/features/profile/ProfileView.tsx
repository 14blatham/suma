import { User, Settings, Heart, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAppContext } from '../../context/AppContext';

export function ProfileView() {
  const { user } = useAppContext();

  return (
    <div className="p-8 bg-[#FAF7F2] h-full">
      <div className="flex flex-col items-center mb-12">
        <div className="relative">
          <div className="w-28 h-28 rounded-[2.5rem] bg-white flex items-center justify-center mb-6 shadow-md border border-[#EFEAE4]">
            <User className="w-12 h-12 text-[#A8BA9A]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#A8BA9A] rounded-full border-4 border-[#FAF7F2] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#3A4145]">{user?.name}</h2>
        <p className="text-[#A8BA9A] font-medium">Safe Space Member</p>
      </div>

      <div className="space-y-4">
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E5B7B7]/10 flex items-center justify-center">
              <Heart className="text-[#E5B7B7] w-5 h-5" />
            </div>
            <span className="text-[#3A4145] font-semibold">Positive Interactions</span>
          </div>
          <span className="text-[#A8BA9A] font-bold">124</span>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#7FB3D5]/10 flex items-center justify-center">
              <Settings className="text-[#7FB3D5] w-5 h-5" />
            </div>
            <span className="text-[#3A4145] font-semibold">Settings</span>
          </div>
        </Card>

        <div className="mt-8 p-6 bg-[#F4F1EC] rounded-3xl border border-[#EFEAE4]">
          <p className="text-xs text-[#A8BA9A] font-bold uppercase tracking-[0.2em] mb-3">Community Pledge</p>
          <p className="text-[#6B7280] text-sm leading-relaxed italic">
            "I pledge to communicate with kindness, listen with empathy, and respect the safety of everyone in the Nexus space."
          </p>
        </div>
      </div>
    </div>
  );
}
