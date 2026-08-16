//  Load food log items from LocalStorage

export function loadFoodLog() {
  try {
    const data = localStorage.getItem('nutriplan_foodlog');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load food log from localStorage:', e);
    return [];
  }
}

//  application state
export const state = {
  currentTab: 'meals',
  activeMealId: null,
  categories: [],
  areas: [],
  meals: [],
  products: [],
  currentMeal: null,
  categoryFilter: '',
  areaFilter: '',
  activeFilter: '',
  nutriScoreFilter: '',
  viewMode: 'grid', // 'grid' or 'list'
  foodLog: loadFoodLog(),
};

// Registered callback state listeners
const listeners = [];

//  Persist current food log items to LocalStorage

export function saveFoodLog() {
  try {
    localStorage.setItem('nutriplan_foodlog', JSON.stringify(state.foodLog));
    notifyListeners();
  } catch (e) {
    console.error('Failed to save food log to localStorage:', e);
  }
}

//  Add a new item to the daily food log

export function addFoodLogItem(item) {
  const logEntry = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    ...item,
  };
  state.foodLog.push(logEntry);
  saveFoodLog();
}

// Delete an item from the daily food log by unique ID

export function deleteFoodLogItem(id) {
  state.foodLog = state.foodLog.filter((item) => item.id !== id);
  saveFoodLog();
}

// Clear all items in the food log
export function clearFoodLog() {
  state.foodLog = [];
  saveFoodLog();
}

//Register a callback listener that triggers whenever the state changes

export function addListener(callback) {
  listeners.push(callback);
}

//  Notify all registered listeners with the updated state

export function notifyListeners() {
  listeners.forEach((callback) => callback(state));
}

// Update state fields and notify listeners
export function updateState(newState) {
  Object.assign(state, newState);
  notifyListeners();
}

// Generate  nutrition facts for meals using their ID and category
export function getMealNutrients(meal) {
  const idNum = parseInt(meal.id) || 12345;
  const category = (meal.category || '').toLowerCase();

  let baseCalories = 400;
  let baseProtein = 20;
  let baseCarbs = 40;
  let baseFat = 12;
  let baseFiber = 3;
  let baseSugar = 5;

  if (
    category.includes('beef') ||
    category.includes('lamb') ||
    category.includes('pork') ||
    category.includes('meat')
  ) {
    baseCalories = 500;
    baseProtein = 35;
    baseCarbs = 10;
    baseFat = 22;
    baseFiber = 1;
    baseSugar = 2;
  } else if (
    category.includes('chicken') ||
    category.includes('poultry') ||
    category.includes('turkey')
  ) {
    baseCalories = 450;
    baseProtein = 38;
    baseCarbs = 15;
    baseFat = 12;
    baseFiber = 1;
    baseSugar = 2;
  } else if (category.includes('seafood') || category.includes('fish')) {
    baseCalories = 350;
    baseProtein = 30;
    baseCarbs = 8;
    baseFat = 8;
    baseFiber = 0;
    baseSugar = 1;
  } else if (category.includes('dessert') || category.includes('sweet')) {
    baseCalories = 450;
    baseProtein = 5;
    baseCarbs = 65;
    baseFat = 15;
    baseFiber = 2;
    baseSugar = 35;
  } else if (
    category.includes('vegetarian') ||
    category.includes('vegan') ||
    category.includes('pasta') ||
    category.includes('starter')
  ) {
    baseCalories = 380;
    baseProtein = 12;
    baseCarbs = 50;
    baseFat = 10;
    baseFiber = 5;
    baseSugar = 4;
  }

  // Add some  variance based on ID
  const calories = baseCalories + (idNum % 15) * 10;
  const protein = baseProtein + (idNum % 8);
  const carbs = baseCarbs + (idNum % 12);
  const fat = baseFat + (idNum % 6);
  const fiber = baseFiber + (idNum % 4);
  const sugar = baseSugar + (idNum % 6);

  return { calories, protein, carbs, fat, fiber, sugar };
}
