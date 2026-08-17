'use client';

import { useEffect, useState } from 'react';
import { dietPlan, dayNames, dayLabels, getFoodIcon } from '@/lib/diet-plan';

export function DietTrackerClient() {
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedMeals = localStorage.getItem('dietTrackerProgress');
    if (savedMeals) {
      setCompletedMeals(JSON.parse(savedMeals));
    }

    const savedItems = localStorage.getItem('dietTrackerItems');
    if (savedItems) {
      setCompletedItems(JSON.parse(savedItems));
    }

    const today = new Date();
    setSelectedDayIndex(today.getDay());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveMealProgress = (newMeals: Record<string, boolean>) => {
    localStorage.setItem('dietTrackerProgress', JSON.stringify(newMeals));
  };

  const saveItemProgress = (newItems: Record<string, boolean>) => {
    localStorage.setItem('dietTrackerItems', JSON.stringify(newItems));
  };

  const handleItemCheck = (itemKey: string, checked: boolean) => {
    const newItems = { ...completedItems, [itemKey]: checked };
    setCompletedItems(newItems);
    saveItemProgress(newItems);

    // Check if all items in this meal are done
    // itemKey format: "monday-mon-1_item_0"
    const mealKeyPart = itemKey.split('_item_')[0]; // "monday-mon-1"
    const parts = mealKeyPart.split('-');
    const dayName = parts[0]; // "monday"
    const mealId = parts.slice(1).join('-'); // "mon-1"
    const mealKey = `${dayName}-${mealId}`;
    const meals = dietPlan[dayName as keyof typeof dietPlan] || [];
    const meal = meals.find((m: any) => m.id === mealId);

    if (meal) {
      const allItemsCompleted = meal.items.every((_, idx) =>
        newItems[`${dayName}-${mealId}_item_${idx}`]
      );

      if (allItemsCompleted) {
        // Auto-complete the meal
        const newMeals = { ...completedMeals, [mealKey]: true };
        setCompletedMeals(newMeals);
        saveMealProgress(newMeals);
      }
    }
  };

  const toggleMealExpanded = (mealKey: string) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [mealKey]: !prev[mealKey],
    }));
  };

  const handleMealCheck = (mealKey: string, checked: boolean) => {
    const newMeals = { ...completedMeals, [mealKey]: checked };
    setCompletedMeals(newMeals);
    saveMealProgress(newMeals);

    // If checking meal, check all items. If unchecking, uncheck all items.
    const parts = mealKey.split('-');
    const dayName = parts[0];
    const mealId = parts.slice(1).join('-');
    const meals = dietPlan[dayName as keyof typeof dietPlan] || [];
    const meal = meals.find((m: any) => m.id === mealId);

    if (meal) {
      const newItems = { ...completedItems };
      meal.items.forEach((_, idx) => {
        newItems[`${dayName}-${mealId}_item_${idx}`] = checked;
      });
      setCompletedItems(newItems);
      saveItemProgress(newItems);
    }
  };

  const today = new Date();
  const selectedDate = new Date(today);
  selectedDate.setDate(selectedDate.getDate() + (selectedDayIndex - today.getDay()));

  const dayName = dayNames[selectedDayIndex];
  const meals = dietPlan[dayName as keyof typeof dietPlan] || [];
  const isToday = dayNames[today.getDay()] === dayName;

  const completedCount = meals.filter((meal: any) => {
    const itemsCompleted = meal.items.every((_: string, idx: number) =>
      completedItems[`${dayName}-${meal.id}_item_${idx}`]
    );
    return itemsCompleted && meal.items.length > 0;
  }).length;

  const progressPercentage = meals.length > 0 ? (completedCount / meals.length) * 100 : 0;

  const tomorrowDate = new Date(selectedDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDayIndex = tomorrowDate.getDay();
  const tomorrowDayName = dayNames[tomorrowDayIndex];
  const tomorrowMeals = dietPlan[tomorrowDayName as keyof typeof dietPlan] || [];

  // For sprouts, check 2 days ahead (need soaking 2 days before)
  const sproutPrepDate = new Date(selectedDate);
  sproutPrepDate.setDate(sproutPrepDate.getDate() + 2);
  const sproutPrepDayIndex = sproutPrepDate.getDay();
  const sproutPrepDayName = dayNames[sproutPrepDayIndex];
  const sproutPrepMeals = dietPlan[sproutPrepDayName as keyof typeof dietPlan] || [];

  const tomorrowPrepItems = new Set<string>();

  // Soaked and peeled items - prep 1 day before (tomorrow)
  tomorrowMeals.forEach((meal: any) => {
    meal.items.forEach((item: string) => {
      const lowerItem = item.toLowerCase();
      if ((lowerItem.includes('soaked') || lowerItem.includes('peeled')) && !lowerItem.includes('sprout')) {
        tomorrowPrepItems.add(item);
      }
    });
  });

  // Sprout items - prep 2 days before
  const sproutPrepItems = new Set<string>();
  sproutPrepMeals.forEach((meal: any) => {
    meal.items.forEach((item: string) => {
      const lowerItem = item.toLowerCase();
      if (lowerItem.includes('sprout') || lowerItem.includes('sprouted')) {
        // Format: "Soak for sprouting: [item name]"
        const itemName = item.replace(/sprouted\s+/i, '').replace(/\s+sprout/i, '').trim();
        tomorrowPrepItems.add(`🌱 Soak for sprouting: ${itemName} (needed for ${dayLabels[sproutPrepDayIndex]})`);
        sproutPrepItems.add(itemName);
      }
    });
  });

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 sm:p-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 p-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-xl">
            <span className="text-5xl">🥗</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent mb-3">
            Anti-Inflammatory Diet Tracker
          </h1>
          <p className="text-sm text-gray-500">7-Day Ayurvedic Vegetarian Meal Plan</p>
        </div>

        {/* Date & Navigation Combined */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl p-8 mb-6 shadow-xl border-2 border-emerald-200 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <div className="text-gray-600 font-semibold">⏰ {currentTime}</div>
          </div>

          <div className="flex justify-center gap-4">
            {[-1, 0, 1].map((offset) => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() + offset);
              const dayIdx = date.getDay();
              const isSelected = offset === 0;
              const label = offset === -1 ? '← Prev' : offset === 0 ? 'Current' : 'Next →';
              const isTodayDate = date.toDateString() === today.toDateString();

              return (
                <button
                  key={offset}
                  onClick={() => {
                    if (offset === 0) {
                      // Current button goes to today
                      setSelectedDayIndex(today.getDay());
                    } else {
                      setSelectedDayIndex(dayIdx);
                    }
                  }}
                  className={`py-3 px-6 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                    isSelected
                      ? isTodayDate
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-white shadow-2xl scale-105'
                        : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md'
                  }`}
                >
                  <div>{label}</div>
                  <div className="text-xs opacity-80 mt-0.5">{dayLabels[dayIdx].substring(0, 3)}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 mb-6 shadow-xl border-2 border-green-200">
          <div className="flex justify-between mb-4 font-bold text-gray-800 text-lg">
            <span className="flex items-center gap-2">📊 Daily Progress</span>
            <span className="text-emerald-600">{completedCount}/{meals.length} meals</span>
          </div>
          <div className="w-full h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 transition-all duration-500 shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-3 text-center text-sm text-gray-600 font-medium">{Math.round(progressPercentage)}% Complete</div>
        </div>

        {/* Completion Message */}
        {isToday && completedCount === meals.length && meals.length > 0 && (
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 text-white rounded-3xl p-10 mb-6 shadow-2xl text-center font-bold text-2xl animate-bounce border-4 border-white">
            <div className="flex justify-center gap-2 mb-3">
              {['🎉', '✨', '🌟', '💚', '🎊'].map((emoji, i) => (
                <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                  {emoji}
                </span>
              ))}
            </div>
            Amazing! You completed today's diet plan!
            <div className="text-lg mt-3 opacity-95">Keep up the healthy lifestyle! 💪</div>
          </div>
        )}

        {/* Meals */}
        <div className="space-y-4 mb-8">
          {meals.map((meal: any, index: number) => {
            const mealKey = `${dayName}-${meal.id}`;
            const prevMealKey = index > 0 ? `${dayName}-${meals[index - 1].id}` : null;
            const isActive = isToday && (index === 0 || (prevMealKey && completedMeals[prevMealKey]));

            // Check how many items are completed
            const completedItemsCount = meal.items.filter((_: string, idx: number) =>
              completedItems[`${dayName}-${meal.id}_item_${idx}`]
            ).length;

            const isCompleted = completedItemsCount === meal.items.length && meal.items.length > 0;
            const progress = Math.round((completedItemsCount / meal.items.length) * 100);

            // Determine if expanded - ONLY completed meals can collapse, incomplete always expanded
            const canCollapse = isCompleted;
            const isExpanded = expandedMeals[mealKey] !== undefined
              ? canCollapse ? expandedMeals[mealKey] : true
              : true; // Default to expanded

            // Stacked card styling for collapsed completed meals
            const getCardStyles = () => {
              if (!isCompleted || isExpanded) {
                return {
                  container: `rounded-3xl shadow-lg border-l-4 transition-all duration-300 backdrop-blur-sm ${
                    isCompleted
                      ? 'border-l-emerald-600 bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50 border-4 border-emerald-400'
                      : 'border-l-orange-500 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200'
                  } ${isActive && !isCompleted ? 'opacity-100 -translate-y-2 shadow-2xl scale-105' : isToday && !isCompleted ? 'opacity-70' : 'opacity-100'} p-8`,
                  clickable: isCompleted ? 'cursor-pointer' : ''
                };
              }
              // Collapsed stacked style
              return {
                container: `rounded-2xl shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 bg-gradient-to-r from-emerald-500 to-green-600 border-none`,
                clickable: 'h-16 flex items-center px-6'
              };
            };

            const styles = getCardStyles();

            return (
              <div
                key={meal.id}
                className={`${styles.container} ${styles.clickable}`}
                onClick={() => isCompleted && toggleMealExpanded(mealKey)}
              >
                {/* Collapsed View - Stacked Header Style */}
                {!isExpanded && isCompleted && (
                  <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl text-white">
                        {meal.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-white">
                          {meal.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <span className="text-xl">✅</span>
                    </div>
                  </div>
                )}

                {/* Expanded View */}
                {isExpanded && (
                  <>
                    {/* Meal Header */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`text-5xl p-3 rounded-xl ${isCompleted ? 'bg-emerald-200' : 'bg-orange-200'}`}>
                          {meal.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-700' : 'text-orange-700'}`}>
                            {meal.time}
                          </div>
                          <div className={`text-3xl font-bold ${isCompleted ? 'text-emerald-800' : 'text-gray-800'}`}>
                            {meal.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-2 font-semibold">
                            {isToday && !isCompleted ? '👆 Click the progress box to check/uncheck all items at once' : ''}
                            {isCompleted ? '✨ All items completed!' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Large Meal Checkbox with Progress */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isToday) {
                            const allItemsDone = completedItemsCount === meal.items.length && meal.items.length > 0;
                            handleMealCheck(mealKey, !allItemsDone);
                          }
                        }}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all cursor-pointer border-4 ${
                          isToday ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        } ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-200 to-green-200 border-emerald-600 shadow-lg'
                            : 'bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-400 hover:shadow-lg'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={completedItemsCount === meal.items.length && meal.items.length > 0}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleMealCheck(mealKey, e.target.checked);
                          }}
                          disabled={!isToday}
                          className={`w-12 h-12 cursor-pointer accent-emerald-600 ${!isToday ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        <div className="flex items-center gap-1">
                          <span className={`text-sm font-bold ${isCompleted ? 'text-emerald-700' : 'text-orange-700'}`}>
                            {completedItemsCount}
                          </span>
                          <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-700' : 'text-orange-700'}`}>
                            / {meal.items.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                            : 'bg-gradient-to-r from-orange-400 to-yellow-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Items List */}
                    <ul className="space-y-3 border-t-3 border-gray-300 pt-6">
                  {meal.items.map((item: string, idx: number) => {
                    const itemKey = `${dayName}-${meal.id}_item_${idx}`;
                    const itemCompleted = completedItems[itemKey] || false;
                    const foodIcon = getFoodIcon(item);

                    return (
                      <li
                        key={idx}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all shadow-sm hover:shadow-md ${
                          itemCompleted
                            ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-400'
                            : `${foodIcon.bgColor} border-2 border-gray-200 hover:shadow-lg`
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={itemCompleted}
                          onChange={(e) => handleItemCheck(itemKey, e.target.checked)}
                          disabled={!isToday}
                          className={`mt-1 w-6 h-6 cursor-pointer accent-emerald-600 flex-shrink-0 ${!isToday ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />

                        {/* Food Icon with Color */}
                        <div className={`text-2xl ${foodIcon.color} flex-shrink-0 p-2 rounded-lg ${foodIcon.bgColor}`}>
                          {foodIcon.emoji}
                        </div>

                        <span
                          className={`text-lg font-semibold leading-relaxed flex-1 ${
                            itemCompleted
                              ? 'text-emerald-700 line-through opacity-70'
                              : 'text-gray-800'
                          }`}
                        >
                          {item}
                        </span>
                        <span className="text-2xl flex-shrink-0">
                          {itemCompleted ? '✅' : '📌'}
                        </span>
                      </li>
                    );
                  })}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Day Prep */}
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl p-8 border-t-4 border-blue-500 shadow-xl mb-8 border-2 border-blue-200">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            🌙 Preparation Ahead
          </div>
          <div className="text-gray-700 font-semibold mb-6 text-lg">
            <div>📅 Tomorrow: {dayLabels[tomorrowDayIndex]}</div>
            <div className="text-sm text-gray-600 mt-1">
              {sproutPrepItems.size > 0 && `(+ Sprouts for ${dayLabels[sproutPrepDayIndex]})`}
            </div>
          </div>

          {tomorrowPrepItems.size > 0 && (
            <div className="mb-6">
              <div className="font-bold text-blue-600 mb-3">
                {sproutPrepItems.size > 0 ? '🌙 Items to Soak Overnight (1 day)' : '🌙 Items to Soak Overnight'}
              </div>
              <div className="space-y-2">
                {Array.from(tomorrowPrepItems).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 border-l-3 border-blue-500 rounded-lg">
                    <span className="text-lg">📋</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tomorrowMeals.length > 0 && (
            <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-l-3 border-red-500 rounded-lg">
              <div className="font-bold text-red-600 mb-2">🌅 First Meal ({dayLabels[tomorrowDayIndex]})</div>
              <div className="text-sm text-gray-600 mb-3">{tomorrowMeals[0].time}</div>
              <ul className="space-y-1">
                {tomorrowMeals[0].items.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-base">🌅</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-3xl p-10 border-t-4 border-orange-500 shadow-xl border-2 border-orange-200">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
            💡 Wellness Tips
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: '💧', tip: 'Stay Hydrated: Drink plenty of water throughout the day' },
              { icon: '🚫', tip: 'Avoid Caffeine and Alcohol: These can exacerbate inflammation' },
              { icon: '🛡️', tip: 'Avoid Triggers: Limit sugar, processed foods, and high-fat dairy' },
              { icon: '🧂', tip: 'Cook with turmeric, garlic and ginger abundantly' },
              { icon: '🫒', tip: 'Use cold pressed oil / sesame oil / olive oil for cooking' },
              { icon: '🌾', tip: 'Focus on whole grains, fresh vegetables and legumes' }
            ].map((item, idx) => (
              <div key={idx} className="p-5 bg-gradient-to-br from-white via-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <div className="flex gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-gray-700 font-medium text-sm leading-relaxed">{item.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
