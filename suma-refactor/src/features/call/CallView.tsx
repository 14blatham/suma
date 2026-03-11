import { User, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVideoService } from '../../hooks/useVideoService';
import { Routes } from '../../router/routes';

export function CallView() {
  const { isMuted, isVideoOff, toggleAudio, toggleVideo } = useVideoService();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-[#FAF7F2] z-50 flex flex-col">
      {/* Remote Video Container */}
      <div className="flex-1 relative bg-[#F4F1EC] m-4 rounded-[2.5rem] overflow-hidden shadow-inner border border-[#EFEAE4]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="w-28 h-28 bg-[#A8BA9A]/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-[#A8BA9A]/30">
              <User className="text-[#A8BA9A] w-12 h-12" />
            </div>
            <p className="text-[#3A4145] font-bold text-lg">Connecting with Sarah...</p>
            <p className="text-[#6B7280] text-sm mt-1 italic">Building a secure channel</p>
          </div>
        </div>

        {/* Local Preview */}
        <div className="absolute bottom-6 right-6 w-36 h-52 bg-white rounded-3xl border-4 border-[#FAF7F2] shadow-2xl overflow-hidden z-10">
          {!isVideoOff ? (
            <div className="w-full h-full bg-[#7FB3D5]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#7FB3D5] uppercase">You</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F4F1EC]">
              <VideoOff className="text-[#A8BA9A] w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-10 pb-14 flex items-center justify-around rounded-t-[4rem] shadow-[-10px_-10px_30px_rgba(0,0,0,0.02)]">
        <button
          onClick={toggleAudio}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          aria-pressed={isMuted}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isMuted ? 'bg-[#E5B7B7]/20 text-[#D9A5A5]' : 'bg-[#F4F1EC] text-[#6B7280]'}`}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        <button
          onClick={() => navigate(Routes.LOBBY)}
          aria-label="End call"
          className="w-20 h-20 rounded-[2rem] bg-[#E5B7B7] text-white flex items-center justify-center shadow-lg shadow-[#E5B7B7]/40 hover:bg-[#D9A5A5] transform active:scale-90 transition-all"
        >
          <PhoneOff className="w-8 h-8" />
        </button>
        <button
          onClick={toggleVideo}
          aria-label={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
          aria-pressed={isVideoOff}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isVideoOff ? 'bg-[#E5B7B7]/20 text-[#D9A5A5]' : 'bg-[#F4F1EC] text-[#6B7280]'}`}
        >
          {isVideoOff ? <VideoOff /> : <Video />}
        </button>
      </div>
    </div>
  );
}
