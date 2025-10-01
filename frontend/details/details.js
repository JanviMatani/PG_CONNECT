const detailsContainer = document.getElementById('flat-details');
const API_BASE = "http://localhost:5000/api";

const params = new URLSearchParams(window.location.search);
const flatId = params.get('id');

async function fetchFlatDetails() {
  try {
    const res = await fetch(`${API_BASE}/flats/${flatId}`);
    const flat = await res.json();

    detailsContainer.innerHTML = `
      <div class="flat-card">
        <img src="${flat.img}" alt="${flat.title}">
        <div class="flat-content">
          <h2>${flat.title}</h2>
          <p><strong>Price:</strong> ₹${flat.price}/month</p>
          <p><strong>Rating:</strong> ⭐ ${flat.rating}</p>
          <p><strong>Flatmates:</strong> ${flat.flatmates}</p>
          <p><strong>Area:</strong> ${flat.area}</p>
          <p><strong>Status:</strong> ${flat.status}</p>
        </div>
      </div>
    `;
  } catch (err) {
    detailsContainer.innerHTML = `<p>Failed to load details.</p>`;
    console.error(err);
  }
}

fetchFlatDetails();
