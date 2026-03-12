import { useState } from 'react';
import { Welcome }         from './screens/Welcome';
import { Onboarding }      from './screens/Onboarding';
import { Permissions }     from './screens/Permissions';
import { Home }            from './screens/Home';
import { Queue }           from './screens/Queue';
import { MatchFound }      from './screens/MatchFound';
import { Connecting }      from './screens/Connecting';
import { InCall }          from './screens/InCall';
import { InCallExtended }  from './screens/InCallExtended';
import { Decision }        from './screens/Decision';
import { MatchedChat }     from './screens/MatchedChat';
import { ReturnToQueue }   from './screens/ReturnToQueue';
import { Report }          from './screens/Report';

/*
 * TEMPO — STATE MACHINE
 *
 * WELCOME → ONBOARDING → PERMISSIONS → HOME
 *                                        ↓
 *                                   QUEUE_WAITING ──(>60s, no match)──→ no-users inline
 *                                        ↓
 *                                   MATCH_FOUND (partner card)
 *                                        ↓
 *                                    CONNECTING (3-2-1)
 *                                        ↓
 *                                IN_CALL_MIN_TIMER (5:00 → 0:00)
 *                                  ├──(leave early)──→ RETURN_TO_QUEUE
 *                                  ├──(report)──→ REPORT → RETURN_TO_QUEUE
 *                                        ↓ both tap Extend
 *                                IN_CALL_EXTENDED (counts up)
 *                                  ├──(report)──→ REPORT → RETURN_TO_QUEUE
 *                                        ↓ either ends
 *                               POST_CALL_DECISION (👍/👎 blind)
 *                                  ├──(report)──→ REPORT → RETURN_TO_QUEUE
 *                                 ↙                         ↘
 *                           MATCHED_CHAT              RETURN_TO_QUEUE
 *                          (chat + re-call)         (gentle · queue / home)
 */

export type Profile = {
  name: string;
  age: string;
  bio: string;
  photo: string | null;
  tags: string[];
  intent: 'Dating' | 'Friends' | 'Casual chat';
};

export type Partner = {
  name: string;
  age: number;
  bio: string;
  tags: string[];
  intent: string;
  hue: number;
};

type Phase =
  | { id: 'welcome' }
  | { id: 'onboarding' }
  | { id: 'permissions' }
  | { id: 'home' }
  | { id: 'queue' }
  | { id: 'match-found';  partner: Partner }
  | { id: 'connecting';   partner: Partner }
  | { id: 'in-call';      partner: Partner }
  | { id: 'in-call-ext';  partner: Partner }
  | { id: 'decision';     partner: Partner; duration: number }
  | { id: 'matched-chat'; partner: Partner }
  | { id: 'return-queue'; earlyLeave?: boolean }
  | { id: 'report';       partner: Partner; fromCall: boolean };

const MOCK_PARTNERS: Partner[] = [
  { name: 'Jamie',  age: 26, bio: 'Designer. Amateur baker. Will talk about cheese.',              tags: ['Creative', 'Warm', 'Curious'],       intent: 'Dating',       hue: 28  },
  { name: 'Alex',   age: 29, bio: 'Ex-journalist. Now in tech. Still asks too many questions.',    tags: ['Direct', 'Witty', 'Thoughtful'],     intent: 'Friends',      hue: 200 },
  { name: 'Sam',    age: 24, bio: 'Reading too many books, sleeping too little.',                  tags: ['Calm', 'Reflective', 'Quiet'],        intent: 'Dating',       hue: 155 },
  { name: 'Jordan', age: 31, bio: 'Cyclist. Terrible at small talk. Good at big talk.',            tags: ['Adventurous', 'Direct', 'Funny'],     intent: 'Casual chat',  hue: 260 },
];

function randomPartner(): Partner {
  return MOCK_PARTNERS[Math.floor(Math.random() * MOCK_PARTNERS.length)];
}

export function App() {
  const [phase, setPhase] = useState<Phase>({ id: 'welcome' });
  const [profile, setProfile] = useState<Profile | null>(null);

  const go = (p: Phase) => setPhase(p);

  switch (phase.id) {

    case 'welcome':
      return <Welcome
        onSignUp={() => go({ id: 'onboarding' })}
        onLogin={()  => go({ id: 'home' })}
      />;

    case 'onboarding':
      return <Onboarding
        onComplete={p => { setProfile(p); go({ id: 'permissions' }); }}
      />;

    case 'permissions':
      return <Permissions
        onGranted={() => go({ id: 'home' })}
      />;

    case 'home':
      return <Home
        profile={profile}
        onJoin={() => go({ id: 'queue' })}
        onEditProfile={() => go({ id: 'onboarding' })}
      />;

    case 'queue':
      return <Queue
        onMatched={() => go({ id: 'match-found', partner: randomPartner() })}
        onLeave={()   => go({ id: 'home' })}
        onEdit={()    => go({ id: 'onboarding' })}
      />;

    case 'match-found':
      return <MatchFound
        partner={phase.partner}
        onAccept={() => go({ id: 'connecting', partner: phase.partner })}
        onSkip={()   => go({ id: 'queue' })}
      />;

    case 'connecting':
      return <Connecting
        partner={phase.partner}
        onReady={() => go({ id: 'in-call', partner: phase.partner })}
      />;

    case 'in-call':
      return <InCall
        partner={phase.partner}
        onExtend={()           => go({ id: 'in-call-ext', partner: phase.partner })}
        onEnd={(duration)      => go({ id: 'decision', partner: phase.partner, duration })}
        onEarlyLeave={()       => go({ id: 'return-queue', earlyLeave: true })}
        onReport={()           => go({ id: 'report', partner: phase.partner, fromCall: true })}
      />;

    case 'in-call-ext':
      return <InCallExtended
        partner={phase.partner}
        onEnd={(duration)  => go({ id: 'decision', partner: phase.partner, duration })}
        onReport={()       => go({ id: 'report', partner: phase.partner, fromCall: true })}
      />;

    case 'decision':
      return <Decision
        partner={phase.partner}
        duration={phase.duration}
        onMatched={() => go({ id: 'matched-chat', partner: phase.partner })}
        onPassed={()  => go({ id: 'return-queue' })}
        onReport={()  => go({ id: 'report', partner: phase.partner, fromCall: false })}
      />;

    case 'matched-chat':
      return <MatchedChat
        partner={phase.partner}
        onCallAgain={() => go({ id: 'connecting', partner: phase.partner })}
        onHome={()      => go({ id: 'home' })}
      />;

    case 'return-queue':
      return <ReturnToQueue
        earlyLeave={phase.earlyLeave}
        onQueue={() => go({ id: 'queue' })}
        onHome={()  => go({ id: 'home' })}
      />;

    case 'report':
      return <Report
        partner={phase.partner}
        fromCall={phase.fromCall}
        onDone={() => go({ id: 'return-queue' })}
        onCancel={() =>
          phase.fromCall
            ? go({ id: 'in-call', partner: phase.partner })
            : go({ id: 'decision', partner: phase.partner, duration: 300 })
        }
      />;
  }
}
