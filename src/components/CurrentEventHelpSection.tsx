import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, Calendar } from 'lucide-react';
import { SeasonalEventInfo, SEASONAL_EVENTS, getEventTimingDetails, EventTimingDetails, getCropBuyPrice, getCropSellPrice } from '../events';
import { CROPS } from '../constants';
import { IconRenderer } from './IconRenderer';
import { formatNumberShort, formatTimeShort } from '../utils';

interface CurrentEventHelpSectionProps {
  activeEvent: SeasonalEventInfo;
  t: (key: string) => string;
}

export const CurrentEventHelpSection: React.FC<CurrentEventHelpSectionProps> = ({
  activeEvent,
  t,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Update timer every second for accurate countdown of current event
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const eventToDisplay = activeEvent;
  const timing: EventTimingDetails = getEventTimingDetails(activeEvent.id, currentTime);
  const isSpecialEvent = activeEvent.id !== 'none';

  return (
    <div className="space-y-4 pb-2">
      {/* Main Event Card */}
      <div
        className={`p-4 rounded-3xl text-white relative overflow-hidden shadow-lg bg-gradient-to-br ${eventToDisplay.bgGradient}`}
      >
        <div className="flex items-start justify-between relative z-10 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl filter drop-shadow-md">{eventToDisplay.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-black tracking-tight">{eventToDisplay.name}</h4>
              </div>
              <p className="text-[11px] text-white/80 font-semibold">{eventToDisplay.subtitle}</p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            {isSpecialEvent ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-ping" />
                Active Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                Active Season
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-white/90 leading-relaxed relative z-10 mb-3 font-medium">
          {eventToDisplay.description}
        </p>

        {/* Bonus Banner inside card */}
        {isSpecialEvent && (
          <div className="bg-black/25 backdrop-blur-xs rounded-2xl p-2.5 flex items-center justify-between gap-2 border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-300 shrink-0" />
              <span className="font-bold text-white text-[11px]">{eventToDisplay.bonusDescription}</span>
            </div>
            {eventToDisplay.harvestCoinMultiplier > 1 && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-300 text-amber-950 shrink-0">
                +{Math.round((eventToDisplay.harvestCoinMultiplier - 1) * 100)}% Coins
              </span>
            )}
          </div>
        )}
      </div>

      {/* Active Event Remaining Duration (Only for active special events, without any next event hints) */}
      {isSpecialEvent && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <Timer size={15} />
              </div>
              <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Event Duration
              </h5>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                <Calendar size={12} className="text-emerald-500" />
                <span>Event Concludes</span>
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                {timing.formattedEndDate}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Remaining
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                {timing.timeToEndText}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span>Event Duration Progress</span>
              <span>{timing.progressPercent}% Elapsed</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${timing.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Event Fruits Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span>🍇</span>
            <span>{isSpecialEvent ? 'Exclusive Event Crops' : 'Seasonal Crops'}</span>
          </h5>
          {isSpecialEvent && (
            <span className="text-[10px] font-bold text-slate-400">
              {eventToDisplay.exclusiveCrops.length} {eventToDisplay.exclusiveCrops.length === 1 ? 'Fruit' : 'Fruits'}
            </span>
          )}
        </div>

        {eventToDisplay.exclusiveCrops.length === 0 ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-center border border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Standard season is currently active. Enjoy planting and harvesting your crops!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {eventToDisplay.exclusiveCrops.map((cropType) => {
              const crop = CROPS[cropType];
              if (!crop) return null;

              const effectiveBuyPrice = getCropBuyPrice(cropType, eventToDisplay.id);
              const baseSellPrice = getCropSellPrice(cropType, eventToDisplay.id);
              const bonusMultiplier = eventToDisplay.harvestCoinMultiplier;
              const boostedSellPrice = Math.floor(baseSellPrice * bonusMultiplier);
              const isDiscounted = effectiveBuyPrice < crop.buyPrice;
              const isSellBoosted = baseSellPrice > crop.sellPrice;

              return (
                <div
                  key={`event-fruit-${cropType}`}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    crop.rarity === 'Sawm'
                      ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-emerald-300 shadow-sm'
                      : crop.rarity === 'Splatsh'
                      ? 'bg-gradient-to-r from-cyan-50 via-sky-50 to-teal-50 border-cyan-300 shadow-sm'
                      : crop.type === 'Corn Candy' || (cropType === 'Pumpkin' && eventToDisplay.id === 'halloween')
                      ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-purple-50 border-orange-300 shadow-sm'
                      : crop.type === 'Candy Cane'
                      ? 'bg-gradient-to-r from-red-50 via-rose-50 to-emerald-50 border-red-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 relative shrink-0">
                        <IconRenderer
                          icon={crop.icon}
                          className="w-full h-full text-2xl"
                          containerClassName="w-10 h-10"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h6 className="font-black text-sm text-slate-800">{t(crop.displayName)}</h6>
                          {/* Rarity Tag */}
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              crop.rarity === 'Splatsh'
                                ? 'bg-cyan-500 text-white shadow-xs'
                                : crop.rarity === 'Sawm'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : crop.rarity === 'Legendary'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-yellow-500 text-white'
                            }`}
                          >
                            {crop.rarity}
                          </span>
                          {isDiscounted && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                              -50% Buy Deal
                            </span>
                          )}
                          {isSellBoosted && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                              +100% Sell Boost
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{crop.bonus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Grow Time Info Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/80 rounded-xl p-1.5 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Cost (Buy)</span>
                      <div className="flex items-center justify-center gap-1">
                        {isDiscounted && (
                          <span className="text-[10px] line-through text-slate-400 font-bold">
                            £{formatNumberShort(crop.buyPrice)}
                          </span>
                        )}
                        <span className={`text-xs font-black ${isDiscounted ? 'text-emerald-600' : 'text-slate-700'}`}>
                          £{formatNumberShort(effectiveBuyPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-xl p-1.5 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Sell Value</span>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-black text-emerald-600">£{formatNumberShort(boostedSellPrice)}</span>
                        {(bonusMultiplier > 1 || isSellBoosted) && (
                          <span className="text-[8px] font-black text-amber-600 bg-amber-100 px-1 rounded">
                            {isSellBoosted ? '+boost' : `+${Math.round((bonusMultiplier - 1) * 100)}%`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-xl p-1.5 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Grow Time</span>
                      <span className="text-xs font-black text-blue-600">{formatTimeShort(crop.growTime)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
