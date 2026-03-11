import { useState } from 'react';
import { User, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
}

const MOCK_MESSAGES: Message[] = [
  { id: 1, text: 'Hello! It was so nice meeting you.', sender: 'other' },
  { id: 2, text: 'I really appreciated our conversation about meditation.', sender: 'other' },
  { id: 3, text: "Me too! Let's talk again soon. 😊", sender: 'me' },
];

export function ChatView() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-full bg-[#FAF7F2]">
      <header className="p-6 bg-white border-b border-[#EFEAE4] flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#A8BA9A]/10 flex items-center justify-center border border-[#A8BA9A]/20">
          <User className="w-6 h-6 text-[#A8BA9A]" />
        </div>
        <div>
          <h3 className="text-[#3A4145] font-bold">Sarah</h3>
          <p className="text-xs text-[#A8BA9A] font-bold uppercase tracking-wider">Recently Connected</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {MOCK_MESSAGES.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm ${
                m.sender === 'me'
                  ? 'bg-[#7FB3D5] text-white rounded-tr-none'
                  : 'bg-white text-[#3A4145] rounded-tl-none border border-[#EFEAE4]'
              }`}
            >
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white border-t border-[#EFEAE4]">
        <div className="bg-[#FAF7F2] rounded-2xl p-2 flex gap-2 border border-[#EFEAE4]">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-[#3A4145] px-3 placeholder-[#A8BA9A]"
            placeholder="Type a kind message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="primary" className="w-12 h-12 p-0 rounded-xl">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
