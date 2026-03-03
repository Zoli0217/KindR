import React, { useState, useRef, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface User {
  id: number;
  name: string;
  age: number;
  bio: string;
  distance: string;
  image: string;
  interests: string[];
}

/* ------------------------------------------------------------------ */
/*  Random User Generator                                              */
/* ------------------------------------------------------------------ */
const FIRST_NAMES_FEMALE = ['Anna', 'Betti', 'Cili', 'Dóra', 'Eszter', 'Fanni', 'Gréta', 'Hanna', 'Ivett', 'Jázmin', 'Kata', 'Lilla', 'Maja', 'Nóra', 'Olívia', 'Petra', 'Rita', 'Sára', 'Tímea', 'Zsófi'];
const FIRST_NAMES_MALE = ['Ádám', 'Bence', 'Csaba', 'Dániel', 'Erik', 'Ferenc', 'Gábor', 'Henrik', 'István', 'János', 'Kristóf', 'László', 'Márk', 'Norbert', 'Olivér', 'Péter', 'Roland', 'Sándor', 'Tamás', 'Zoltán'];

const BIOS = [
  'Szeretem a természetet 🌿 és a jó kávét ☕',
  'Gitáros 🎸 | Programozó 💻 | Álmodozó 🌙',
  'Utazó lélek ✈️ — a világ az otthonom.',
  'Fitness rajongó 💪 | Egészséges életmód híve 🥗',
  'Könyvmoly 📚 | Tea imádó 🍵',
  'Zenész 🎵 | Éjjeli bagoly 🦉',
  'Foodie 🍕 | Mindig éhes vagyok',
  'Művész lélek 🎨 | Kreatív gondolkodó',
  'Sportos típus ⚽ | Csapatszellem híve',
  'Filmrajongó 🎬 | Netflix & chill szakértő',
  'Állatok szeretete 🐕 | Van egy kutyám',
  'Kávéfüggő ☕ | Reggeli ember vagyok',
  'Gamer 🎮 | Éjszakai kalandok',
  'Fotós 📷 | Pillanatokat örökítek meg',
  'Túrázó 🥾 | Hegyek szerelmese',
];

const INTERESTS = ['🎵 Zene', '📚 Könyvek', '🎮 Gaming', '✈️ Utazás', '🍕 Főzés', '💪 Fitness', '🎬 Filmek', '📷 Fotózás', '🎨 Művészet', '🐕 Állatok', '☕ Kávé', '🌿 Természet', '⚽ Sport', '🎸 Hangszerek', '🧘 Jóga'];

// Profi Unsplash képek - modellek/portrék
const PROFILE_IMAGES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=600&fit=crop&crop=face',
];

let userIdCounter = 100;
let imageIndex = 0;

const generateRandomUser = (): User => {
  const isFemale = Math.random() > 0.5;
  const names = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;
  const name = names[Math.floor(Math.random() * names.length)];
  const age = Math.floor(Math.random() * 15) + 20; // 20-35
  const bio = BIOS[Math.floor(Math.random() * BIOS.length)];
  const distance = `${Math.floor(Math.random() * 20) + 1} km`;
  
  // Profi képek sorban
  const image = PROFILE_IMAGES[imageIndex % PROFILE_IMAGES.length];
  imageIndex++;
  
  // Random 2-4 interests
  const shuffled = [...INTERESTS].sort(() => 0.5 - Math.random());
  const interests = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
  
  return {
    id: userIdCounter++,
    name,
    age,
    bio,
    distance,
    image,
    interests,
  };
};

const generateInitialUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => generateRandomUser());
};

/* ------------------------------------------------------------------ */
/*  KindR Logo                                                         */
/* ------------------------------------------------------------------ */
const KindRLogo: React.FC = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-9 h-9 text-rose-500 drop-shadow-lg animate-pulse"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
      <div className="absolute inset-0 bg-rose-400 rounded-full blur-xl opacity-30 animate-ping" />
    </div>
    <span className="text-2xl font-black tracking-tight">
      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Kind</span>
      <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">R</span>
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Swipe overlay indicator (LIKE / NOPE / SUPER)                      */
/* ------------------------------------------------------------------ */
interface SwipeIndicatorProps {
  offsetX: number;
  offsetY: number;
  isSuperLike?: boolean;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ offsetX, offsetY, isSuperLike }) => {
  const opacity = Math.min(Math.abs(offsetX) / 100, 1);
  const superOpacity = Math.min(Math.abs(offsetY) / 80, 1);

  if (isSuperLike && offsetY < -50) {
    return (
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl px-6 py-3 shadow-2xl"
        style={{ opacity: superOpacity, transform: `translateX(-50%) scale(${0.8 + superOpacity * 0.4})` }}
      >
        <span className="text-white font-black text-3xl tracking-wider flex items-center gap-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          SUPER
        </span>
      </div>
    );
  }

  if (Math.abs(offsetX) < 40) return null;

  return offsetX > 0 ? (
    <div
      className="absolute top-8 left-6 z-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl px-5 py-2.5 -rotate-12 shadow-xl"
      style={{ opacity, transform: `rotate(-12deg) scale(${0.8 + opacity * 0.3})` }}
    >
      <span className="text-white font-black text-3xl tracking-wider">LIKE 💚</span>
    </div>
  ) : (
    <div
      className="absolute top-8 right-6 z-10 bg-gradient-to-r from-rose-500 to-red-500 rounded-2xl px-5 py-2.5 rotate-12 shadow-xl"
      style={{ opacity, transform: `rotate(12deg) scale(${0.8 + opacity * 0.3})` }}
    >
      <span className="text-white font-black text-3xl tracking-wider">NOPE 💔</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const SwipeCards: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => generateInitialUsers(5));
  const [swipedUsers, setSwipedUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [leaving, setLeaving] = useState<'left' | 'right' | 'up' | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [boostActive, setBoostActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // mutable refs so document-level handlers never read stale state
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const currentIndexRef = useRef(currentIndex);

  // stable handler refs
  const moveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const upHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  // Add more users when running low
  useEffect(() => {
    if (users.length - currentIndex < 3) {
      const newUsers = Array.from({ length: 5 }, () => generateRandomUser());
      setUsers(prev => [...prev, ...newUsers]);
    }
  }, [currentIndex, users.length]);

  /* ---------- handlers ---------- */
  useEffect(() => {
    moveHandlerRef.current = (e: MouseEvent) => {
      if (!isDraggingRef.current || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      offsetRef.current = { x, y };
      setOffsetX(x);
      setOffsetY(y);
    };

    upHandlerRef.current = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      if (moveHandlerRef.current) document.removeEventListener('mousemove', moveHandlerRef.current);
      if (upHandlerRef.current) document.removeEventListener('mouseup', upHandlerRef.current);

      const x = offsetRef.current.x;
      const y = offsetRef.current.y;
      
      // Super like on upward swipe
      if (y < -80 && Math.abs(x) < 80) {
        swipeCard('up');
      } else if (Math.abs(x) > 100) {
        swipeCard(x > 0 ? 'right' : 'left');
      } else {
        offsetRef.current = { x: 0, y: 0 };
        setOffsetX(0);
        setOffsetY(0);
      }
    };

    return () => {
      if (moveHandlerRef.current) document.removeEventListener('mousemove', moveHandlerRef.current);
      if (upHandlerRef.current) document.removeEventListener('mouseup', upHandlerRef.current);
    };
  }, []);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
    if (moveHandlerRef.current) document.addEventListener('mousemove', moveHandlerRef.current);
    if (upHandlerRef.current) document.addEventListener('mouseup', upHandlerRef.current);
  };

  const swipeCard = (direction: 'left' | 'right' | 'up') => {
    // Save user before removing for rewind
    const swipedUser = users[currentIndex];
    setSwipedUsers(prev => [...prev, swipedUser]);
    
    // animate card flying off-screen
    setLeaving(direction);
    if (direction === 'up') {
      setOffsetX(0);
      setOffsetY(-800);
      // Show match animation for super-like (higher chance)
      if (Math.random() > 0.3) {
        setMatchedUser(swipedUser);
        setTimeout(() => setShowMatch(true), 300);
        setTimeout(() => {
          setShowMatch(false);
          setMatchedUser(null);
        }, 3000);
      }
    } else {
      setOffsetX(direction === 'right' ? 600 : -600);
      setOffsetY(-80);
      // Random match on like
      if (direction === 'right' && Math.random() > 0.5) {
        setMatchedUser(swipedUser);
        setTimeout(() => setShowMatch(true), 300);
        setTimeout(() => {
          setShowMatch(false);
          setMatchedUser(null);
        }, 3000);
      }
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      console.log(`Swiped ${direction} on user ${swipedUser.id}`);

      // reset
      offsetRef.current = { x: 0, y: 0 };
      setOffsetX(0);
      setOffsetY(0);
      isDraggingRef.current = false;
      setIsDragging(false);
      setLeaving(null);
    }, 300);
  };

  const handleRewind = () => {
    if (swipedUsers.length === 0 || currentIndex === 0) return;
    
    setSwipedUsers(prev => prev.slice(0, -1));
    setCurrentIndex(prev => prev - 1);
  };

  const handleSuperLike = () => {
    swipeCard('up');
  };

  const handleBoost = () => {
    setBoostActive(true);
    setTimeout(() => setBoostActive(false), 3000);
  };

  // keep refs in sync
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const currentUser = users[currentIndex];

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Match Animation Overlay */}
      {showMatch && matchedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-rose-600/95 to-pink-700/95 backdrop-blur-sm">
          <div className="text-center px-8">
            {/* Animated hearts background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-4xl animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                >
                  💕
                </div>
              ))}
            </div>
            
            {/* Profile pictures */}
            <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden transform -rotate-12 hover:rotate-0 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face" 
                  alt="You" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white text-5xl animate-pulse">❤️</div>
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden transform rotate-12 hover:rotate-0 transition-transform">
                <img 
                  src={matchedUser.image} 
                  alt={matchedUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Match text */}
            <h2 className="text-5xl font-black text-white mb-3 drop-shadow-lg animate-bounce">
              It's a Match! 🎉
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Te és <span className="font-bold">{matchedUser.name}</span> kedvelitek egymást!
            </p>
            
            {/* Action buttons */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setShowMatch(false);
                  setMatchedUser(null);
                }}
                className="px-8 py-3 bg-white text-rose-600 font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                Üzenet küldése
              </button>
              <button 
                onClick={() => {
                  setShowMatch(false);
                  setMatchedUser(null);
                }}
                className="px-8 py-3 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition-colors"
              >
                Folytatás
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boost Animation Overlay */}
      {boostActive && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full shadow-2xl animate-bounce">
          <span className="text-white font-bold flex items-center gap-2">
            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
            BOOST AKTÍV! Többen látnak most!
          </span>
        </div>
      )}

      {/* ---- top bar ---- */}
      <header className="shrink-0 flex items-center justify-between px-6 py-4 bg-white shadow-sm z-30">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <KindRLogo />

        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
        </button>
      </header>

      {/* ---- card area ---- */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="relative w-full max-w-sm" style={{ height: '500px' }}>
          {/* stacked cards behind active */}
          {users.slice(currentIndex + 1, currentIndex + 3).reverse().map((user, i) => (
            <div
              key={user.id}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-gray-300"
              style={{
                transform: `scale(${0.92 - i * 0.04}) translateY(${(i + 1) * 16}px)`,
                zIndex: 10 - i,
                opacity: 0.6 - i * 0.2,
              }}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/cccccc/666666?text=' + user.name;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            </div>
          ))}

          {/* ---- active card ---- */}
          {currentUser && (
            <div
              ref={cardRef}
              className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl z-20 cursor-grab active:cursor-grabbing select-none bg-gray-300
                ${boostActive ? 'ring-4 ring-purple-500 ring-opacity-75 animate-pulse' : ''}`}
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.06}deg) scale(${isDragging ? 1.02 : 1})`,
                transition: leaving || !isDragging ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
              onMouseDown={handleMouseDown}
            >
              {/* photo */}
              <img
                src={currentUser.image}
                alt={currentUser.name}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/cccccc/666666?text=' + currentUser.name;
                }}
              />

              {/* gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* LIKE / NOPE / SUPER indicator */}
              <SwipeIndicator offsetX={offsetX} offsetY={offsetY} isSuperLike={offsetY < -50} />

              {/* user info — pinned to bottom-left */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-20 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-emerald-500/80 rounded-full text-xs font-medium">Online</span>
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs">{currentUser.distance} távolságra</span>
                </div>
                
                <h2 className="text-4xl font-black leading-none tracking-tight">
                  {currentUser.name}
                  <span className="font-light ml-3 text-3xl text-white/80">{currentUser.age}</span>
                </h2>
                
                <p className="mt-2 text-base text-white/90 leading-snug line-clamp-2">{currentUser.bio}</p>
                
                {/* Interests */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentUser.interests.map((interest, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ---- action buttons ---- */}
      <footer className="shrink-0 flex items-center justify-center gap-3 pb-8 pt-4">
        {/* rewind */}
        <button 
          onClick={handleRewind}
          disabled={swipedUsers.length === 0}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-xl hover:shadow-orange-500/40 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
          </svg>
        </button>

        {/* NOPE */}
        <button
          onClick={() => swipeCard('left')}
          className="w-18 h-18 p-5 rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-xl hover:shadow-rose-500/50 active:scale-95 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* super-like */}
        <button 
          onClick={handleSuperLike}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-95 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>

        {/* LIKE */}
        <button
          onClick={() => swipeCard('right')}
          className="w-18 h-18 p-5 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/50 active:scale-95 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>

        {/* boost */}
        <button 
          onClick={handleBoost}
          disabled={boostActive}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 transition-all duration-300 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
          </svg>
        </button>
      </footer>
    </div>
  );
};


export default SwipeCards;
