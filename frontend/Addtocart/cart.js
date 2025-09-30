const cartContainer = document.getElementById('cart-items');
const USER_ID = 1; // replace with logged-in user ID
const API_BASE = "http://localhost:5000/api"; // your backend API

// Fetch cart items from backend
async function fetchCart() {
  try {
    const res = await fetch(`${API_BASE}/cart/${USER_ID}`);
    const cartItems = await res.json();

    cartContainer.innerHTML = ''; // clear previous content

    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<p class="empty">Your cart is empty.</p>';
      return;
    }

    cartItems.forEach(flat => {
      const card = document.createElement('div');
      card.classList.add('flat-card');

      // attach flat ID as data attribute
      card.dataset.id = flat.id;

      card.innerHTML = `
        <img src="${flat.img}" alt="${flat.title}">
        <div class="flat-content">
          <h3>${flat.title}</h3>
          <p>Location: ${flat.area}</p>
          <p>Rent: ₹${flat.price}/month</p>
          <p>⭐ ${flat.rating} rating</p>
          <button class="view-btn">View Details</button>
        </div>
      `;
      cartContainer.appendChild(card);
    });

    // Add click event listeners for all view buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const flatCard = e.target.closest('.flat-card');
        const flatId = flatCard.dataset.id;
        // Redirect to details page with flat ID
        window.location.href = `../details/details.html?id=${flatId}`;
      });
    });

  } catch (err) {
    console.error('Error fetching cart:', err);
    cartContainer.innerHTML = '<p class="empty">Failed to load cart.</p>';
  }
}

// Initialize
fetchCart();
