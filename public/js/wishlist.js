document.addEventListener('DOMContentLoaded', () => {
  const listElement = document.querySelector('.wishlist-list');
  const emptyState = document.querySelector('.wishlist-empty');
  const username = localStorage.getItem('username') || 'User';
  const userSpan = document.getElementById('wishlist-username');
  if (userSpan) userSpan.textContent = username;

  const pageTitle = document.title.toLowerCase();
  let storageKey = '';
  let headingText = '';

  if (pageTitle.includes('wishlist')) {
    storageKey = 'wishlistItems';
    headingText = 'My Wishlist';
  } else if (pageTitle.includes('cart')) {
    storageKey = 'cartItems';
    headingText = 'My Cart';
  } else {
    return;
  }

  const heading = document.querySelector('.wishlist-heading');
  if (heading) heading.textContent = headingText;

  const items = JSON.parse(localStorage.getItem(storageKey)) || [];

  if (!listElement || !emptyState) return;

  if (items.length === 0) {
    emptyState.style.display = 'block';
    listElement.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    listElement.style.display = 'block';
    listElement.innerHTML = '';

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'wishlist-item';

      li.innerHTML = `
        <img src="/Images/living-room/${encodeURIComponent(item.image)}" alt="${item.name}" style="max-width:60px; margin-right:10px; vertical-align: middle;" />
        <span>${item.name}</span>
      `;
      listElement.appendChild(li);
    });
  }
});
