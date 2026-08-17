'use client';

import { useEffect, useState } from 'react';
import { dietPlan, dayNames, dayLabels } from '@/lib/diet-plan';

export function DietTrackerClient() {
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('dietTrackerProgress');
    if (saved) {
      setCompletedMeals(JSON.parse(saved));
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

  const saveProgress = (newMeals: Record<string, boolean>) => {
    localStorage.setItem('dietTrackerProgress', JSON.stringify(newMeals));
  };

  const handleMealCheck = (mealKey: string, checked: boolean) => {
    const newMeals = { ...completedMeals, [mealKey]: checked };
    setCompletedMeals(newMeals);
    saveProgress(newMeals);
  };

  const today = new Date();
  const selectedDate = new Date(today);
  selectedDate.setDate(selectedDate.getDate() + (selectedDayIndex - today.getDay()));

  const dayName = dayNames[selectedDayIndex];
  const meals = dietPlan[dayName as keyof typeof dietPlan] || [];
  const isToday = dayNames[today.getDay()] === dayName;

  const completedCount = meals.filter((meal: any) =>
    completedMeals[`${dayName}-${meal.id}`]
  ).length;

  const progressPercentage = meals.length > 0 ? (completedCount / meals.length) * 100 : 0;

  const tomorrowDate = new Date(selectedDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDayIndex = tomorrowDate.getDay();
  const tomorrowDayName = dayNames[tomorrowDayIndex];
  const tomorrowMeals = dietPlan[tomorrowDayName as keyof typeof dietPlan] || [];

  const tomorrowPrepItems = new Set<string>();
  tomorrowMeals.forEach((meal: any) => {
    meal.items.forEach((item: string) => {
      const lowerItem = item.toLowerCase();
      if (lowerItem.includes('soaked') || lowerItem.includes('peeled') || lowerItem.includes('sprout')) {
        tomorrowPrepItems.add(item);
      }
    });
  });

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            🥗 Anti-Inflammatory Diet Tracker
          </h1>
          <p className="text-lg text-white opacity-95">Your Daily Health Journey</p>
        </div>

        {/* Date & Time Display */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 mb-6 shadow-lg text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-lg font-semibold text-red-500 mb-2">{dayLabels[selectedDayIndex]}</div>
          <div className="text-gray-600">🕐 {currentTime}</div>
        </div>

        {/* Day Selector */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="font-semibold text-gray-800 mb-4">📅 Select a Day to View Plan</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date(today);
              date.setDate(date.getDate() + i);
              const dayIdx = date.getDay();
              const isSelected = dayIdx === selectedDayIndex;
              const isDayToday = i === 0;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDayIndex(dayIdx)}
                  className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                    isSelected
                      ? isDayToday
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                        : 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dayLabels[dayIdx].substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between mb-3 font-semibold text-gray-800">
            <span>Progress</span>
            <span>{completedCount}/{meals.length}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Completion Message */}
        {isToday && completedCount === meals.length && meals.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-8 mb-6 shadow-lg text-center font-bold text-xl animate-pulse">
            🎉 Amazing! You completed today's diet plan! 🎉
          </div>
        )}

        {/* Meals */}
        <div className="space-y-5 mb-8">
          {meals.map((meal: any, index: number) => {
            const mealKey = `${dayName}-${meal.id}`;
            const isCompleted = completedMeals[mealKey] || false;
            const prevMealKey = index > 0 ? `${dayName}-${meals[index - 1].id}` : null;
            const isActive = isToday && (index === 0 || (prevMealKey && completedMeals[prevMealKey]));

            return (
              <div
                key={meal.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 transition-all duration-300 ${
                  isCompleted
                    ? 'border-l-green-500 bg-gradient-to-br from-green-50 to-teal-50'
                    : 'border-l-red-500'
                } ${isActive ? 'opacity-100 -translate-y-1 shadow-2xl' : 'opacity-50'} ${
                  !isToday ? 'opacity-100' : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{meal.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{meal.time}</div>
                    <div className="text-2xl font-bold text-gray-800">{meal.name}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => handleMealCheck(mealKey, e.target.checked)}
                    disabled={!isToday}
                    className={`w-8 h-8 cursor-pointer accent-red-500 ${!isToday ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>

                <ul className="space-y-2 border-t border-gray-200 pt-4">
                  {meal.items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-xl mt-0.5">{isCompleted ? '✓' : '🥘'}</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Next Day Prep */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-8 border-t-4 border-blue-500 shadow-lg mb-8">
          <div className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            📆 Tomorrow's Preparation
          </div>
          <div className="text-gray-600 mb-6">Get ready for {dayLabels[tomorrowDayIndex]}</div>

          {tomorrowPrepItems.size > 0 && (
            <div className="mb-6">
              <div className="font-bold text-blue-600 mb-3">🌙 Items to Soak Overnight</div>
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
        <div className="bg-white bg-opacity-95 rounded-2xl p-8 border-t-4 border-orange-500 shadow-lg">
          <div className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            💡 Daily Tips
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Stay Hydrated: Drink plenty of water throughout the day',
              'Avoid Caffeine and Alcohol: These can exacerbate inflammation',
              'Avoid Triggers: Limit sugar, processed foods, and high-fat dairy',
              'Cook with turmeric, garlic and ginger abundantly',
              'Use cold pressed oil / sesame oil / olive oil for cooking',
              'Focus on whole grains, fresh vegetables and legumes'
            ].map((tip, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-l-3 border-orange-500 rounded-lg">
                <span className="text-gray-700">✨ {tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
