import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, Gift, Star, Trophy, ChevronRight, Lock, RotateCcw, Calendar, ArrowRight, Award } from 'lucide-react';
import { GameState, CropType, AnimalType, InfusionType } from '../types';
import { formatNumberShort } from '../utils';
import { getEventSeasonYear } from '../events';

interface ChristmasTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  t: (key: string) => string;
  onBuyCandyCaneSeed?: () => void;
}

export interface TreeBallChallenge {
  id: number;
  name: string;
  color: string;
  textColor: string;
  bgGlow: string;
  icon: string;
  description: string;
  target: number;
  getCurrent: (state: GameState) => number;
  rewardDesc: string;
  // Position coordinates on tree (percentages x, y)
  treeX: number;
  treeY: number;
}

export interface PresentReward {
  id: number;
  title: string;
  icon: string;
  description: string;
  isRudolph?: boolean;
  grant: (state: GameState) => Partial<GameState>;
}

/**
 * Returns dynamic challenges customized for each Christmas season year.
 * Rotates themes and smoothly scales targets so every year has fresh, distinct challenges!
 */
export function getTreeBallsForYear(year: number): TreeBallChallenge[] {
  const cycle = Math.abs(year - 2026) % 3;
  const yearOffset = Math.max(0, year - 2026);

  if (cycle === 0) {
    // Theme A: Classic Winter Wonderland
    return [
      {
        id: 1,
        name: 'Ruby Sparkle Ball',
        color: '#ef4444',
        textColor: 'text-red-500',
        bgGlow: 'shadow-red-500/50',
        icon: '🔴',
        description: `Plant at least ${5 + yearOffset * 2} seeds in your farm plots`,
        target: 5 + yearOffset * 2,
        getCurrent: (state) => {
          const fromCounter = state.christmasTree?.seedsPlantedCount || 0;
          const fromHarvests = state.totalCropsHarvested || 0;
          return Math.max(fromCounter, fromHarvests);
        },
        rewardDesc: 'Unlocks the 1st Crimson Tree Bauble',
        treeX: 50,
        treeY: 26,
      },
      {
        id: 2,
        name: 'Golden Bell Ball',
        color: '#eab308',
        textColor: 'text-amber-500',
        bgGlow: 'shadow-amber-500/50',
        icon: '🔔',
        description: `Harvest at least ${10 + yearOffset * 3} crops of any kind`,
        target: 10 + yearOffset * 3,
        getCurrent: (state) => state.totalCropsHarvested || 0,
        rewardDesc: 'Unlocks the 2nd Golden Bell Bauble',
        treeX: 38,
        treeY: 38,
      },
      {
        id: 3,
        name: 'Peppermint Twist Ball',
        color: '#f43f5e',
        textColor: 'text-rose-500',
        bgGlow: 'shadow-rose-500/50',
        icon: '🦯',
        description: `Harvest at least ${2 + Math.floor(yearOffset / 2)} Candy Cane fruits`,
        target: 2 + Math.floor(yearOffset / 2),
        getCurrent: (state) => {
          const candyHarvested = state.christmasTree?.candyCaneHarvested || 0;
          const inInventory = Object.keys(state.inventory || {}).reduce((sum, k) => {
            if (k === 'Candy Cane' || k.startsWith('Candy Cane|')) {
              return sum + (state.inventory[k] || 0);
            }
            return sum;
          }, 0);
          return Math.max(candyHarvested, inInventory);
        },
        rewardDesc: 'Unlocks the 3rd Peppermint Bauble',
        treeX: 62,
        treeY: 38,
      },
      {
        id: 4,
        name: 'Emerald Pine Ball',
        color: '#10b981',
        textColor: 'text-emerald-500',
        bgGlow: 'shadow-emerald-500/50',
        icon: '🟢',
        description: `Collect or hold at least ${2 + Math.floor(yearOffset / 2)} Animal Products (Milk, Wool, etc.)`,
        target: 2 + Math.floor(yearOffset / 2),
        getCurrent: (state) => {
          return Object.values(state.animalProductInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
        },
        rewardDesc: 'Unlocks the 4th Emerald Bauble',
        treeX: 28,
        treeY: 52,
      },
      {
        id: 5,
        name: 'Frost Sapphire Ball',
        color: '#3b82f6',
        textColor: 'text-blue-500',
        bgGlow: 'shadow-blue-500/50',
        icon: '💎',
        description: `Earn at least £${(1000 + yearOffset * 500).toLocaleString()} in total farm earnings`,
        target: 1000 + yearOffset * 500,
        getCurrent: (state) => state.totalMoneyEarned || state.money || 0,
        rewardDesc: 'Unlocks the 5th Frost Sapphire Bauble',
        treeX: 72,
        treeY: 52,
      },
      {
        id: 6,
        name: 'Royal Amethyst Ball',
        color: '#a855f7',
        textColor: 'text-purple-500',
        bgGlow: 'shadow-purple-500/50',
        icon: '🟣',
        description: 'Have any tonic in inventory or an infused crop in a plot',
        target: 1,
        getCurrent: (state) => {
          const tonicCount = Object.values(state.tonicInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          const hasInfusedPlot = state.plots.some(
            (p) => (p.infusions && p.infusions.length > 0) || p.tonicApplied
          );
          return tonicCount > 0 || hasInfusedPlot ? 1 : 0;
        },
        rewardDesc: 'Unlocks the 6th Royal Amethyst Bauble',
        treeX: 50,
        treeY: 48,
      },
      {
        id: 7,
        name: 'Amber Hearth Ball',
        color: '#f97316',
        textColor: 'text-orange-500',
        bgGlow: 'shadow-orange-500/50',
        icon: '🟠',
        description: 'Own at least 1 Animal in your cages or inventory',
        target: 1,
        getCurrent: (state) => {
          const inInv = Object.values(state.animalInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          const inCages = state.cages.filter((c) => c.type !== null).length;
          return inInv + inCages;
        },
        rewardDesc: 'Unlocks the 7th Amber Hearth Bauble',
        treeX: 22,
        treeY: 66,
      },
      {
        id: 8,
        name: 'Silver Snowflake Ball',
        color: '#94a3b8',
        textColor: 'text-slate-400',
        bgGlow: 'shadow-slate-400/50',
        icon: '❄️',
        description: `Have a wallet balance of at least £${(2500 + yearOffset * 1000).toLocaleString()} coins`,
        target: 2500 + yearOffset * 1000,
        getCurrent: (state) => state.money || 0,
        rewardDesc: 'Unlocks the 8th Silver Snowflake Bauble',
        treeX: 42,
        treeY: 66,
      },
      {
        id: 9,
        name: 'Holiday Joy Ball',
        color: '#ec4899',
        textColor: 'text-pink-500',
        bgGlow: 'shadow-pink-500/50',
        icon: '💖',
        description: 'Expand your farm to at least 5 plots',
        target: 5,
        getCurrent: (state) => state.unlockedPlots || 4,
        rewardDesc: 'Unlocks the 9th Holiday Joy Bauble',
        treeX: 60,
        treeY: 66,
      },
      {
        id: 10,
        name: 'Grand North Pole Star',
        color: '#f59e0b',
        textColor: 'text-yellow-400',
        bgGlow: 'shadow-yellow-400/80',
        icon: '⭐',
        description: `Harvest at least ${20 + yearOffset * 5} total crops on your farm`,
        target: 20 + yearOffset * 5,
        getCurrent: (state) => state.totalCropsHarvested || 0,
        rewardDesc: 'Unlocks the 10th Crown Star Bauble',
        treeX: 78,
        treeY: 66,
      },
    ];
  } else if (cycle === 1) {
    // Theme B: Winter Solstice & Sleigh Bells
    return [
      {
        id: 1,
        name: 'Crimson Cranberry Bauble',
        color: '#dc2626',
        textColor: 'text-red-500',
        bgGlow: 'shadow-red-500/50',
        icon: '🍒',
        description: `Plant at least ${8 + yearOffset * 2} seeds in your farm plots`,
        target: 8 + yearOffset * 2,
        getCurrent: (state) => {
          const fromCounter = state.christmasTree?.seedsPlantedCount || 0;
          const fromHarvests = state.totalCropsHarvested || 0;
          return Math.max(fromCounter, fromHarvests);
        },
        rewardDesc: 'Unlocks the 1st Cranberry Solstice Bauble',
        treeX: 50,
        treeY: 26,
      },
      {
        id: 2,
        name: 'Sleigh Bell Chime Bauble',
        color: '#f59e0b',
        textColor: 'text-amber-400',
        bgGlow: 'shadow-amber-500/50',
        icon: '🪅',
        description: `Harvest at least ${15 + yearOffset * 3} crops of any kind`,
        target: 15 + yearOffset * 3,
        getCurrent: (state) => state.totalCropsHarvested || 0,
        rewardDesc: 'Unlocks the 2nd Sleigh Chime Bauble',
        treeX: 38,
        treeY: 38,
      },
      {
        id: 3,
        name: 'Spiced Peppermint Bauble',
        color: '#fb7185',
        textColor: 'text-rose-400',
        bgGlow: 'shadow-rose-500/50',
        icon: '🦯',
        description: `Harvest at least ${3 + Math.floor(yearOffset / 2)} Candy Cane fruits`,
        target: 3 + Math.floor(yearOffset / 2),
        getCurrent: (state) => {
          const candyHarvested = state.christmasTree?.candyCaneHarvested || 0;
          const inInventory = Object.keys(state.inventory || {}).reduce((sum, k) => {
            if (k === 'Candy Cane' || k.startsWith('Candy Cane|')) {
              return sum + (state.inventory[k] || 0);
            }
            return sum;
          }, 0);
          return Math.max(candyHarvested, inInventory);
        },
        rewardDesc: 'Unlocks the 3rd Spiced Candy Bauble',
        treeX: 62,
        treeY: 38,
      },
      {
        id: 4,
        name: 'Fluffy Winter Fleece Bauble',
        color: '#059669',
        textColor: 'text-emerald-400',
        bgGlow: 'shadow-emerald-500/50',
        icon: '🐑',
        description: `Collect or hold at least ${3 + Math.floor(yearOffset / 2)} Animal Products`,
        target: 3 + Math.floor(yearOffset / 2),
        getCurrent: (state) => {
          return Object.values(state.animalProductInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
        },
        rewardDesc: 'Unlocks the 4th Winter Fleece Bauble',
        treeX: 28,
        treeY: 52,
      },
      {
        id: 5,
        name: 'Glacial Crystal Bauble',
        color: '#0284c7',
        textColor: 'text-sky-400',
        bgGlow: 'shadow-sky-500/50',
        icon: '💠',
        description: `Earn at least £${(2000 + yearOffset * 600).toLocaleString()} in total farm earnings`,
        target: 2000 + yearOffset * 600,
        getCurrent: (state) => state.totalMoneyEarned || state.money || 0,
        rewardDesc: 'Unlocks the 5th Glacial Crystal Bauble',
        treeX: 72,
        treeY: 52,
      },
      {
        id: 6,
        name: 'Enchanted Holiday Elixir Bauble',
        color: '#9333ea',
        textColor: 'text-purple-400',
        bgGlow: 'shadow-purple-500/50',
        icon: '🧪',
        description: 'Hold at least 1 Tonic in bag or have an infused crop plot',
        target: 1,
        getCurrent: (state) => {
          const tonicCount = Object.values(state.tonicInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          const hasInfusedPlot = state.plots.some(
            (p) => (p.infusions && p.infusions.length > 0) || p.tonicApplied
          );
          return tonicCount > 0 || hasInfusedPlot ? 1 : 0;
        },
        rewardDesc: 'Unlocks the 6th Elixir Bauble',
        treeX: 50,
        treeY: 48,
      },
      {
        id: 7,
        name: 'North Pole Pasture Bauble',
        color: '#ea580c',
        textColor: 'text-orange-400',
        bgGlow: 'shadow-orange-500/50',
        icon: '🦌',
        description: 'Own at least 1 Animal in your farm cages or inventory',
        target: 1,
        getCurrent: (state) => {
          const inInv = Object.values(state.animalInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          const inCages = state.cages.filter((c) => c.type !== null).length;
          return inInv + inCages;
        },
        rewardDesc: 'Unlocks the 7th Pasture Bauble',
        treeX: 22,
        treeY: 66,
      },
      {
        id: 8,
        name: 'Frost Treasury Bauble',
        color: '#cbd5e1',
        textColor: 'text-slate-300',
        bgGlow: 'shadow-slate-400/50',
        icon: '🪙',
        description: `Have a wallet balance of at least £${(3500 + yearOffset * 1000).toLocaleString()} coins`,
        target: 3500 + yearOffset * 1000,
        getCurrent: (state) => state.money || 0,
        rewardDesc: 'Unlocks the 8th Treasury Bauble',
        treeX: 42,
        treeY: 66,
      },
      {
        id: 9,
        name: 'Yuletide Expansion Bauble',
        color: '#db2777',
        textColor: 'text-pink-400',
        bgGlow: 'shadow-pink-500/50',
        icon: '🏡',
        description: 'Expand your farm to at least 5 plots',
        target: 5,
        getCurrent: (state) => state.unlockedPlots || 4,
        rewardDesc: 'Unlocks the 9th Yuletide Bauble',
        treeX: 60,
        treeY: 66,
      },
      {
        id: 10,
        name: 'Northern Lights Star of Wonder',
        color: '#eab308',
        textColor: 'text-amber-300',
        bgGlow: 'shadow-yellow-400/90',
        icon: '🌟',
        description: `Harvest at least ${30 + yearOffset * 5} total crops on your farm`,
        target: 30 + yearOffset * 5,
        getCurrent: (state) => state.totalCropsHarvested || 0,
        rewardDesc: 'Unlocks the 10th Northern Lights Crown Star',
        treeX: 78,
        treeY: 66,
      },
    ];
  } else {
    // Theme C: Starry Frost & Royal Hearth
    return [
      {
        id: 1,
        name: 'Poinsettia Blossom Bauble',
        color: '#be123c',
        textColor: 'text-rose-600',
        bgGlow: 'shadow-rose-600/50',
        icon: '🌺',
        description: `Plant at least ${10 + yearOffset * 2} seeds in your farm plots`,
        target: 10 + yearOffset * 2,
        getCurrent: (state) => {
          const fromCounter = state.christmasTree?.seedsPlantedCount || 0;
          const fromHarvests = state.totalCropsHarvested || 0;
          return Math.max(fromCounter, fromHarvests);
        },
        rewardDesc: 'Unlocks the 1st Poinsettia Bauble',
        treeX: 50,
        treeY: 26,
      },
      {
        id: 2,
        name: 'Starlight Carillon Bauble',
        color: '#ca8a04',
        textColor: 'text-yellow-500',
        bgGlow: 'shadow-yellow-500/50',
        icon: '🔔',
        description: `Harvest at least ${20 + yearOffset * 3} crops of any kind`,
        target: 20 + yearOffset * 3,
        getCurrent: (state) => state.totalCropsHarvested || 0,
        rewardDesc: 'Unlocks the 2nd Carillon Bauble',
        treeX: 38,
        treeY: 38,
      },
      {
        id: 3,
        name: 'Frost Swirl Peppermint Bauble',
        color: '#f43f5e',
        textColor: 'text-rose-500',
        bgGlow: 'shadow-rose-500/50',
        icon: '🍭',
        description: `Harvest at least ${4 + Math.floor(yearOffset / 2)} Candy Cane fruits`,
        target: 4 + Math.floor(yearOffset / 2),
        getCurrent: (state) => {
          const candyHarvested = state.christmasTree?.candyCaneHarvested || 0;
          const inInventory = Object.keys(state.inventory || {}).reduce((sum, k) => {
            if (k === 'Candy Cane' || k.startsWith('Candy Cane|')) {
              return sum + (state.inventory[k] || 0);
            }
            return sum;
          }, 0);
          return Math.max(candyHarvested, inInventory);
        },
        rewardDesc: 'Unlocks the 3rd Peppermint Swirl Bauble',
        treeX: 62,
        treeY: 38,
      },
      {
        id: 4,
        name: 'Arctic Barnyard Bounty Bauble',
        color: '#047857',
        textColor: 'text-emerald-500',
        bgGlow: 'shadow-emerald-500/50',
        icon: '🥛',
        description: `Collect or hold at least ${4 + Math.floor(yearOffset / 2)} Animal Products`,
        target: 4 + Math.floor(yearOffset / 2),
        getCurrent: (state) => {
          return Object.values(state.animalProductInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
        },
        rewardDesc: 'Unlocks the 4th Barnyard Bauble',
        treeX: 28,
        treeY: 52,
      },
      {
        id: 5,
        name: 'Aurora Fortune Bauble',
        color: '#2563eb',
        textColor: 'text-blue-500',
        bgGlow: 'shadow-blue-500/50',
        icon: '👑',
        description: `Earn at least £${(3500 + yearOffset * 800).toLocaleString()} in total farm earnings`,
        target: 3500 + yearOffset * 800,
        getCurrent: (state) => state.totalMoneyEarned || state.money || 0,
        rewardDesc: 'Unlocks the 5th Aurora Fortune Bauble',
        treeX: 72,
        treeY: 52,
      },
      {
        id: 6,
        name: 'Celestial Winter Brew Bauble',
        color: '#7c3aed',
        textColor: 'text-violet-500',
        bgGlow: 'shadow-violet-500/50',
        icon: '✨',
        description: 'Hold any Tonic or have an infused plot on your farm',
        target: 1,
        getCurrent: (state) => {
          const tonicCount = Object.values(state.tonicInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          const hasInfusedPlot = state.plots.some(
            (p) => (p.infusions && p.infusions.length > 0) || p.tonicApplied
          );
          return tonicCount > 0 || hasInfusedPlot ? 1 : 0;
        },
        rewardDesc: 'Unlocks the 6th Celestial Brew Bauble',
        treeX: 50,
        treeY: 48,
      },
      {
        id: 7,
        name: 'Reindeer Sanctuary Bauble',
        color: '#c2410c',
        textColor: 'text-orange-500',
        bgGlow: 'shadow-orange-500/50',
        icon: '🛷',
        description: 'Own at least 1 Animal in cages or inventory',
        target: 1,
        getCurrent: (state) => {
          const inInv = Object.values(state.animalInventory || {}).reduce(
            (sum, count) => sum + (count || 0),
            0
          );
          const inCages = state.cages.filter((c) => c.type !== null).length;
          return inInv + inCages;
        },
        rewardDesc: 'Unlocks the 7th Sanctuary Bauble',
        treeX: 22,
        treeY: 66,
      },
      {
        id: 8,
        name: 'Blizzard Vault Bauble',
        color: '#64748b',
        textColor: 'text-slate-400',
        bgGlow: 'shadow-slate-400/50',
        icon: '💰',
        description: `Have a wallet balance of at least £${(5000 + yearOffset * 1500).toLocaleString()} coins`,
        target: 5000 + yearOffset * 1500,
        getCurrent: (state) => state.money || 0,
        rewardDesc: 'Unlocks the 8th Blizzard Vault Bauble',
        treeX: 42,
        treeY: 66,
      },
      {
        id: 9,
        name: 'Grand Winter Estate Bauble',
        color: '#be185d',
        textColor: 'text-pink-500',
        bgGlow: 'shadow-pink-500/50',
        icon: '🏰',
        description: 'Expand your farm to at least 5 plots',
        target: 5,
        getCurrent: (state) => state.unlockedPlots || 4,
        rewardDesc: 'Unlocks the 9th Winter Estate Bauble',
        treeX: 60,
        treeY: 66,
      },
      {
        id: 10,
        name: 'Supernova Star of the Hearth',
        color: '#f59e0b',
        textColor: 'text-amber-300',
        bgGlow: 'shadow-yellow-400/90',
        icon: '🌠',
        description: `Harvest at least ${40 + yearOffset * 5} total crops on your farm`,
        target: 40 + yearOffset * 5,
        getCurrent: (state) => state.totalCropsHarvested || 0,
        rewardDesc: 'Unlocks the 10th Supernova Star of the Hearth',
        treeX: 78,
        treeY: 66,
      },
    ];
  }
}

/**
 * Returns mystery presents from Santa for the given season year.
 */
export function getSantaPresentsForYear(
  year: number,
  isRudolphAlreadyClaimed = false
): PresentReward[] {
  const bonusCoins = Math.max(0, year - 2026) * 2000;
  return [
    {
      id: 1,
      title: `${year} Festive Starter Sack`,
      icon: '🦯',
      description: `£${(5000 + bonusCoins).toLocaleString()} Coins + 5 Candy Cane Seeds`,
      grant: (state) => ({
        money: state.money + 5000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 5000 + bonusCoins,
        seedInventory: {
          ...state.seedInventory,
          'Candy Cane': (state.seedInventory['Candy Cane'] || 0) + 5,
        },
      }),
    },
    {
      id: 2,
      title: 'Lucky Holiday Potion',
      icon: '🍀',
      description: `£${(10000 + bonusCoins).toLocaleString()} Coins + 2 Lucky Tonics`,
      grant: (state) => ({
        money: state.money + 10000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 10000 + bonusCoins,
        tonicInventory: {
          ...state.tonicInventory,
          Lucky: (state.tonicInventory.Lucky || 0) + 2,
        },
      }),
    },
    {
      id: 3,
      title: 'Shadow Frost Chest',
      icon: '💀',
      description: `£${(15000 + bonusCoins).toLocaleString()} Coins + 2 Corrupted Tonics`,
      grant: (state) => ({
        money: state.money + 15000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 15000 + bonusCoins,
        tonicInventory: {
          ...state.tonicInventory,
          Corrupted: (state.tonicInventory.Corrupted || 0) + 2,
        },
      }),
    },
    {
      id: 4,
      title: 'Divine Apple Blessing',
      icon: '🍎',
      description: `£${(20000 + bonusCoins).toLocaleString()} Coins + 1 Divine God Apple Seed`,
      grant: (state) => ({
        money: state.money + 20000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 20000 + bonusCoins,
        seedInventory: {
          ...state.seedInventory,
          'God Apple': (state.seedInventory['God Apple'] || 0) + 1,
        },
      }),
    },
    {
      id: 5,
      title: 'Celestial Starlight Gift',
      icon: '🫐',
      description: `£${(30000 + bonusCoins).toLocaleString()} Coins + 1 Celestial Berry Seed`,
      grant: (state) => ({
        money: state.money + 30000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 30000 + bonusCoins,
        seedInventory: {
          ...state.seedInventory,
          'Celestial Berry': (state.seedInventory['Celestial Berry'] || 0) + 1,
        },
      }),
    },
    isRudolphAlreadyClaimed
      ? {
          id: 6,
          title: "Santa's Grand Reindeer Blessing",
          icon: '🦌',
          description: `£${(75000 + bonusCoins * 2).toLocaleString()} Coins + 10 Candy Cane Seeds + 5 Lucky Tonics!`,
          grant: (state) => ({
            money: state.money + 75000 + bonusCoins * 2,
            totalMoneyEarned: state.totalMoneyEarned + 75000 + bonusCoins * 2,
            seedInventory: {
              ...state.seedInventory,
              'Candy Cane': (state.seedInventory['Candy Cane'] || 0) + 10,
            },
            tonicInventory: {
              ...state.tonicInventory,
              Lucky: (state.tonicInventory.Lucky || 0) + 5,
            },
          }),
        }
      : {
          id: 6,
          title: 'Rudolph the Red-Nosed Reindeer!',
          icon: '🦌',
          description: 'Unlocks Rudolph! Place him in your Animal Pens to produce valuable Deer Antlers!',
          isRudolph: true,
          grant: (state) => ({
            animalAreaUnlocked: true,
            animalInventory: {
              ...state.animalInventory,
              Rudolph: (state.animalInventory.Rudolph || 0) + 1,
            },
          }),
        },
    {
      id: 7,
      title: 'Draconic Winter Hoard',
      icon: '🐲',
      description: `£${(50000 + bonusCoins).toLocaleString()} Coins + 2 Dragonic Tonics`,
      grant: (state) => ({
        money: state.money + 50000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 50000 + bonusCoins,
        tonicInventory: {
          ...state.tonicInventory,
          Dragonic: (state.tonicInventory.Dragonic || 0) + 2,
        },
      }),
    },
    {
      id: 8,
      title: 'Angelic Mango Gift',
      icon: '🥭',
      description: `£${(75000 + bonusCoins).toLocaleString()} Coins + 1 Angelic Mango Seed`,
      grant: (state) => ({
        money: state.money + 75000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 75000 + bonusCoins,
        seedInventory: {
          ...state.seedInventory,
          'Angelic Mango': (state.seedInventory['Angelic Mango'] || 0) + 1,
        },
      }),
    },
    {
      id: 9,
      title: "Santa's Divine Elixir",
      icon: '🌟',
      description: `£${(100000 + bonusCoins).toLocaleString()} Coins + 1 Divine Tonic`,
      grant: (state) => ({
        money: state.money + 100000 + bonusCoins,
        totalMoneyEarned: state.totalMoneyEarned + 100000 + bonusCoins,
        tonicInventory: {
          ...state.tonicInventory,
          Divine: (state.tonicInventory.Divine || 0) + 1,
        },
      }),
    },
    {
      id: 10,
      title: 'The Grand North Pole Stardust Chest',
      icon: '👑',
      description: `£${(250000 + bonusCoins * 2).toLocaleString()} Coins + 1 Stardust Apple Seed`,
      grant: (state) => ({
        money: state.money + 250000 + bonusCoins * 2,
        totalMoneyEarned: state.totalMoneyEarned + 250000 + bonusCoins * 2,
        seedInventory: {
          ...state.seedInventory,
          'Stardust Apple': (state.seedInventory['Stardust Apple'] || 0) + 1,
        },
      }),
    },
  ];
}

// Backwards compatibility export
export const TREE_BALLS: TreeBallChallenge[] = getTreeBallsForYear(2026);
export const SANTA_PRESENTS: PresentReward[] = getSantaPresentsForYear(2026);

export const ChristmasTreeModal: React.FC<ChristmasTreeModalProps> = ({
  isOpen,
  onClose,
  gameState,
  setGameState,
  t,
  onBuyCandyCaneSeed,
}) => {
  const [activeTab, setActiveTab] = useState<'tree' | 'challenges' | 'presents'>('tree');
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);
  const [showYearControl, setShowYearControl] = useState(false);

  if (!isOpen) return null;

  const currentSeasonYear = getEventSeasonYear('christmas', new Date());

  const christmasTree = gameState.christmasTree || {
    year: currentSeasonYear,
    unlockedBalls: [],
    hungBalls: [],
    challengesProgress: {},
    santaVisited: false,
    openedPresents: [],
    rudolphClaimed: false,
    completedYears: [],
  };

  const activeTreeYear = christmasTree.year || currentSeasonYear;
  const completedYears = christmasTree.completedYears || [];

  // Check if calendar year advanced and automatically reset the event
  useEffect(() => {
    if (christmasTree.year && christmasTree.year < currentSeasonYear) {
      const wasCompleted = (christmasTree.hungBalls || []).length >= 10;
      const prevCompleted = christmasTree.completedYears || [];
      const updatedCompleted = wasCompleted && !prevCompleted.includes(christmasTree.year)
        ? [...prevCompleted, christmasTree.year]
        : prevCompleted;

      setGameState((prev) => ({
        ...prev,
        christmasTree: {
          year: currentSeasonYear,
          unlockedBalls: [],
          hungBalls: [],
          challengesProgress: {},
          santaVisited: false,
          openedPresents: [],
          rudolphClaimed: prev.christmasTree?.rudolphClaimed || false,
          seedsPlantedCount: 0,
          candyCaneHarvested: 0,
          completedYears: updatedCompleted,
        },
      }));

      setClaimedNotice(`🎄 Welcome to Christmas ${currentSeasonYear}! The Grand Tree has reset with brand-new challenges!`);
    } else if (!christmasTree.year) {
      setGameState((prev) => ({
        ...prev,
        christmasTree: {
          ...(prev.christmasTree || {
            unlockedBalls: [],
            hungBalls: [],
            challengesProgress: {},
            santaVisited: false,
            openedPresents: [],
            rudolphClaimed: false,
          }),
          year: currentSeasonYear,
        },
      }));
    }
  }, [currentSeasonYear, christmasTree.year]);

  const treeBalls = useMemo(() => getTreeBallsForYear(activeTreeYear), [activeTreeYear]);
  const santaPresents = useMemo(
    () => getSantaPresentsForYear(activeTreeYear, christmasTree.rudolphClaimed),
    [activeTreeYear, christmasTree.rudolphClaimed]
  );

  const hungBalls = christmasTree.hungBalls || [];
  const openedPresents = christmasTree.openedPresents || [];
  const allBallsHung = hungBalls.length >= 10;

  const handleAdvanceYear = (targetYear?: number) => {
    const nextYear = targetYear || (activeTreeYear + 1);
    const wasCompleted = hungBalls.length >= 10;
    const prevCompleted = christmasTree.completedYears || [];
    const newCompleted = wasCompleted && !prevCompleted.includes(activeTreeYear)
      ? [...prevCompleted, activeTreeYear]
      : prevCompleted;

    setGameState((prev) => ({
      ...prev,
      christmasTree: {
        year: nextYear,
        unlockedBalls: [],
        hungBalls: [],
        challengesProgress: {},
        santaVisited: false,
        openedPresents: [],
        rudolphClaimed: prev.christmasTree?.rudolphClaimed || false,
        seedsPlantedCount: 0,
        candyCaneHarvested: 0,
        completedYears: newCompleted,
      },
    }));

    setShowYearControl(false);
    setClaimedNotice(`✨ Event reset for Christmas ${nextYear}! 10 fresh holiday challenges have unlocked!`);
    setTimeout(() => setClaimedNotice(null), 4000);
  };

  const handleResetCurrentYear = () => {
    setGameState((prev) => ({
      ...prev,
      christmasTree: {
        ...(prev.christmasTree || {}),
        year: activeTreeYear,
        unlockedBalls: [],
        hungBalls: [],
        challengesProgress: {},
        santaVisited: false,
        openedPresents: [],
        seedsPlantedCount: 0,
        candyCaneHarvested: 0,
      },
    }));

    setShowYearControl(false);
    setClaimedNotice(`🔄 Christmas ${activeTreeYear} challenges and presents have been reset!`);
    setTimeout(() => setClaimedNotice(null), 4000);
  };

  const handleHangBall = (ballId: number) => {
    if (hungBalls.includes(ballId)) return;
    const challenge = treeBalls.find((b) => b.id === ballId);
    if (!challenge) return;
    const current = challenge.getCurrent(gameState);
    if (current < challenge.target) return;

    setGameState((prev) => {
      const prevTree = prev.christmasTree || {
        year: activeTreeYear,
        unlockedBalls: [],
        hungBalls: [],
        challengesProgress: {},
        santaVisited: false,
        openedPresents: [],
        rudolphClaimed: false,
        completedYears: [],
      };
      const newHung = [...new Set([...prevTree.hungBalls, ballId])];
      const santaNowVisited = prevTree.santaVisited || newHung.length >= 10;
      const prevCompleted = prevTree.completedYears || [];
      const newCompleted = santaNowVisited && !prevCompleted.includes(activeTreeYear)
        ? [...prevCompleted, activeTreeYear]
        : prevCompleted;

      return {
        ...prev,
        christmasTree: {
          ...prevTree,
          year: activeTreeYear,
          hungBalls: newHung,
          santaVisited: santaNowVisited,
          completedYears: newCompleted,
        },
      };
    });

    setClaimedNotice(`✨ You hung ${challenge.name} on the Christmas Tree!`);
    setTimeout(() => setClaimedNotice(null), 3000);
  };

  const handleOpenPresent = (presentId: number) => {
    if (openedPresents.includes(presentId)) return;
    const present = santaPresents.find((p) => p.id === presentId);
    if (!present) return;

    setGameState((prev) => {
      const prevTree = prev.christmasTree || {
        year: activeTreeYear,
        unlockedBalls: [],
        hungBalls: [],
        challengesProgress: {},
        santaVisited: false,
        openedPresents: [],
        rudolphClaimed: false,
      };

      const partial = present.grant(prev);
      const isRudolph = present.isRudolph || false;

      return {
        ...prev,
        ...partial,
        christmasTree: {
          ...prevTree,
          openedPresents: [...new Set([...prevTree.openedPresents, presentId])],
          rudolphClaimed: prevTree.rudolphClaimed || isRudolph,
        },
      };
    });

    if (present.isRudolph) {
      setClaimedNotice(`🦌 HO HO HO! You unlocked Rudolph! You can now place him in your Animal Pens!`);
    } else {
      setClaimedNotice(`🎁 Present #${presentId} opened: ${present.description}!`);
    }
    setTimeout(() => setClaimedNotice(null), 4000);
  };

  return (
    <motion.div
      key="christmas-tree-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-slate-900 border-2 border-emerald-500/40 text-white w-full max-w-2xl rounded-[2.5rem] p-5 sm:p-6 shadow-2xl relative my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Winter Snow Sparkles Header Atmosphere */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg border border-emerald-400/40 text-2xl shrink-0">
              🎄
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-white tracking-tight truncate">
                  The Grand Christmas Tree
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
                  <Calendar size={11} /> {activeTreeYear} Season
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {hungBalls.length}/10 Balls
                </span>
                {completedYears.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1 shrink-0">
                    <Award size={11} /> {completedYears.length} Won
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">
                Hang all 10 baubles to summon Santa & receive 10 festive presents!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowYearControl(!showYearControl)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-amber-500/30 transition-colors"
              title="Yearly Season Reset & Simulator"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Season</span>
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Yearly Season Reset & Controls Panel */}
        <AnimatePresence>
          {showYearControl && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3 mt-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300">🎄 Christmas Season Management</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      Active: {activeTreeYear}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Events automatically reset every year with new challenges. You can also advance to next year or reset now!
                  </p>
                  {completedYears.length > 0 && (
                    <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span>🏆 Completed seasons:</span>
                      <span className="font-bold">{completedYears.join(', ')}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => handleAdvanceYear()}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all"
                  >
                    <span>Advance to {activeTreeYear + 1}</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={handleResetCurrentYear}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <RotateCcw size={12} />
                    <span>Reset {activeTreeYear}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Claimed notification toast */}
        <AnimatePresence>
          {claimedNotice && (
            <motion.div
              key="claimed-notice-toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-gradient-to-r from-red-600 to-emerald-600 text-white text-xs font-bold text-center rounded-xl shadow-lg border border-white/20"
            >
              {claimedNotice}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-4 shrink-0 bg-slate-800/80 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('tree')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'tree'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎄</span>
            <span>Tree View</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'challenges'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⭐</span>
            <span>10 Challenges ({hungBalls.length}/10)</span>
          </button>

          <button
            onClick={() => setActiveTab('presents')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'presents'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎁</span>
            <span>Santa\'s Presents ({openedPresents.length}/10)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          {activeTab === 'tree' && (
            <div className="flex flex-col items-center">
              {/* Christmas Tree Stage */}
              <div className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-4 border border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                {/* Snowy particles / stars in background */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <span className="absolute top-4 left-6 text-sm animate-pulse">❄️</span>
                  <span className="absolute top-12 right-10 text-xs animate-pulse delay-200">✨</span>
                  <span className="absolute top-28 left-12 text-xs animate-pulse delay-500">❄️</span>
                  <span className="absolute bottom-16 right-8 text-sm animate-pulse delay-300">❄️</span>
                  <span className="absolute top-44 right-16 text-xs animate-pulse">✨</span>
                </div>

                {/* Illustrated Layered Pine Tree */}
                <div className="relative w-72 h-88 flex flex-col items-center justify-center">
                  {/* Tree Top Star */}
                  <motion.div
                    animate={
                      hungBalls.includes(10)
                        ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 3 }}
                    className={`absolute top-2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-3xl cursor-pointer transition-all ${
                      hungBalls.includes(10)
                        ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]'
                        : 'text-slate-600 opacity-40 border-2 border-dashed border-slate-600 rounded-full'
                    }`}
                    onClick={() => handleHangBall(10)}
                    title="Top Star Bauble (Challenge #10)"
                  >
                    ⭐
                  </motion.div>

                  {/* SVG Tree Body */}
                  <svg
                    viewBox="0 0 200 240"
                    className="w-full h-full drop-shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                  >
                    {/* Trunk */}
                    <rect x="90" y="195" width="20" height="35" rx="4" fill="#78350f" />

                    {/* Tier 1 (Top) */}
                    <polygon
                      points="100,25 65,75 135,75"
                      fill="#065f46"
                      stroke="#047857"
                      strokeWidth="2"
                    />

                    {/* Tier 2 (Upper Middle) */}
                    <polygon
                      points="100,60 50,115 150,115"
                      fill="#047857"
                      stroke="#059669"
                      strokeWidth="2"
                    />

                    {/* Tier 3 (Lower Middle) */}
                    <polygon
                      points="100,100 35,160 165,160"
                      fill="#065f46"
                      stroke="#047857"
                      strokeWidth="2"
                    />

                    {/* Tier 4 (Bottom) */}
                    <polygon
                      points="100,140 20,205 180,205"
                      fill="#047857"
                      stroke="#10b981"
                      strokeWidth="2"
                    />

                    {/* Decorative String Lights Ribbon */}
                    <path
                      d="M 50,85 Q 100,110 150,85"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      strokeDasharray="4,6"
                      className="opacity-70"
                    />
                    <path
                      d="M 35,130 Q 100,165 165,130"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4,6"
                      className="opacity-70"
                    />
                    <path
                      d="M 20,175 Q 100,215 180,175"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="4,6"
                      className="opacity-70"
                    />
                  </svg>

                  {/* 10 Interactive Tree Baubles */}
                  {treeBalls.map((ball) => {
                    const isHung = hungBalls.includes(ball.id);
                    const current = ball.getCurrent(gameState);
                    const canHang = current >= ball.target && !isHung;

                    return (
                      <motion.div
                        key={`tree-ball-${ball.id}`}
                        style={{
                          left: `${ball.treeX}%`,
                          top: `${ball.treeY}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (canHang) {
                            handleHangBall(ball.id);
                          } else {
                            setActiveTab('challenges');
                          }
                        }}
                      >
                        {isHung ? (
                          <div
                            className="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform"
                            style={{
                              backgroundColor: ball.color,
                              boxShadow: `0 0 12px ${ball.color}`,
                            }}
                          >
                            <span className="text-xs">{ball.icon}</span>
                            <motion.span
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute -top-1 -right-1 text-[8px]"
                            >
                              ✨
                            </motion.span>
                          </div>
                        ) : canHang ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-lg animate-bounce"
                            title={`Tap to hang ${ball.name}!`}
                          >
                            Hang!
                          </motion.div>
                        ) : (
                          <div
                            className="w-6 h-6 rounded-full border-2 border-dashed border-slate-600 bg-slate-900/80 flex items-center justify-center text-[10px] text-slate-400 font-bold opacity-75"
                            title={`${ball.name}: ${current}/${ball.target}`}
                          >
                            {ball.id}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Status Bar */}
                <div className="w-full mt-3 flex items-center justify-between text-xs px-2">
                  <span className="text-slate-400">
                    Tree Progress: <strong className="text-emerald-400">{hungBalls.length}/10</strong> Balls Hung
                  </span>
                  {allBallsHung ? (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <span>🎅</span> Santa is Admiring!
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveTab('challenges')}
                      className="text-amber-400 font-bold flex items-center gap-1 hover:underline"
                    >
                      View Challenges <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Actions / Santa Status */}
              {allBallsHung ? (
                <div className="w-full mt-4 p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-emerald-950/80 border border-red-500/40 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl">🎅</span>
                    <h4 className="text-base font-black text-white">
                      Ho Ho Ho! Santa Admired Your Tree!
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    Your Christmas Tree is fully adorned! Santa has laid 10 magical presents under the tree for you!
                  </p>
                  <button
                    onClick={() => setActiveTab('presents')}
                    className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-lg transition-all"
                  >
                    🎁 Unwrap Santa\'s Presents ({openedPresents.length}/10)
                  </button>
                </div>
              ) : (
                <div className="w-full mt-4 flex items-center justify-between gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🦯</span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Need Candy Canes?</p>
                      <p className="text-[10px] text-slate-400">Grow them to unlock Ball #3!</p>
                    </div>
                  </div>
                  {onBuyCandyCaneSeed && (
                    <button
                      onClick={onBuyCandyCaneSeed}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-sm"
                    >
                      Buy Candy Cane Seed (£150)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Complete each challenge to unlock its ornamental ball. Once unlocked, click{' '}
                <span className="text-amber-400 font-bold">"Hang on Tree"</span> to place it on the Christmas Tree!
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {treeBalls.map((ball) => {
                  const isHung = hungBalls.includes(ball.id);
                  const current = ball.getCurrent(gameState);
                  const isCompleted = current >= ball.target;
                  const progressPct = Math.min(100, Math.round((current / ball.target) * 100));

                  return (
                    <div
                      key={`challenge-card-${ball.id}`}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isHung
                          ? 'bg-slate-800/50 border-emerald-500/30'
                          : isCompleted
                          ? 'bg-gradient-to-r from-slate-800 to-slate-850 border-amber-500/50 shadow-md'
                          : 'bg-slate-850 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                            style={{ backgroundColor: `${ball.color}25`, color: ball.color }}
                          >
                            {ball.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-xs text-white truncate">
                                #{ball.id} {ball.name}
                              </h5>
                              {isHung ? (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Hung
                                </span>
                              ) : isCompleted ? (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                  Ready!
                                </span>
                              ) : (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                                  In Progress
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{ball.description}</p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          {isHung ? (
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-700/40 opacity-80 cursor-default"
                            >
                              ✓ On Tree
                            </button>
                          ) : isCompleted ? (
                            <button
                              onClick={() => handleHangBall(ball.id)}
                              className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/20 animate-bounce"
                            >
                              Hang on Tree!
                            </button>
                          ) : (
                            <div className="text-right">
                              <span className="text-xs font-black text-slate-300">
                                {formatNumberShort(current)} / {formatNumberShort(ball.target)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      {!isHung && (
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${progressPct}%`,
                              backgroundColor: isCompleted ? '#f59e0b' : ball.color,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'presents' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/70 to-emerald-950/70 border border-slate-700 flex items-center gap-4">
                <span className="text-4xl">🎅</span>
                <div>
                  <h4 className="font-black text-sm text-white">Santa Claus & The 10 Presents</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {allBallsHung
                      ? 'Santa is delighted! Tap each present below to unwrap your festive surprises!'
                      : `Hang all 10 balls on the tree to summon Santa! Current progress: ${hungBalls.length}/10 balls.`}
                  </p>
                </div>
              </div>

              {!allBallsHung && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-amber-300">
                    🔒 You still need {10 - hungBalls.length} more ball{10 - hungBalls.length > 1 ? 's' : ''} to unlock Santa\'s presents!
                  </span>
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                  >
                    View Challenges
                  </button>
                </div>
              )}

              {/* 10 Presents Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {santaPresents.map((present) => {
                  const isOpened = openedPresents.includes(present.id);
                  const canOpen = allBallsHung && !isOpened;

                  return (
                    <motion.button
                      key={`present-${present.id}`}
                      disabled={!canOpen && !isOpened}
                      onClick={() => canOpen && handleOpenPresent(present.id)}
                      whileHover={canOpen ? { scale: 1.05 } : {}}
                      whileTap={canOpen ? { scale: 0.95 } : {}}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all min-h-[140px] relative ${
                        isOpened
                          ? 'bg-slate-800/40 border-slate-700/60 opacity-90'
                          : canOpen
                          ? 'bg-gradient-to-b from-red-900/60 to-emerald-900/60 border-amber-400 shadow-lg shadow-red-500/20 cursor-pointer animate-pulse'
                          : 'bg-slate-900/60 border-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Ribbon badge */}
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        #{present.id}
                      </span>

                      {/* Icon */}
                      <div className="my-2">
                        {isOpened ? (
                          <div className="flex flex-col items-center">
                            <span className="text-3xl">{present.icon}</span>
                            <span className="text-[9px] text-emerald-400 font-bold mt-1">Claimed</span>
                          </div>
                        ) : canOpen ? (
                          <div className="flex flex-col items-center">
                            <span className="text-3xl animate-bounce">🎁</span>
                            <span className="text-[9px] text-amber-300 font-black uppercase mt-1">
                              Tap to Open!
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-slate-500">
                            <span className="text-3xl">🎁</span>
                            <Lock size={12} className="mt-1" />
                          </div>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="w-full">
                        {isOpened ? (
                          <>
                            <p
                              className={`font-bold text-[11px] leading-tight ${
                                present.isRudolph ? 'text-amber-300 font-black' : 'text-slate-200'
                              }`}
                            >
                              {present.title}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1 line-clamp-2">
                              {present.description}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-[11px] leading-tight text-slate-200">
                              Mystery Gift #{present.id}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1">
                              {canOpen ? 'Tap to unwrap!' : 'Locked'}
                            </p>
                          </>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="text-[11px] text-slate-400">
            {allBallsHung ? (
              <span className="text-emerald-400 font-bold">
                🎄 All 10 balls hung! Santa visited your tree!
              </span>
            ) : (
              <span>
                Hang all 10 balls to receive 10 mystery presents from Santa!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {allBallsHung && (
              <button
                onClick={() => handleAdvanceYear()}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                title={`Archive ${activeTreeYear} and start Christmas ${activeTreeYear + 1}`}
              >
                <span>Start Year {activeTreeYear + 1}</span>
                <ArrowRight size={13} />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
