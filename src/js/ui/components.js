const categoryIcons = {
  beef: 'fa-solid fa-drumstick-bite',
  chicken: 'fa-solid fa-egg',
  dessert: 'fa-solid fa-cookie-bite',
  lamb: 'fa-solid fa-drumstick-bite',
  miscellaneous: 'fa-solid fa-utensils',
  pasta: 'fa-solid fa-bowl-food',
  pork: 'fa-solid fa-drumstick-bite',
  seafood: 'fa-solid fa-fish',
  side: 'fa-solid fa-bowl-rice',
  starter: 'fa-solid fa-plate-wheat',
  vegan: 'fa-solid fa-leaf',
  vegetarian: 'fa-solid fa-carrot',
  breakfast: 'fa-solid fa-mug-hot',
  goat: 'fa-solid fa-seedling',
};

function getCategoryIcon(name) {
  return categoryIcons[(name || '').toLowerCase()] || 'fa-solid fa-utensils';
}

// Same gradient-card pattern as the emerald example in index.html, one color family per category
const categoryColors = {
  beef: { bg: 'from-red-50 to-rose-50', border: 'border-red-200 hover:border-red-400', icon: 'from-red-400 to-rose-500', active: 'border-red-500' },
  chicken: { bg: 'from-orange-50 to-amber-50', border: 'border-orange-200 hover:border-orange-400', icon: 'from-orange-400 to-amber-500', active: 'border-orange-500' },
  dessert: { bg: 'from-pink-50 to-fuchsia-50', border: 'border-pink-200 hover:border-pink-400', icon: 'from-pink-400 to-fuchsia-500', active: 'border-pink-500' },
  lamb: { bg: 'from-rose-50 to-red-50', border: 'border-rose-200 hover:border-rose-400', icon: 'from-rose-400 to-red-500', active: 'border-rose-500' },
  miscellaneous: { bg: 'from-slate-50 to-gray-50', border: 'border-slate-200 hover:border-slate-400', icon: 'from-slate-400 to-gray-500', active: 'border-slate-500' },
  pasta: { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-200 hover:border-yellow-400', icon: 'from-yellow-400 to-amber-500', active: 'border-yellow-500' },
  pork: { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200 hover:border-amber-400', icon: 'from-amber-400 to-orange-500', active: 'border-amber-500' },
  seafood: { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200 hover:border-blue-400', icon: 'from-blue-400 to-cyan-500', active: 'border-blue-500' },
  side: { bg: 'from-green-50 to-lime-50', border: 'border-green-200 hover:border-green-400', icon: 'from-green-400 to-lime-500', active: 'border-green-500' },
  starter: { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200 hover:border-teal-400', icon: 'from-teal-400 to-emerald-500', active: 'border-teal-500' },
  vegan: { bg: 'from-lime-50 to-green-50', border: 'border-lime-200 hover:border-lime-400', icon: 'from-lime-400 to-green-500', active: 'border-lime-500' },
  vegetarian: { bg: 'from-orange-50 to-red-50', border: 'border-orange-200 hover:border-orange-400', icon: 'from-orange-400 to-red-500', active: 'border-orange-500' },
  breakfast: { bg: 'from-yellow-50 to-orange-50', border: 'border-yellow-200 hover:border-yellow-400', icon: 'from-yellow-400 to-orange-500', active: 'border-yellow-500' },
  goat: { bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200 hover:border-emerald-400', icon: 'from-emerald-400 to-green-500', active: 'border-emerald-500' },
};

const defaultCategoryColor = { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200 hover:border-emerald-400', icon: 'from-emerald-400 to-green-500', active: 'border-emerald-500' };

function getCategoryColor(name) {
  return categoryColors[(name || '').toLowerCase()] || defaultCategoryColor;
}

// Product helpers

function getNutriScoreColorClass(grade) {
  switch ((grade || '').toLowerCase()) {
    case 'a':
      return 'bg-green-500';
    case 'b':
      return 'bg-green-600';
    case 'c':
      return 'bg-yellow-500';
    case 'd':
      return 'bg-orange-500';
    case 'e':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}

function getNovaColorClass(group) {
  switch (parseInt(group)) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-orange-500';
    case 4:
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}

function getYoutubeEmbedUrl(youtubeUrl) {
  if (!youtubeUrl) return '';
  const match = youtubeUrl.match(
    /(?:youtu\.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

// Loading & empty states

export function renderSpinner(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="flex items-center justify-center py-12 w-full col-span-full">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>`;
}

export function renderEmptyState(
  containerId,
  message = 'No items found',
  submessage = 'Try searching for something else',
) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 text-center w-full col-span-full">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
      </div>
      <p class="text-gray-500 text-lg font-medium">${message}</p>
      <p class="text-gray-400 text-sm mt-1">${submessage}</p>
    </div>`;
}

// Categories grid

const CATEGORIES_DISPLAY_LIMIT = 12;
const AREAS_DISPLAY_LIMIT = 12;

export function renderCategories(categories, activeFilter) {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  if (!categories || categories.length === 0) {
    grid.innerHTML =
      '<p class="text-gray-500 text-sm col-span-full text-center">No categories found.</p>';
    return;
  }

  const visibleCategories = categories.slice(0, CATEGORIES_DISPLAY_LIMIT);

  // "All" button first
  const allActive = activeFilter === '';
  const allBtn = `
    <div class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border ${allActive ? 'border-emerald-500 shadow-md' : 'border-emerald-200 hover:border-emerald-400 hover:shadow-md'} cursor-pointer transition-all group"
      data-category="">
      <div class="flex items-center gap-2.5">
        <div class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
          <i class="fa-solid fa-border-all"></i>
        </div>
        <h3 class="text-sm font-bold text-gray-900">All</h3>
      </div>
    </div>`;

  const cards = visibleCategories.map((cat) => {
    const iconClass = getCategoryIcon(cat.name);
    const color = getCategoryColor(cat.name);
    const isActive = activeFilter === `cat:${cat.name}`;
    const borderClasses = isActive ? `${color.active} shadow-md` : `${color.border} hover:shadow-md`;
    return `
      <div class="category-card bg-gradient-to-br ${color.bg} rounded-xl p-3 border ${borderClasses} cursor-pointer transition-all group"
        data-category="${cat.name}">
        <div class="flex items-center gap-2.5">
          <div class="text-white w-9 h-9 bg-gradient-to-br ${color.icon} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <i class="${iconClass}"></i>
          </div>
          <h3 class="text-sm font-bold text-gray-900">${cat.name}</h3>
        </div>
      </div>`;
  });

  grid.innerHTML = allBtn + cards.join('');
}

// Areas row

export function renderAreas(areas, activeFilter) {
  const container = document.getElementById('areas-filter-container');
  if (!container) return;

  if (!areas || areas.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500 text-sm">No areas found.</p>';
    return;
  }

  // Only show a capped number of areas
  const visibleAreas = areas.slice(0, AREAS_DISPLAY_LIMIT);

  // "All" pill first
  const allActive = activeFilter === '';
  const allPill = `
    <div class="area-card cursor-pointer select-none whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
        ${allActive ? 'text-white border-transparent shadow-sm' : 'text-gray-600 bg-gray-100 border-gray-200 hover:bg-gray-200'}"
      style="${allActive ? 'background:#10b981;' : ''}"
      data-area="">
      <i class="fa-solid fa-earth-americas mr-1"></i> All Cuisines
    </div>`;

  const pills = visibleAreas.map((area) => {
    const isActive = activeFilter === `area:${area.name}`;
    return `
      <div class="area-card cursor-pointer select-none whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
          ${isActive ? 'text-white border-transparent shadow-sm' : 'text-gray-600 bg-gray-100 border-gray-200 hover:bg-gray-200'}"
        style="${isActive ? 'background:#10b981;' : ''}"
        data-area="${area.name}">
        ${area.name}
      </div>`;
  });

  container.innerHTML = allPill + pills.join('');
}

// Recipes grid / list

export function renderRecipes(meals, viewMode = 'grid') {
  const grid = document.getElementById('recipes-grid');
  if (!grid) return;

  grid.className =
    viewMode === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-4 gap-5';

  if (!meals || meals.length === 0) {
    renderEmptyState(
      'recipes-grid',
      'No recipes found',
      'Try a different category, area, or search term',
    );
    return;
  }

  grid.innerHTML = meals
    .map((meal) => {
      if (viewMode === 'list') {
        return `
        <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col sm:flex-row h-auto sm:h-40" data-meal-id="${meal.id}">
          <div class="relative w-full sm:w-48 h-40 sm:h-full shrink-0 overflow-hidden">
            <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.thumbnail || ''}" alt="${meal.name}" loading="lazy"/>
            <div class="absolute bottom-2 left-2">
              <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.category}</span>
            </div>
          </div>
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.name}</h3>
              <p class="text-xs text-gray-600 line-clamp-2">${meal.instructions ? (Array.isArray(meal.instructions) ? meal.instructions.join(' ') : meal.instructions) : 'Click to view the full recipe.'}</p>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${meal.category}</span>
              ${meal.area ? `<span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${meal.area}</span>` : ''}
            </div>
          </div>
        </div>`;
      }

      // Grid view
      return `
      <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${meal.id}">
        <div class="relative h-48 overflow-hidden">
          <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.thumbnail || ''}" alt="${meal.name}" loading="lazy"/>
          <div class="absolute bottom-3 left-3 flex gap-2">
            <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.category}</span>
            ${meal.area ? `<span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.area}</span>` : ''}
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.name}</h3>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">${meal.instructions ? (Array.isArray(meal.instructions) ? meal.instructions.join(' ') : meal.instructions) : 'Click to view full recipe details.'}</p>
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${meal.category}</span>
            ${meal.area ? `<span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${meal.area}</span>` : ''}
          </div>
        </div>
      </div>`;
    })
    .join('');
}

// Meal detail view

export function renderMealDetails(meal, nutrients) {
  const detailContainer = document.getElementById('meal-details');
  if (!detailContainer) return;

  const banner = detailContainer.querySelector('.relative.h-80 img');
  if (banner) {
    banner.src = meal.thumbnail;
    banner.alt = meal.name;
  }

  const badgesContainer = detailContainer.querySelector(
    '.absolute.bottom-0 .flex.items-center.gap-3',
  );
  if (badgesContainer) {
    badgesContainer.innerHTML = `
      <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>
      ${meal.area ? `<span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area}</span>` : ''}
      ${(meal.tags || [])
        .slice(0, 2)
        .map(
          (tag) =>
            `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${tag}</span>`,
        )
        .join('')}`;
  }

  const title = detailContainer.querySelector('.absolute.bottom-0 h1');
  if (title) title.textContent = meal.name;

  const heroServings = document.getElementById('hero-servings');
  if (heroServings) heroServings.textContent = '4 servings';

  const heroCalories = document.getElementById('hero-calories');
  if (heroCalories)
    heroCalories.textContent = `${nutrients.calories} cal/serving`;

  const logMealBtn = document.getElementById('log-meal-btn');
  if (logMealBtn) logMealBtn.setAttribute('data-meal-id', meal.id);

  // Ingredients
  const ingredientsContainer = detailContainer.querySelector(
    '.bg-white.rounded-2xl.shadow-lg.p-6 .grid',
  );
  const ingredientCountLabel = detailContainer.querySelector(
    '.bg-white.rounded-2xl.shadow-lg.p-6 h2 span',
  );

  if (ingredientsContainer) {
    if (meal.ingredients && meal.ingredients.length > 0) {
      if (ingredientCountLabel)
        ingredientCountLabel.textContent = `${meal.ingredients.length} items`;
      ingredientsContainer.innerHTML = meal.ingredients
        .map(
          (ing) => `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
          <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"/>
          <span class="text-gray-700 text-sm"><span class="font-bold text-gray-900">${ing.measure}</span> ${ing.ingredient}</span>
        </div>`,
        )
        .join('');
    } else {
      if (ingredientCountLabel) ingredientCountLabel.textContent = '0 items';
      ingredientsContainer.innerHTML =
        '<p class="text-gray-500 text-sm py-4 col-span-full text-center">No ingredients listed.</p>';
    }
  }

  // Instructions
  const instructionsContainer = detailContainer.querySelector('.space-y-4');
  if (instructionsContainer) {
    let steps = [];
    if (Array.isArray(meal.instructions)) {
      steps = meal.instructions;
    } else if (meal.instructions) {
      steps = meal.instructions
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 10);
    }

    instructionsContainer.innerHTML =
      steps.length > 0
        ? steps
            .map(
              (step, idx) => `
          <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">${idx + 1}</div>
            <p class="text-gray-700 leading-relaxed pt-1.5 text-sm">${step.replace(/^\d+\.\s*/, '')}</p>
          </div>`,
            )
            .join('')
        : '<p class="text-gray-500 text-sm py-4 text-center">No instructions provided.</p>';
  }

  // Video
  const videoSection =
    detailContainer.querySelector('.fa-video') &&
    detailContainer.querySelector('.fa-video').closest('.bg-white.rounded-2xl');
  const iframe = detailContainer.querySelector('iframe');
  const embedUrl = getYoutubeEmbedUrl(meal.youtube);
  if (videoSection && iframe) {
    videoSection.style.display = embedUrl ? '' : 'none';
    iframe.src = embedUrl || '';
  }

  // Nutrition facts
  const factContainer = document.getElementById('nutrition-facts-container');
  if (factContainer) {
    const totalCalories = nutrients.calories * 4;
    factContainer.innerHTML = `
      <p class="text-sm text-gray-500 mb-4">Per serving (Calculated for 4 servings)</p>
      <div class="text-center py-4 mb-5 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
        <p class="text-xs text-gray-600 font-medium">Calories per serving</p>
        <p class="text-4xl font-extrabold text-emerald-600 my-0.5">${nutrients.calories}</p>
        <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total: ${totalCalories} cal</p>
      </div>
      <div class="space-y-4">
        ${[
          {
            label: 'Protein',
            value: nutrients.protein,
            color: 'bg-emerald-500',
            max: 50,
          },
          {
            label: 'Carbs',
            value: nutrients.carbs,
            color: 'bg-blue-500',
            max: 250,
          },
          {
            label: 'Fat',
            value: nutrients.fat,
            color: 'bg-purple-500',
            max: 65,
          },
          {
            label: 'Fiber',
            value: nutrients.fiber,
            color: 'bg-orange-500',
            max: 28,
          },
          {
            label: 'Sugar',
            value: nutrients.sugar,
            color: 'bg-pink-500',
            max: 50,
          },
        ]
          .map(
            (n) => `
          <div>
            <div class="flex items-center justify-between text-sm mb-1">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full ${n.color}"></div>
                <span class="text-gray-700 font-medium">${n.label}</span>
              </div>
              <span class="font-bold text-gray-900">${n.value}g</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="${n.color} h-2 rounded-full progress-animate" style="width:${Math.min((n.value / n.max) * 100, 100)}%"></div>
            </div>
          </div>`,
          )
          .join('')}
      </div>
      <div class="mt-6 pt-6 border-t border-gray-100">
        <h3 class="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Vitamins & Minerals (% Daily Value)</h3>
        <div class="grid grid-cols-2 gap-3 text-xs">
          ${['Vitamin A / 15%', 'Vitamin C / 25%', 'Calcium / 4%', 'Iron / 12%']
            .map((v) => {
              const [label, pct] = v.split(' / ');
              return `<div class="flex justify-between border-b border-gray-50 pb-1"><span class="text-gray-600 font-medium">${label}</span><span class="font-bold text-gray-900">${pct}</span></div>`;
            })
            .join('')}
        </div>
      </div>`;
  }
}

// Products grid

export function renderProducts(products, activeGradeFilter = '') {
  const grid = document.getElementById('products-grid');
  const countLabel = document.getElementById('products-count');
  if (!grid) return;

  let displayed = activeGradeFilter
    ? products.filter(
        (p) =>
          (p.nutritionGrade || '').toLowerCase() ===
          activeGradeFilter.toLowerCase(),
      )
    : products;

  if (countLabel)
    countLabel.textContent = `Showing ${displayed.length} product${displayed.length !== 1 ? 's' : ''}`;

  if (!displayed || displayed.length === 0) {
    renderEmptyState(
      'products-grid',
      'No products found',
      'Try refining your filters or search terms',
    );
    return;
  }

  grid.innerHTML = displayed
    .map((prod) => {
      const scoreColor = getNutriScoreColorClass(prod.nutritionGrade);
      const nutrients = prod.nutrients || {};
      const cals = Math.round(parseFloat(nutrients.calories) || 0);
      return `
      <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between" data-barcode="${prod.barcode}">
        <div class="relative h-40 bg-gray-50 flex items-center justify-center p-3 overflow-hidden shrink-0">
          <img class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            src="${prod.image || ''}" alt="${prod.name}" loading="lazy"
            onerror="this.src='https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Image'"/>
          ${prod.nutritionGrade ? `<div class="absolute top-2 left-2 ${scoreColor} text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase shadow-sm">Nutri-Score ${prod.nutritionGrade}</div>` : ''}
          ${prod.novaGroup ? `<div class="absolute top-2 right-2 ${getNovaColorClass(prod.novaGroup)} text-white text-[10px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center shadow-sm" title="NOVA ${prod.novaGroup}">${prod.novaGroup}</div>` : ''}
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div class="mb-3">
            <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5 truncate">${prod.brand || 'Generic Brand'}</p>
            <h3 class="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">${prod.name}</h3>
          </div>
          <div>
            <div class="flex items-center gap-3 text-xs text-gray-500 mb-3 border-t border-gray-100 pt-2.5">
              <span><i class="fa-solid fa-barcode text-gray-400 mr-1"></i>${prod.barcode}</span>
              <span><i class="fa-solid fa-fire text-amber-500 mr-1"></i>${cals} kcal/100g</span>
            </div>
            <div class="grid grid-cols-4 gap-1 text-center">
              <div class="bg-emerald-50 rounded p-1.5"><p class="text-[11px] font-bold text-emerald-700">${nutrients.protein ?? 0}g</p><p class="text-[9px] text-gray-500 font-medium">Protein</p></div>
              <div class="bg-blue-50 rounded p-1.5"><p class="text-[11px] font-bold text-blue-700">${nutrients.carbs ?? 0}g</p><p class="text-[9px] text-gray-500 font-medium">Carbs</p></div>
              <div class="bg-purple-50 rounded p-1.5"><p class="text-[11px] font-bold text-purple-700">${nutrients.fat ?? 0}g</p><p class="text-[9px] text-gray-500 font-medium">Fat</p></div>
              <div class="bg-orange-50 rounded p-1.5"><p class="text-[11px] font-bold text-orange-700">${nutrients.sugar ?? 0}g</p><p class="text-[9px] text-gray-500 font-medium">Sugar</p></div>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join('');
}

// Product detail modal

export function buildProductModalHtml(product) {
  const n = product.nutrients || {};
  const grade = (product.nutritionGrade || '').toLowerCase();
  const gradeColor = getNutriScoreColorClass(grade);
  const gradeLetter = grade && grade !== 'unknown' ? grade.toUpperCase() : '?';
  const gradeLabel =
    grade && grade !== 'unknown' ? grade.toUpperCase() : 'Unknown';

  const calories = Math.round(parseFloat(n.calories) || 0);
  const protein = (parseFloat(n.protein) || 0).toFixed(1);
  const carbs = (parseFloat(n.carbs) || 0).toFixed(1);
  const fat = (parseFloat(n.fat) || 0).toFixed(1);
  const sugar = (parseFloat(n.sugar) || 0).toFixed(1);
  const fiber = (parseFloat(n.fiber) || 0).toFixed(1);

  const salt = ((parseFloat(n.sodium) || 0) * 2.5).toFixed(2);

  return `
    <div class="text-left">
      <div class="flex items-start gap-4 mb-4">
        <img src="${product.image || ''}" alt="${product.name}"
          class="w-20 h-20 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
          onerror="this.src='https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image'"/>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-emerald-600 uppercase tracking-wide truncate">${product.brand || 'Generic Brand'}</p>
          <h3 class="text-lg font-bold text-gray-900 leading-tight">${product.name}</h3>
          <div class="flex items-center gap-2 mt-2">
            <div class="w-9 h-9 rounded-lg ${gradeColor} text-white flex items-center justify-center text-xs font-extrabold uppercase shrink-0">${gradeLetter}</div>
            <div>
              <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Nutri-Score</p>
              <p class="text-sm font-bold text-gray-800">${gradeLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <p class="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
          <i class="fa-solid fa-chart-pie text-emerald-600"></i> Nutrition Facts (per 100g)
        </p>
        <div class="text-center py-2">
          <p class="text-4xl font-extrabold text-gray-900 leading-none">${calories}</p>
          <p class="text-xs text-gray-500 font-semibold mt-1">Calories</p>
        </div>
        <div class="grid grid-cols-4 gap-2 text-center mt-3 pt-3 border-t border-emerald-100">
          <div><p class="font-bold text-emerald-600">${protein}g</p><p class="text-[10px] text-gray-500">Protein</p></div>
          <div><p class="font-bold text-blue-600">${carbs}g</p><p class="text-[10px] text-gray-500">Carbs</p></div>
          <div><p class="font-bold text-purple-600">${fat}g</p><p class="text-[10px] text-gray-500">Fat</p></div>
          <div><p class="font-bold text-orange-600">${sugar}g</p><p class="text-[10px] text-gray-500">Sugar</p></div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-emerald-100">
          <div><p class="font-bold text-gray-900">${fiber}g</p><p class="text-[10px] text-gray-500">Fiber</p></div>
          <div><p class="font-bold text-gray-900">${salt}g</p><p class="text-[10px] text-gray-500">Salt</p></div>
          <div><p class="font-bold text-gray-400">—</p><p class="text-[10px] text-gray-500">Sat. Fat</p></div>
        </div>
      </div>

      <div class="flex gap-3 mt-5">
        <button id="log-food-modal-btn" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl py-3 transition-colors">
          <i class="fa-solid fa-plus mr-1.5"></i>Log This Food
        </button>
        <button id="close-food-modal-btn" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl py-3 transition-colors">
          Close
        </button>
      </div>
    </div>`;
}

// Daily Food Log

export function renderFoodLog(logItems) {
  const listContainer = document.getElementById('logged-items-list');
  const clearBtn = document.getElementById('clear-foodlog');
  const summaryTitle = document.querySelector('#foodlog-section h4');
  if (!listContainer) return;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayItems = logItems.filter((item) => item.date === todayStr);

  if (summaryTitle)
    summaryTitle.textContent = `Logged Items (${todayItems.length})`;
  if (clearBtn) clearBtn.style.display = todayItems.length > 0 ? '' : 'none';

  if (todayItems.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-semibold text-gray-700">No meals logged today</p>
        <p class="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Add meals from the Meals page or scan products.</p>
      </div>`;
    return;
  }

  listContainer.innerHTML = todayItems
    .map((item) => {
      const isMeal = item.type === 'meal';
      const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg ${isMeal ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} flex items-center justify-center font-bold">
            <i class="${isMeal ? 'fa-solid fa-utensils' : 'fa-solid fa-barcode'}"></i>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm leading-tight line-clamp-1">${item.name}</h4>
            <p class="text-xs text-gray-500 mt-1">
              <span class="font-semibold">${item.servingSize || '1 serving'}</span>
              <span class="mx-1.5">•</span>
              <span>Logged at ${timeStr}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <div class="text-right">
            <p class="font-bold text-gray-900 text-sm">${item.calories} kcal</p>
            <p class="text-[10px] text-gray-500 font-medium">P: ${item.protein}g | C: ${item.carbs}g | F: ${item.fat}g</p>
          </div>
          <button class="delete-log-btn text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors" data-id="${item.id}" aria-label="Delete entry">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>`;
    })
    .join('');
}
