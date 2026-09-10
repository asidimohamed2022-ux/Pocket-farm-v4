import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, ShoppingBasket, Coins, Clock, Calendar } from 'lucide-react';
import { CropType, EventMode } from '../types';
import { CROPS } from '../constants';
import { SeasonalEventInfo, getCropBuyPrice, getCropSellPrice } from '../events';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: SeasonalEventInfo;
  eventMode?: EventMode;
  onSetEventMode?: (mode: EventMode) => void;
  onOpenShop: () => void;
  onOpenNiro?: () => void;
  onOpenRayan?: () => void;
  t: (key: string) => string;
  dateText?: string;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  activeEvent,
  eventMode = 'auto',
  onSetEventMode,
  onOpenShop,
  onOpenNiro,
  onOpenRayan,
  t,
  dateText = 'Today',
}) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      key="event-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Event Themed Visual Banner */}
        <div className="relative rounded-3xl p-5 mb-4 overflow-hidden text-white shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
          {/* Ambient Background Particles */}
          <div className="absolute top-2 right-3 flex gap-2 text-2xl opacity-20 pointer-events-none select-none">
            {activeEvent.ambientDecor.map((d, i) => (
              <span key={`decor-particle-${i}`}>{d}</span>
            ))}
          </div>

            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-4xl filter drop-shadow-md">{activeEvent.icon}</span>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-sm mb-1">
                    <Sparkles size={10} className="text-amber-300" />
                    <span>{activeEvent.badge}</span>
                    <span className="opacity-60">•</span>
                    <Calendar size={10} className="text-emerald-300" />
                    <span>{dateText}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{activeEvent.name}</h3>
                  <p className="text-xs text-white/80 font-medium">{activeEvent.subtitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-4 text-xs text-white/90 leading-relaxed bg-white/10 p-3 rounded-2xl backdrop-blur-xs">
              {activeEvent.description}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar">
            {/* Seasonal Calendar Mode & Switcher */}
            {onSetEventMode && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-100">
                    <Calendar size={13} className="text-emerald-500" />
                    <span>Seasonal Calendar</span>
                  </div>
                  {eventMode === 'auto' ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      Auto Calendar Active
                    </span>
                  ) : (
                    <button
                      onClick={() => onSetEventMode('auto')}
                      className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Reset to Auto Calendar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                  <button
                    onClick={() => onSetEventMode('auto')}
                    className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      eventMode === 'auto'
                        ? 'bg-emerald-600 text-white shadow-sm font-black'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/60 dark:border-slate-600/60'
                    }`}
                  >
                    <span>📅</span>
                    <span>Auto</span>
                  </button>
                  <button
                    onClick={() => onSetEventMode('summer')}
                    className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      eventMode === 'summer'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/60 dark:border-slate-600/60'
                    }`}
                  >
                    <span>☀️</span>
                    <span>Summer</span>
                  </button>
                  <button
                    onClick={() => onSetEventMode('ramadan')}
                    className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      eventMode === 'ramadan'
                        ? 'bg-teal-600 text-white shadow-sm font-black'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/60 dark:border-slate-600/60'
                    }`}
                  >
                    <span>🌙</span>
                    <span>Ramadan</span>
                  </button>
                  <button
                    onClick={() => onSetEventMode('halloween')}
                    className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      eventMode === 'halloween'
                        ? 'bg-purple-600 text-white shadow-sm font-black'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/60 dark:border-slate-600/60'
                    }`}
                  >
                    <span>🎃</span>
                    <span>Halloween</span>
                  </button>
                  <button
                    onClick={() => onSetEventMode('christmas')}
                    className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      eventMode === 'christmas'
                        ? 'bg-red-600 text-white shadow-sm font-black'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/60 dark:border-slate-600/60'
                    }`}
                  >
                    <span>🎄</span>
                    <span>Christmas</span>
                  </button>
                  <button
                    onClick={() => onSetEventMode('none')}
                    className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      eventMode === 'none'
                        ? 'bg-slate-600 text-white shadow-sm font-black'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/60 dark:border-slate-600/60'
                    }`}
                  >
                    <span>🌱</span>
                    <span>Standard</span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                  {eventMode === 'auto'
                    ? `Auto Calendar matches your real system date (${dateText}).`
                    : `Manual override active. Click "Auto" to follow the system calendar.`}
                </p>
              </div>
            )}

            {/* Exclusive Event Crops Section */}
            {activeEvent.exclusiveCrops.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Exclusive Event Crops</span>
                  </h4>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenShop();
                    }}
                    className="text-[11px] font-bold text-green-600 dark:text-green-400 flex items-center gap-1 hover:underline"
                  >
                    <ShoppingBasket size={14} />
                    <span>Buy in Shop</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {activeEvent.exclusiveCrops.map((cropKey: CropType) => {
                    const crop = CROPS[cropKey];
                    if (!crop) return null;
                    return (
                      <div
                        key={`event-exclusive-${cropKey}`}
                        className="flex items-center justify-between p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-3xl shadow-sm">
                            {crop.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-black text-sm text-slate-800 dark:text-slate-100">
                                {t(crop.displayName)}
                              </h5>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                crop.rarity === 'Splatsh'
                                  ? 'bg-cyan-500 text-white shadow-xs'
                                  : crop.rarity === 'Sawm'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                              }`}>
                                {crop.rarity}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                              {crop.bonus}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                <Coins size={12} /> Buy: £{getCropBuyPrice(cropKey as CropType, activeEvent.id)} | Sell: £{getCropSellPrice(cropKey as CropType, activeEvent.id)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {Math.round(crop.growTime / 60)}m
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Event Bonus Perks */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">✨</span>
                <div>
                  <h5 className="font-black text-xs text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1">
                    Event Perk & Multiplier
                  </h5>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    {activeEvent.bonusDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Summer Event Special NPC: Niro & Panache */}
            {activeEvent.id === 'summer' && onOpenNiro && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-amber-400/50 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍹</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-black text-xs text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                        {t('niro')} • {t('tropical_panache')}
                      </h5>
                      <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                        {t('summer_npc')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {t('unique_fruits_hint')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNiro();
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {t('niro')}
                </button>
              </div>
            )}

            {/* Ramadan Event Special NPC: Rayan & Iftar Feast */}
            {activeEvent.id === 'ramadan' && onOpenRayan && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-950/40 border-2 border-emerald-400/50 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👳‍♂️</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-black text-xs text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                        {t('rayan') || 'Rayan'} • {t('iftar_feast') || 'Iftar Feast'}
                      </h5>
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                        {t('ramadan_npc') || 'Ramadan NPC'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {t('rayan_event_desc') || 'Cook 10 Ramadan meals like Milk & Dates to earn riches and unlock the Camel!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenRayan();
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {t('rayan') || 'Rayan'}
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 flex gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
            >
              <ShoppingBasket size={16} />
              <span>Go to Shop</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
  );
};
