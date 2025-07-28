let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 24;

const paginationControls = document.getElementById('roomPaginationControls');
const filterSortPanel = document.getElementById('filterSortPanel');
const filterSortToggle = document.getElementById('filterSortToggle');
const filterSortForm = document.getElementById('filterSortForm');
const searchInput = document.getElementById('searchInput');

const categoryMap = {
    "allproducts": { api: "/api/images", category: "All Products" },
    "livingroom": { api: "/api/images/living-room", category: "Living Room" },
    "bedroom": { api: "/api/images/bedroom", category: "Bedroom" },
    "diningroom": { api: "/api/images/dining-Room", category: "Dining Room" },
    "office": { api: "/api/images/office", category: "Office" },
    "accessories": { api: "/api/images/accessories", category: "Accessories" },
    "outdoors": { api: "/api/images/outdoors", category: "Outdoor" }
};

function formatNameFromSrc(src) {
    const filename = src.split('/').pop().split('.')[0];
    return filename.replace(/[-_]/g, ' ')
                   .replace(/([a-z])([A-Z])/g, '$1 $2')
                   .replace(/\s+/g, ' ')
                   .trim();
}

function getRandomPrice() {
    const current = (Math.floor(Math.random() * 10) + 10) * 10;
    return { current };
}

async function loadProducts() {
    let pageTitle = document.title.toLowerCase().replace("products", "").trim();
    if (pageTitle.includes("all")) pageTitle = "allproducts";
    else if (pageTitle.includes("living")) pageTitle = "livingroom";
    else if (pageTitle.includes("bedroom")) pageTitle = "bedroom";
    else if (pageTitle.includes("dining")) pageTitle = "diningroom";
    else if (pageTitle.includes("outdoor")) pageTitle = "outdoors";
    else if (pageTitle.includes("office")) pageTitle = "office";
    else if (pageTitle.includes("accessories")) pageTitle = "accessories";

    const categoryInfo = categoryMap[pageTitle];
    if (!categoryInfo) {
        console.error("Unknown page title:", document.title);
        return;
    }

    allProducts = [];

    if (pageTitle === "allproducts") {
        const categoryKeys = Object.keys(categoryMap).filter(key => key !== "allproducts");
        for (let key of categoryKeys) {
            try {
                const res = await fetch(categoryMap[key].api);
                const data = await res.json();
                const images = data.images || data;
                const products = images.map((src, index) => ({
                    src,
                    name: formatNameFromSrc(src),
                    dateAdded: Date.now() - allProducts.length * 1000,
                    category: categoryMap[key].category
                }));
                allProducts.push(...products);
            } catch (err) {
                console.error(`Failed to load products from ${categoryMap[key].api}`, err);
            }
        }
    } else {
        try {
            const res = await fetch(categoryInfo.api);
            const data = await res.json();
            const images = data.images || data;
            allProducts = images.map((src, index) => ({
                src,
                name: formatNameFromSrc(src),
                dateAdded: Date.now() - index * 1000,
                category: categoryInfo.category
            }));
        } catch (err) {
            console.error(`Failed to load products from ${categoryInfo.api}`, err);
        }
    }

    document.getElementById('totalProductCount').textContent = `Total Products: ${allProducts.length}`;
    filteredProducts = [...allProducts];
    render();
}

function renderProductsPage() {
    const grid = document.getElementById('roomProductGrid');
    grid.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);

    pageProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = "product-card";

        const wishlistIcon = document.createElement('i');
        wishlistIcon.className = 'far fa-heart wishlist-icon'; // outline heart
        wishlistIcon.title = 'Add to Wishlist';
        wishlistIcon.addEventListener('click', () => {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (!wishlist.some(item => item.src === product.src)) {
                wishlist.push(product);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            }
            window.location.href = 'wishlist.html';
        });

        const img = document.createElement('img');
        img.src = product.src;
        img.alt = product.name;
        img.className = "product-img";
        img.addEventListener('click', () => {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'product-details.html';
        });

        const nameOverlay = document.createElement('h3');
        nameOverlay.textContent = product.name;

        const { current } = getRandomPrice();

        const priceBox = document.createElement('div');
        priceBox.className = 'price-box';

        const currentPrice = document.createElement('span');
        currentPrice.className = 'current-price';
        currentPrice.textContent = `$${current}`;

        const cartIcon = document.createElement('i');
        cartIcon.className = 'fas fa-shopping-cart cart-icon';
        cartIcon.title = 'Add to Cart';
        cartIcon.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (!cart.some(item => item.src === product.src)) {
    cart.push({ ...product, price: current });
}

            window.location.href = 'cart.html';
        });


        priceBox.appendChild(currentPrice);
        priceBox.appendChild(cartIcon);
        card.appendChild(wishlistIcon);
        card.appendChild(img);
        card.appendChild(nameOverlay);
        card.appendChild(priceBox);
        grid.appendChild(card);
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        return btn;
    }

    paginationControls.appendChild(createBtn('<<', 1));
    for (let i = 1; i <= totalPages; i++) {
        paginationControls.appendChild(createBtn(i, i));
    }
    paginationControls.appendChild(createBtn('>>', totalPages));
}

function applyFiltersAndSort(skipFiltering = false) {
    if (!skipFiltering) {
        const formData = new FormData(filterSortForm);
        const selectedCategories = formData.getAll('category');
        const sortBy = formData.get('sortBy');

        filteredProducts = allProducts.filter(p =>
            selectedCategories.length === 0 || selectedCategories.includes(p.category)
        );

        switch (sortBy) {
            case 'alphaAsc': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'alphaDesc': filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'dateNew': filteredProducts.sort((a, b) => b.dateAdded - a.dateAdded); break;
            case 'dateOld': filteredProducts.sort((a, b) => a.dateAdded - b.dateAdded); break;
        }
    }
    currentPage = 1;
    render();
}

function render() {
    renderProductsPage();
    renderPagination();
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
    currentPage = 1;
    render();
});

document.addEventListener('DOMContentLoaded', loadProducts);
