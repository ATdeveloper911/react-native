import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface BinCard {
  id: number;
  location: string;
  address: string;
  fillLevel: number;
  status: 'empty' | 'filling' | 'full' | 'overflow';
  lastUpdated: string;
}

const binData: BinCard[] = [
  { id: 1, location: 'Main Street Bin', address: '123 Main St', fillLevel: 85, status: 'full', lastUpdated: '2 min ago' },
  { id: 2, location: 'Park Avenue', address: '45 Park Ave', fillLevel: 45, status: 'filling', lastUpdated: '5 min ago' },
  { id: 3, location: 'Market Square', address: '78 Market Sq', fillLevel: 20, status: 'empty', lastUpdated: '8 min ago' },
  { id: 4, location: 'Campus Area', address: 'University Rd', fillLevel: 95, status: 'overflow', lastUpdated: '1 min ago' },
  { id: 5, location: 'Residential Block', address: '90 Oak Lane', fillLevel: 60, status: 'filling', lastUpdated: '12 min ago' },
];

const getStatusColor = (status: BinCard['status']) => {
  switch (status) {
    case 'empty': return 'bg-success';
    case 'filling': return 'bg-info';
    case 'full': return 'bg-warning';
    case 'overflow': return 'bg-destructive';
    default: return 'bg-muted';
  }
};

const getStatusIcon = (status: BinCard['status']) => {
  switch (status) {
    case 'empty': return <CheckCircle className="w-4 h-4" />;
    case 'filling': return <Trash2 className="w-4 h-4" />;
    case 'full': return <AlertTriangle className="w-4 h-4" />;
    case 'overflow': return <AlertTriangle className="w-4 h-4" />;
    default: return <Trash2 className="w-4 h-4" />;
  }
};

const SwipableCard: React.FC<{
  card: BinCard;
  index: number;
  totalCards: number;
  onSwipe: () => void;
}> = ({ card, index, totalCards, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe();
    }
  };

  const stackOffset = index * 8;
  const stackScale = 1 - index * 0.05;

  return (
    <motion.div
      className="absolute w-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex: totalCards - index,
        top: stackOffset,
        scale: stackScale,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: stackScale, opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="bg-card rounded-2xl p-4 shadow-medium border border-border">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`${getStatusColor(card.status)} w-10 h-10 rounded-xl flex items-center justify-center text-white`}>
              {getStatusIcon(card.status)}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{card.location}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <MapPin className="w-3 h-3" />
                <span>{card.address}</span>
              </div>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(card.status)} text-white`}>
            {card.status}
          </div>
        </div>

        {/* Fill Level Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Fill Level</span>
            <span className="font-semibold text-foreground">{card.fillLevel}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${getStatusColor(card.status)} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${card.fillLevel}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated {card.lastUpdated}</span>
          </div>
          <span className="text-primary font-medium">Swipe to view next →</span>
        </div>
      </div>
    </motion.div>
  );
};

const SwipableCardStack: React.FC = () => {
  const [cards, setCards] = useState(binData);

  const handleSwipe = () => {
    setCards((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <div className="relative h-48 mb-4">
      {cards.slice(0, 3).map((card, index) => (
        <SwipableCard
          key={card.id}
          card={card}
          index={index}
          totalCards={3}
          onSwipe={handleSwipe}
        />
      ))}
    </div>
  );
};

export default SwipableCardStack;
