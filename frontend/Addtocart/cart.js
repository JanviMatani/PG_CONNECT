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
      const statusColor = flat.status === 'Unavailable' ? '#f8d7da' : '#fff';
      const btnDisabled = flat.status === 'Unavailable' ? 'disabled' : '';
      const btnText = flat.status === 'Unavailable' ? 'Unavailable' : 'Proceed to Payment';

      flatsSection.innerHTML += `
        <div class="flat-card"
             data-id="${flat.flat_id}"
             data-name="${flat.title}"
             data-location="${flat.area}"
             data-city="${flat.city}"
             data-rent="₹${flat.price}/month"
             data-img="${imgSrc}"
             data-size="${flat.flatmates}"
             data-furnished="${flat.status}"
             data-amenities="WiFi, Parking"
             style="background-color:${statusColor}">
          <img src="${imgSrc}" alt="${flat.title}">
          <div class="flat-content">
            <h3>${flat.title}</h3>
            <p>Location: ${flat.area}</p>
            <p>City: ${flat.city}</p>
            <p>Rent: ₹${flat.price}/month</p>
            <button class="view-btn" ${btnDisabled}>${btnText}</button>
          </div>
        </div>
      `;
    });
    attachModalEvents();
  })
  .catch(err => console.error(err));

// Attach click events for "Proceed to Payment"
function attachModalEvents() {
  const flatCards = document.querySelectorAll('.flat-card');
  const docModal = document.getElementById('docModal');
  const docName = document.getElementById('doc-name');
  const docLocation = document.getElementById('doc-location');
  const docRent = document.getElementById('doc-rent');

  flatCards.forEach(card => {
    const btn = card.querySelector('.view-btn');
    if (btn.disabled) return;

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

  const flatName = document.getElementById('doc-name').textContent;

  // Get flat_id of the selected flat
  const selectedCard = Array.from(document.querySelectorAll('.flat-card'))
    .find(card => card.dataset.name === flatName);

  const flatId = selectedCard.dataset.id;

  // Update flat status to Unavailable in backend
  fetch(`${API_BASE}/api/flats/mark-unavailable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flat_id: flatId }) // <-- send correct flat_id
  })
  .then(res => res.json())
  .then(data => {
    console.log('Flat status updated:', data);

    // Hide payment modal
    document.getElementById('docModal').style.display = "none";

    // Show receipt
    document.getElementById('receiptContent').innerHTML = `
      <p>Flat: ${flatName}</p>
      <p>Location: ${document.getElementById('doc-location').textContent}</p>
      <p>Rent: ${document.getElementById('doc-rent').textContent}</p>
      <p>Paid by: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Status: Payment Successful ✅</p>
    `;
    document.getElementById('receiptModal').style.display = "block";

    // Update card visually
    selectedCard.style.backgroundColor = '#f8d7da'; // red
    const btn = selectedCard.querySelector('.view-btn');
    btn.textContent = 'Unavailable';
    btn.disabled = true;
  })
  .catch(err => console.error(err));
});

// Close receipt modal
document.getElementById('closeReceiptBtn').addEventListener('click', () => {
  document.getElementById('receiptModal').style.display = "none";
});
