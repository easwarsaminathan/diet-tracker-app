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
          <p className="text-lg text-gray-700 font-medium">🌿 Your Daily Wellness Companion</p>
          <p className="text-sm text-gray-500 mt-2">7-Day Ayurvedic Vegetarian Meal Plan</p>
        </div>

        {/* Date & Time Display */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl p-8 mb-6 shadow-xl border-2 border-emerald-200 backdrop-blur-sm text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-xl font-bold text-emerald-600 mb-3 flex items-center justify-center gap-2">
            {dayLabels[selectedDayIndex] === 'Sunday' ? '🎉' : '🌟'} {dayLabels[selectedDayIndex]}
          </div>
          <div className="text-gray-600 font-semibold">⏰ {currentTime}</div>
        </div>

        {/* Day Selector */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 mb-6 shadow-xl border-2 border-blue-200">
          <div className="font-bold text-gray-800 mb-6 text-lg flex items-center gap-2">📅 Select a Day to View Plan</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
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
                  className={`py-3 px-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                    isSelected
                      ? isDayToday
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-white shadow-2xl scale-105'
                        : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md'
                  }`}
                >
                  {dayLabels[dayIdx].substring(0, 3)}
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
        <div className="space-y-5 mb-8">
          {meals.map((meal: any, index: number) => {
            const mealKey = `${dayName}-${meal.id}`;
            const isCompleted = completedMeals[mealKey] || false;
            const prevMealKey = index > 0 ? `${dayName}-${meals[index - 1].id}` : null;
            const isActive = isToday && (index === 0 || (prevMealKey && completedMeals[prevMealKey]));

            return (
              <div
                key={meal.id}
                className={`rounded-2xl p-6 shadow-lg border-l-4 transition-all duration-300 backdrop-blur-sm ${
                  isCompleted
                    ? 'border-l-green-500 bg-gradient-to-br from-green-100 via-teal-50 to-emerald-50 border-2 border-green-300'
                    : 'border-l-red-500 bg-white border-2 border-gray-200'
                } ${isActive ? 'opacity-100 -translate-y-2 shadow-2xl scale-105' : 'opacity-50'} ${
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

                <ul className="space-y-2 border-t-2 border-gray-300 pt-4">
                  {meal.items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-blue-50 hover:to-green-50 transition-all shadow-sm hover:shadow-md">
                      <span className="text-xl mt-0.5 flex-shrink-0">{isCompleted ? '✅' : '🥘'}</span>
                      <span className={`text-sm font-medium ${isCompleted ? 'text-green-700 line-through opacity-70' : 'text-gray-700'}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Next Day Prep */}
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl p-8 border-t-4 border-blue-500 shadow-xl mb-8 border-2 border-blue-200">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            🌙 Tomorrow's Preparation
          </div>
          <div className="text-gray-700 font-semibold mb-6 text-lg">Get ready for {dayLabels[tomorrowDayIndex]}</div>

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
