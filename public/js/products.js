let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 24;

const productGrid = document.getElementById('roomProductGrid');
const totalCount = document.getElementById('totalProductCount');
const paginationControls = document.getElementById('roomPaginationControls');
const filterSortPanel = document.getElementById('filterSortPanel');
const filterSortToggle = document.getElementById('filterSortToggle');
const filterSortForm = document.getElementById('filterSortForm');
const searchInput = document.getElementById('searchInput');

async function loadLivingRoomProducts() {
  try {
    const response = await fetch('/api/livingroom-products');
    const products = await response.json();

    allProducts = products.map(image => ({
      image,
      name: image.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ''),
      category: guessCategory(image),
      price: randomPrice(),
      dateAdded: randomDate()
    }));

    filteredProducts = allProducts;
    render();
  } catch (error) {
    productGrid.innerHTML = '<p>Failed to load products.</p>';
  }
}

function guessCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('sofa')) return 'Sofas';
  if (lower.includes('recliner')) return 'Recliners';
  if (lower.includes('chair')) return 'Accent Chairs';
  return 'Other';
}

function randomPrice() {
  return Math.floor(Math.random() * 2000) + 100;
}

function randomDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 365);
  const date = new Date(today);
  date.setDate(today.getDate() - daysAgo);
  return date;
}

function render() {
  totalCount.textContent = `Total Products: ${filteredProducts.length}`;
  renderProductsPage();
  renderPagination();
}

function renderProductsPage() {
  productGrid.innerHTML = '';
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const productsToShow = filteredProducts.slice(start, end);

  productsToShow.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'room-product-card';

    const img = document.createElement('img');
    img.src = `/Images/living-room/${encodeURIComponent(product.image)}`;
    img.alt = product.name;
    img.className = 'room-product-image';

    const name = document.createElement('p');
    name.className = 'room-product-name';
    name.textContent = product.name;

    productCard.appendChild(img);
    productCard.appendChild(name);
    productGrid.appendChild(productCard);

    productCard.addEventListener('click', () => {
      const params = new URLSearchParams({
        image: product.image,
        name: product.name,
        price: product.price,
        category: product.category
      });
      window.location.href = `product-details.html?${params.toString()}`;
    });
  });
}

function renderPagination() {
  paginationControls.innerHTML = '';
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (totalPages <= 1) return;

  function createBtn(label, page) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = (page === currentPage) ? 'active' : '';
    btn.disabled = (page === currentPage);
    btn.addEventListener('click', () => {
      currentPage = page;
      renderProductsPage();
      renderPagination();
      scrollToTop();
    });
    return btn;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<<';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProductsPage();
      renderPagination();
      scrollToTop();
    }
  });
  paginationControls.appendChild(prevBtn);

  paginationControls.appendChild(createBtn('1', 1));

  if (currentPage > 4) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.style.padding = '0 5px';
    paginationControls.appendChild(dots);
  }

  const startPage = Math.max(2, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);
  for (let i = startPage; i <= endPage; i++) {
    paginationControls.appendChild(createBtn(i, i));
  }

  if (currentPage < totalPages - 3) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.style.padding = '0 5px';
    paginationControls.appendChild(dots);
  }

  if (totalPages > 1) {
    paginationControls.appendChild(createBtn(totalPages, totalPages));
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProductsPage();
      renderPagination();
      scrollToTop();
    }
  });
  paginationControls.appendChild(nextBtn);
}

function applyFiltersAndSort(skipFiltering = false) {
  if (!skipFiltering) {
    const formData = new FormData(filterSortForm);
    const selectedCategories = formData.getAll('category');
    const minPrice = parseFloat(formData.get('minPrice')) || 0;
    const maxPrice = parseFloat(formData.get('maxPrice')) || Infinity;

    filteredProducts = allProducts.filter(p => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const priceMatch = p.price >= minPrice && p.price <= maxPrice;
      return categoryMatch && priceMatch;
    });
  }

  const sortBy = filterSortForm.sortBy.value;

  switch (sortBy) {
    case 'alphaAsc': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'alphaDesc': filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
    case 'priceAsc': filteredProducts.sort((a, b) => a.price - b.price); break;
    case 'priceDesc': filteredProducts.sort((a, b) => b.price - a.price); break;
    case 'dateNew': filteredProducts.sort((a, b) => b.dateAdded - a.dateAdded); break;
    case 'dateOld': filteredProducts.sort((a, b) => a.dateAdded - b.dateAdded); break;
    default: break;
  }

  currentPage = 1;
  render();
}

filterSortToggle.addEventListener('click', () => filterSortPanel.classList.toggle('show'));
filterSortForm.addEventListener('submit', e => {
  e.preventDefault();
  applyFiltersAndSort();
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();

  filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  applyFiltersAndSort(true);
});

document.addEventListener('DOMContentLoaded', loadLivingRoomProducts);
