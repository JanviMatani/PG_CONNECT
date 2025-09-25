// ====== PG Connect Script ======

// Sample flat data
const flats = [
  { id: 1, title: "2 BHK, Downtown", price: 15000, rating: 4.5, flatmates: 2, area: "Downtown", status: "Available", img: "https://picsum.photos/400/250?random=1" },
  { id: 2, title: "1 BHK, Suburbs", price: 9000, rating: 4.0, flatmates: 1, area: "Suburbs", status: "Available", img: "https://picsum.photos/400/250?random=2" },
  { id: 3, title: "3 BHK, Uptown", price: 25000, rating: 4.8, flatmates: 3, area: "Uptown", status: "Available", img: "https://picsum.photos/400/250?random=3" },
  { id: 4, title: "Studio, City Center", price: 12000, rating: 4.2, flatmates: 0, area: "City Center", status: "Available", img: "https://picsum.photos/400/250?random=4" },
];

// ====== State ======
let cart = JSON.parse(localStorage.getItem("pg_cart")) || [];
let filters = {};

// ====== DOM Elements ======
const flatsContainer = document.querySelector(".flats");
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar .btn");
const minRange = document.getElementById("min-range");
const maxRange = document.getElementById("max-range");
const minValue = document.getElementById("min-value");
const maxValue = document.getElementById("max-value");
const starRadios = document.querySelectorAll('input[name="star-rating"]');
const areaCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]');
const flatmateCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]:not(#available-only)');
const availableOnly = document.getElementById("available-only");
const sortSelect = document.getElementById("sort-select");
const applyBtn = document.querySelector(".filter-actions .btn");
const clearBtn = document.querySelector(".filter-actions .btn-clear");
const cartCount = document.getElementById("cart-count");

// ====== Functions ======
function saveCart() {
  localStorage.setItem("pg_cart", JSON.stringify(cart));
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}

function renderFlats() {
  flatsContainer.innerHTML = "";

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
    const selectedRating = [...starRadios].find(r => r.checked);
    if (selectedRating && flat.rating < parseFloat(selectedRating.value)) return false;

    // Flatmates
    const selectedFlatmates = [...flatmateCheckboxes].filter(c => c.checked).map(c => parseInt(c.value));
    if (selectedFlatmates.length && !selectedFlatmates.includes(flat.flatmates)) return false;

    // Area
    const selectedAreas = [...areaCheckboxes].filter(c => c.checked && c.value !== "Available Only").map(c => c.value);
    if (selectedAreas.length && !selectedAreas.includes(flat.area)) return false;

    // Availability
    if (availableOnly.checked && flat.status !== "Available") return false;

    return true;
  });

  // Sorting
  if (sortSelect.value === "low-high") filtered.sort((a,b) => a.price - b.price);
  else if (sortSelect.value === "high-low") filtered.sort((a,b) => b.price - a.price);
  else if (sortSelect.value === "rating") filtered.sort((a,b) => b.rating - a.rating);

  // Render
  filtered.forEach(flat => {
    const card = document.createElement("div");
    card.className = "flat-card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${flat.img}" alt="${flat.title}">
          <h4>${flat.title}</h4>
        </div>
        <div class="card-back">
          <h4>Details</h4>
          <p>Rent: ₹${flat.price}/month</p>
          <p>⭐ ${flat.rating} rating</p>
          <p>${flat.flatmates} Flatmates</p>
          <button class="add-btn" ${flat.status !== "Available" ? "disabled" : ""} data-id="${flat.id}">Add</button>
        </div>
      </div>
    `;
    flatsContainer.appendChild(card);
  });

  // Add to Cart
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      if (!cart.includes(id)) {
        cart.push(id);
        saveCart();
        updateCartCount();
        alert("Added to cart!");
      }
    });
  });
}

// Apply / Clear filters
function applyFilters() {
  renderFlats();
}

function clearFilters() {
  searchInput.value = "";
  minRange.value = 1000;
  maxRange.value = 70000;
  minValue.textContent = 1000;
  maxValue.textContent = 70000;
  starRadios.forEach(r => r.checked = false);
  areaCheckboxes.forEach(c => c.checked = false);
  flatmateCheckboxes.forEach(c => c.checked = false);
  availableOnly.checked = false;
  sortSelect.value = "default";
  renderFlats();
}

// Range update
minRange.addEventListener("input", e => { minValue.textContent = e.target.value; renderFlats(); });
maxRange.addEventListener("input", e => { maxValue.textContent = e.target.value; renderFlats(); });

// Search
searchBtn.addEventListener("click", applyFilters);
searchInput.addEventListener("input", () => { renderFlats(); });

// Filter buttons
applyBtn.addEventListener("click", applyFilters);
clearBtn.addEventListener("click", clearFilters);

// Sort
sortSelect.addEventListener("change", renderFlats);

// Init
updateCartCount();
renderFlats();
