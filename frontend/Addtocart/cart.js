// Handle View Details modal
const flatCards = document.querySelectorAll('.flat-card');
const flatModal = document.getElementById('flatModal');
const docModal = document.getElementById('docModal');
const receiptModal = document.getElementById('receiptModal');

const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalLocation = document.getElementById('modal-location');
const modalCity = document.getElementById('modal-city');
const modalSize = document.getElementById('modal-size');
const modalFurnished = document.getElementById('modal-furnished');
const modalAmenities = document.getElementById('modal-amenities');
const modalRent = document.getElementById('modal-rent');

const docName = document.getElementById('doc-name');
const docLocation = document.getElementById('doc-location');
const docRent = document.getElementById('doc-rent');

const receiptContent = document.getElementById('receiptContent');

flatCards.forEach(card => {
  const btn = card.querySelector('.view-btn');
  btn.addEventListener('click', () => {
    modalImg.src = card.dataset.img;
    modalName.textContent = card.dataset.name;
    modalLocation.textContent = "Location: " + card.dataset.location;
    modalCity.textContent = "City: " + card.dataset.city;
    modalSize.textContent = "Size: " + card.dataset.size;
    modalFurnished.textContent = "Furnished: " + card.dataset.furnished;
    modalAmenities.textContent = "Amenities: " + card.dataset.amenities;
    modalRent.textContent = "Rent: " + card.dataset.rent;
    flatModal.style.display = "block";
  });
});

// Close buttons
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    flatModal.style.display = "none";
    docModal.style.display = "none";
    receiptModal.style.display = "none";
  });
});

// Proceed to payment
document.getElementById('proceedPaymentBtn').addEventListener('click', () => {
  flatModal.style.display = "none";
  docName.textContent = modalName.textContent;
  docLocation.textContent = modalLocation.textContent.replace('Location: ', '');
  docRent.textContent = modalRent.textContent.replace('Rent: ', '');
  docModal.style.display = "block";
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

  docModal.style.display = "none";
  receiptContent.innerHTML = `
    <p>Flat: ${docName.textContent}</p>
    <p>Location: ${docLocation.textContent}</p>
    <p>Rent: ${docRent.textContent}</p>
    <p>Paid by: ${name}</p>
    <p>Email: ${email}</p>
    <p>Phone: ${phone}</p>
    <p>Status: Payment Successful ✅</p>
  `;
  receiptModal.style.display = "block";
});

// Close receipt modal
document.getElementById('closeReceiptBtn').addEventListener('click', () => {
  receiptModal.style.display = "none";
});
