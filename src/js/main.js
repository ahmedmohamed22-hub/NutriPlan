import {
  fetchCategories,
  fetchAreas,
  searchMeals,
  getMealById,
  filterMealsByCategory,
  filterMealsByArea,
  searchProducts,
  getProductByBarcode,
} from './mealdb.js';

import {
  state,
  addListener,
  updateState,
  addFoodLogItem,
  deleteFoodLogItem,
  clearFoodLog,
  getMealNutrients,
} from './appState.js';

import {
  renderSpinner,
  renderEmptyState,
  renderCategories,
  renderAreas,
  renderRecipes,
  renderMealDetails,
  renderProducts,
  renderFoodLog,
  buildProductModalHtml,
} from './ui/components.js';

// Initialize the application
async function init() {
  showAppLoading(true);

  // Inject the areas filter row container dynamically
  const catSection = document.getElementById('meal-categories-section');
  if (catSection && !document.getElementById('areas-filter-container')) {
    const areasWrapper = document.createElement('div');
    areasWrapper.className = 'mt-4 pt-4 border-t border-gray-100';
    areasWrapper.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-globe text-blue-500 text-xs"></i>
          Browse by Area
        </h2>
      </div>
      <div id="areas-filter-container" class="flex flex-wrap gap-2"></div>
    `;
    catSection.appendChild(areasWrapper);
  }

  // Bind DOM events
  bindEvents();

  // Register state listener to trigger UI re-renders on state change
  addListener((updatedState) => handleStateChange(updatedState));

  // Handle initial routing
  handleRouting();

  // Load initial categories, areas & default meals
  try {
    const [categoriesData, areasData, defaultMealsData] = await Promise.all([
      fetchCategories(),
      fetchAreas(),
      searchMeals(''),
    ]);

    updateState({
      categories: categoriesData.results || [],
      areas: areasData.results || [],
      meals: defaultMealsData.results || [],
    });
  } catch (error) {
    console.error('Initialization failed:', error);
    Swal.fire({
      icon: 'error',
      title: 'Initialization Failed',
      text: 'Could not fetch data from the server. Please check your internet connection and try again.',
      confirmButtonColor: '#10b981',
    });
  } finally {
    showAppLoading(false);
  }
}

// Show or hide the  app loading overlay
function showAppLoading(show) {
  const overlay = document.getElementById('app-loading-overlay');
  if (!overlay) return;
  if (show) {
    overlay.style.display = 'flex';
    overlay.classList.remove('opacity-0');
  } else {
    overlay.classList.add('opacity-0');

    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
  }
}

// Listen to URL hash changes
function handleRouting() {
  const route = () => {
    const hash = window.location.hash || '#meals';

    if (hash.startsWith('#recipe/')) {
      const id = hash.split('/')[1];
      navigateToRecipeDetail(id);
    } else if (hash === '#products') {
      updateState({ currentTab: 'products' });
    } else if (hash === '#foodlog') {
      updateState({ currentTab: 'foodlog' });
    } else {
      // Default fallback
      updateState({ currentTab: 'meals' });
    }
  };

  window.addEventListener('hashchange', route);
  route(); // Call once on load
}

// Switch the UI view sections based on current active tab
function renderTabs(currentTab) {
  const mealsSections = [
    document.getElementById('search-filters-section'),
    document.getElementById('meal-categories-section'),
    document.getElementById('all-recipes-section'),
  ];
  const detailsSection = document.getElementById('meal-details');
  const productsSection = document.getElementById('products-section');
  const foodlogSection = document.getElementById('foodlog-section');

  const setVisible = (elements, visible) => {
    elements.forEach((el) => {
      if (el) el.style.display = visible ? '' : 'none';
    });
  };

  // Hide all first
  setVisible(mealsSections, false);
  setVisible([detailsSection, productsSection, foodlogSection], false);

  // Update Header Content
  const headerTitle = document.querySelector('#header h1');
  const headerSub = document.querySelector('#header p');

  // Show active tab
  switch (currentTab) {
    case 'meals':
      setVisible(mealsSections, true);
      if (headerTitle) headerTitle.textContent = 'Meals & Recipes';
      if (headerSub) {
        headerSub.textContent =
          'Discover delicious and nutritious recipes tailored for you';
        headerSub.style.display = '';
      }
      break;
    case 'recipe-detail':
      setVisible([detailsSection], true);
      if (headerTitle) headerTitle.textContent = 'Recipe Details';
      if (headerSub) {
        headerSub.textContent =
          'View recipe ingredients, preparation steps, and nutrition info';
        headerSub.style.display = '';
      }
      break;
    case 'products':
      setVisible([productsSection], true);
      if (headerTitle) headerTitle.textContent = 'Product Scanner';
      if (headerSub) {
        headerSub.textContent =
          'Search or scan packaged foods to check ingredients and nutrients';
        headerSub.style.display = '';
      }
      break;
    case 'foodlog':
      setVisible([foodlogSection], true);
      if (headerTitle) headerTitle.textContent = 'Daily Food Log';
      if (headerSub) {
        headerSub.textContent =
          'Monitor your calories, macronutrient targets, and weekly statistics';
        headerSub.style.display = '';
      }
      break;
  }

  // Update Sidebar Navigation Active Styling
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link, idx) => {
    let isActive = false;
    if (idx === 0 && (currentTab === 'meals' || currentTab === 'recipe-detail'))
      isActive = true;
    if (idx === 1 && currentTab === 'products') isActive = true;
    if (idx === 2 && currentTab === 'foodlog') isActive = true;

    const span = link.querySelector('span');

    if (isActive) {
      link.className =
        'nav-link flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg transition-all';
      if (span) {
        span.className = 'font-semibold';
      }
    } else {
      link.className =
        'nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all';
      if (span) {
        span.className = 'font-medium';
      }
    }
  });

  // Close mobile sidebar if open
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
}

/**
 * Show/hide a loading spinner OVER the meal-details section without destroying
 * its inner structure. #meal-details contains named elements (.relative.h-80 img,
 * #hero-servings, ingredient/instruction containers, etc.) that renderMealDetails()
 * updates via querySelector — wiping the container's innerHTML (like renderSpinner
 * does) destroys those elements permanently, so a plain overlay is used instead.
 */
function showMealDetailLoading(show) {
  const container = document.getElementById('meal-details');
  if (!container) return;

  let overlay = document.getElementById('meal-detail-loading-overlay');

  if (show) {
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'meal-detail-loading-overlay';
      overlay.className =
        'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20';
      overlay.innerHTML =
        '<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>';
      container.appendChild(overlay);
    }
  } else if (overlay) {
    overlay.remove();
  }
}

// Navigate to the Detailed Recipe screen
async function navigateToRecipeDetail(mealId) {
  updateState({
    currentTab: 'recipe-detail',
    activeMealId: mealId,
    currentMeal: null,
  });

  showMealDetailLoading(true);

  try {
    const data = await getMealById(mealId);
    if (data && data.result) {
      const meal = data.result;
      const nutrients = getMealNutrients(meal);
      updateState({ currentMeal: meal });

      // Re-render detailed view
      renderMealDetails(meal, nutrients);
    } else {
      throw new Error('Meal details empty');
    }
  } catch (err) {
    console.error('Failed to load meal details:', err);
    Swal.fire({
      icon: 'error',
      title: 'Failed to load recipe',
      text: 'Verify your connection and try again.',
      confirmButtonColor: '#10b981',
    });
  } finally {
    showMealDetailLoading(false);
  }
}

// Triggered whenever AppState changes
function handleStateChange(currentState) {
  //  Render active tab layout
  renderTabs(currentState.currentTab);

  //  Render categories + areas grids (if on meals page)
  if (currentState.currentTab === 'meals') {
    renderCategories(currentState.categories, currentState.activeFilter);
    renderAreas(currentState.areas, currentState.activeFilter);
    renderRecipes(currentState.meals, currentState.viewMode);

    // Update recipe count label
    const countLabel = document.getElementById('recipes-count');
    if (countLabel) {
      countLabel.textContent = `Showing ${currentState.meals.length} recipe${currentState.meals.length !== 1 ? 's' : ''}`;
    }
  }

  //  Render products (if on products tab)
  if (currentState.currentTab === 'products') {
    renderProducts(currentState.products, currentState.nutriScoreFilter);
  }

  //  Render food log items (if on foodlog tab)
  if (currentState.currentTab === 'foodlog') {
    renderFoodLog(currentState.foodLog);
    updateFoodLogSummary(currentState.foodLog);
    drawWeeklyChart(currentState.foodLog);
  }
}

// Update progress bars and intake metrics for the food log page

function updateFoodLogSummary(logItems) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayItems = logItems.filter((item) => item.date === todayStr);

  // Sum today's metrics
  const totalCals = todayItems.reduce(
    (sum, item) => sum + (parseFloat(item.calories) || 0),
    0,
  );
  const totalProtein = todayItems.reduce(
    (sum, item) => sum + (parseFloat(item.protein) || 0),
    0,
  );
  const totalCarbs = todayItems.reduce(
    (sum, item) => sum + (parseFloat(item.carbs) || 0),
    0,
  );
  const totalFat = todayItems.reduce(
    (sum, item) => sum + (parseFloat(item.fat) || 0),
    0,
  );

  // Set today's date formatted label
  const dateLabel = document.getElementById('foodlog-date');
  if (dateLabel) {
    dateLabel.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }

  // Locate elements and update
  const summarySection = document.getElementById('foodlog-today-section');
  if (summarySection) {
    const bars = summarySection.querySelectorAll('.w-full > div');

    // Calories (target: 2000)
    const caloriesLabel = summarySection.querySelector(
      '.bg-emerald-50 span:nth-child(2)',
    );
    if (caloriesLabel)
      caloriesLabel.textContent = `${Math.round(totalCals)} / 2000 kcal`;
    if (bars[0])
      bars[0].style.width = `${Math.min((totalCals / 2000) * 100, 100)}%`;

    // Protein (target: 50)
    const proteinLabel = summarySection.querySelector(
      '.bg-blue-50 span:nth-child(2)',
    );
    if (proteinLabel)
      proteinLabel.textContent = `${Math.round(totalProtein * 10) / 10} / 50 g`;
    if (bars[1])
      bars[1].style.width = `${Math.min((totalProtein / 50) * 100, 100)}%`;

    // Carbs (target: 250)
    const carbsLabel = summarySection.querySelector(
      '.bg-amber-50 span:nth-child(2)',
    );
    if (carbsLabel)
      carbsLabel.textContent = `${Math.round(totalCarbs * 10) / 10} / 250 g`;
    if (bars[2])
      bars[2].style.width = `${Math.min((totalCarbs / 250) * 100, 100)}%`;

    // Fat (target: 65)
    const fatLabel = summarySection.querySelector(
      '.bg-purple-50 span:nth-child(2)',
    );
    if (fatLabel)
      fatLabel.textContent = `${Math.round(totalFat * 10) / 10} / 65 g`;
    if (bars[3])
      bars[3].style.width = `${Math.min((totalFat / 65) * 100, 100)}%`;
  }
}

// Helper to retrieve last 7 days
function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push({
      key: `${year}-${month}-${day}`,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return dates;
}

// Renders  weekly calorie chart
function drawWeeklyChart(logItems) {
  if (typeof Plotly === 'undefined') return;

  const last7Days = getLast7Days();
  const caloriesData = last7Days.map((day) => {
    const dayItems = logItems.filter((item) => item.date === day.key);
    return dayItems.reduce(
      (sum, item) => sum + (parseFloat(item.calories) || 0),
      0,
    );
  });

  const labels = last7Days.map((day) => day.label);

  const trace = {
    x: labels,
    y: caloriesData,
    type: 'bar',
    name: 'Intake',
    marker: {
      color: '#10b981',
      line: {
        color: '#047857',
        width: 1.5,
      },
    },
    hovertemplate: '%{x}: %{y} kcal<extra></extra>',
  };

  const layout = {
    margin: { l: 45, r: 15, t: 20, b: 35 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    font: {
      family: 'Inter, sans-serif',
      size: 11,
      color: '#6b7280',
    },
    xaxis: {
      gridcolor: 'rgba(0,0,0,0)',
      zeroline: false,
      tickfont: { color: '#6b7280' },
    },
    yaxis: {
      gridcolor: '#f3f4f6',
      zeroline: false,
      tickfont: { color: '#6b7280' },
    },
    shapes: [
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        x1: 1,
        yref: 'y',
        y0: 2000,
        y1: 2000,
        line: {
          color: '#ef4444',
          width: 1.5,
          dash: 'dot',
        },
      },
    ],
    annotations: [
      {
        xref: 'paper',
        x: 0.95,
        yref: 'y',
        y: 2050,
        text: 'Target (2000)',
        showarrow: false,
        font: {
          color: '#ef4444',
          size: 10,
          weight: 'bold',
        },
      },
    ],
  };

  const config = { responsive: true, displayModeBar: false };
  Plotly.newPlot('weekly-chart', [trace], layout, config);
}

// Setup event listeners on DOM components
function bindEvents() {
  // Sidebar Nav Clicks
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (idx === 0) window.location.hash = '#meals';
      if (idx === 1) window.location.hash = '#products';
      if (idx === 2) window.location.hash = '#foodlog';
    });
  });

  // Mobile Sidebar Buttons
  const menuBtn = document.getElementById('header-menu-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const overlay = document.getElementById('sidebar-overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
      overlay.classList.add('active');
    });
  }

  const closeSidebar = () => {
    document.getElementById('sidebar').classList.remove('open');
    overlay.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // View Mode Toggles
  const gridBtn = document.getElementById('grid-view-btn');
  const listBtn = document.getElementById('list-view-btn');

  const updateViewModeButtons = (viewMode) => {
    if (viewMode === 'grid') {
      gridBtn.classList.add('bg-white', 'shadow-xs', 'rounded-md');
      gridBtn.querySelector('i').className =
        'fa-solid fa-table-cells text-gray-700';
      listBtn.classList.remove('bg-white', 'shadow-xs', 'rounded-md');
      listBtn.querySelector('i').className = 'fa-solid fa-list text-gray-400';
    } else {
      listBtn.classList.add('bg-white', 'shadow-xs', 'rounded-md');
      listBtn.querySelector('i').className = 'fa-solid fa-list text-gray-700';
      gridBtn.classList.remove('bg-white', 'shadow-xs', 'rounded-md');
      gridBtn.querySelector('i').className =
        'fa-solid fa-table-cells text-gray-400';
    }
  };

  if (gridBtn) {
    gridBtn.addEventListener('click', () => {
      updateState({ viewMode: 'grid' });
      updateViewModeButtons('grid');
    });
  }

  if (listBtn) {
    listBtn.addEventListener('click', () => {
      updateState({ viewMode: 'list' });
      updateViewModeButtons('list');
    });
  }

  // Meal Categories Grid Clicking
  const catGrid = document.getElementById('categories-grid');
  if (catGrid) {
    catGrid.addEventListener('click', async (e) => {
      const card = e.target.closest('.category-card');
      if (!card) return;

      const category = card.getAttribute('data-category');

      if (category === '') {
        // "All" clicked — reset all filters
        updateState({ categoryFilter: '', areaFilter: '', activeFilter: '' });
        renderSpinner('recipes-grid');
        try {
          const data = await searchMeals('');
          updateState({ meals: data.results || [] });
        } catch (err) {
          console.error('Failed fetching all meals:', err);
        }
        return;
      }

      const filterKey = `cat:${category}`;
      const alreadyActive = state.activeFilter === filterKey;

      if (alreadyActive) {
        // Deselect — show all
        updateState({ categoryFilter: '', areaFilter: '', activeFilter: '' });
        renderSpinner('recipes-grid');
        try {
          const data = await searchMeals('');
          updateState({ meals: data.results || [] });
        } catch (err) {
          console.error('Failed fetching all meals:', err);
        }
      } else {
        // Select this category
        updateState({
          categoryFilter: category,
          areaFilter: '',
          activeFilter: filterKey,
        });
        renderSpinner('recipes-grid');
        try {
          const data = await filterMealsByCategory(category);
          updateState({ meals: data.results || [] });
        } catch (err) {
          console.error('Failed filtering category:', err);
        }
      }
    });
  }

  //  Areas Grid Clicking
  const areasContainer = document.getElementById('areas-filter-container');
  if (areasContainer) {
    areasContainer.addEventListener('click', async (e) => {
      const card = e.target.closest('.area-card');
      if (!card) return;

      const area = card.getAttribute('data-area');

      if (area === '') {
        // "All Areas" clicked — reset filters
        updateState({ categoryFilter: '', areaFilter: '', activeFilter: '' });
        renderSpinner('recipes-grid');
        try {
          const data = await searchMeals('');
          updateState({ meals: data.results || [] });
        } catch (err) {
          console.error('Area reset failed:', err);
        }
        return;
      }

      const filterKey = `area:${area}`;
      const alreadyActive = state.activeFilter === filterKey;

      if (alreadyActive) {
        // Deselect — show all
        updateState({ categoryFilter: '', areaFilter: '', activeFilter: '' });
        renderSpinner('recipes-grid');
        try {
          const data = await searchMeals('');
          updateState({ meals: data.results || [] });
        } catch (err) {
          console.error('Area reset failed:', err);
        }
      } else {
        // Select this area
        updateState({
          categoryFilter: '',
          areaFilter: area,
          activeFilter: filterKey,
        });
        renderSpinner('recipes-grid');
        try {
          const data = await filterMealsByArea(area);
          updateState({ meals: data.results || [] });
        } catch (err) {
          console.error('Area filtering failed:', err);
        }
      }
    });
  }

  // Meals Search Bar
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      searchTimeout = setTimeout(async () => {
        renderSpinner('recipes-grid');
        // Clear all active filters when searching
        updateState({ categoryFilter: '', areaFilter: '', activeFilter: '' });
        try {
          const data = await searchMeals(query);
          updateState({ meals: data.results || [] });
        } catch (err) {
          console.error('Search failed:', err);
        }
      }, 300);
    });
  }

  // Click on Recipe Card -> Navigate to Detail View
  const recipesGrid = document.getElementById('recipes-grid');
  if (recipesGrid) {
    recipesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.recipe-card');
      if (!card) return;
      const mealId = card.getAttribute('data-meal-id');
      window.location.hash = `#recipe/${mealId}`;
    });
  }

  //  Back button on Recipe Detail
  const backBtn = document.getElementById('back-to-meals-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.hash = '#meals';
    });
  }

  // Log Meal Button Click
  const logMealBtn = document.getElementById('log-meal-btn');
  if (logMealBtn) {
    logMealBtn.addEventListener('click', () => {
      const currentMeal = state.currentMeal;
      if (!currentMeal) return;

      const nutrients = getMealNutrients(currentMeal);

      Swal.fire({
        title: 'Log this meal?',
        text: `Add "${currentMeal.name}" to today's food log?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, log it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          addFoodLogItem({
            name: currentMeal.name,
            type: 'meal',
            calories: Math.round(nutrients.calories),
            protein: Math.round(nutrients.protein * 10) / 10,
            carbs: Math.round(nutrients.carbs * 10) / 10,
            fat: Math.round(nutrients.fat * 10) / 10,
            fiber: Math.round(nutrients.fiber * 10) / 10,
            sugar: Math.round(nutrients.sugar * 10) / 10,
            servingSize: '1 serving',
            date: new Date().toISOString().split('T')[0],
          });

          Swal.fire({
            title: 'Logged!',
            text: `"${currentMeal.name}" has been added.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.hash = '#foodlog';
          });
        }
      });
    });
  }

  //  Product Search Action
  const prodSearchInput = document.getElementById('product-search-input');
  const searchProdBtn = document.getElementById('search-product-btn');

  const triggerProductSearch = async () => {
    const query = prodSearchInput.value.trim();
    if (!query) return;

    renderSpinner('products-grid');
    try {
      const data = await searchProducts(query);
      updateState({ products: data.results || [] });
    } catch (err) {
      console.error('Products search failed:', err);
      renderEmptyState(
        'products-grid',
        'Failed to retrieve products',
        'Check your connection and try again.',
      );
    }
  };

  if (searchProdBtn)
    searchProdBtn.addEventListener('click', triggerProductSearch);
  if (prodSearchInput) {
    prodSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerProductSearch();
    });
  }

  // Barcode Lookup Action
  const barcodeInput = document.getElementById('barcode-input');
  const lookupBarcodeBtn = document.getElementById('lookup-barcode-btn');

  const triggerBarcodeLookup = async () => {
    const barcode = barcodeInput.value.trim();
    if (!barcode) return;

    renderSpinner('products-grid');
    try {
      const data = await getProductByBarcode(barcode);
      if (data && data.result) {
        updateState({ products: [data.result] });
      } else {
        throw new Error('Barcode not found');
      }
    } catch (err) {
      console.error('Barcode lookup failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Product Not Found',
        text: `We couldn't locate a product with barcode "${barcode}". Please try again.`,
        confirmButtonColor: '#10b981',
      });
      renderEmptyState(
        'products-grid',
        'Product not found',
        'Verify the barcode and try searching again.',
      );
    }
  };

  if (lookupBarcodeBtn)
    lookupBarcodeBtn.addEventListener('click', triggerBarcodeLookup);
  if (barcodeInput) {
    barcodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerBarcodeLookup();
    });
  }

  //  Nutri-Score Filter Clicking
  const gradeFilters = document.querySelectorAll('.nutri-score-filter');
  gradeFilters.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const grade = btn.getAttribute('data-grade');
      updateState({ nutriScoreFilter: grade });

      // Update filters UI selection styling
      gradeFilters.forEach((f) => {
        const fGrade = f.getAttribute('data-grade');
        // Inactive layout reset
        if (fGrade === '') {
          f.className =
            'nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200';
        } else {
          const colors = {
            a: 'bg-green-100 text-green-700 hover:bg-green-200',
            b: 'bg-lime-100 text-lime-700 hover:bg-lime-200',
            c: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
            d: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
            e: 'bg-red-100 text-red-700 hover:bg-red-200',
          };
          f.className = `nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all ${colors[fGrade]}`;
        }
      });

      // Set active styling
      if (grade === '') {
        btn.className =
          'nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-emerald-600 text-white';
      } else {
        const activeColors = {
          a: 'bg-green-600 text-white',
          b: 'bg-lime-600 text-white',
          c: 'bg-yellow-500 text-white',
          d: 'bg-orange-500 text-white',
          e: 'bg-red-600 text-white',
        };
        btn.className = `nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeColors[grade]}`;
      }
    });
  });

  //  Product Categories Clicking
  const prodCatContainer = document.getElementById('product-categories');
  if (prodCatContainer) {
    prodCatContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('.product-category-btn');
      if (!btn) return;
      const text = btn.textContent.trim();
      prodSearchInput.value = text;
      triggerProductSearch();
    });
  }

  //  Show Product Detail Modal
  const prodsGrid = document.getElementById('products-grid');
  if (prodsGrid) {
    prodsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;

      const barcode = card.getAttribute('data-barcode');
      const prod = state.products.find((p) => p.barcode === barcode);
      if (!prod) return;

      Swal.fire({
        html: buildProductModalHtml(prod),
        showConfirmButton: false,
        showCloseButton: true,
        width: 420,
        padding: '1.5rem',
        didOpen: () => {
          const popup = Swal.getPopup();

          popup
            .querySelector('#close-food-modal-btn')
            .addEventListener('click', () => {
              Swal.close();
            });

          popup
            .querySelector('#log-food-modal-btn')
            .addEventListener('click', () => {
              const nutrients = prod.nutrients || {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                sugar: 0,
                fiber: 0,
              };

              addFoodLogItem({
                name: prod.name,
                type: 'product',
                calories: Math.round(parseFloat(nutrients.calories) || 0),
                protein:
                  Math.round((parseFloat(nutrients.protein) || 0) * 10) / 10,
                carbs: Math.round((parseFloat(nutrients.carbs) || 0) * 10) / 10,
                fat: Math.round((parseFloat(nutrients.fat) || 0) * 10) / 10,
                fiber: Math.round((parseFloat(nutrients.fiber) || 0) * 10) / 10,
                sugar: Math.round((parseFloat(nutrients.sugar) || 0) * 10) / 10,
                servingSize: '100g',
                date: new Date().toISOString().split('T')[0],
              });

              Swal.fire({
                title: 'Logged!',
                text: `"${prod.name}" logged successfully.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                window.location.hash = '#foodlog';
              });
            });
        },
      });
    });
  }

  //  Delete Item from Log
  const loggedItemsList = document.getElementById('logged-items-list');
  if (loggedItemsList) {
    loggedItemsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.delete-log-btn');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      deleteFoodLogItem(id);
    });
  }

  //  Clear Daily Food Log
  const clearFoodLogBtn = document.getElementById('clear-foodlog');
  if (clearFoodLogBtn) {
    clearFoodLogBtn.addEventListener('click', () => {
      Swal.fire({
        title: 'Clear food log?',
        text: 'This will delete all logged items for today. This action is permanent!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, clear all!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          clearFoodLog();
          Swal.fire({
            title: 'Cleared!',
            text: "Today's log has been cleared.",
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
        }
      });
    });
  }

  //  Quick Actions links on Log page
  const quickLogButtons = document.querySelectorAll('.quick-log-btn');
  if (quickLogButtons.length >= 3) {
    //  Log a Meal
    quickLogButtons[0].addEventListener('click', () => {
      window.location.hash = '#meals';
    });
    //  Scan Product
    quickLogButtons[1].addEventListener('click', () => {
      window.location.hash = '#products';
    });
    //  Custom Entry Modal
    quickLogButtons[2].addEventListener('click', () => {
      Swal.fire({
        title: 'Custom Food Entry',
        html:
          '<div class="flex flex-col gap-3 text-left">' +
          '  <div>' +
          '    <label class="block text-xs font-semibold text-gray-500 mb-1">Name</label>' +
          '    <input id="custom-name" class="swal2-input m-0 w-full" placeholder="e.g. Avocado Toast" type="text">' +
          '  </div>' +
          '  <div class="grid grid-cols-2 gap-3">' +
          '    <div>' +
          '      <label class="block text-xs font-semibold text-gray-500 mb-1">Calories (kcal)</label>' +
          '      <input id="custom-calories" class="swal2-input m-0 w-full" placeholder="e.g. 250" type="number">' +
          '    </div>' +
          '    <div>' +
          '      <label class="block text-xs font-semibold text-gray-500 mb-1">Protein (g)</label>' +
          '      <input id="custom-protein" class="swal2-input m-0 w-full" placeholder="e.g. 8" type="number">' +
          '    </div>' +
          '  </div>' +
          '  <div class="grid grid-cols-2 gap-3">' +
          '    <div>' +
          '      <label class="block text-xs font-semibold text-gray-500 mb-1">Carbohydrates (g)</label>' +
          '      <input id="custom-carbs" class="swal2-input m-0 w-full" placeholder="e.g. 24" type="number">' +
          '    </div>' +
          '    <div>' +
          '      <label class="block text-xs font-semibold text-gray-500 mb-1">Fat (g)</label>' +
          '      <input id="custom-fat" class="swal2-input m-0 w-full" placeholder="e.g. 12" type="number">' +
          '    </div>' +
          '  </div>' +
          '</div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Add to log',
        preConfirm: () => {
          const name = document.getElementById('custom-name').value.trim();
          const calories = parseFloat(
            document.getElementById('custom-calories').value,
          );
          const protein = parseFloat(
            document.getElementById('custom-protein').value,
          );
          const carbs = parseFloat(
            document.getElementById('custom-carbs').value,
          );
          const fat = parseFloat(document.getElementById('custom-fat').value);

          if (!name) {
            Swal.showValidationMessage('A name is required!');
            return false;
          }
          if (isNaN(calories) || calories < 0) {
            Swal.showValidationMessage('Enter a valid calories value!');
            return false;
          }

          return {
            name,
            calories,
            protein: isNaN(protein) ? 0 : protein,
            carbs: isNaN(carbs) ? 0 : carbs,
            fat: isNaN(fat) ? 0 : fat,
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const val = result.value;
          addFoodLogItem({
            name: val.name,
            type: 'meal',
            calories: Math.round(val.calories),
            protein: Math.round(val.protein * 10) / 10,
            carbs: Math.round(val.carbs * 10) / 10,
            fat: Math.round(val.fat * 10) / 10,
            fiber: 0,
            sugar: 0,
            servingSize: '1 portion',
            date: new Date().toISOString().split('T')[0],
          });

          Swal.fire({
            title: 'Success!',
            text: `"${val.name}" added to food log.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    });
  }
}

// Start application
init();
