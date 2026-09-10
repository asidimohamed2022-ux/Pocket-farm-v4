import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { SeasonalEventInfo } from '../events';

interface EventBannerProps {
  activeEvent: SeasonalEventInfo;
  onClick: () => void;
  t: (key: string) => string;
  dateText?: string;
}

export const EventBanner: React.FC<EventBannerProps> = ({ activeEvent, onClick, t, dateText }) => {
  const isSpecialEvent = activeEvent.id !== 'none';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full max-w-sm mx-auto mb-2 px-3 py-2 rounded-2xl border flex items-center justify-between transition-all shadow-sm group cursor-pointer ${
        activeEvent.id === 'ramadan'
          ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white border-emerald-500/50 shadow-emerald-950/20'
          : activeEvent.id === 'summer'
          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white border-amber-300 shadow-orange-500/20'
          : activeEvent.id === 'halloween'
          ? 'bg-gradient-to-r from-purple-950 via-slate-900 to-orange-950 text-white border-purple-500/50 shadow-purple-950/20'
          : activeEvent.id === 'christmas'
          ? 'bg-gradient-to-r from-red-950 via-slate-900 to-emerald-950 text-white border-red-500/50 shadow-red-950/20'
          : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <motion.div
          animate={isSpecialEvent ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-2xl shrink-0 filter drop-shadow-sm select-none"
        >
          {activeEvent.icon}
        </motion.div>
        
        <div className="text-left truncate">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
              isSpecialEvent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {isSpecialEvent ? 'Special Event' : 'Seasonal System'}
            </span>
            <span className="font-black text-xs truncate">
              {activeEvent.name}
            </span>
            {dateText && (
              <span className="text-[10px] font-bold flex items-center gap-0.5 opacity-90 bg-black/15 px-1.5 py-0.5 rounded-md text-white">
                <Calendar size={10} />
                <span>{dateText}</span>
              </span>
            )}
          </div>
          
          <p className={`text-[10px] truncate ${
            isSpecialEvent ? 'text-white/90 font-medium' : 'text-slate-500 dark:text-slate-400'
          }`}>
            {activeEvent.id === 'ramadan' && '🌴 Date Fruit seeds available & +20% coins!'}
            {activeEvent.id === 'summer' && '🍍 Pineapple, Melon & Banana seeds in season!'}
            {activeEvent.id === 'halloween' && '🎃 Pumpkin season & +25% spooky rewards!'}
            {activeEvent.id === 'christmas' && '🎄 Candy Cane seeds & Markman\'s Christmas tree adventure!'}
            {activeEvent.id === 'none' && 'Enjoy the tranquil harvest season'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
          isSpecialEvent ? 'bg-white/20 text-white group-hover:bg-white/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}>
          <span>View</span>
          <ChevronRight size={12} />
        </span>
      </div>
    </motion.button>
  );
};
