document.addEventListener('DOMContentLoaded', () => {
  const listElement = document.querySelector('.wishlist-list');
  const emptyState = document.querySelector('.wishlist-empty');
  const userSpan = document.getElementById('wishlist-username');
  const username = localStorage.getItem('username') || 'User';
  if (userSpan) userSpan.textContent = username;

  const pageTitle = document.title.toLowerCase();
  let storageKey = '';
  let headingText = '';

  if (pageTitle.includes('wishlist')) {
    storageKey = 'wishlist';
    headingText = 'My Wishlist';
  } else if (pageTitle.includes('cart')) {
    storageKey = 'cartItems';
    headingText = 'My Cart';
  } else if (pageTitle.includes('product') || pageTitle.includes('details')) {
    storageKey = null;
    headingText = null;
  } else {
    return;
  }

  if (headingText) {
    const heading = document.querySelector('.wishlist-heading');
    if (heading) heading.textContent = headingText;
  }

  if (storageKey) {
    let items = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (!listElement || !emptyState) return;

    if (items.length === 0) {
      emptyState.style.display = 'block';
      listElement.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      listElement.style.display = 'block';
      listElement.innerHTML = '';

      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'wishlist-item';
        let imgSrc = item.src || 'Images/placeholder.png';
        if (imgSrc.startsWith('/')) imgSrc = imgSrc.slice(1);

        li.innerHTML = `
          <img src="${imgSrc}" alt="${item.name}" style="max-width:60px; margin-right:10px; vertical-align: middle;" onerror="this.src='Images/placeholder.png'" />
          <span>${item.name}</span>
          <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        listElement.appendChild(li);
      });

      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', e => {
          const idx = e.target.getAttribute('data-index');
          items.splice(idx, 1);
          localStorage.setItem(storageKey, JSON.stringify(items));
          location.reload();
        });
      });
    }
  }

  if (pageTitle.includes('product') || pageTitle.includes('details')) {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    const container = document.querySelector('.room-container');

    if (!product) {
      if (container) container.innerHTML = "<p>No product selected.</p>";
      return;
    }

    let imagePath = product.src;
    if (
      !imagePath.startsWith('Images/') &&
      !imagePath.startsWith('./') &&
      !imagePath.startsWith('/')
    ) {
      imagePath = 'Images/' + imagePath;
    }

    if (container) container.innerHTML = `
      <h1 class="room-section-title">${product.name}</h1>
      <div class="product-details">
        <img src="${imagePath}" alt="${product.name}" style="max-width: 400px; border-radius: 10px;" onerror="this.src='Images/placeholder.png'"/>
        <p><strong>Price:</strong> ${product.price || "N/A"}</p>
        <p><strong>Description:</strong> ${product.description || "No description available."}</p>
        <div>
          <button id="addToCartBtn">Add to Cart</button>
          <button id="addToWishlistBtn">Add to Wishlist</button>
        </div>
      </div>
    `;

    const addToCartBtn = document.getElementById('addToCartBtn');
    const addToWishlistBtn = document.getElementById('addToWishlistBtn');

    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        cart.push(product);
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.location.href = 'cart.html';
      });
    }

    if (addToWishlistBtn) {
      addToWishlistBtn.addEventListener('click', () => {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        window.location.href = 'wishlist.html';
      });
    }

    const allProducts = [
      { name: "Leather Sofa", image: "Images/living-room/leather-sofas/sample.jpg", url: "livingroom.html?category=leather-sofas" },
      { name: "Formal Dining Set", image: "Images/dining-room/formal-dining-sets/Moderna Dining Set.jpg", url: "diningroom.html?category=formal-dining-sets" },
      { name: "Office Chair", image: "Images/office/office-chair/Comfy Low Back Office Chair In Brown.jpg", url: "office.html?category=office-chair" },
      { name: "Rugs", image: "Images/accessories/rugs/sample.jpg", url: "accessories.html?category=rugs" },
      { name: "Accent Chair", image: "Images/living-room/accent-chairs/sample.jpg", url: "livingroom.html?category=accent-chairs" },
      { name: "Night Stand", image: "Images/bedroom/night-stands/sample.jpg", url: "bedroom.html?category=night-stands" },
      { name: "Leather Sectional", image: "Images/living-room/leather-sectionals/sample.jpg", url: "livingroom.html?category=leather-sectionals" },
      { name: "Beds", image: "Images/bedroom/beds/AVA FOUR-POSTER BED.jpg", url: "bedroom.html?category=beds" },
      { name: "Dining Chairs", image: "Images/dining-room/dining-chairs/Chiara Dining Chair.jpg", url: "diningroom.html?category=dining-chairs" },
      { name: "Floor Lamps", image: "Images/accessories/floor-lamps/sample.jpg", url: "accessories.html?category=floor-lamps" },
    ];

    function getSuggestions(currentProductName, count = 3) {
      const filtered = allProducts.filter(p => p.name !== currentProductName);
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
      return filtered.slice(0, count);
    }

    const suggestionsGrid = document.getElementById('suggestionsGrid');
    if (suggestionsGrid) {
      const suggestions = getSuggestions(product.name, 3);
      suggestions.forEach(item => {
        const div = document.createElement('a');
        div.href = item.url;
        div.className = 'suggestion-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="suggestion-name">${item.name}</div>
        `;
        suggestionsGrid.appendChild(div);
      });
    }
  }
});
