import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Utensils, 
  ShoppingBag, 
  Coins, 
  RotateCcw,
  Check,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { GameState, CropType, AnimalProductType } from '../types';
import { CROPS, ANIMAL_PRODUCTS } from '../constants';
import { formatNumberShort } from '../utils';

export interface RamadanMealIngredient {
  name: string;
  type: 'crop' | 'product';
  key: CropType | AnimalProductType;
  amount: number;
  icon: string;
}

export interface RamadanMeal {
  id: string;
  name: string;
  arabicName: string;
  icon: string;
  description: string;
  ingredients: RamadanMealIngredient[];
  coinReward: number;
  seedReward?: { crop: CropType; count: number };
  highlight?: boolean;
}

export const RAMADAN_MEALS: RamadanMeal[] = [
  {
    id: 'milk_and_dates',
    name: 'Milk and Dates',
    arabicName: 'حليب وتمر',
    icon: '🥛',
    description: 'The sacred Sunnah tradition to break the fast at sunset. Fresh milk paired with 5 sweet, tender date fruits.',
    ingredients: [
      { name: 'Date Fruit', type: 'crop', key: 'Date Fruit', amount: 5, icon: '🌴' },
      { name: 'Milk', type: 'product', key: 'Milk', amount: 1, icon: '🥛' },
    ],
    coinReward: 25000,
    seedReward: { crop: 'Date Fruit', count: 5 },
    highlight: true,
  },
  {
    id: 'shorba',
    name: 'Golden Shorba Soup',
    arabicName: 'شوربة عدس ذهبية',
    icon: '🍲',
    description: 'A comforting, hearty soup made from golden wheat, crisp carrots, and sweet garden pumpkin.',
    ingredients: [
      { name: 'Wheat', type: 'crop', key: 'Wheat', amount: 4, icon: '🌾' },
      { name: 'Carrot', type: 'crop', key: 'Carrot', amount: 3, icon: '🥕' },
      { name: 'Pumpkin', type: 'crop', key: 'Pumpkin', amount: 1, icon: '🎃' },
    ],
    coinReward: 18000,
    seedReward: { crop: 'Wheat', count: 10 },
  },
  {
    id: 'sambusa',
    name: 'Crispy Ramadan Sambusa',
    arabicName: 'سمبوسة مقرمشة',
    icon: '🥟',
    description: 'Crunchy golden pastry triangles filled with garden vegetables and fresh farm eggs.',
    ingredients: [
      { name: 'Wheat', type: 'crop', key: 'Wheat', amount: 4, icon: '🌾' },
      { name: 'Carrot', type: 'crop', key: 'Carrot', amount: 3, icon: '🥕' },
      { name: 'Eggs', type: 'product', key: 'Eggs', amount: 2, icon: '🥚' },
    ],
    coinReward: 20000,
    seedReward: { crop: 'Carrot', count: 8 },
  },
  {
    id: 'qatayef',
    name: 'Sweet Qatayef Pancakes',
    arabicName: 'قطايف بالكريمة والتمر',
    icon: '🥞',
    description: 'Stuffed folded crescent pancakes filled with sweet date cream and dipped in orange honey syrup.',
    ingredients: [
      { name: 'Wheat', type: 'crop', key: 'Wheat', amount: 4, icon: '🌾' },
      { name: 'Milk', type: 'product', key: 'Milk', amount: 2, icon: '🥛' },
      { name: 'Date Fruit', type: 'crop', key: 'Date Fruit', amount: 4, icon: '🌴' },
      { name: 'Orange', type: 'crop', key: 'Orange', amount: 2, icon: '🍊' },
    ],
    coinReward: 24000,
    seedReward: { crop: 'Date Fruit', count: 5 },
  },
  {
    id: 'harira',
    name: 'Spiced Harira Stew',
    arabicName: 'حريرة رمضانية أصيلة',
    icon: '🥘',
    description: 'A traditional, nourishing stew simmered with fragrant garden vegetables, pumpkin, wheat, and egg ribbons.',
    ingredients: [
      { name: 'Wheat', type: 'crop', key: 'Wheat', amount: 4, icon: '🌾' },
      { name: 'Carrot', type: 'crop', key: 'Carrot', amount: 4, icon: '🥕' },
      { name: 'Pumpkin', type: 'crop', key: 'Pumpkin', amount: 2, icon: '🎃' },
      { name: 'Eggs', type: 'product', key: 'Eggs', amount: 2, icon: '🥚' },
    ],
    coinReward: 22000,
    seedReward: { crop: 'Pumpkin', count: 5 },
  },
  {
    id: 'fruit_medley',
    name: 'Chilled Iftar Fruit Salad',
    arabicName: 'سلطة فواكه منعشة',
    icon: '🥗',
    description: 'A thirst-quenching dessert bowl of freshly sliced sun-ripened oranges, tropical mangoes, and kiwis.',
    ingredients: [
      { name: 'Orange', type: 'crop', key: 'Orange', amount: 4, icon: '🍊' },
      { name: 'Mango', type: 'crop', key: 'Mango', amount: 2, icon: '🥭' },
      { name: 'Kiwi', type: 'crop', key: 'Kiwi', amount: 2, icon: '🥝' },
    ],
    coinReward: 22000,
    seedReward: { crop: 'Orange', count: 6 },
  },
  {
    id: 'tamriyah',
    name: 'Rich Tamriyah Date Bites',
    arabicName: 'تمرية فاخرة بالحليب',
    icon: '🧆',
    description: 'Melt-in-your-mouth date truffles rolled with farm milk and toasted golden wheat grains.',
    ingredients: [
      { name: 'Date Fruit', type: 'crop', key: 'Date Fruit', amount: 6, icon: '🌴' },
      { name: 'Milk', type: 'product', key: 'Milk', amount: 2, icon: '🥛' },
      { name: 'Wheat', type: 'crop', key: 'Wheat', amount: 3, icon: '🌾' },
    ],
    coinReward: 26000,
    seedReward: { crop: 'Date Fruit', count: 6 },
  },
  {
    id: 'basbousa',
    name: 'Golden Basbousa Cake',
    arabicName: 'بسبوسة بالبرتقال',
    icon: '🥮',
    description: 'Tender semolina cake baked golden brown with farm milk, farm eggs, and sweet orange blossom drizzle.',
    ingredients: [
      { name: 'Wheat', type: 'crop', key: 'Wheat', amount: 5, icon: '🌾' },
      { name: 'Milk', type: 'product', key: 'Milk', amount: 2, icon: '🥛' },
      { name: 'Eggs', type: 'product', key: 'Eggs', amount: 2, icon: '🥚' },
      { name: 'Orange', type: 'crop', key: 'Orange', amount: 2, icon: '🍊' },
    ],
    coinReward: 24000,
    seedReward: { crop: 'Wheat', count: 8 },
  },
  {
    id: 'muhallabia',
    name: 'Velvety Muhallabia Pudding',
    arabicName: 'مهلبية الحليب والتمر',
    icon: '🍮',
    description: 'Silky chilled milk pudding infused with natural date fruit essence and fine milled wheat.',
    ingredients: [
      { name: 'Milk', type: 'product', key: 'Milk', amount: 3, icon: '🥛' },
      { name: 'Wheat', type: 'crop', key: 'Wheat', amount: 3, icon: '🌾' },
      { name: 'Date Fruit', type: 'crop', key: 'Date Fruit', amount: 3, icon: '🌴' },
    ],
    coinReward: 22000,
    seedReward: { crop: 'Date Fruit', count: 4 },
  },
  {
    id: 'qamar_al_din',
    name: 'Royal Qamar al-Din Elixir',
    arabicName: 'قمر الدين الملكي',
    icon: '🍹',
    description: 'The crowning jewel of the Ramadan table! A restorative chilled drink of mango, date fruit, orange, and fresh milk.',
    ingredients: [
      { name: 'Orange', type: 'crop', key: 'Orange', amount: 4, icon: '🍊' },
      { name: 'Mango', type: 'crop', key: 'Mango', amount: 3, icon: '🥭' },
      { name: 'Date Fruit', type: 'crop', key: 'Date Fruit', amount: 4, icon: '🌴' },
      { name: 'Milk', type: 'product', key: 'Milk', amount: 2, icon: '🥛' },
    ],
    coinReward: 30000,
    seedReward: { crop: 'Date Fruit', count: 8 },
    highlight: true,
  },
];

interface RayanRamadanModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onOpenShop?: () => void;
  t: (key: string) => string;
}

export const RayanRamadanModal: React.FC<RayanRamadanModalProps> = ({
  isOpen,
  onClose,
  gameState,
  setGameState,
  onOpenShop,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ready' | 'completed'>('all');
  const [cookingMealId, setCookingMealId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationDetails, setCelebrationDetails] = useState<{
    mealName: string;
    coins: number;
    seedsCount?: number;
    seedsType?: string;
    isCamelUnlock?: boolean;
  } | null>(null);

  const ramadanState = gameState.ramadanRayan || {
    completedMeals: [],
    camelClaimed: false,
    totalFeastsCompleted: 0,
    totalCoinsEarned: 0,
  };

  const completedMeals = ramadanState.completedMeals || [];
  const completedCount = completedMeals.length;
  const isCamelClaimed = ramadanState.camelClaimed;

  // Inventory helper: count available items (crops from inventory + animal products)
  const getIngredientStock = (ing: RamadanMealIngredient): number => {
    if (ing.type === 'product') {
      return gameState.animalProductInventory[ing.key as AnimalProductType] || 0;
    }
    // Crop: aggregate counts across possible infusion keys
    let count = 0;
    Object.entries(gameState.inventory || {}).forEach(([key, qty]) => {
      const cropName = key.split('|')[0];
      if (cropName === ing.key) {
        count += Number(qty) || 0;
      }
    });
    return count;
  };

  // Check if player has all required ingredients for a meal
  const canCookMeal = (meal: RamadanMeal): boolean => {
    return meal.ingredients.every((ing) => getIngredientStock(ing) >= ing.amount);
  };

  // Filtered meals based on active tab
  const filteredMeals = useMemo(() => {
    if (activeTab === 'ready') {
      return RAMADAN_MEALS.filter((m) => canCookMeal(m) && !completedMeals.includes(m.id));
    }
    if (activeTab === 'completed') {
      return RAMADAN_MEALS.filter((m) => completedMeals.includes(m.id));
    }
    return RAMADAN_MEALS;
  }, [activeTab, completedMeals, gameState.inventory, gameState.animalProductInventory]);

  if (!isOpen) return null;

  // Handle preparing a meal
  const handleCookMeal = (meal: RamadanMeal) => {
    if (!canCookMeal(meal)) return;
    setCookingMealId(meal.id);

    setTimeout(() => {
      setGameState((prev) => {
        const newInventory = { ...prev.inventory };
        const newAnimalProductInventory = { ...prev.animalProductInventory };
        const newSeedInventory = { ...prev.seedInventory };

        // 1. Deduct ingredients
        meal.ingredients.forEach((ing) => {
          if (ing.type === 'product') {
            const current = newAnimalProductInventory[ing.key as AnimalProductType] || 0;
            newAnimalProductInventory[ing.key as AnimalProductType] = Math.max(0, current - ing.amount);
          } else {
            // Deduct from standard crops first, then infused if needed
            let needed = ing.amount;
            const entries = Object.entries(newInventory).filter(([key]) => key.split('|')[0] === ing.key);
            for (const [key, qty] of entries) {
              const available = Number(qty) || 0;
              if (available > 0) {
                const take = Math.min(available, needed);
                newInventory[key] = available - take;
                needed -= take;
                if (needed <= 0) break;
              }
            }
          }
        });

        // 2. Grant seed reward if any
        if (meal.seedReward) {
          const currentSeeds = newSeedInventory[meal.seedReward.crop] || 0;
          newSeedInventory[meal.seedReward.crop] = currentSeeds + meal.seedReward.count;
        }

        // 3. Update completed meals
        const prevRamadan = prev.ramadanRayan || {
          completedMeals: [],
          camelClaimed: false,
          totalFeastsCompleted: 0,
          totalCoinsEarned: 0,
        };

        const updatedCompleted = prevRamadan.completedMeals.includes(meal.id)
          ? prevRamadan.completedMeals
          : [...prevRamadan.completedMeals, meal.id];

        // 4. Check if 10 meals milestone is reached and Camel should be unlocked
        const willBeComplete = updatedCompleted.length >= 10;
        const grantCamel = willBeComplete && !prevRamadan.camelClaimed;
        const grandCoins = grantCamel ? 100000 : 0;
        const totalCoinsGained = meal.coinReward + grandCoins;

        const newAnimalInventory = { ...prev.animalInventory };
        if (grantCamel) {
          newAnimalInventory.Camel = (newAnimalInventory.Camel || 0) + 1;
        }

        return {
          ...prev,
          money: prev.money + totalCoinsGained,
          totalMoneyEarned: prev.totalMoneyEarned + totalCoinsGained,
          inventory: newInventory,
          animalProductInventory: newAnimalProductInventory,
          seedInventory: newSeedInventory,
          animalInventory: newAnimalInventory,
          ramadanRayan: {
            ...prevRamadan,
            completedMeals: updatedCompleted,
            camelClaimed: prevRamadan.camelClaimed || grantCamel,
            totalCoinsEarned: (prevRamadan.totalCoinsEarned || 0) + totalCoinsGained,
            lastMealCookedAt: Date.now(),
          },
        };
      });

      const isNowComplete = !completedMeals.includes(meal.id) && completedCount + 1 >= 10;
      const isUnlockCamel = isNowComplete && !isCamelClaimed;

      setCelebrationDetails({
        mealName: meal.name,
        coins: meal.coinReward + (isUnlockCamel ? 100000 : 0),
        seedsCount: meal.seedReward?.count,
        seedsType: meal.seedReward?.crop,
        isCamelUnlock: isUnlockCamel,
      });

      setCookingMealId(null);
      setShowCelebration(true);
    }, 900);
  };

  // Replay option: reset meals counter for another feast cycle while retaining Camel
  const handleStartAnotherFeast = () => {
    setGameState((prev) => {
      const prevRamadan = prev.ramadanRayan || {
        completedMeals: [],
        camelClaimed: false,
        totalFeastsCompleted: 0,
        totalCoinsEarned: 0,
      };

      return {
        ...prev,
        ramadanRayan: {
          ...prevRamadan,
          completedMeals: [],
          totalFeastsCompleted: (prevRamadan.totalFeastsCompleted || 0) + 1,
        },
      };
    });
  };

  return (
    <div
      id="rayan-ramadan-modal"
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-[70] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        className="bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950 text-slate-100 w-full max-w-2xl rounded-3xl sm:rounded-[2.5rem] shadow-2xl border-2 border-emerald-500/30 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 pb-4 bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-emerald-950/90 border-b border-emerald-500/20">
          {/* Decorative ambient elements */}
          <div className="absolute top-2 right-12 text-2xl opacity-40 select-none pointer-events-none">🌙</div>
          <div className="absolute top-8 right-24 text-xl opacity-25 select-none pointer-events-none">✨</div>
          <div className="absolute top-4 left-24 text-xl opacity-25 select-none pointer-events-none">🏮</div>

          <div className="flex items-start justify-between relative z-10 gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-600 to-teal-800 p-0.5 shadow-lg shadow-emerald-950 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl">
                  👳‍♂️
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                    🌙 {t('ramadan_npc') || 'Ramadan NPC'}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <span>🏮</span> Iftar Feast
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
                  <span>Rayan</span>
                  <span className="text-xs font-bold text-emerald-400/80 bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-700/50">
                    ريان
                  </span>
                </h3>
                <p className="text-xs text-emerald-200/80 font-medium">
                  {t('rayan_title') || 'Host of the Blessed Ramadan Iftar Table'}
                </p>
              </div>
            </div>

            <button
              id="close-rayan-modal-btn"
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Rayan's Greeting & Dialogue Box */}
          <div className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 text-xs sm:text-sm text-emerald-100 flex items-start gap-2.5">
            <span className="text-xl shrink-0 mt-0.5">💬</span>
            <div className="leading-relaxed">
              <span className="font-bold text-amber-300">"Assalamu Alaikum! </span>
              {t('rayan_dialogue') ||
                'I am fasting for Ramadan and preparing the grand Iftar table. Prepare 10 different traditional meals for my guests—especially Milk & Dates (5 Dates + 1 Milk)—and I will reward you with grand riches and my beloved Camel that produces fine Leather!'}
              <span className="font-bold text-amber-300">"</span>
            </div>
          </div>

          {/* Progress Banner & Camel Reward Status */}
          <div className="mt-3.5 p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Utensils size={13} className="text-amber-400" />
                  <span>{t('meals_prepared') || 'Meals Prepared for Rayan'}</span>
                </span>
                <span className="text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                  {completedCount} / 10
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full sm:w-64 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-emerald-700/40">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (completedCount / 10) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Camel Reward Badge */}
            <div className="flex items-center gap-2.5 bg-emerald-950/90 border border-emerald-500/40 px-3 py-2 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐪</span>
                <div className="text-left">
                  <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                    <span>{t('camel') || 'Camel'}</span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-900/80 px-1 rounded">
                      {t('produces_leather') || 'Produces Leather 📜'}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-200/70 font-medium">
                    {isCamelClaimed
                      ? '✨ Camel Unlocked in Farm Pens!'
                      : completedCount >= 10
                      ? '🎁 Ready to Claim!'
                      : `Requires 10/10 Meals (${10 - completedCount} left)`}
                  </p>
                </div>
              </div>
              {isCamelClaimed ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/80 px-2 py-1 rounded-xl flex items-center gap-1 border border-emerald-600/40">
                  <CheckCircle2 size={13} /> {t('claimed') || 'Claimed'}
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-1 rounded-xl border border-amber-600/40">
                  +£100K
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="px-5 sm:px-6 pt-3 pb-2 flex items-center justify-between border-b border-emerald-900/40 bg-slate-950/60">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-900/40'
              }`}
            >
              {t('all_meals') || 'All Meals (10)'}
            </button>
            <button
              onClick={() => setActiveTab('ready')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ready'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-900/40'
              }`}
            >
              {t('ready_to_cook') || 'Ready to Cook'}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-900/40'
              }`}
            >
              {t('completed') || 'Served'} ({completedCount})
            </button>
          </div>

          {onOpenShop && (
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag size={13} />
              <span>{t('buy_date_seeds') || 'Seed Shop'}</span>
            </button>
          )}
        </div>

        {/* Meals List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredMeals.map((meal) => {
            const isCompleted = completedMeals.includes(meal.id);
            const canCook = canCookMeal(meal);
            const isCooking = cookingMealId === meal.id;

            return (
              <div
                key={`meal-${meal.id}`}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 shadow-sm'
                    : canCook
                    ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/30 border-amber-400/50 shadow-md ring-1 ring-amber-400/20'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-90'
                }`}
              >
                {/* Special highlight tag for Milk & Dates */}
                {meal.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-bl-xl shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>{meal.id === 'milk_and_dates' ? 'Sunnah Special' : 'Royal Feast'}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                  {/* Left: Meal Icon & Details */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-800/60 border border-emerald-400/30'
                          : canCook
                          ? 'bg-amber-500/20 border border-amber-400/40'
                          : 'bg-slate-800 border border-slate-700'
                      }`}
                    >
                      {meal.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-white flex items-center gap-1.5">
                          <span>{t(meal.name) || meal.name}</span>
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.2 rounded-md border border-emerald-700/50">
                          {meal.arabicName}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check size={11} /> {t('served_to_rayan') || 'Served to Rayan'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300/80 mt-1 max-w-md leading-relaxed">
                        {meal.description}
                      </p>

                      {/* Ingredients List with Live Stock Tracking */}
                      <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        {meal.ingredients.map((ing, idx) => {
                          const stock = getIngredientStock(ing);
                          const hasEnough = stock >= ing.amount;

                          return (
                            <div
                              key={`ing-${meal.id}-${idx}`}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                                hasEnough
                                  ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40'
                                  : 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                              }`}
                            >
                              <span className="text-sm">{ing.icon}</span>
                              <span>{t(ing.name) || ing.name}:</span>
                              <span className={hasEnough ? 'text-emerald-300 font-black' : 'text-rose-400 font-black'}>
                                {stock}/{ing.amount}
                              </span>
                              {hasEnough ? (
                                <Check size={12} className="text-emerald-400 shrink-0 ml-0.5" />
                              ) : (
                                <span className="text-[10px] text-rose-400 ml-0.5">✕</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Rewards & Cook Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-900/30">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-black text-amber-300 flex items-center gap-1 justify-start sm:justify-end">
                        <Coins size={13} className="text-amber-400" />
                        <span>+£{formatNumberShort(meal.coinReward)}</span>
                      </div>
                      {meal.seedReward && (
                        <div className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1 justify-start sm:justify-end">
                          <span>🌱 +{meal.seedReward.count} {t(meal.seedReward.crop)} Seeds</span>
                        </div>
                      )}
                    </div>

                    <button
                      id={`cook-btn-${meal.id}`}
                      onClick={() => handleCookMeal(meal)}
                      disabled={!canCook || isCooking}
                      className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-700/60 text-emerald-100 hover:bg-emerald-600 active:scale-95'
                          : canCook
                          ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-amber-500/20 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {isCooking ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          >
                            <Flame size={16} className="text-amber-400" />
                          </motion.span>
                          <span>{t('cooking') || 'Cooking...'}</span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <RotateCcw size={14} />
                          <span>{t('cook_again') || 'Cook Again'}</span>
                        </>
                      ) : canCook ? (
                        <>
                          <Utensils size={15} />
                          <span>{t('cook_and_serve') || 'Cook & Serve'}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('need_ingredients') || 'Need Ingredients'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredMeals.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Utensils size={36} className="mx-auto text-emerald-600/40 mb-2" />
              <p className="font-bold text-sm text-emerald-200/70">
                {activeTab === 'ready'
                  ? 'No meals ready to cook right now. Plant seeds or collect animal milk & eggs!'
                  : 'No meals match this filter.'}
              </p>
            </div>
          )}

          {/* Reset / Cook another feast celebration banner if all 10 completed */}
          {completedCount >= 10 && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-amber-400/40 text-center space-y-2 mt-4">
              <div className="text-3xl">🎉 🐪 🌙</div>
              <h4 className="text-base font-black text-amber-300">
                {t('all_meals_completed') || 'Grand Ramadan Feast Completed!'}
              </h4>
              <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
                {t('rayan_praise') ||
                  'You have cooked all 10 traditional meals! The Camel has been granted to your animal inventory. You can serve another grand feast cycle for more coins and rewards!'}
              </p>
              <button
                onClick={handleStartAnotherFeast}
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg cursor-pointer"
              >
                🔄 {t('serve_another_feast') || 'Serve Another Grand Feast'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-emerald-900/40 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-emerald-300/80 font-medium flex items-center gap-1.5">
            <span>🐪</span>
            <span>
              {isCamelClaimed
                ? 'Camel is in your Animal Pens (produces Leather 📜)'
                : 'Complete all 10 meals to unlock the Camel!'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
          >
            {t('close') || 'Close'}
          </button>
        </div>
      </motion.div>

      {/* Celebration Popup when a meal is cooked / Camel unlocked */}
      <AnimatePresence>
        {showCelebration && celebrationDetails && (
          <div
            className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border-2 border-amber-400 text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-2">
                {celebrationDetails.isCamelUnlock ? '🐪' : '🍲'}
              </div>

              {celebrationDetails.isCamelUnlock ? (
                <>
                  <div className="inline-block px-3 py-1 bg-amber-400 text-slate-950 text-[11px] font-black rounded-full uppercase tracking-wider mb-2">
                    🌟 Legendary Reward!
                  </div>
                  <h3 className="text-xl font-black text-amber-300 mb-1">
                    Camel Unlocked! 🐪
                  </h3>
                  <p className="text-xs text-emerald-100 mb-4 leading-relaxed">
                    Mubarak! You prepared all 10 Ramadan meals! Rayan has gifted you his prized{' '}
                    <span className="font-black text-amber-300">Camel</span>. Place it in your Animal Pens to produce{' '}
                    <span className="font-black text-amber-300">Leather 📜</span>!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-black text-amber-300 mb-1">
                    Delicious Iftar Meal! 🌙
                  </h3>
                  <p className="text-xs text-emerald-100 mb-4">
                    Rayan and his guests enjoyed{' '}
                    <span className="font-bold text-white">{celebrationDetails.mealName}</span>!
                  </p>
                </>
              )}

              {/* Rewards summary */}
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-emerald-500/30 mb-4 space-y-1.5 text-xs font-bold">
                <div className="text-amber-300 flex items-center justify-center gap-1.5 text-sm font-black">
                  <Coins size={16} />
                  <span>+£{formatNumberShort(celebrationDetails.coins)}</span>
                </div>
                {celebrationDetails.seedsCount && celebrationDetails.seedsType && (
                  <div className="text-emerald-300">
                    🌱 +{celebrationDetails.seedsCount} {celebrationDetails.seedsType} Seeds
                  </div>
                )}
                {celebrationDetails.isCamelUnlock && (
                  <div className="text-amber-200 font-black">
                    🐪 +1 Camel added to Animal Pens Inventory!
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg cursor-pointer transition-all"
              >
                Alhamdulillah! Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
