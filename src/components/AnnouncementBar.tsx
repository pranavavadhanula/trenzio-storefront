import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    text: 'FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,999',
    highlight: 'FREE EXPRESS SHIPPING',
    link: '/collections',
  },
  {
    text: 'USE CODE: TREVORI200 FOR FLAT ₹200 OFF',
    highlight: 'TREVORI200',
    link: '/collections',
  },
  {
    text: '100% COMBED COTTON • 240–400 GSM DROPS',
    highlight: '240–400 GSM',
    link: '/about',
  },
  {
    text: '3D VIRTUAL FIT ROOM • LIVE PREVIEW',
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
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full max-w-full overflow-hidden bg-[#07111E] text-slate-300 border-b border-[#1E3A66]/40 py-2 sm:py-2.5 px-3 sm:px-4 font-sans select-none relative z-40 transition-colors"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between min-w-0 text-[10px] sm:text-xs">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="shrink-0 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Central Clean Luxury Message */}
        <div className="flex-1 min-w-0 text-center overflow-hidden px-2">
          <Link
            to={current.link}
            className="block truncate max-w-full transition-opacity duration-300 hover:text-white"
          >
            <span className="tracking-[0.14em] uppercase font-medium text-slate-300 hover:text-white">
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
          className="shrink-0 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
