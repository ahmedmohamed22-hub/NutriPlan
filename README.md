# NutriPlan - JavaScript Starter Project

Welcome to the NutriPlan starter project! The design is fully complete - your task is to bring it to life with JavaScript.

## 🎯 Project Overview

NutriPlan is a Food, Nutrition & Fitness Planner web application. The HTML and CSS are ready - you need to implement the JavaScript functionality.

## 📁 Project Structure

```
starter/
├── index.html          # Main HTML file (ready)
├── README.md           # This file
└── src/
    ├── css/
    │   └── style.css   # Styles (ready)
    └── js/
        ├── main.js           # Entry point (implement here)
        ├── api/
        │   └── mealdb.js     # API module (implement here)
        ├── state/
        │   └── appState.js   # State management (implement here)
        └── ui/
            └── components.js  # UI components (implement here)
```

## 🚀 Getting Started

1. Open `index.html` in your browser to see the design
2. Start implementing the JavaScript files
3. Begin with `src/js/api/mealdb.js` - fetch data from the API
4. Then update `src/js/main.js` to load and display data

## 🔗 API Reference

### TheMealDB API (Free, No API Key Required)

Base URL: `https://www.themealdb.com/api/json/v1/1/`

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/categories.php` | Get all categories | [Try it](https://www.themealdb.com/api/json/v1/1/categories.php) |
| `/search.php?s={query}` | Search meals by name | [Try it](https://www.themealdb.com/api/json/v1/1/search.php?s=chicken) |
| `/lookup.php?i={id}` | Get meal by ID | [Try it](https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772) |
| `/filter.php?c={category}` | Filter by category | [Try it](https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood) |
| `/filter.php?a={area}` | Filter by area/cuisine | [Try it](https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian) |
| `/random.php` | Get random meal | [Try it](https://www.themealdb.com/api/json/v1/1/random.php) |

## ✅ Tasks to Complete

### Level 1: Basic Functionality
- [ ] Fetch and display meal categories in `#categories-grid`
- [ ] Fetch and display recipes in `#recipes-grid`
- [ ] Hide the loading overlay when data is loaded
- [ ] Update the recipe count text

### Level 2: Interactivity
- [ ] Implement search functionality (use `#search-input`)
- [ ] Filter recipes when clicking on a category
- [ ] Show meal details when clicking on a recipe card

### Level 3: Navigation
- [ ] Implement sidebar navigation between pages
- [ ] Create different views (Meals, Products, Food Log)

### Level 4: Advanced Features
- [ ] Add loading states while fetching data
- [ ] Implement error handling for API calls
- [ ] Save favorites to localStorage

## 🎨 Key HTML Elements

### Meals Page
| Element ID | Purpose |
|------------|---------|
| `#app-loading-overlay` | Loading screen (hide when ready) |
| `#categories-grid` | Container for category cards |
| `#recipes-grid` | Container for recipe cards |
| `#search-input` | Search input field |
| `#recipes-count` | Text showing recipe count |

### Product Scanner Page
| Element ID | Purpose |
|------------|---------|
| `#products-section` | Product scanner page container (toggle display) |
| `#product-search-input` | Product name search input |
| `#barcode-input` | Barcode number input |
| `#search-product-btn` | Product search button |
| `#lookup-barcode-btn` | Barcode lookup button |
| `#products-grid` | Container for product cards |
| `#products-count` | Text showing products count |
| `.nutri-score-filter` | Nutri-Score filter buttons |

### Food Log Page
| Element ID | Purpose |
|------------|---------|
| `#foodlog-section` | Food log page container (toggle display) |
| `#foodlog-date` | Current date display |
| `#foodlog-today-section` | Today's nutrition summary |
| `#logged-items-list` | Container for logged food items |
| `#weekly-chart` | Weekly chart container (Plotly) |
| `#clear-foodlog` | Clear all logged items button |
| `.quick-log-btn` | Quick action buttons |

## 💡 Tips

1. **Start Simple**: First just fetch and log data to console
2. **Use Modules**: The project uses ES6 modules (`type="module"`)
3. **Check Console**: Look for TODO messages and errors
4. **Inspect Design**: The skeleton loaders show the expected card layout
5. **Navigation**: Use `style.display = "none"` or `style.display = ""` to show/hide sections
6. **Page State**: Track current page in your app state for navigation

## 🔄 Navigation

To switch between pages, hide/show the relevant sections:
- **Meals Page**: Show `#search-filters-section`, `#meal-categories-section`, `#all-recipes-section`
- **Product Scanner**: Show `#products-section`
- **Food Log**: Show `#foodlog-section`





<!-- 🎯 المطلوب:
الـ website متقسم لـ 3 أجزاء رئيسية :
1️⃣ الـHome page: و دي بنعرض فيها مجموعة من الوجبات (25 وجبة) و تقدر تـعمل filteration للوجبات علي حسب الـ categories او الـ areas بمعني ممكن اظهر وجبات الـ Pasta فقط أو اظهر الوجبات المصرية بس

2️⃣ الـ Meal Details Page: و دي هتظهر لو ضغط علي أى وجبة هتظهرلك الـ Page دي و فيها بنعرض كل تفاصيل الوجبة ( المكونات - خطوات التحضير - فيديو لتحضير الوجبة - القيمة الغذائية [ فيها كام جرام بروتين - كربوهيدرات - دهون و خلافه) و مع كل وجبة هتلاقي button فوق كدا اسمه Log This Meal علشان اقولك الـ button دا بيعمل ايه هندخل علي النقطة اللى بعد كدا 👇

3️⃣ الـ Food Log Page: المفترض ان ليك كل يوم مقدار معين من الـ Protein, Carbohydrates, fats و الـ Calories بشكل عام فانا عايز اتابع و أتاكد ان كل يوم انا بحصل علي القدر الكافي من كل حاجة و في نفس الوقت اتأكد انى متخطتش عدد الـ  Calories المسموح كل يوم فدا الهدف من الـ Page دي كل وجبة هتأكلها هتضيفها للصفحة دى عن طريق الـ button اللى قولتلك عليه من شوية في النقطة التانية

⚠️⚠️ جزء الـ Food Log : هيتعمل بالـ LocalStorage عادى يعني مفيش endpoints ليه لما المستخدم يضيف اى حاجة ضيفها عادى في الـ LocalStorage و اعرضها

4️⃣هتقولي مهو انا أكيد هأكل حجات تانية غير الـوجبات فالموضوع مش هيكون دقيق أوي !! هقولك و عشان كدا الجزء الثالث معانا هو الـ Product Scanner و هنا لو اشتريت أى منتج و ليكن Pepsi أو Nutella هتروح للـ Product Scanner tab و تكتب اسم المنتج او الـ barcode الخاص بالمنتج ساعتها المنتج دا هيظهر معاك تقدر تضيفه برضه للـ Food Log و كدا تبقا بتتابع كل حاجة مش بس الـ Meals.

✨BONUS:
🔵 حاول تعمل سيرش ازاى تغير الـ URL مع كل tab بمعني لما اضغط علي Food Log هتلاقي اللينك فوق اتغير و اتكتب foodlog و كذلك الحال مع باقي الـ tabs (جربها و تعالى تانى)
🔵 لو عملت الإمتحان بالـ OOP هيكون ليك Bonus 5 درجات (فضلُا عن الـ Bonus حاول تعمل كدا لانك بالشكل دا هتكون طبقت علي كل حاجة في الـ JS) -->

