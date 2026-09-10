import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, MapPin, ChevronRight, Gift, Coins, CheckCircle2 } from 'lucide-react';
import { GameState } from '../types';
import { CROPS } from '../constants';
import { formatNumberShort } from '../utils';

interface MarkmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onOpenChristmasTree: () => void;
  onBuyCandyCaneSeed: () => void;
  t: (key: string) => string;
}

export const MarkmanModal: React.FC<MarkmanModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onOpenChristmasTree,
  onBuyCandyCaneSeed,
  t,
}) => {
  if (!isOpen) return null;

  const christmasTree = gameState.christmasTree || {
    unlockedBalls: [],
    hungBalls: [],
    challengesProgress: {},
    santaVisited: false,
    openedPresents: [],
    rudolphClaimed: false,
  };

  const hungCount = (christmasTree.hungBalls || []).length;
  const openedCount = (christmasTree.openedPresents || []).length;
  const candyCaneSeedCount = gameState.seedInventory['Candy Cane'] || 0;
  const candyPrice = CROPS['Candy Cane']?.buyPrice || 150;

  return (
    <motion.div
      key="markman-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-slate-900 border-2 border-emerald-500/40 text-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Winter Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg border border-emerald-400/40 text-2xl">
              🧑‍🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">Markman</h3>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-500/30">
                  Santa\'s Scout
                </span>
              </div>
              <p className="text-xs text-slate-400">Christmas Explorer & Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialogue Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-750 relative">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🎄</span>
            <div className="space-y-2 text-xs text-slate-200 leading-relaxed">
              <p>
                <strong>"Ho Ho Ho, Farmer!</strong> I am <strong>Markman</strong>, Santa\'s royal scout!
                Deep in our snowy Winter Haven, the Grand Christmas Tree is waiting to be decorated."
              </p>
              <p className="text-slate-300">
                "There are <strong>10 magical challenge balls</strong> to hang. If you unlock and hang all 10 balls,{' '}
                <strong className="text-amber-300">Santa will come and admire your tree</strong> and leave{' '}
                <strong className="text-amber-300">10 mystery presents</strong> filled with wonderful holiday surprises!"
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="p-3.5 bg-slate-850 rounded-2xl border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Christmas Tree Balls:</span>
            <span className="font-bold text-emerald-400">{hungCount} / 10 Hung</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.round((hungCount / 10) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Santa Presents: <strong className="text-amber-300">{openedCount}/10 Opened</strong></span>
            {christmasTree.rudolphClaimed ? (
              <span className="text-emerald-400 font-bold">✓ Rudolph in Animal Pens</span>
            ) : (
              <span className="text-slate-400 font-medium">🎁 10 Mystery Presents</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Main Travel Button */}
          <button
            onClick={() => {
              onClose();
              onOpenChristmasTree();
            }}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/20 hover:from-emerald-500 hover:to-teal-500 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎄</span>
              <span>Travel with Markman to Christmas Tree</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] bg-emerald-700/60 px-2 py-1 rounded-xl">
              <span>{hungCount}/10 Balls</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Quick Buy Candy Cane Seeds */}
          <div className="flex items-center justify-between gap-2 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🦯</span>
              <div className="text-left">
                <p className="font-bold text-xs text-white">Candy Cane Fruit Seeds</p>
                <p className="text-[10px] text-slate-400">
                  Owned: {candyCaneSeedCount} seeds • Plant for Challenge #3!
                </p>
              </div>
            </div>
            <button
              onClick={onBuyCandyCaneSeed}
              disabled={gameState.money < candyPrice}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Coins size={12} />
              <span>Buy (£{candyPrice})</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-bold"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
