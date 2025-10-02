// ====== State ======
let flats = [];
let cart = [];

// ====== DOM Elements ======
const flatsContainer = document.querySelector(".flats");
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar .btn");
const minRange = document.getElementById("min-range");
const maxRange = document.getElementById("max-range");
const minValue = document.getElementById("min-value");
const maxValue = document.getElementById("max-value");
const starRadios = document.querySelectorAll('input[name="star-rating"]');
const areaCheckboxes = document.querySelectorAll('.filters input.area-checkbox');
const flatmateCheckboxes = document.querySelectorAll('.filters input.flatmate-checkbox');
const availableOnly = document.getElementById("available-only");
const sortSelect = document.getElementById("sort-select");
const applyBtn = document.querySelector(".filter-actions .btn");
const clearBtn = document.querySelector(".filter-actions .btn-clear");
const cartCount = document.getElementById("cart-count");

// ====== Backend API ======
const API_BASE = "http://localhost:5000";
const USER_ID = 1;

// ====== Functions ======
async function fetchFlats() {
  try {
    const res = await fetch(`${API_BASE}/api/flats`);
    flats = await res.json();
    renderFlats();
  } catch (err) {
    console.error('Error fetching flats:', err);
  }
}

async function fetchCart() {
  try {
    const res = await fetch(`${API_BASE}/api/cart/${USER_ID}`);
    const data = await res.json();
    cart = data.map(f => f.flat_id);
    updateCartCount();
  } catch (err) {
    console.error('Error fetching cart:', err);
  }
}

async function addToCart(flatId) {
  try {
    const res = await fetch(`${API_BASE}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: USER_ID, flat_id: flatId })
    });
    const data = await res.json();
    if (data.success) {
      cart.push(flatId);
      updateCartCount();
      renderFlats();
      alert(data.message);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
  }
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}

function renderFlats() {
  flatsContainer.innerHTML = '';

  let filtered = flats.filter(flat => {
    // Search
    if (searchInput.value.trim()) {
      const term = searchInput.value.trim().toLowerCase();
      if (!flat.title.toLowerCase().includes(term) && !flat.area.toLowerCase().includes(term)) return false;
    }

    // Price
    const minPrice = parseInt(minRange.value) || 0;
    const maxPrice = parseInt(maxRange.value) || Infinity;
    if (flat.price < minPrice || flat.price > maxPrice) return false;

    // Rating
    const selectedRatingRadio = [...starRadios].find(r => r.checked);
    if (selectedRatingRadio && parseFloat(flat.rating) < parseFloat(selectedRatingRadio.value)) return false;

    // Flatmates
    const selectedFlatmates = [...flatmateCheckboxes].filter(c => c.checked).map(c => parseInt(c.value));
    if (selectedFlatmates.length && !selectedFlatmates.includes(flat.flatmates)) return false;

    // Area
    const selectedAreas = [...areaCheckboxes].filter(c => c.checked).map(c => c.value);
    if (selectedAreas.length && !selectedAreas.includes(flat.area)) return false;

    // Availability
    if (availableOnly.checked && flat.status !== "Available") return false;

    return true;
  });

  // Sorting
  if (sortSelect.value === "low-high") filtered.sort((a,b) => a.price - b.price);
  else if (sortSelect.value === "high-low") filtered.sort((a,b) => b.price - a.price);
  else if (sortSelect.value === "rating") filtered.sort((a,b) => b.rating - a.rating);

  // Render cards
  filtered.forEach(flat => {
    const card = document.createElement('div');
    card.className = 'flat-card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <h4>${flat.title}</h4>
        </div>
        <div class="card-back">
          <h4>Details</h4>
          <p>Rent: ₹${flat.price}/month</p>
          <p>⭐ ${flat.rating} rating</p>
          <p>${flat.flatmates} Flatmates</p>
          <p>Status: ${flat.status}</p>
          <button class="add-btn" ${cart.includes(flat.id) || flat.status !== "Available" ? 'disabled' : ''} data-id="${flat.id}">
            ${cart.includes(flat.id) ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    `;
    flatsContainer.appendChild(card);
  });
}

// Apply / Clear filters
function applyFilters() { renderFlats(); }

function clearFilters() {
  searchInput.value = '';
  minRange.value = 1000;
  maxRange.value = 70000;
  minValue.textContent = 1000;
  maxValue.textContent = 70000;
  starRadios.forEach(r => r.checked = false);
  areaCheckboxes.forEach(c => c.checked = false);
  flatmateCheckboxes.forEach(c => c.checked = false);
  availableOnly.checked = false;
  sortSelect.value = 'default';
  renderFlats();
}

// ====== Event Listeners ======
minRange.addEventListener('input', e => { minValue.textContent = e.target.value; renderFlats(); });
maxRange.addEventListener('input', e => { maxValue.textContent = e.target.value; renderFlats(); });
searchBtn.addEventListener('click', applyFilters);
searchInput.addEventListener('input', renderFlats);
applyBtn.addEventListener('click', applyFilters);
clearBtn.addEventListener('click', clearFilters);
sortSelect.addEventListener('change', renderFlats);

// Rating radios
starRadios.forEach(r => r.addEventListener('change', renderFlats));
// Flatmate checkboxes
flatmateCheckboxes.forEach(c => c.addEventListener('change', renderFlats));
// Area checkboxes
areaCheckboxes.forEach(c => c.addEventListener('change', renderFlats));
// Availability checkbox
availableOnly.addEventListener('change', renderFlats);

// Delegate add-to-cart
document.addEventListener('click', e => {
  if (e.target.classList.contains('add-btn')) {
    const flatId = parseInt(e.target.dataset.id);
    if (!cart.includes(flatId)) addToCart(flatId);
  }
});

// ====== Init ======
fetchFlats();
fetchCart();
