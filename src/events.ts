import { CropType, SeasonalEventType, EventMode } from './types';
import { CROPS } from './constants';

export interface SeasonalEventInfo {
  id: SeasonalEventType;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
  secondaryIcon: string;
  exclusiveCrops: CropType[];
  bonusDescription: string;
  harvestCoinMultiplier: number;
  bgGradient: string;
  bannerBg: string;
  bannerBorder: string;
  badgeBg: string;
  accentText: string;
  ambientDecor: string[];
}

export const SEASONAL_EVENTS: Record<SeasonalEventType, SeasonalEventInfo> = {
  ramadan: {
    id: 'ramadan',
    name: 'Ramadan Mubarak',
    subtitle: 'Holy Month of Blessings',
    description: 'The crescent moon shines bright! Special Date Fruit seeds featuring the sacred Sawm rarity are exclusively available in the shop, bringing peaceful blessings and +20% bonus coins.',
    badge: '🌙 Ramadan Event',
    icon: '🌙',
    secondaryIcon: '🌴',
    exclusiveCrops: ['Date Fruit'],
    bonusDescription: 'Exclusive Sawm rarity with +20% sell bonus on Date Fruits',
    harvestCoinMultiplier: 1.2,
    bgGradient: 'from-emerald-900 via-teal-950 to-slate-950',
    bannerBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    bannerBorder: 'border-emerald-300 dark:border-emerald-700',
    badgeBg: 'bg-emerald-600 text-white',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    ambientDecor: ['🌙', '⭐', '✨', '🕌', '🌴'],
  },
  summer: {
    id: 'summer',
    name: 'Summer Splash Festival',
    subtitle: 'Sun, Sea & Sweet Fruits',
    description: 'Summer heat is in full swing! Refreshing Pineapple, juicy Melon, and golden Banana are in season featuring the exclusive Splatsh rarity with +20% bonus coins.',
    badge: '☀️ Summer Event',
    icon: '☀️',
    secondaryIcon: '🍍',
    exclusiveCrops: ['Pineapple', 'Melon', 'Banana'],
    bonusDescription: 'Exclusive Splatsh rarity with +20% sell bonus on Pineapple, Melon & Banana',
    harvestCoinMultiplier: 1.2,
    bgGradient: 'from-amber-600 via-orange-600 to-yellow-600',
    bannerBg: 'bg-amber-50 dark:bg-amber-950/60',
    bannerBorder: 'border-amber-300 dark:border-amber-700',
    badgeBg: 'bg-amber-500 text-white',
    accentText: 'text-amber-700 dark:text-amber-300',
    ambientDecor: ['☀️', '🌴', '🌊', '🌺', '🍹'],
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween Spooktacular',
    subtitle: 'Spooky Harvest & Sweet Treats',
    description: 'Eerie shadows, glowing jack-o-lanterns, and sweet treats! During Halloween, Pumpkin planting prices drop by 50% (£50) and sell prices double (£400+), with delicious Corn Candy sweets in season!',
    badge: '🎃 Halloween Event',
    icon: '🎃',
    secondaryIcon: '🍬',
    exclusiveCrops: ['Pumpkin', 'Corn Candy'],
    bonusDescription: 'Pumpkin seeds 50% off (£50) & 2x sell price (£400+) + sweet Corn Candy with +25% harvest rewards',
    harvestCoinMultiplier: 1.25,
    bgGradient: 'from-purple-950 via-slate-950 to-orange-950',
    bannerBg: 'bg-purple-50 dark:bg-purple-950/60',
    bannerBorder: 'border-purple-300 dark:border-purple-700',
    badgeBg: 'bg-purple-600 text-white',
    accentText: 'text-purple-700 dark:text-purple-300',
    ambientDecor: ['🎃', '👻', '🦇', '🍬', '🕸️'],
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas Wonderland',
    subtitle: 'Holiday Joy & Snowy Festivities',
    description: 'Snow glitters on the pines and sleigh bells ring! Sweet Candy Cane fruit thrives in the winter chill with +25% harvest rewards, and Markman has brought the legendary Christmas Tree with 10 challenge ornaments and Santa\'s gifts!',
    badge: '🎄 Christmas Event',
    icon: '🎄',
    secondaryIcon: '🦯',
    exclusiveCrops: ['Candy Cane'],
    bonusDescription: 'Candy Cane seeds in season with +25% harvest coin bonus & Markman\'s Christmas Tree adventure',
    harvestCoinMultiplier: 1.25,
    bgGradient: 'from-red-950 via-slate-950 to-emerald-950',
    bannerBg: 'bg-red-50 dark:bg-red-950/60',
    bannerBorder: 'border-red-300 dark:border-red-700',
    badgeBg: 'bg-red-600 text-white',
    accentText: 'text-red-700 dark:text-red-300',
    ambientDecor: ['🎄', '❄️', '⛄', '🦯', '🎁', '🔔', '🦌'],
  },
  none: {
    id: 'none',
    name: 'Standard Season',
    subtitle: 'Cozy Farming Days',
    description: 'A peaceful time on the farm. Cultivate your fields and enjoy tranquil farm life.',
    badge: 'Farm Season',
    icon: '🌱',
    secondaryIcon: '🚜',
    exclusiveCrops: [],
    bonusDescription: 'Standard seasonal harvest',
    harvestCoinMultiplier: 1.0,
    bgGradient: 'from-slate-800 to-slate-900',
    bannerBg: 'bg-slate-50 dark:bg-slate-900',
    bannerBorder: 'border-slate-200 dark:border-slate-800',
    badgeBg: 'bg-slate-600 text-white',
    accentText: 'text-slate-700 dark:text-slate-300',
    ambientDecor: ['🌱', '🌾', '🌻', '🍃'],
  },
};

/**
 * Terraria-style automatic seasonal event detection using system calendar date.
 * Terraria automatically enables:
 * - Halloween: October 10 - November 1
 * - Christmas: December 15 - December 31
 * 
 * Here we automatically detect:
 * - Ramadan: Islamic lunar month (accurate Gregorian dates for 2024-2030)
 * - Summer: June 1 - September 15
 * - Halloween: October 10 - November 1
 */
export function getCalendarEvent(date: Date = new Date()): SeasonalEventType {
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 1 = Feb, ..., 11 = Dec
  const day = date.getDate();

  // 1. Ramadan calendar checks (Gregorian equivalent ranges):
  const ramadanRanges: Array<{ start: [number, number, number]; end: [number, number, number] }> = [
    { start: [2024, 2, 10], end: [2024, 3, 10] }, // Mar 10 - Apr 10, 2024
    { start: [2025, 1, 28], end: [2025, 2, 30] }, // Feb 28 - Mar 30, 2025
    { start: [2026, 1, 17], end: [2026, 2, 20] }, // Feb 17 - Mar 20, 2026
    { start: [2027, 1, 7], end: [2027, 2, 9] },   // Feb 7 - Mar 9, 2027
    { start: [2028, 0, 27], end: [2028, 1, 27] }, // Jan 27 - Feb 27, 2028
    { start: [2029, 0, 15], end: [2029, 1, 15] }, // Jan 15 - Feb 15, 2029
    { start: [2030, 0, 5], end: [2030, 1, 4] },   // Jan 5 - Feb 4, 2030
  ];

  for (const range of ramadanRanges) {
    const start = new Date(range.start[0], range.start[1], range.start[2], 0, 0, 0);
    const end = new Date(range.end[0], range.end[1], range.end[2], 23, 59, 59);
    if (date >= start && date <= end) {
      return 'ramadan';
    }
  }

  // 2. Halloween check (Terraria dates: October 10 - November 1):
  if ((month === 9 && day >= 10) || (month === 10 && day <= 1)) {
    return 'halloween';
  }

  // 3. Summer check (June 1 - September 15):
  if (month === 5 || month === 6 || month === 7 || (month === 8 && day <= 15)) {
    return 'summer';
  }

  // 4. Christmas check (Terraria dates: December 15 - January 5):
  if ((month === 11 && day >= 15) || (month === 0 && day <= 5)) {
    return 'christmas';
  }

  return 'none';
}

/**
 * Calculates the season year for a given event and date.
 * For Christmas (Dec 15 - Jan 5):
 * December of year Y and January of year Y+1 both belong to the year Y Christmas season.
 * For other events: returns the current year of the date.
 */
export function getEventSeasonYear(eventId: SeasonalEventType = 'christmas', date: Date = new Date()): number {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (eventId === 'christmas' && month === 0) {
    return year - 1;
  }
  return year;
}

/**
 * Resolves the currently active seasonal event given user setting (auto vs manual override).
 */
export function getActiveSeasonalEvent(
  mode: EventMode = 'auto',
  testDate: Date = new Date()
): SeasonalEventInfo {
  const eventId: SeasonalEventType = mode === 'auto' ? getCalendarEvent(testDate) : mode;
  return SEASONAL_EVENTS[eventId] || SEASONAL_EVENTS.none;
}

/**
 * Checks whether a crop is available to buy in the shop given the active event.
 * If a crop has an associated event, it can only be purchased when that event is active.
 */
export function isCropAvailableInShop(
  cropEvent: SeasonalEventType | undefined,
  activeEvent: SeasonalEventType
): boolean {
  if (!cropEvent || cropEvent === 'none') {
    return true;
  }
  return cropEvent === activeEvent;
}

/**
 * Checks if the crop gets a special seasonal harvest bonus multiplier.
 */
export function getEventCropMultiplier(
  cropType: CropType,
  activeEvent: SeasonalEventType
): number {
  if (activeEvent === 'none') return 1;
  const event = SEASONAL_EVENTS[activeEvent];
  if (event && event.exclusiveCrops.includes(cropType)) {
    return event.harvestCoinMultiplier;
  }
  return 1;
}

/**
 * Returns the effective buy price for a crop given the active seasonal event.
 * During Halloween, Pumpkin buy price goes down from 100 to 50 coins (-50% discount).
 */
export function getCropBuyPrice(cropType: CropType, activeEvent: SeasonalEventType): number {
  const baseCrop = CROPS[cropType];
  if (!baseCrop) return 0;
  if (cropType === 'Pumpkin' && activeEvent === 'halloween') {
    return 50; // Pumpkin buy price drops to 50 coins during Halloween
  }
  return baseCrop.buyPrice;
}

/**
 * Returns the effective base sell price for a crop given the active seasonal event before infusion/bonus multipliers.
 * During Halloween, Pumpkin sell price goes up from 200 to 400 coins (+100% surge).
 */
export function getCropSellPrice(cropType: CropType, activeEvent: SeasonalEventType): number {
  const baseCrop = CROPS[cropType];
  if (!baseCrop) return 0;
  if (cropType === 'Pumpkin' && activeEvent === 'halloween') {
    return 400; // Pumpkin base sell price doubles to 400 coins during Halloween
  }
  return baseCrop.sellPrice;
}

export interface EventTimingDetails {
  eventId: SeasonalEventType;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isUpcoming: boolean;
  hasEnded: boolean;
  timeToStartMs: number;
  timeToEndMs: number;
  formattedStartDate: string;
  formattedEndDate: string;
  timeToStartText: string;
  timeToEndText: string;
  progressPercent: number;
}

export function formatRemainingDuration(ms: number): string {
  if (ms <= 0) return '0m';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${totalSeconds % 60}s`;
}

/**
 * Calculates start date, end date, time to start, and time to end for an event.
 */
export function getEventTimingDetails(
  eventId: SeasonalEventType,
  now: Date = new Date()
): EventTimingDetails {
  const currentYear = now.getFullYear();
  let startDate = new Date(currentYear, 0, 1);
  let endDate = new Date(currentYear, 11, 31, 23, 59, 59);

  if (eventId === 'summer') {
    // June 1 (00:00:00) to September 15 (23:59:59)
    startDate = new Date(currentYear, 5, 1, 0, 0, 0);
    endDate = new Date(currentYear, 8, 15, 23, 59, 59);
    if (now > endDate) {
      startDate = new Date(currentYear + 1, 5, 1, 0, 0, 0);
      endDate = new Date(currentYear + 1, 8, 15, 23, 59, 59);
    }
  } else if (eventId === 'halloween') {
    // October 10 (00:00:00) to November 1 (23:59:59)
    startDate = new Date(currentYear, 9, 10, 0, 0, 0);
    endDate = new Date(currentYear, 10, 1, 23, 59, 59);
    if (now > endDate) {
      startDate = new Date(currentYear + 1, 9, 10, 0, 0, 0);
      endDate = new Date(currentYear + 1, 10, 1, 23, 59, 59);
    }
  } else if (eventId === 'christmas') {
    // December 15 (00:00:00) to January 5 (23:59:59 next year)
    startDate = new Date(currentYear, 11, 15, 0, 0, 0);
    endDate = new Date(currentYear + 1, 0, 5, 23, 59, 59);
    if (now > endDate) {
      startDate = new Date(currentYear + 1, 11, 15, 0, 0, 0);
      endDate = new Date(currentYear + 2, 0, 5, 23, 59, 59);
    }
  } else if (eventId === 'ramadan') {
    const ramadanRanges: Array<{ start: [number, number, number]; end: [number, number, number] }> = [
      { start: [2024, 2, 10], end: [2024, 3, 10] },
      { start: [2025, 1, 28], end: [2025, 2, 30] },
      { start: [2026, 1, 17], end: [2026, 2, 20] },
      { start: [2027, 1, 7], end: [2027, 2, 9] },
      { start: [2028, 0, 27], end: [2028, 1, 27] },
      { start: [2029, 0, 15], end: [2029, 1, 15] },
      { start: [2030, 0, 5], end: [2030, 1, 4] },
    ];
    let found = ramadanRanges.find(r => {
      const e = new Date(r.end[0], r.end[1], r.end[2], 23, 59, 59);
      return now <= e;
    });
    if (!found) found = ramadanRanges[ramadanRanges.length - 1];
    startDate = new Date(found.start[0], found.start[1], found.start[2], 0, 0, 0);
    endDate = new Date(found.end[0], found.end[1], found.end[2], 23, 59, 59);
  } else {
    // 'none' - standard farming season without future event spoilers
    return {
      eventId: 'none',
      startDate: new Date(currentYear, 0, 1),
      endDate: new Date(currentYear, 11, 31, 23, 59, 59),
      isActive: true,
      isUpcoming: false,
      hasEnded: false,
      timeToStartMs: 0,
      timeToEndMs: 0,
      formattedStartDate: 'Standard Season',
      formattedEndDate: 'Ongoing',
      timeToStartText: 'Active',
      timeToEndText: 'Ongoing',
      progressPercent: 100,
    };
  }

  const nowMs = now.getTime();
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();

  const isActive = nowMs >= startMs && nowMs <= endMs;
  const isUpcoming = nowMs < startMs;
  const hasEnded = nowMs > endMs;

  const timeToStartMs = Math.max(0, startMs - nowMs);
  const timeToEndMs = Math.max(0, endMs - nowMs);

  const totalDuration = endMs - startMs;
  const elapsed = Math.max(0, Math.min(totalDuration, nowMs - startMs));
  const progressPercent = totalDuration > 0 ? Math.round((elapsed / totalDuration) * 100) : 0;

  const formattedStartDate = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedEndDate = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  let timeToStartText = 'Event in Progress (Started)';
  if (isUpcoming) {
    timeToStartText = `Starts in ${formatRemainingDuration(timeToStartMs)}`;
  }

  let timeToEndText = 'Event has concluded';
  if (isActive) {
    timeToEndText = `Ends in ${formatRemainingDuration(timeToEndMs)}`;
  } else if (isUpcoming) {
    timeToEndText = `${Math.round(totalDuration / 86400000)} days total duration`;
  }

  return {
    eventId,
    startDate,
    endDate,
    isActive,
    isUpcoming,
    hasEnded,
    timeToStartMs,
    timeToEndMs,
    formattedStartDate,
    formattedEndDate,
    timeToStartText,
    timeToEndText,
    progressPercent,
  };
}
