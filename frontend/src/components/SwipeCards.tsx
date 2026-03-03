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
}

/* ------------------------------------------------------------------ */
/*  KindR Logo                                                         */
/* ------------------------------------------------------------------ */
const KindRLogo: React.FC = () => (
  <div className="flex items-center gap-1 select-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8 text-rose-500 drop-shadow"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
    <span className="text-2xl font-extrabold tracking-tight">
      <span className="text-gray-800">Kind</span>
      <span className="text-rose-500">R</span>
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Swipe overlay indicator (LIKE / NOPE)                              */
/* ------------------------------------------------------------------ */
const SwipeIndicator: React.FC<{ offsetX: number }> = ({ offsetX }) => {
  const opacity = Math.min(Math.abs(offsetX) / 120, 1);
  if (Math.abs(offsetX) < 30) return null;

  return offsetX > 0 ? (
    <div
      className="absolute top-8 left-8 z-10 border-4 border-emerald-400 rounded-lg px-4 py-2 -rotate-12"
      style={{ opacity }}
    >
      <span className="text-emerald-400 font-extrabold text-3xl tracking-widest">LIKE</span>
    </div>
  ) : (
    <div
      className="absolute top-8 right-8 z-10 border-4 border-rose-500 rounded-lg px-4 py-2 rotate-12"
      style={{ opacity }}
    >
      <span className="text-rose-500 font-extrabold text-3xl tracking-widest">NOPE</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const SwipeCards: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Anna',
      age: 25,
      bio: 'Szeretem a természetet 🌿 és a jó kávét ☕',
      distance: '3 km',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: 2,
      name: 'Bence',
      age: 28,
      bio: 'Gitáros 🎸 | Programozó 💻 | Álmodozó 🌙',
      distance: '5 km',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: 3,
      name: 'Cili',
      age: 24,
      bio: 'Utazó lélek ✈️ — a világ az otthonom.',
      distance: '2 km',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // mutable refs so document-level handlers never read stale state
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const currentIndexRef = useRef(currentIndex);

  // stable handler refs
  const moveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const upHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

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
      if (Math.abs(x) > 100) {
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

  const swipeCard = (direction: 'left' | 'right') => {
    // animate card flying off-screen
    setLeaving(direction);
    setOffsetX(direction === 'right' ? 600 : -600);
    setOffsetY(-80);

    setTimeout(() => {
      setUsers(prev => {
        const idx = currentIndexRef.current;
        const userId = prev[idx]?.id;
        console.log(`Swiped ${direction} on user ${userId}`);

        const newUsers = prev.filter((_, i) => i !== idx);
        setCurrentIndex(curr => Math.min(curr, Math.max(0, newUsers.length - 1)));
        return newUsers;
      });

      // reset
      offsetRef.current = { x: 0, y: 0 };
      setOffsetX(0);
      setOffsetY(0);
      isDraggingRef.current = false;
      setIsDragging(false);
      setLeaving(null);
    }, 300);
  };

  // keep refs in sync
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  /* ---------- empty state ---------- */
  if (users.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <KindRLogo />
        <p className="mt-6 text-gray-500 text-lg">Nincs több profil a közeledben 😢</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full font-semibold shadow hover:bg-rose-600 transition"
        >
          Újratöltés
        </button>
      </div>
    );
  }

  const currentUser = users[currentIndex];

  /* ---------- render ---------- */
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* ---- top bar ---- */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3 bg-white shadow-sm z-30">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <KindRLogo />

        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </header>

      {/* ---- card area ---- */}
      <main className="flex-1 min-h-0 flex items-center justify-center px-4 py-4">
        <div className="relative w-full max-w-sm h-full max-h-[540px]">
          {/* stacked cards behind active */}
          {users.slice(currentIndex + 1, currentIndex + 3).reverse().map((user, i) => (
            <div
              key={user.id}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg"
              style={{
                transform: `scale(${0.92 - i * 0.04}) translateY(${(i + 1) * 14}px)`,
                zIndex: 10 - i,
              }}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}

          {/* ---- active card ---- */}
          <div
            ref={cardRef}
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl z-20 cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.08}deg)`,
              transition: leaving || !isDragging ? 'transform 0.3s ease' : 'none',
            }}
            onMouseDown={handleMouseDown}
          >
            {/* photo */}
            <img
              src={currentUser.image}
              alt={currentUser.name}
              draggable={false}
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* LIKE / NOPE indicator */}
            <SwipeIndicator offsetX={offsetX} />

            {/* user info — pinned to bottom-left */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-16 text-white">
              <h2 className="text-3xl font-bold leading-none">
                {currentUser.name}<span className="font-light ml-2 text-2xl">{currentUser.age}</span>
              </h2>
              <div className="flex items-center gap-1 mt-1.5 text-sm text-white/80">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{currentUser.distance} távolságra</span>
              </div>
              <p className="mt-1.5 text-sm text-white/90 leading-snug line-clamp-2">{currentUser.bio}</p>
            </div>
          </div>
        </div>
      </main>

      {/* ---- action buttons ---- */}
      <footer className="shrink-0 flex items-center justify-center gap-4 pb-6 pt-2">
        {/* rewind */}
        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-amber-500 hover:scale-110 transition border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
          </svg>
        </button>

        {/* NOPE */}
        <button
          onClick={() => swipeCard('left')}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 hover:scale-110 transition border border-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* super-like */}
        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-blue-400 hover:scale-110 transition border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>

        {/* LIKE */}
        <button
          onClick={() => swipeCard('right')}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-400 hover:scale-110 transition border border-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>

        {/* boost */}
        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-purple-500 hover:scale-110 transition border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default SwipeCards;
