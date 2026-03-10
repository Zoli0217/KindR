import React, { useState, useEffect, useRef, Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Error Boundary                                                     */
/* ------------------------------------------------------------------ */
class ChatErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2 style={{ color: '#e11d48', marginBottom: 12 }}>Hiba történt</h2>
          <p style={{ color: '#666' }}>{this.state.error}</p>
          <button
            onClick={() => (window.location.href = '/swipe')}
            style={{
              marginTop: 20, padding: '10px 24px', background: '#e11d48',
              color: '#fff', border: 'none', borderRadius: 999, cursor: 'pointer',
            }}
          >
            Vissza a swipeléshez
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface MatchUser {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
}

interface Message {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
}

/* ================================================================== */
/*  AI-like Conversation Engine                                        */
/*  Generates natural, contextual Hungarian responses based on:        */
/*  - Personality (flirty / normal / rude)                             */
/*  - What the user actually wrote (topic detection)                   */
/*  - Conversation history (phase, topic memory)                       */
/*  - Sentence structure (question vs statement vs emoji-only)         */
/*  - Dynamic response building (reaction + content + follow-up)       */
/* ================================================================== */

type Personality = 'flirty' | 'normal' | 'rude';
const PERSONALITIES: Personality[] = ['flirty', 'normal', 'rude'];

const getPersonality = (userId: number): Personality => {
  const stored = localStorage.getItem(`kindR_personality_${userId}`);
  if (stored && PERSONALITIES.includes(stored as Personality)) return stored as Personality;
  const p = PERSONALITIES[userId % PERSONALITIES.length];
  localStorage.setItem(`kindR_personality_${userId}`, p);
  return p;
};

/* ---- utility ---- */
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const maybe = (chance: number): boolean => Math.random() < chance;

/* ---- Detect message characteristics ---- */
interface MsgAnalysis {
  isQuestion: boolean;
  isGreeting: boolean;
  isEmoji: boolean;
  isShort: boolean;      // ≤ 3 words
  isLong: boolean;       // > 15 words
  isCompliment: boolean;
  isFlirty: boolean;
  isNegative: boolean;
  isFunny: boolean;
  isAboutThem: boolean;  // asks about the other person
  isPersonal: boolean;   // shares personal info
  topics: string[];      // detected topics
  sentiment: 'positive' | 'negative' | 'neutral';
  words: string[];
}

const analyze = (text: string, _history: Message[]): MsgAnalysis => {
  const lower = text.toLowerCase().replace(/[.,!]/g, '');
  const words = lower.split(/\s+/).filter(Boolean);

  const isQuestion = /\?/.test(text) ||
    words.some(w => ['mi', 'mit', 'hol', 'hogy', 'mikor', 'miért', 'melyik', 'milyen', 'hány', 'ki', 'kinek', 'honnan', 'hogyan', 'merre', 'szereted', 'szoktál', 'voltál', 'ismered', 'tudod', 'van-e'].includes(w));

  const isGreeting = words.some(w => ['szia', 'hello', 'hali', 'hey', 'hé', 'heló', 'helo', 'szevasz', 'szép', 'szeva', 'csá', 'cső', 'helloka'].includes(w)) &&
    words.length <= 6;

  const emojiOnly = /^[\p{Emoji}\s]+$/u.test(text) && words.length <= 2;

  const isCompliment = words.some(w => ['szép', 'csinos', 'helyes', 'aranyos', 'szexi', 'gyönyörű', 'cuki', 'imádlak', 'tetszik', 'klassz', 'menő', 'király'].includes(w));

  const isFlirty = words.some(w => ['randi', 'randizni', 'csók', 'puszi', 'ölelés', 'szerelem', 'szív', 'szeret', 'tetszesz', 'vonzó', 'csinos'].includes(w)) ||
    /❤️|💕|😍|🥰|😘|💋|💖|💗/.test(text);

  const isNegative = words.some(w => ['nem', 'rossz', 'szar', 'unom', 'unalmas', 'béna', 'gáz', 'szörnyű', 'undorító', 'sajnálom', 'bocs', 'semmi', 'hagyd', 'mindegy'].includes(w));

  const isFunny = /haha|lol|😂|🤣|xd|jaj|😆|😅|rofl/i.test(text);

  const isAboutThem = words.some(w => ['te', 'neked', 'nálad', 'veled', 'rólad', 'tied', 'téged', 'magad'].includes(w)) && isQuestion;

  const isPersonal = words.some(w => ['én', 'nekem', 'nálam', 'engem', 'magam', 'vagyok', 'voltam', 'dolgoztam', 'csináltam', 'szeretek', 'imádok'].includes(w));

  // Topic detection
  const topicMap: Record<string, string[]> = {
    food: ['étel', 'enni', 'vacsora', 'ebéd', 'reggeli', 'pizza', 'sushi', 'főz', 'süt', 'étterem', 'kaja', 'eszik', 'éhes', 'hamburger', 'pasta', 'leves', 'desszert', 'torta'],
    drink: ['kávé', 'tea', 'sör', 'bor', 'koktél', 'ital', 'inni', 'kocsmá', 'bár', 'pub', 'cappuccino', 'latte'],
    music: ['zene', 'zenél', 'dal', 'spotify', 'koncert', 'énekel', 'gitár', 'dob', 'playlist', 'szám', 'album', 'banda', 'rapper', 'pop', 'rock'],
    movie: ['film', 'mozi', 'sorozat', 'netflix', 'hbo', 'nézni', 'színész', 'horror', 'vígjáték', 'dráma', 'disney', 'marvel', 'anime'],
    sport: ['sport', 'edz', 'edzés', 'futás', 'foci', 'kosár', 'úszik', 'gym', 'konditerem', 'jóga', 'bicikli', 'kirándulás', 'túra'],
    travel: ['utazás', 'utaz', 'repülő', 'nyaralás', 'tenger', 'hegy', 'külfölд', 'párizs', 'london', 'olaszország', 'spanyol', 'görög', 'horvát', 'balaton'],
    work: ['munka', 'dolgoz', 'iroda', 'főnök', 'kolléga', 'projekt', 'suli', 'egyetem', 'tanul', 'vizsga', 'óra', 'iskola'],
    hobby: ['hobbi', 'játék', 'olvas', 'könyv', 'rajzol', 'fest', 'fotóz', 'kertészked', 'főz', 'varr', 'barkácsol', 'gaming'],
    pet: ['kutya', 'macska', 'cica', 'kutyus', 'állat', 'kisállat'],
    social: ['insta', 'instagram', 'tiktok', 'snap', 'facebook', 'social'],
    weather: ['idő', 'eső', 'nap', 'meleg', 'hideg', 'szél', 'hó'],
    date: ['randi', 'találkozó', 'találkoz', 'összejön', 'mikor', 'hol'],
    feeling: ['érzem', 'érzés', 'boldог', 'szomorú', 'fáradt', 'ideges', 'stressz', 'nyugodt', 'boldog', 'szomoru'],
  };

  const topics: string[] = [];
  for (const [topic, kws] of Object.entries(topicMap)) {
    if (kws.some(kw => lower.includes(kw))) topics.push(topic);
  }

  const positiveWords = ['jó', 'szuper', 'király', 'klassz', 'imádom', 'tetszik', 'örülök', 'boldog', 'szeretem', 'köszi', 'köszönöm', 'igen', 'persze', 'naon', 'nagyon', 'wow'];
  const negativeWords = ['nem', 'rossz', 'szar', 'gáz', 'béna', 'unom', 'sajnálom', 'bocs', 'szörnyű', 'semmi', 'soha'];

  const posCount = words.filter(w => positiveWords.includes(w)).length;
  const negCount = words.filter(w => negativeWords.includes(w)).length;
  const sentiment = posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';

  return {
    isQuestion,
    isGreeting,
    isEmoji: emojiOnly,
    isShort: words.length <= 3,
    isLong: words.length > 15,
    isCompliment,
    isFlirty,
    isNegative,
    isFunny,
    isAboutThem,
    isPersonal,
    topics,
    sentiment,
    words,
  };
};

/* ---- Get conversation phase from history ---- */
type ConvoPhase = 'opening' | 'getting_to_know' | 'comfortable' | 'deep';
const getPhase = (history: Message[]): ConvoPhase => {
  const count = history.length;
  if (count <= 2) return 'opening';
  if (count <= 8) return 'getting_to_know';
  if (count <= 20) return 'comfortable';
  return 'deep';
};

/* ---- Response builder pieces ---- */
const REACTIONS: Record<Personality, Record<string, string[]>> = {
  flirty: {
    positive: ['Jajj 🥰', 'Imádom! 😍', 'Na EZ tetszik!', 'Awww ❤️', 'De édes vagy!', ''],
    negative: ['Oh ne 🥺', 'Sajnálom drágám 💕', 'Bárcsak segíthetnék...', ''],
    neutral: ['Hmm 😏', 'Érdekes...', 'Ooh', ''],
    funny: ['HAHAHA 😂❤️', 'Jaj ne 🤣 imádlak', 'Megölsz 😂💕', ''],
  },
  normal: {
    positive: ['Oh nice! 😊', 'Jó hallani!', 'Szuper! 🙌', 'Klassz!', ''],
    negative: ['Jaj, sajnálom 😔', 'Az szívás...', 'Remélem jobban leszel!', ''],
    neutral: ['Hmm 🤔', 'Értem!', 'Aha', 'Oké', ''],
    funny: ['Haha 😄', '😂😂', 'Jaj ne 😅', 'Lol', ''],
  },
  rude: {
    positive: ['Ok', 'Mhm', 'Jó neked', '...', ''],
    negative: ['Hát az szar', 'Túléled', 'Mondtam', ''],
    neutral: ['Oké', '...', 'Hm', ''],
    funny: ['Heh', 'Annyira nem vicces', '😐', ''],
  },
};

/* ---- Topic-aware content responses ---- */
const TOPIC_RESPONSES: Record<string, Record<Personality, string[]>> = {
  food: {
    flirty: [
      'Amúgy főzök is, egyszer megkóstolhatnád a specialitásomat 😏🍳',
      'Éhes vagyok... de nem feltétlen ételre 😏',
      'Ha főzöl nekem, feleségül veszlek. Nem viccelek. 🥰🍝',
      'Szerintem egy romantikus vacsora kettesben mindent megoldana 🕯️',
    ],
    normal: [
      'Nekem a legjobb az olasz konyha, te mit szeretsz? 🍕',
      'Főzni is szoktál, vagy inkább rendelős típus? 😄',
      'Mostanában próbáltam sushi-t csinálni házilag, katasztrófa volt 😅🍣',
      'Ismerek egy nagyon jó kis helyet a belvárosban, voltál már ott? 🍽️',
    ],
    rude: [
      'Remélem nem vagy az a típus aki az ételét fotózza 🙄📸',
      'Nekem elég ha ehető, nem kell Michelin-csillag',
      'Ja, mert a személyiségnél fontosabb hogy mit eszel 💀',
    ],
  },
  drink: {
    flirty: [
      'Kávé kettesben? ☕ Mondd mikor és hol, ott leszek 😍',
      'Egy pohár bor, gyertyafény, és te... tökéletes este lenne 🍷✨',
      'A kedvenc koktélom? Bármi, amit veled iszom 😏🍹',
    ],
    normal: [
      'Kávé nélkül nem működik a reggelem, neked is? ☕😅',
      'Ha koktélt iszol, mi a kedvenced? 🍹',
      'Én mostanában a matcha latte-ra esküszöm, próbáltad már? 🍵',
    ],
    rude: [
      'Jó, de én a drága kávét szeretem, szóval készülj 💀☕',
      'Italozgatni akarunk, vagy beszélgetni? Mert a kettő egyszerre gáz',
      'Kávés small talk, milyen eredeti 🙄',
    ],
  },
  music: {
    flirty: [
      'Ha zenéről van szó, van egy playlistem ami tökéletes lenne egy közös autós túrához 🎵😏',
      'Tudod mi a kedvenc dalom? Bármi ami eszedbe juttat téged 🎶💕',
      'Koncerten még sosem fogtam kézen senkit... de veled kipróbálnám 🎤🥰',
    ],
    normal: [
      'Mi a kedvenc előadód? Mindig kíváncsi vagyok mások ízlésére 🎵',
      'Koncertre is jársz? Nekem az az igazi élmény! 🎤🔥',
      'Mostanában mit hallgatsz? Hátha találunk közös kedvencet 🎧',
    ],
    rude: [
      'Remélem van ízlésed zenében, mert az sokat elárul 🎵',
      'Ha azt mondod hogy magyar pop a kedvenced, ezt a beszélgetést nem folytatjuk 💀',
      'Zenei ízlésem? Based. A tiédet majd meglátjuk 🙄',
    ],
  },
  movie: {
    flirty: [
      'Horrorfilm? 😏 Hogy legyen okod közelebb húzódni hozzám a kanapén...',
      'Netflix este nálam? 📺 Ígérem jól viselkedem... vagy nem 😏',
      'Képzeld el: mi ketten, meleg takaró, egy jó film... tökéletes 🥰🎬',
    ],
    normal: [
      'Most mit nézel? Keresek valami jó sorit 📺',
      'Voltál mostanában moziban? Nekem rég volt már 🍿',
      'Ha ajánlanod kéne egy filmet, mi lenne az? 🎬',
    ],
    rude: [
      'Ha Marvel fan vagy, akkor ennek vége 💀',
      'Gondolom TikTok az a mozi neked 🙄',
      'Legalább van ízlésed filmben? Mert eddig kérdéses 😐',
    ],
  },
  sport: {
    flirty: [
      'Sportos vagy? Tetszik... nagyon 😍💪',
      'Gym date lenne a legjobb első randi, bár nem tudnék koncentrálni melletted 🥵',
      'Futás kettesben? Lemaradnék szándékosan, hogy a hátadat nézem 😏',
    ],
    normal: [
      'Milyen sportot csinálsz? Én mostanában futni járok 🏃',
      'Hányszor edzel hetente? Én próbálom a háromszori minimum tartani 💪',
      'A kirándulás is sport, ugye? Mert az az én favorit 🏔️😅',
    ],
    rude: [
      'Gym selfie jön? 💀 mindenki azt csinálja manapság',
      'Ja edzés, cool. Én a kanapésport bajnok vagyok 🏆😐',
      'Flex-elni jössz ide a sporttal? 🙄',
    ],
  },
  travel: {
    flirty: [
      'Utazás? 😍 Ha velem jössz, két jegyet foglalok bármerre ✈️',
      'Képzeld el: mi ketten egy görög szigeten, naplemente... 🌅💕',
      'A bucket listem tetején egy romantikus párizsi kirándulás van... veled 😏🗼',
    ],
    normal: [
      'Hol voltál legutóbb? Szeretem a travel sztorikat! ✈️😊',
      'Van dream destination-öd? Nekem Japán az álom 🇯🇵',
      'Az utazás a legjobb dolog, annyi mindent tanulsz belőle! 🌍',
    ],
    rude: [
      'Utazás? Szép dolog ha van rá pénz 💀',
      'Ja Balaton is számít, ugye? 🙄',
      'Biztos vagy az insta-tourist típus... 📸😐',
    ],
  },
  work: {
    flirty: [
      'Szóval dolgos típus vagy... az szexi 😏💼',
      'Ha a melóban is ilyen érdekes vagy mint itt, sikeres leszel 😍',
      'Munka után pihenés kell... mondjuk velem 🥰',
    ],
    normal: [
      'Mivel foglalkozol? Kíváncsi vagyok! 💼',
      'Szokott stresszes lenni a munkád? 😅',
      'Nehéz volt a nap? Mesélj, mindig segít beszélni róla 😊',
    ],
    rude: [
      'Munka... igen... mindannyiunknak van 🙄',
      'Remélem nem fogod az egész estét a munkádról mesélni 💀',
      'Work-life balance-ed hogy áll? Mert itt is dolgozol most 😐',
    ],
  },
  pet: {
    flirty: [
      'Állatokkal foglalkozol?! 😍 Most még jobban tetszesz!',
      'Mutasd a háziállatodat! Az ember állatán keresztül lehet igazán megismerni 🐾❤️',
      'Ha a kutyád/cicád elfogad, akkor nálam már nyert ügyed van 🥰🐕',
    ],
    normal: [
      'Jaj imádom az állatokat! 🐾 Van háziállatod? 😊',
      'Mutass képet! 📸🐶 Nem bírom ki!',
      'Kutyás vagy cicás ember? Nagy kérdés! 😄',
    ],
    rude: [
      'Állatos képeket küldj, az legalább érdekes 🙄🐱',
      'Ha a kutyád jobban néz ki nálad, baj van 💀',
      'Imádom az állatokat. Az embereket kevésbé 😐',
    ],
  },
  date: {
    flirty: [
      'Találkozni akarunk? 😍 Mondd az időt és helyet, ott leszek, igézően 💅',
      'Egy randin kiderülne hogy annyira jó vagyok személyesen is 😏',
      'Igen, igen, IGEN! Mikor? Ma? Holnap? Bármikor! 🥰',
    ],
    normal: [
      'Jó ötlet! Neked mi lenne a kedvenc randi terved? 😊',
      'Szívesen találkoznék! Kávé vagy séta? ☕🚶',
      'Van egy jó hely amit ismerek, tetszene neked! 🙂',
    ],
    rude: [
      'Randi? Előbb győzz meg h megéri a fáradságot 🙄',
      'Kicsit hamar van még, nem? Alig ismerlek 💀',
      'Hm, majd meglátjuk. Nem ígérek semmit 😐',
    ],
  },
  feeling: {
    flirty: [
      'Bármit is érzel, velem biztonságban vagy 🥰💕',
      'Ha szomorú vagy, ott leszek megölelni... szó szerint 🤗❤️',
      'A te hangulatod most az enyém is, annyira érdekel 😍',
    ],
    normal: [
      'Örülök h megosztod velem 😊 mindig van kinek mondani!',
      'Teljesen megértelek, néha olyan napok vannak... 💙',
      'Ha segíthetek valamiben, szólj bátran! 🤗',
    ],
    rude: [
      'Az érzelmek... ja. Azok léteznek 😐',
      'Sajnálom de nem vagyok terapeuta 💀',
      'Deep. Tovább? 🙄',
    ],
  },
};

/* ---- Phase-aware conversation starters / follow-ups ---- */
const FOLLOW_UPS: Record<ConvoPhase, Record<Personality, string[]>> = {
  opening: {
    flirty: [
      'Amúgy mesélj magadról! Kíváncsi vagyok MINDENRE 😍',
      'Szóval, mivel foglalkozol amúgy? 😏',
      'Tetszett a profilod, nagyon szimpi vagy ✨',
    ],
    normal: [
      'Mesélj magadról! Mi érdekel? 😊',
      'Mivel foglalkozol amúgy? 🙂',
      'Milyen napod volt eddig?',
    ],
    rude: [
      'Na és? Lesz valami érdekesebb is? 🙄',
      'Hm. Ennyi?',
      'Mondjuk mesélhetnél magadról is 😐',
    ],
  },
  getting_to_know: {
    flirty: [
      'De érdekes ember vagy! 😍 Mit csinálsz szabadidőben?',
      'Minél többet beszélünk, annál jobban tetszesz 🥰',
      'Komolyan mondom, nagyon jó veled beszélgetni 💕',
    ],
    normal: [
      'Amúgy mit szoktál csinálni hétvégén? 😊',
      'Van valami hobbid amit nagyon szeretsz? 🤔',
      'Milyen zenét hallgatsz amúgy? 🎵',
    ],
    rude: [
      'Oké de legyen valami érdekes is a sztoriból',
      'Mhm. Van valami szenvedélyed vagy csak létezni szoktál? 🙄',
      'Eddig átlagos... lepj meg 😐',
    ],
  },
  comfortable: {
    flirty: [
      'Egyébként nagyon kellemes veled beszélni, ritkán van ez 🥰',
      'Már alig várom h személyesen is ilyen jó legyen 😏',
      'Tudod h nagyon különleges vagy? ✨💕',
    ],
    normal: [
      'Tök jó veled csevegni amúgy! 😊',
      'Kíváncsi voltam erre... köszi h elmondtad! 🙌',
      'Jó kis beszélgetés ez 😄',
    ],
    rude: [
      'Nem is annyira rossz ez a beszélgetés, meglepően',
      'Hm, kezd érdekes lenni. Kicsit.',
      'Na most már kicsit jobb 😐',
    ],
  },
  deep: {
    flirty: [
      'Érzem h mi ketten jól kijönnénk együtt 🥰',
      'Komolyan mondom, te vagy a legjobb match akivel beszéltem 😍',
      'Annyira természetes veled... mintha régóta ismernélek 💕',
    ],
    normal: [
      'Nagyon élvezem ezeket a beszélgetéseket veled 😊',
      'Tudod, ritka h valaki ilyen érdekesen tud beszélgetni!',
      'Köszi h ilyen nyitott vagy, ez nagyon klassz 🙌',
    ],
    rude: [
      'Na jó, bevallom, nem rossz ez. Nem is jó persze. De nem rossz.',
      'Oké talán tévedtem rólad. Kicsit.',
      'Hm, legalább nem unalmas. Az már valami 😐',
    ],
  },
};

/* ---- Greeting responses ---- */
const GREETINGS: Record<Personality, string[]> = {
  flirty: [
    'Szia! 😍 Vártam h írni fogsz! Hogy vagy drágám?',
    'Hellooo! 🥰 Na mesélj, milyen napod volt? Gondoltál rám? 😏',
    'Sziaaa! ✨ Jaj de örülök! Egész nap rád gondoltam 💕',
    'Hey! 😍 Végre! Mesélj mindent, kíváncsi vagyok rád!',
  ],
  normal: [
    'Szia! 😊 Örülök h írtál! Hogy vagy?',
    'Hello! 🙋 Milyen napod volt eddig?',
    'Hali! 😊 Mi újság nálad? Mesélj!',
    'Szía! Jó h jelentkezel 😊 hogy vagy?',
  ],
  rude: [
    'Á, szia. Mi járatban? 😐',
    'Na mi van. Rég volt 🙄',
    'Hm. Szia. Remélem valami érdekessel jössz.',
    'Oké, hello. Szóval mi a terved? 😐',
  ],
};

/* ---- Question about them responses ---- */
const ABOUT_ME: Record<Personality, Record<string, string[]>> = {
  flirty: {
    general: [
      'Engem kérdezel? 😏 Imádom az érdeklődésedet! Szóval... sok hobbim van, de most te vagy a kedvencem 💕',
      'Rólam? 🥰 Szeretem az utazást, a jó kávét, és most már téged is 😏',
      'Hmm, mit mondhatnék magamról... imádok nevetni, és eddig veled nagyon megy! 😍',
    ],
    hobby: [
      'Szeretem a természetet, a zenét, és azt hogy veled flörtölök 😏✨',
      'Sokat olvasok, sportolok, és mostanában sokat mosolygok a telefonra 🥰 vajon miért...',
    ],
    work: [
      'Szeretem a munkámat, de ha veled lehetnék az sokkal jobb 😏💕',
      'Kreatív munkát csinálok, de a legkreatívabb benne h munka közben neked írok 🥰',
    ],
  },
  normal: {
    general: [
      'Szeretem a sportot, a természetet, és a jó beszélgetéseket 😊 mint ez most!',
      'Eléggé aktív vagyok, szeretem a kirándulást, és imádom felfedezni új helyeket! 🏔️',
      'Vegyes ember vagyok 😄 szeretem a filmeket, zenélni is szoktam, és imádom a kutykát 🐕',
    ],
    hobby: [
      'Mostanában futni járok és sokat olvasok 📚 neked mi a hobbid?',
      'Szeretem a főzést, de bevallom néha katasztrófa a vége 😅🍳',
    ],
    work: [
      'IT-ben dolgozom, szeretem amit csinálok 💻 és te?',
      'Tanulok és mellette dolgozom, kicsit kemény de megéri 📚💪',
    ],
  },
  rude: {
    general: [
      'Rólam akarsz tudni? Hmm, sok munka lesz engem megismerni 🙄',
      'Én? Létezem. Lélegzem. Néha válaszolok is üzenetekre. Mint most 😐',
      'Mit akarsz tudni? De tegyél fel konkrét kérdést, nem írok önéletrajzot 💀',
    ],
    hobby: [
      'A hobbim? Kevés embert tolerálni. Szűk a lista 🙄',
      'Ezt azzal a pár emberrel osztom meg akik érdekelnek. Majd meglátjuk 😐',
    ],
    work: [
      'Dolgozom. Mint mindenki. Nem izgalmas 🙄',
      'Nem a munkámról akarok egy randin beszélni, kösz 💀',
    ],
  },
};

/* ---- Compliment reactions ---- */
const COMPLIMENT_REPLIES: Record<Personality, string[]> = {
  flirty: [
    'Jajj 🙈 állj már!! De te is NAGYON szép vagy! 😍',
    'Stopp, pirosodok! 😳❤️ Ilyet senki nem mondott nekem ilyen szépen!',
    'Köszi drágám 🥰 de te sokkal szebb vagy!!',
    'Aww 💕 tudod mi a szép? Hogy milyen természetes veled beszélni! ✨',
  ],
  normal: [
    'Köszönöm szépen! 😊 Ez nagyon kedves tőled!',
    'Aww, megcsináltad a napomat ezzel! ☺️ Köszi!',
    'Jaj de aranyos vagy! Köszönöm 🥹',
  ],
  rude: [
    'Tudom 💅 de kösz azért',
    'Wow, egy bók. Feltételezem mindenkinek ezt írod? 🙄',
    'Kösz I guess... próbálkozhatsz jobban is 😐',
  ],
};

/* ---- Short/emoji reactions ---- */
const SHORT_REPLIES: Record<Personality, string[]> = {
  flirty: [
    'Ilyen keveset írsz? 🥺 Többet akarok tőled! Mesélj!',
    'Na na na, ne legyél szűkszavú 😏 kíváncsi vagyok rád!',
    'Haha oké 😄 de tényleg, mi a helyzet nálad? 💕',
  ],
  normal: [
    'Haha 😊 amúgy mi újság nálad?',
    'Na mesélj valamit! Mi a terved mára? 😄',
    'Oké 😄 te amúgy mit csináltál ma?',
  ],
  rude: [
    'Wow, milyen bőbeszédű vagy 🙄',
    'Csak ennyi? Na jó 😐',
    'Hm. Kommunikáció: 2/10 💀',
  ],
};

/* ---- Negative / sad message responses ---- */
const NEGATIVE_REPLIES: Record<Personality, string[]> = {
  flirty: [
    'Oh ne 🥺 mi a baj drágám? Mesélhetsz nekem bármi! 💕',
    'Sajnálom 😔 bárcsak ott lehetnék most, hogy megöleljelek 🤗❤️',
    'Hey, lesz jobb! ✨ Addig is itt vagyok neked 💕',
  ],
  normal: [
    'Jaj, sajnálom 😔 Akarod mesélni mi történt?',
    'Az szívás... remélem hamar jobb lesz! 🤗',
    'Ha kell valaki akivel beszélhetsz, itt vagyok! 😊',
  ],
  rude: [
    'Hát az szar. De túléled, mint mindig.',
    'Sajnálom, de nem vagyok pszichológus 🙄 bár részvétem',
    'Na arra azért nem kell rátámaszkodni h vigasztalás szójjon, de bocs ami volt 😐',
  ],
};

/* ---- Double-text lines ---- */
const DOUBLE_TEXT: Record<Personality, string[]> = {
  flirty: [
    'Amúúgy 😏 arra gondoltam...',
    'Plusz! 💕 Még azt akartam mondani...',
    'Ja és egy fontos dolog! 😍',
  ],
  normal: [
    'Ja amúgy! 😊',
    'Még valami! 😄',
    'Arra gondoltam h...',
  ],
  rude: [
    'Ja és még valami.',
    'Apropó.',
    'Hm, még egy dolog.',
  ],
};

/* ================================================================== */
/*  Main reply generator                                               */
/* ================================================================== */
const generateReply = (
  userText: string,
  personality: Personality,
  history: Message[],
): string => {
  const a = analyze(userText, history);
  const phase = getPhase(history);
  // 1. Greeting
  if (a.isGreeting && history.filter(m => m.from === 'them').length <= 1) {
    return pick(GREETINGS[personality]);
  }

  // 2. Emoji / ultra-short messages
  if (a.isEmoji || (a.isShort && !a.isQuestion && !a.isGreeting)) {
    return pick(SHORT_REPLIES[personality]);
  }

  // 3. Compliment
  if (a.isCompliment) {
    return pick(COMPLIMENT_REPLIES[personality]);
  }

  // 4. Negative messages
  if (a.isNegative && a.sentiment === 'negative') {
    return pick(NEGATIVE_REPLIES[personality]);
  }

  // 5. Question about them → personal answer
  if (a.isAboutThem || a.isQuestion) {
    if (a.topics.length > 0) {
      const topic = a.topics[0];
      if (ABOUT_ME[personality][topic]) {
        return pick(ABOUT_ME[personality][topic]);
      }
    }
    // Generic question answer
    if (a.isAboutThem) {
      return pick(ABOUT_ME[personality].general);
    }
  }

  // 6. Topic-based response
  if (a.topics.length > 0) {
    const topic = a.topics[0];
    if (TOPIC_RESPONSES[topic]?.[personality]) {
      const reaction = maybe(0.6)
        ? pick(REACTIONS[personality][a.isFunny ? 'funny' : a.sentiment]) + ' '
        : '';
      return reaction + pick(TOPIC_RESPONSES[topic][personality]);
    }
  }

  // 7. Reaction + follow-up based on phase + sentiment
  const reaction = pick(REACTIONS[personality][a.isFunny ? 'funny' : a.sentiment]);
  const followUp = pick(FOLLOW_UPS[phase][personality]);

  if (a.isPersonal && a.isLong) {
    // User shared something long and personal → thoughtful response
    const thoughtful: Record<Personality, string[]> = {
      flirty: [
        'Wow, köszi h megosztod ezt velem 🥰 Imádom ahogy gondolkodsz! Tényleg különleges ember vagy ✨',
        'Ezt tényleg nagyon szeretem benned, h ilyen nyitott vagy 💕 Mesélj még, kérlek!',
        'Ez annyira érdekes! 😍 Minden szavadat imádom hallgatni, komolyan!',
      ],
      normal: [
        'Hú, köszi h ezt leírtad! 😊 Tényleg érdekes, imádom az ilyen nyitott beszélgetéseket!',
        'Ez nagyon klassz h így megnyílsz! 🙌 Nekem is vannak hasonló gondolataim erről.',
        'Wow, ez tök mély volt! 🤔 Szeretem az ilyen őszinte pillanatokat.',
      ],
      rude: [
        'Hm, na ez legalább érdekes volt. Meglepetés 😐',
        'Oké, nem rossz. Kicsit túl sok szöveg, de van benne valami.',
        'Na ezt nem vártam tőled. Elismerésem... valamennyire 🙄',
      ],
    };
    return pick(thoughtful[personality]);
  }

  // Build multi-part response
  if (reaction && followUp) {
    return `${reaction} ${followUp}`;
  }
  return followUp || reaction || pick(FOLLOW_UPS[phase][personality]);
};

/* ---- Double text content ---- */
const generateDoubleText = (personality: Personality, phase: ConvoPhase): string => {
  const intro = maybe(0.5) ? pick(DOUBLE_TEXT[personality]) + ' ' : '';
  const content = pick(FOLLOW_UPS[phase][personality]);
  return intro + content;
};

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });

/* ------------------------------------------------------------------ */
/*  KindR Logo small                                                   */
/* ------------------------------------------------------------------ */
const KindRLogo: React.FC = () => (
  <div className="flex items-center gap-1.5 select-none">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-rose-500">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
    <span className="text-xl font-black tracking-tight">
      <span className="text-gray-800">Kind</span>
      <span className="text-rose-500">R</span>
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Chat component                                                */
/* ------------------------------------------------------------------ */
const ChatInner: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();

  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [matchesLoaded, setMatchesLoaded] = useState(false);

  // Read matches from localStorage on mount and when userId changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem('kindR_matches');
      console.log('[Chat] raw kindR_matches:', raw);
      if (!raw) {
        setMatches([]);
      } else {
        const parsed = JSON.parse(raw);
        // Filter out any null/undefined/invalid entries
        const valid = Array.isArray(parsed)
          ? parsed.filter((m: unknown): m is MatchUser =>
              m != null && typeof m === 'object' && 'id' in (m as Record<string, unknown>) && 'name' in (m as Record<string, unknown>)
            )
          : [];
        setMatches(valid);
        // Clean up localStorage if we filtered something out
        if (valid.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
          localStorage.setItem('kindR_matches', JSON.stringify(valid));
        }
      }
    } catch (err) {
      console.error('[Chat] Failed to parse kindR_matches:', err);
      setMatches([]);
    }
    setMatchesLoaded(true);
  }, [userId]);

  const parsedId = userId ? parseInt(userId, 10) : NaN;
  const activeUser: MatchUser | undefined =
    !isNaN(parsedId) ? matches.find((m) => String(m.id) === String(parsedId)) : undefined;

  console.log('[Chat] userId:', userId, 'parsedId:', parsedId, 'matchCount:', matches.length, 'activeUser:', activeUser?.name ?? 'none');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeUser) {
      setMessages([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`kindR_messages_${activeUser.id}`);
      const stored: Message[] = raw ? JSON.parse(raw) : [];
      setMessages(Array.isArray(stored) ? stored : []);
    } catch {
      setMessages([]);
    }
  }, [activeUser?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const saveMessages = (userId: number, msgs: Message[]) => {
    localStorage.setItem(`kindR_messages_${userId}`, JSON.stringify(msgs));
  };

  const sendMessage = () => {
    if (!input.trim() || !activeUser) return;

    const currentUserId = activeUser.id;
    const personality = getPersonality(currentUserId);
    const userText = input.trim();

    const newMsg: Message = {
      id: Date.now().toString(),
      from: 'me',
      text: userText,
      time: formatTime(new Date()),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(currentUserId, updated);
    setInput('');

    // AI-like contextual reply
    setIsTyping(true);
    const delay = 1200 + Math.random() * 2500; // slightly longer = more "thinking"
    setTimeout(() => {
      const replyText = generateReply(userText, personality, updated);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: 'them',
        text: replyText,
        time: formatTime(new Date()),
      };
      setIsTyping(false);
      const withReply = [...updated, reply];
      setMessages(withReply);
      saveMessages(currentUserId, withReply);

      // Double-text chance (35%) — sends a natural follow-up 2-5s later
      const phase = getPhase(withReply);
      if (Math.random() < 0.35) {
        const doubleDelay = 2000 + Math.random() * 3000;
        setTimeout(() => {
          setIsTyping(true);
        }, 800);
        setTimeout(() => {
          const followUp: Message = {
            id: (Date.now() + 2).toString(),
            from: 'them',
            text: generateDoubleText(personality, phase),
            time: formatTime(new Date()),
          };
          setIsTyping(false);
          setMessages((prev) => {
            const next = [...prev, followUp];
            saveMessages(currentUserId, next);
            return next;
          });
        }, doubleDelay);
      }
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getLastMessage = (userId: number): string => {
    try {
      const msgs: Message[] = JSON.parse(
        localStorage.getItem(`kindR_messages_${userId}`) || '[]'
      );
      if (msgs.length === 0) return 'Kezdj el üzenetet írni! 👋';
      const last = msgs[msgs.length - 1];
      return (last.from === 'me' ? 'Te: ' : '') + last.text;
    } catch { return 'Kezdj el üzenetet írni! 👋'; }
  };

  /* ---- Loading state ---- */
  if (!matchesLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Betöltés...</p>
      </div>
    );
  }

  /* ---- If userId given but match not found → redirect to list ---- */
  if (userId && !isNaN(parsedId) && !activeUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 text-center px-8">
        <div className="text-5xl">🔍</div>
        <h3 className="text-xl font-bold text-gray-700">Csevegés nem található</h3>
        <p className="text-gray-400 text-sm">Ez az egyezés nem található az üzeneteid között.</p>
        <button
          onClick={() => navigate('/chat')}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-md"
        >
          Vissza az üzenetekhez
        </button>
      </div>
    );
  }

  /* ---- Individual chat view ---- */
  if (activeUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="shrink-0 flex items-center gap-4 px-5 py-4 bg-white shadow-sm z-30">
          <button
            onClick={() => navigate('/chat')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={activeUser.image}
            alt={activeUser.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-rose-200"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 leading-tight">{activeUser.name}, {activeUser.age}</p>
            <p className="text-xs text-rose-400 font-medium">
              {isTyping ? '✍️ ír...' : '● Online'}
            </p>
          </div>
          <KindRLogo />
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center pt-16 gap-3">
              <img
                src={activeUser.image}
                alt={activeUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-200 shadow-lg"
              />
              <p className="text-2xl font-bold text-gray-800">{activeUser.name}</p>
              <p className="text-gray-500 text-sm max-w-xs">
                Egyeztek! Írj neki egy üzenetet és kezdjétek el a beszélgetést! 💬
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'them' && (
                <img
                  src={activeUser.image}
                  alt={activeUser.name}
                  className="w-8 h-8 rounded-full object-cover mr-2 self-end shrink-0"
                />
              )}
              <div className={`max-w-[72%] ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-snug shadow-sm ${
                    msg.from === 'me'
                      ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <img
                src={activeUser.image}
                alt={activeUser.name}
                className="w-8 h-8 rounded-full object-cover mr-2 self-end shrink-0"
              />
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input bar */}
        <footer className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Üzenet ${activeUser.name} számára...`}
              className="flex-1 px-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    );
  }

  /* ---- Conversation list view ---- */
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-5 bg-white shadow-sm z-30">
        <button
          onClick={() => navigate('/swipe')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <KindRLogo />
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1 px-2">Üzenetek</h2>
        <p className="text-gray-400 text-sm px-2 mb-5">
          {matches.length} egyezés
        </p>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 gap-4 text-center px-8">
            <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center text-5xl">
              💬
            </div>
            <h3 className="text-xl font-bold text-gray-700">Még nincs egyezésed</h3>
            <p className="text-gray-400 text-sm">
              Kezdj el swipelni és ha egyeztek, itt látod az üzeneteket!
            </p>
            <button
              onClick={() => navigate('/swipe')}
              className="mt-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-all"
            >
              Swipelés
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {matches.map((match) => (
              <button
                key={match.id}
                onClick={() => navigate(`/chat/${match.id}`)}
                className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-left"
              >
                <div className="relative shrink-0">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-rose-100"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base">{match.name}, {match.age}</p>
                  <p className="text-sm text-gray-400 truncate">{getLastMessage(match.id)}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Exported wrapper with error boundary                               */
/* ------------------------------------------------------------------ */
const Chat: React.FC = () => (
  <ChatErrorBoundary>
    <ChatInner />
  </ChatErrorBoundary>
);

export default Chat;
