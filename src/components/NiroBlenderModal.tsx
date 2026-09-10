import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, CheckCircle2, RotateCcw, Flame, Snowflake, ShoppingBag } from 'lucide-react';
import { GameState, CropType } from '../types';
import { CROPS } from '../constants';
import { formatNumberShort } from '../utils';

interface NiroBlenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onBlendAndCoolSun: (usedFruits: CropType[]) => void;
  onOpenShop?: () => void;
  t: (key: string) => string;
}

export const NiroBlenderModal: React.FC<NiroBlenderModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onBlendAndCoolSun,
  onOpenShop,
  t,
}) => {
  // 10 distinct fruit slots
  const [selectedFruits, setSelectedFruits] = useState<CropType[]>([]);
  const [blenderState, setBlenderState] = useState<'idle' | 'blending' | 'blended' | 'cooling' | 'celebrating'>('idle');
  const [rewardDetails, setRewardDetails] = useState<{
    coins: number;
    seeds: Partial<Record<CropType, number>>;
  } | null>(null);

  // Extract all distinct fruit/crop types player currently has in inventory (count > 0)
  const availableFruits = useMemo(() => {
    const counts: Partial<Record<CropType, number>> = {};
    Object.entries(gameState.inventory || {}).forEach(([key, count]) => {
      const numericCount = typeof count === 'number' ? count : Number(count) || 0;
      if (numericCount <= 0) return;
      const cropName = key.split('|')[0] as CropType;
      if (cropName && CROPS[cropName]) {
        counts[cropName] = (counts[cropName] || 0) + numericCount;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({
      type: name as CropType,
      crop: CROPS[name as CropType],
      count: count || 0,
    })).sort((a, b) => b.count - a.count);
  }, [gameState.inventory]);

  if (!isOpen) return null;

  const niroState = gameState.summerNiro || {
    timesCooled: 0,
    totalPanachesBlended: 0,
    sunChillLevel: 0,
  };

  const isSunCurrentlyChilled = (niroState.sunCoolBlessingUntil || 0) > Date.now();
  const remainingBlessingSeconds = Math.max(0, Math.floor(((niroState.sunCoolBlessingUntil || 0) - Date.now()) / 1000));
  const remainingBlessingMinutes = Math.ceil(remainingBlessingSeconds / 60);

  const handleToggleFruit = (cropType: CropType) => {
    if (blenderState !== 'idle') return;
    if (selectedFruits.includes(cropType)) {
      setSelectedFruits(prev => prev.filter(f => f !== cropType));
    } else {
      if (selectedFruits.length >= 10) return;
      setSelectedFruits(prev => [...prev, cropType]);
    }
  };

  const handleAutoSelect10 = () => {
    if (blenderState !== 'idle') return;
    const distinctAvailable = availableFruits.map(f => f.type).slice(0, 10);
    setSelectedFruits(distinctAvailable);
  };

  const handleClearSlots = () => {
    if (blenderState !== 'idle') return;
    setSelectedFruits([]);
  };

  const handleStartBlending = () => {
    if (selectedFruits.length !== 10) return;
    setBlenderState('blending');

    setTimeout(() => {
      setBlenderState('blended');
    }, 1800);
  };

  const handleGivePanacheToSun = () => {
    if (blenderState !== 'blended') return;
    setBlenderState('cooling');

    setTimeout(() => {
      // Reward calculation
      const coinsEarned = 25000 + (niroState.timesCooled * 5000);
      const seedsAwarded: Partial<Record<CropType, number>> = {
        'Pineapple': 3,
        'Melon': 3,
        'Banana': 3,
      };

      setRewardDetails({
        coins: coinsEarned,
        seeds: seedsAwarded,
      });

      // Trigger state update
      onBlendAndCoolSun(selectedFruits);
      setBlenderState('celebrating');
    }, 2000);
  };

  const handleResetForNextPanache = () => {
    setSelectedFruits([]);
    setBlenderState('idle');
    setRewardDetails(null);
  };

  return (
    <motion.div
      key="niro-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        className="bg-slate-900 border-2 border-amber-500/50 text-white w-full max-w-xl rounded-[2.5rem] p-5 sm:p-6 shadow-2xl relative overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Ambient Summer Tropical Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg border-2 border-amber-300 text-3xl shadow-amber-500/20">
              🍹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">{t('niro')}</h3>
                <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {t('summer_npc')}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hidden sm:inline-block">
                  {t('tropical_panache')}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('master_of_smoothies')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sun Temperature & Chill Banner */}
        <div className={`mt-4 p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
          isSunCurrentlyChilled 
            ? 'bg-gradient-to-r from-blue-950/70 to-teal-950/70 border-blue-500/40 text-blue-100 shadow-lg shadow-teal-950/30' 
            : 'bg-gradient-to-r from-amber-950/60 to-orange-950/60 border-amber-500/40 text-amber-100'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">
              {isSunCurrentlyChilled ? '😎' : '☀️'}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider">
                  {isSunCurrentlyChilled ? t('sun_chilled_happy') : t('sun_is_scorching')}
                </span>
                {isSunCurrentlyChilled ? (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-blue-500/30 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-black">
                    <Snowflake size={10} className="text-cyan-300" />
                    22°C {t('breeze')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-red-500/30 text-red-300 border border-red-400/40 px-2 py-0.5 rounded-full font-black">
                    <Flame size={10} className="text-orange-400" />
                    100°C {t('blazing')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                {isSunCurrentlyChilled 
                  ? t('chill_blessing_active')
                  : t('needs_panache')}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('sun_cooled_times')}</span>
            <span className="text-sm font-black text-amber-300">
              {niroState.timesCooled} {niroState.timesCooled === 1 ? t('time') : t('times')}
            </span>
          </div>
        </div>

        {/* Niro's Dialogue Speech Bubble */}
        <div className="mt-3.5 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl relative">
          <p className="text-xs text-slate-200 leading-relaxed">
            {t('niro_speech')}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="mt-4">
          {/* Step 1: 10 Fruit Slots */}
          {blenderState === 'idle' && (
            <div className="space-y-4">
              {/* Fruit Slots Display */}
              <div className="p-4 bg-slate-800/50 border border-slate-750 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥣</span>
                    <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
                      {t('fruit_slots')} ({selectedFruits.length} / 10)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {availableFruits.length >= 10 && selectedFruits.length < 10 && (
                      <button
                        onClick={handleAutoSelect10}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                      >
                        {t('auto_fill_10')}
                      </button>
                    )}
                    {selectedFruits.length > 0 && (
                      <button
                        onClick={handleClearSlots}
                        className="text-[11px] font-bold text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-700 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw size={12} />
                        {t('clear')}
                      </button>
                    )}
                  </div>
                </div>

                {/* 10 Visual Fruit Slots Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const fruitType = selectedFruits[index];
                    const cropInfo = fruitType ? CROPS[fruitType] : null;

                    return (
                      <div
                        key={`slot-${index}`}
                        onClick={() => fruitType && handleToggleFruit(fruitType)}
                        className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all group ${
                          cropInfo 
                            ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/20 border-amber-400/80 cursor-pointer shadow-md shadow-amber-500/10 hover:scale-105' 
                            : 'bg-slate-800/60 border-slate-700 border-dashed text-slate-600'
                        }`}
                        title={cropInfo ? `${t(cropInfo.name) || cropInfo.displayName}` : `#${index + 1}`}
                      >
                        {cropInfo ? (
                          <>
                            <span className="text-xl sm:text-2xl">{cropInfo.icon}</span>
                            <span className="text-[9px] text-amber-200 font-bold truncate max-w-[90%] mt-0.5">
                              {t(cropInfo.name) || cropInfo.displayName}
                            </span>
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              ✕
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-black text-slate-500">#{index + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full transition-all duration-300 ${
                        selectedFruits.length === 10
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${(selectedFruits.length / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-slate-400 shrink-0">
                    {selectedFruits.length}/10
                  </span>
                </div>
              </div>

              {/* Selection Tray: Harvested Fruits Available in Inventory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-400" />
                    {t('different_fruits_selected')} ({availableFruits.length})
                  </span>
                  {selectedFruits.length < 10 && (
                    <span className="text-[11px] text-amber-400 font-bold">
                      {t('unique_fruits_hint')}
                    </span>
                  )}
                </div>

                {availableFruits.length === 0 ? (
                  <div className="p-5 bg-slate-800/40 border border-slate-750 rounded-2xl text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      {t('no_fruits_desc')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t('no_fruits_sub')}
                    </p>
                    {onOpenShop && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenShop();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer mt-1"
                      >
                        <ShoppingBag size={14} />
                        {t('open_seed_shop')}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="max-h-48 sm:max-h-52 overflow-y-auto pr-1 space-y-1.5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableFruits.map(({ type, crop, count }) => {
                        const isSelected = selectedFruits.includes(type);
                        const isBlenderFull = selectedFruits.length >= 10;
                        const isDisabled = !isSelected && isBlenderFull;

                        return (
                          <button
                            key={`fruit-choice-${type}`}
                            onClick={() => handleToggleFruit(type)}
                            disabled={isDisabled}
                            className={`p-2.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/25 border-amber-400 text-white shadow-md shadow-amber-500/10 scale-[1.02]'
                                : isDisabled
                                ? 'bg-slate-800/30 border-slate-800 opacity-40 cursor-not-allowed'
                                : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="text-2xl shrink-0">{crop.icon}</span>
                              <div className="overflow-hidden">
                                <div className="text-xs font-black truncate">{t(crop.name) || crop.displayName}</div>
                                <div className="text-[10px] text-slate-400 font-semibold">
                                  {t('owned_label')}: <span className="text-amber-300 font-bold">{count}</span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isSelected ? (
                                <CheckCircle2 size={16} className="text-amber-400" />
                              ) : (
                                <span className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-700/40">
                                  {t('add_fruit')}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Blend Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartBlending}
                  disabled={selectedFruits.length !== 10}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                    selectedFruits.length === 10
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:brightness-110 active:scale-98 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={18} />
                  {selectedFruits.length === 10
                    ? t('blend_panache')
                    : `${t('pick_more_fruits')} (${selectedFruits.length}/10)`}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Blending Animation */}
          {blenderState === 'blending' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.08, 1, 1.08, 1],
                }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-400 flex items-center justify-center text-5xl shadow-2xl shadow-orange-500/40 border-4 border-amber-200"
              >
                🌪️
              </motion.div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">{t('blending_fresh_fruits')}</h4>
                <p className="text-xs text-amber-300 animate-pulse">
                  {t('blending_desc')}
                </p>
              </div>
              {/* Dynamic Fruit Spin Particles */}
              <div className="flex gap-2 text-xl">
                {selectedFruits.slice(0, 6).map((fruit, idx) => (
                  <motion.span
                    key={`spin-particle-${idx}`}
                    animate={{ y: [0, -8, 0], rotate: [0, 180, 360] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: idx * 0.1 }}
                  >
                    {CROPS[fruit]?.icon}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Panache Blended -> Give to the Sun! */}
          {blenderState === 'blended' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-6xl shadow-2xl shadow-amber-500/30 border-4 border-white/80 mx-auto"
                >
                  🍹
                </motion.div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-blue-400 shadow-md whitespace-nowrap">
                  ❄️ {t('breeze')}
                </div>
              </div>

              <div className="space-y-1 max-w-sm">
                <h4 className="text-xl font-black text-white">{t('panache_ready')}</h4>
                <p className="text-xs text-slate-300">
                  {t('panache_ready_desc')}
                </p>
              </div>

              {/* Included Fruits Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md">
                {selectedFruits.map((f, i) => (
                  <span
                    key={`blended-fruit-${i}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300"
                  >
                    <span>{CROPS[f]?.icon}</span>
                    <span>{t(CROPS[f]?.name) || CROPS[f]?.displayName}</span>
                  </span>
                ))}
              </div>

              {/* Action Button: Give to Sun */}
              <button
                onClick={handleGivePanacheToSun}
                className="w-full max-w-md py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 hover:brightness-110 active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-xl">☀️</span>
                {t('give_panache_to_sun')}
              </button>
            </div>
          )}

          {/* Step 4: Cooling Animation */}
          {blenderState === 'cooling' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 1.8 }}
                className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-teal-400 to-amber-300 flex items-center justify-center text-6xl shadow-2xl border-4 border-white/60 mx-auto"
              >
                😎
              </motion.div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">{t('sun_gulping')}</h4>
                <p className="text-xs text-cyan-300 animate-pulse">
                  {t('sun_gulping_desc')}
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Celebrating & Sun Cooled Rewards! */}
          {blenderState === 'celebrating' && rewardDetails && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 via-teal-400 to-emerald-400 flex items-center justify-center text-5xl shadow-2xl shadow-teal-500/30 border-4 border-white mx-auto">
                😎
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black uppercase">
                  <Snowflake size={14} className="text-cyan-300" />
                  {t('sun_cooled_down')}
                </div>
                <h4 className="text-2xl font-black text-white">{t('solar_chill_granted')}</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {t('solar_chill_desc')}
                </p>
              </div>

              {/* Rewards Box */}
              <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <span className="text-xs font-black text-amber-200">{t('suns_coin_bounty')}</span>
                  </div>
                  <span className="text-sm font-black text-amber-300">
                    +£{formatNumberShort(rewardDetails.coins)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <span className="text-xs font-black text-emerald-200">{t('summer_seeds_bundle')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
                    <span>3x 🍍</span>
                    <span>3x 🍈</span>
                    <span>3x 🍌</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-blue-500/15 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">❄️</span>
                    <span className="text-xs font-black text-blue-200">{t('suns_chill_blessing')} (15m)</span>
                  </div>
                  <span className="text-xs font-black text-blue-300">
                    {t('crop_bonus_val')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetForNextPanache}
                  className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  {t('mix_another_panache')}
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-2xl border border-slate-700 transition-all cursor-pointer"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
