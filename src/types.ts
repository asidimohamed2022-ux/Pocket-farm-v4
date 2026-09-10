export type Rarity = 'NR' | 'MID' | 'Legendary' | 'Myth' | 'Secret' | 'Divine' | 'Celestial' | 'Splatsh' | 'Sawm';

export type InfusionType = 'Lucky' | 'Corrupted' | 'Hollowed' | 'Darker' | 'Dragonic' | 'Radioactive' | 'Divine' | 'Random';

export type SeasonalEventType = 'none' | 'ramadan' | 'summer' | 'halloween' | 'christmas';
export type EventMode = 'auto' | 'ramadan' | 'summer' | 'halloween' | 'christmas' | 'none';

export interface InfusedCrop {
  type: CropType;
  infusions: InfusionType[];
  count: number;
}

export type CropType = 
  | 'Carrot' | 'Orange' | 'Wheat' | 'Corn' | 'Dandelion'
  | 'Pumpkin' | 'Cactus' | 'Mango' | 'Kiwi'
  | 'Date Fruit' | 'Pineapple' | 'Melon' | 'Banana'
  | 'Corn Candy' | 'Candy Cane'
  | 'Sky Ruler' | 'Moon Glower' | 'Sun Shaper' | 'Cozmic Apple'
  | 'Banana Tails' | 'Mineral Berries' | 'Trial Melon' | 'Crystal Strawberry' | 'Void Pear' | 'Prism Fruit'
  | 'Dragon Tooth' | 'Demonic Core' | 'God Apple' | 'Celestial Berry' | 'Heaven Fruit' | 'Light Core' | 'Angelic Mango' | 'Guardian’s Eye' | 'Stardust Apple' | 'Nebula Plum';

export interface CropData {
  type: CropType;
  displayName: string;
  rarity: Rarity;
  buyPrice: number;
  sellPrice: number;
  growTime: number; // in seconds
  icon: string;
  bonus?: string;
  event?: SeasonalEventType;
}

export type ToolType = 'Hand' | 'Sickle' | 'Shovel' | 'Tonic';

export interface PlotState {
  id: number;
  crop: CropType | null;
  plantedAt: number | null; // timestamp
  isReady: boolean;
  infusions?: InfusionType[];
  tonicApplied?: boolean;
}

export type AnimalType = 'Cow' | 'Sheep' | 'Duck' | 'Chicken' | 'Rudolph' | 'Camel';
export type AnimalProductType = 'Milk' | 'Wool' | 'Eggs' | 'Feathers' | 'Deer Antlers' | 'Leather';

export interface AnimalData {
  type: AnimalType;
  buyPrice: number;
  icon: string;
  product: AnimalProductType;
  productionTime: number; // in seconds
  eventOnly?: boolean;
}

export interface AnimalProductData {
  type: AnimalProductType;
  sellPrice: number;
  icon: string;
}

export interface CageState {
  id: number;
  type: AnimalType | null;
  count: number;
  lastProduction: number | null; // timestamp
}

export type TutorialStep = 'welcome' | 'open_shop' | 'buy_seeds' | 'plant_crop' | 'harvest_crop' | 'completed';

export interface ChristmasTreeState {
  year?: number;
  unlockedBalls: number[];
  hungBalls: number[];
  challengesProgress: Record<number, number>;
  santaVisited: boolean;
  openedPresents: number[];
  rudolphClaimed: boolean;
  seedsPlantedCount?: number;
  candyCaneHarvested?: number;
  completedYears?: number[];
}

export interface SummerBlenderState {
  timesCooled: number;
  totalPanachesBlended: number;
  sunChillLevel: number; // 0 to 100
  lastCooledAt?: number;
  sunCoolBlessingUntil?: number; // timestamp
}

export interface RamadanRayanState {
  completedMeals: string[]; // List of unique meal IDs cooked for Rayan (0 to 10)
  camelClaimed: boolean;
  totalFeastsCompleted: number;
  totalCoinsEarned: number;
  lastMealCookedAt?: number;
}

import { LanguageCode } from './translations';

export interface GameState {
  money: number;
  unlockedPlots: number;
  inventory: Record<string, number>;
  seedInventory: Partial<Record<CropType, number>>;
  animalInventory: Partial<Record<AnimalType, number>>;
  animalProductInventory: Partial<Record<AnimalProductType, number>>;
  tonicInventory: Partial<Record<InfusionType, number>>;
  plots: PlotState[];
  cages: CageState[];
  unlockedCages: number;
  animalAreaUnlocked: boolean;
  activeTool: ToolType;
  selectedSeed: CropType;
  selectedTonic: InfusionType | null;
  autoHarvestUntil: number | null; // timestamp
  hasPremiumPack: boolean;
  permanentAutoHarvest: boolean;
  hasGrowthBoost: boolean;
  tutorialStep: TutorialStep;
  hasCompletedTutorial: boolean;
  totalMoneyEarned: number;
  totalCropsHarvested: number;
  lastSaved: number;
  language: LanguageCode;
  musicVolume?: number;
  isMusicPlaying?: boolean;
  customMusicName?: string | null;
  customMusicData?: string | null; // Base64
  musicKey?: number;
  darkMode?: boolean;
  eventOverride?: EventMode;
  christmasTree?: ChristmasTreeState;
  summerNiro?: SummerBlenderState;
  ramadanRayan?: RamadanRayanState;
}
