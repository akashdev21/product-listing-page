document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const noProductsMessage = document.getElementById("no-products");
  const sortSelect = document.getElementById("sort");
  const filters = document.querySelectorAll(".catgories input");
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const minPriceValue = document.getElementById("min-price-value");
  const maxPriceValue = document.getElementById("max-price-value");
  const loadMoreButton = document.getElementById("load-more");
  const searchInput = document.getElementById("search");
  const loadingIndicator = document.getElementById("loading");

  let products = [];
  let displayedProducts = [];
  let currentBatchIndex = 0;
  const batchSize = 10;

  const fetchProducts = () => {
    showLoadingIndicator();
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        products = data;
        filterProducts();
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        hideLoadingIndicator();
        showErrorMessage("Failed to fetch products. Please try again later.");
      });
  };

  const displayProducts = (products) => {
    hideLoadingIndicator();
    productList.innerHTML = "";
    if (products.length === 0) {
      noProductsMessage.style.display = "block";
      loadMoreButton.style.display = "none";
    } else {
      noProductsMessage.style.display = "none";
      const productsToDisplay = products.slice(
        0,
        (currentBatchIndex + 1) * batchSize
      );
      productsToDisplay.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");

        productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" style="max-height: 300px;">
                    <p class="product-name">${product.title}</p>
                    <p class="product-price">$${product.price}</p>
                    <img src="img/heart.svg" class="heart" alt="">
                `;

        productList.appendChild(productElement);
      });
      if (productsToDisplay.length < products.length) {
        loadMoreButton.style.display = "block";
      } else {
        loadMoreButton.style.display = "none";
      }
    }
  };

  const filterProducts = () => {
    let filteredProducts = products;

    const selectedCategories = Array.from(filters)
      .filter((input) => input.checked)
      .map((input) => input.getAttribute("data-category"));
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    const searchQuery = searchInput.value.toLowerCase();
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery)
      );
    }

    displayedProducts = filteredProducts;
    currentBatchIndex = 0;
    displayProducts(displayedProducts);
  };

  const sortProducts = () => {
    const sortBy = sortSelect.value;
    if (sortBy === "price-low-high") {
      displayedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      displayedProducts.sort((a, b) => b.price - a.price);
    }
    currentBatchIndex = 0;
    displayProducts(displayedProducts);
  };

  const loadMoreProducts = () => {
    currentBatchIndex++;
    displayProducts(displayedProducts);
  };

  const showLoadingIndicator = () => {
    loadingIndicator.style.display = "block";
  };

  const hideLoadingIndicator = () => {
    loadingIndicator.style.display = "none";
  };

  const showErrorMessage = (message) => {
    noProductsMessage.textContent = message;
    noProductsMessage.style.display = "block";
  };

  filters.forEach((filter) =>
    filter.addEventListener("change", filterProducts)
  );
  minPriceInput.addEventListener("input", () => {
    minPriceValue.textContent = minPriceInput.value;
    filterProducts();
  });
  maxPriceInput.addEventListener("input", () => {
    maxPriceValue.textContent = maxPriceInput.value;
    filterProducts();
  });
  sortSelect.addEventListener("change", sortProducts);
  loadMoreButton.addEventListener("click", loadMoreProducts);
  searchInput.addEventListener("input", filterProducts);

  fetchProducts();
});
