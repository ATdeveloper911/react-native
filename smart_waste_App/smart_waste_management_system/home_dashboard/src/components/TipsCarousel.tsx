import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Recycle, Leaf, Info, Lightbulb } from 'lucide-react';
import heroImage from '@/assets/hero-waste-management.png';

interface Tip {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const tips: Tip[] = [
  {
    id: 1,
    title: 'Proper Recycling',
    description: 'Rinse containers before recycling to prevent contamination',
    icon: <Recycle className="w-8 h-8" />,
    gradient: 'gradient-primary',
  },
  {
    id: 2,
    title: 'Go Green',
    description: 'Composting food waste reduces landfill methane by 50%',
    icon: <Leaf className="w-8 h-8" />,
    gradient: 'gradient-secondary',
  },
  {
    id: 3,
    title: 'Did You Know?',
    description: 'Smart bins can reduce collection costs by up to 40%',
    icon: <Info className="w-8 h-8" />,
    gradient: 'gradient-accent',
  },
  {
    id: 4,
    title: 'Eco Tip',
    description: 'One recycled plastic bottle saves enough energy to power a laptop for 25 minutes',
    icon: <Lightbulb className="w-8 h-8" />,
    gradient: 'gradient-primary',
  },
];

const TipsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`${tips[currentIndex].gradient} p-4 rounded-2xl text-primary-foreground`}
        >
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              {tips[currentIndex].icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{tips[currentIndex].title}</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                {tips[currentIndex].description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-4 flex gap-1.5">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TipsCarousel;
