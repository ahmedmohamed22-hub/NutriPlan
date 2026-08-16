const baseUrl = 'https://nutriplan-api.vercel.app/api';
const headers = {
  Authorization: 'nBXyStIPxY6WYtWegeV77UflcvTVjtFd94iIJ4XJ',
  'x-api-key': 'nBXyStIPxY6WYtWegeV77UflcvTVjtFd94iIJ4XJ',
  'Content-Type': 'application/json',
};

// Helper to perform fetch requests with auth headers
async function request(endpoint) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Request failed for endpoint ${endpoint}:`, error);
    throw error;
  }
}

// Fetch all meal categories
export async function fetchCategories() {
  return request('/meals/categories');
}

// Search meals by name, ingredient, or area using the q parameter
export async function searchMeals(query = '') {
  return request(`/meals/search?q=${encodeURIComponent(query)}`);
}

// Get a single meal's full details by its ID
export async function getMealById(id) {
  return request(`/meals/${id}`);
}

//  Filter meals by category
export async function filterMealsByCategory(category) {
  return request(`/meals/filter?c=${encodeURIComponent(category)}`);
}

// Filter meals by area
export async function filterMealsByArea(area) {
  return request(`/meals/filter?a=${encodeURIComponent(area)}`);
}

// Fetch all available cuisine areas
export async function fetchAreas() {
  return request('/meals/areas');
}

// Fetch a random meal

export async function getRandomMeal() {
  return request('/meals/random');
}

//  Search for packaged products by name using the q parameter
export async function searchProducts(query = '') {
  return request(`/products/search?q=${encodeURIComponent(query)}`);
}

// fetch product by barcode
export async function getProductByBarcode(barcode) {
  return request(`/products/barcode/${barcode}`);
}
