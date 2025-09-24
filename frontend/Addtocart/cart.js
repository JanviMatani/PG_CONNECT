const cartContainer = document.getElementById('cart-items');

function addToCart(name, location, rent, img) {
  // Remove "empty" text if first item
  if (cartContainer.querySelector('.empty')) {
    cartContainer.innerHTML = '';
  }

  const item = document.createElement('div');
  item.classList.add('cart-item');
  item.innerHTML = `
    <img src="${img}" alt="${name}">
    <div class="cart-item-details">
      <h4>${name}</h4>
      <p>${location}</p>
      <p>${rent}</p>
    </div>
  `;
  cartContainer.appendChild(item);
}
