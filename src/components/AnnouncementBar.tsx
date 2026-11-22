import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    text: 'FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹1,999 • COD AVAILABLE',
    highlight: 'FREE SHIPPING',
    link: '/collections',
  },
  {
    text: 'USE CODE: TREVORI200 FOR FLAT ₹200 OFF YOUR FIRST ORDER',
    highlight: 'TREVORI200',
    link: '/collections',
  },
  {
    text: '100% COMBED BIO-WASH COTTON • 240–400 GSM ARCHITECTURAL HEAVYWEIGHT DROPS',
    highlight: '240–400 GSM',
    link: '/about',
  },
  {
    text: 'EXPERIENCE YOUR SILHOUETTE IN THE 3D VIRTUAL FITTING ROOM',
    highlight: '3D VIRTUAL',
    link: '/try-on',
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-[#07111E] text-slate-300 border-b border-[#1E3A66]/40 py-2 sm:py-2.5 px-4 font-sans select-none relative z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Central Clean Message */}
        <div className="flex-1 text-center overflow-hidden px-2">
          <Link
            to={current.link}
            className="inline-block transition-opacity duration-300 hover:text-white"
          >
            <span className="tracking-[0.16em] uppercase font-medium text-slate-300 hover:text-white">
              {current.text.split(current.highlight).map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <strong className="font-bold text-[#F88379] tracking-wider">
                      {current.highlight}
                    </strong>
                  )}
                </React.Fragment>
              ))}
            </span>
          </Link>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next announcement"
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
