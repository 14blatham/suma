import { useState } from 'react';
import { ArrowLeft, Video } from 'lucide-react';
import { type Partner } from '../App';

/*
 * MATCHED_CHAT
 *
 * The reward loop.
 *
 * This is what the whole product was building toward:
 * two people who chose each other, now with a channel open.
 *
 * Design:
 * - Standard message thread layout (their messages left, yours right)
 * - Pre-populated with a natural conversation continuation
 * - Text input disabled in demo — honest label: "Chat with real backend"
 * - "Call again" top-right — the option to continue face-to-face
 * - No confetti, no badge. One quiet "Matched" label in the header.
 *
 * The "Matched" indicator is muted green — it signals success without shouting.
 * The user knows what happened. The UI doesn't need to celebrate for them.
 */

interface Props {
  partner: Partner;
  onCallAgain: () => void;
  onHome: () => void;
}

type Message = {
  id: number;
  from: 'them' | 'me';
  text: string;
  time: string;
};

function generateMessages(partnerName: string): Message[] {
  return [
    { id: 1, from: 'them', text: `Hey! That was a really good conversation.`,                  time: 'Just now'  },
    { id: 2, from: 'me',   text: `Agreed. I didn't expect to enjoy it so much.`,               time: 'Just now'  },
    { id: 3, from: 'them', text: `Same. The cheese thing — I was fully serious by the way.`,   time: 'Just now'  },
    { id: 4, from: 'them', text: `What are you up to this week?`,                              time: 'Just now'  },
    { id: 4, from: 'me',   text: `Mostly work but free at the weekend. You?`,                   time: 'Just now'  },
    { id: 5, from: 'them', text: `Same. Maybe we continue this then — ${partnerName} 🙂`,       time: 'Just now'  },
  ];
}

export function MatchedChat({ partner, onCallAgain, onHome }: Props) {
  const [input, setInput] = useState('');
  const [toast, setToast] = useState(false);
  const messages = generateMessages(partner.name);

  const handleSend = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div
      className="flex flex-col min-h-dvh max-w-sm mx-auto"
      style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={onHome}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Partner avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: `hsl(${partner.hue},30%,72%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem', fontFamily: 'Georgia, serif',
          color: `hsl(${partner.hue},25%,30%)`,
          border: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          {partner.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{partner.name}</span>
            {/* "Matched" — quiet, muted green */}
            <span style={{
              fontSize: '0.68rem', padding: '1px 6px',
              border: '1px solid var(--ok)', borderRadius: 20,
              color: 'var(--ok)', whiteSpace: 'nowrap',
            }}>
              Matched
            </span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-2)' }}>{partner.intent}</div>
        </div>

        {/* Call again */}
        <button
          onClick={onCallAgain}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 6, padding: '5px 10px',
            color: 'var(--text-2)', fontSize: '0.78rem', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'border-color 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <Video className="w-3.5 h-3.5" />
          Call again
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '0.55rem 0.85rem',
                borderRadius: msg.from === 'me' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.from === 'me' ? 'var(--ink)' : 'var(--surface)',
                color: msg.from === 'me' ? 'var(--bg)' : 'var(--text)',
                fontSize: '0.87rem',
                lineHeight: 1.5,
                border: msg.from === 'me' ? 'none' : '1px solid var(--border)',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input — disabled in demo */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message…"
            style={{
              flex: 1, padding: '0.6rem 0.75rem',
              border: '1px solid var(--border)', borderRadius: 20,
              background: 'var(--bg)', color: 'var(--text)',
              fontSize: '0.87rem', fontFamily: 'inherit', outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '0 1rem', borderRadius: 20,
              background: 'var(--ink)', color: 'var(--bg)',
              border: 'none', cursor: 'pointer', fontSize: '0.87rem',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >
            Send
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-2)' }}>
          Demo — chat launches with real backend
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text)', color: 'var(--bg)',
          padding: '0.5rem 1rem', borderRadius: 6, fontSize: '0.8rem',
          zIndex: 100,
        }}>
          Chat launches with real backend
        </div>
      )}
    </div>
  );
}
