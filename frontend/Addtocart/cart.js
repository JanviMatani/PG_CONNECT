const USER_ID = 1; // Replace with logged-in user id
const API_BASE = "http://localhost:5000";

// Fetch flats from backend
fetch(`${API_BASE}/api/cart/${USER_ID}`)
  .then(res => res.json())
  .then(flats => {
    const flatsSection = document.getElementById('flats-container');
    flatsSection.innerHTML = '';
    flats.forEach(flat => {
      const imgSrc = flat.img ? (flat.img.startsWith('http') ? flat.img : `${API_BASE}/${flat.img}`) : '';
      flatsSection.innerHTML += `
        <div class="flat-card"
             data-name="${flat.title}"
             data-location="${flat.area}"
             data-city="${flat.city}"
             data-rent="₹${flat.price}/month"
             data-img="${imgSrc}"
             data-size="${flat.flatmates}"
             data-furnished="${flat.status}"
             data-amenities="WiFi, Parking">
          <img src="${imgSrc}" alt="${flat.title}">
          <div class="flat-content">
            <h3>${flat.title}</h3>
            <p>Location: ${flat.area}</p>
            <p>City: ${flat.city}</p>
            <p>Rent: ₹${flat.price}/month</p>
            <button class="view-btn">Proceed to Payment</button>
          </div>
        </div>
      `;
    });
    attachModalEvents();
  });

// Attach click events for "Proceed to Payment"
function attachModalEvents() {
  const flatCards = document.querySelectorAll('.flat-card');
  const docModal = document.getElementById('docModal');
  const docName = document.getElementById('doc-name');
  const docLocation = document.getElementById('doc-location');
  const docRent = document.getElementById('doc-rent');

  flatCards.forEach(card => {
    const btn = card.querySelector('.view-btn');
    btn.addEventListener('click', () => {
      docName.textContent = card.dataset.name;
      docLocation.textContent = card.dataset.location;
      docRent.textContent = card.dataset.rent;
      docModal.style.display = "block";
    });
  });
}

// Close modals
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('docModal').style.display = "none";
    document.getElementById('receiptModal').style.display = "none";
  });
});

// Final pay
document.getElementById('finalPayBtn').addEventListener('click', () => {
  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  const phone = document.getElementById('user-phone').value;

  if (!name || !email || !phone) {
    alert('Please fill all your details!');
    return;
  }

  document.getElementById('docModal').style.display = "none";

  document.getElementById('receiptContent').innerHTML = `
    <p>Flat: ${document.getElementById('doc-name').textContent}</p>
    <p>Location: ${document.getElementById('doc-location').textContent}</p>
    <p>Rent: ${document.getElementById('doc-rent').textContent}</p>
    <p>Paid by: ${name}</p>
    <p>Email: ${email}</p>
    <p>Phone: ${phone}</p>
    <p>Status: Payment Successful ✅</p>
  `;
  document.getElementById('receiptModal').style.display = "block";
});

// Close receipt modal
document.getElementById('closeReceiptBtn').addEventListener('click', () => {
  document.getElementById('receiptModal').style.display = "none";
});
