import { useState, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Shell, PrimaryBtn } from './Welcome';
import { type Profile } from '../App';

/*
 * Four steps. < 30 seconds. No unnecessary fields.
 *
 * Step 1: Photo — real face required. Safety and trust.
 * Step 2: Name + age + bio — who you are in two sentences.
 * Step 3: Tags — personality in three words. How you search, how you're found.
 * Step 4: Intent — what you're here for. Honest framing from the start.
 *
 * Progress is communicated by four dots, not a percentage bar.
 * Percentages create pressure. Dots show position without urgency.
 */

interface Props {
  onComplete: (p: Profile) => void;
}

const TAGS = [
  'Calm', 'Funny', 'Direct', 'Warm', 'Curious', 'Creative',
  'Quiet', 'Witty', 'Thoughtful', 'Adventurous', 'Reflective', 'Energetic',
];

const INTENTS = ['Dating', 'Friends', 'Casual chat'] as const;

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [intent, setIntent] = useState<Profile['intent']>('Dating');
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleTag = (t: string) =>
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 3 ? [...prev, t] : prev);

  const canNext: Record<number, boolean> = {
    1: !!photo,
    2: name.trim().length > 0 && age.trim().length > 0,
    3: tags.length > 0,
    4: true,
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const next = () => {
    if (step < 4) setStep(s => s + 1);
    else onComplete({ name: name.trim(), age: age.trim(), bio: bio.trim(), photo, tags, intent });
  };

  return (
    <Shell>
      <div className="flex flex-col h-full min-h-dvh p-6">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.87rem' }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {/* Dot progress */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s === step ? 'var(--ink)' : s < step ? 'var(--text-2)' : 'var(--border)',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1">
          {step === 1 && (
            <StepPhoto photo={photo} fileRef={fileRef} onChoose={() => fileRef.current?.click()} onChange={handlePhoto} />
          )}
          {step === 2 && (
            <StepDetails name={name} age={age} bio={bio} setName={setName} setAge={setAge} setBio={setBio} />
          )}
          {step === 3 && (
            <StepTags tags={tags} toggle={toggleTag} />
          )}
          {step === 4 && (
            <StepIntent intent={intent} setIntent={setIntent} />
          )}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <PrimaryBtn onClick={next} disabled={!canNext[step]}>
            {step < 4 ? 'Continue' : 'Done — let\'s go'}
          </PrimaryBtn>
        </div>

      </div>
    </Shell>
  );
}

/* ─── Step sub-components ─────────────────────────────────────────── */

function StepPhoto({ photo, fileRef, onChoose, onChange }: {
  photo: string | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onChoose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>Add a photo</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
        Required. Your face builds trust before the call starts.
      </p>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <button
        onClick={onChoose}
        style={{
          width: 140, height: 140,
          borderRadius: '50%',
          border: `2px dashed ${photo ? 'var(--ink)' : 'var(--border)'}`,
          background: photo ? 'transparent' : 'var(--surface)',
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-2)',
          fontSize: '0.8rem',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
        }}
      >
        {photo
          ? <img src={photo} alt="Your photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : 'Tap to choose'
        }
      </button>
      {!photo && (
        <p className="text-xs mt-3" style={{ color: 'var(--text-2)' }}>
          Use a clear, recent photo of your face.
        </p>
      )}
    </div>
  );
}

function StepDetails({ name, age, bio, setName, setAge, setBio }: {
  name: string; age: string; bio: string;
  setName: (v: string) => void; setAge: (v: string) => void; setBio: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>About you</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
        Name and age are shown before the call. Bio is optional.
      </p>
      <div className="space-y-3">
        <div>
          <Label>First name</Label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoFocus />
        </div>
        <div>
          <Label>Age</Label>
          <input value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" inputMode="numeric" maxLength={3} />
        </div>
        <div>
          <Label>Bio <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>(optional)</span></Label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} maxLength={120} placeholder="One or two honest sentences." />
          <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-2)' }}>{bio.length}/120</p>
        </div>
      </div>
    </div>
  );
}

function StepTags({ tags, toggle }: { tags: string[]; toggle: (t: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>Your personality</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
        Choose up to 3. These help you find people who match your energy.
      </p>
      <div className="flex flex-wrap gap-2">
        {TAGS.map(t => {
          const active = tags.includes(t);
          const maxed = !active && tags.length >= 3;
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              disabled={maxed}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 20,
                border: `1px solid ${active ? 'var(--ink)' : 'var(--border)'}`,
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? 'var(--bg)' : maxed ? 'var(--text-2)' : 'var(--text)',
                fontSize: '0.87rem',
                cursor: maxed ? 'default' : 'pointer',
                opacity: maxed ? 0.45 : 1,
                transition: 'all 0.1s',
                fontFamily: 'inherit',
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
      <p className="text-xs mt-4" style={{ color: 'var(--text-2)' }}>
        {tags.length}/3 selected
      </p>
    </div>
  );
}

function StepIntent({ intent, setIntent }: { intent: Profile['intent']; setIntent: (v: Profile['intent']) => void }) {
  const descriptions: Record<Profile['intent'], string> = {
    'Dating': 'You\'re open to something romantic.',
    'Friends': 'You want to meet interesting people.',
    'Casual chat': 'Just a good conversation.',
  };
  return (
    <div>
      <h2 className="text-2xl mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>What are you here for?</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
        Honesty upfront saves everyone time.
        You'll be matched with people who share your intent.
      </p>
      <div className="space-y-2.5">
        {INTENTS.map(opt => (
          <button
            key={opt}
            onClick={() => setIntent(opt)}
            style={{
              width: '100%',
              padding: '0.9rem',
              textAlign: 'left',
              borderRadius: 6,
              border: `1px solid ${intent === opt ? 'var(--ink)' : 'var(--border)'}`,
              background: intent === opt ? 'var(--surface)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.1s',
              fontFamily: 'inherit',
            }}
          >
            <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{opt}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{descriptions[opt]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </p>
  );
}
