'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/banners/hero-1.jpg',
  },
  {
    id: 2,
    image: '/banners/hero-2.jpg',
  },
  {
    id: 3,
    image: '/banners/hero-3.jpg',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <section 
      className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto pt-4 md:pt-6 pb-0 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="w-full h-[420px] sm:h-[520px] md:h-[600px] lg:h-[680px] xl:h-[740px] rounded-2xl relative overflow-hidden bg-slate-100"
        style={{ boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.09), 0 4px 16px -2px rgba(0, 0, 0, 0.05)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={slides[current].image}
              alt={`Hero Banner ${slides[current].id}`}
              fill
              priority={current === 0}
              className="object-cover object-center"
              sizes="(max-width: 2560px) 100vw, 2560px"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
