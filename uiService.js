export const displayProducts = (products, currentBatchIndex, batchSize) => {
  const productList = document.getElementById("product-list");
  const noProductsMessage = document.getElementById("no-products");
  const loadMoreButton = document.getElementById("load-more");

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

export const showLoadingIndicator = () => {
  document.getElementById("loading").style.display = "block";
};

export const hideLoadingIndicator = () => {
  document.getElementById("loading").style.display = "none";
};

export const showErrorMessage = (message) => {
  const noProductsMessage = document.getElementById("no-products");
  noProductsMessage.textContent = message;
  noProductsMessage.style.display = "block";
};

const addEventListenerToElements = (elements, event, handler) => {
  elements.forEach((element) => element.addEventListener(event, handler));
};

export const setupEventListeners = (productManager) => {
  const filters = document.querySelectorAll(".catgories input");
  addEventListenerToElements(filters, "change", () =>
    productManager.filterProducts()
  );

  const minPriceInput = document.getElementById("min-price");
  minPriceInput.addEventListener("input", () => {
    document.getElementById("min-price-value").textContent =
      minPriceInput.value;
    productManager.filterProducts();
  });

  const maxPriceInput = document.getElementById("max-price");
  maxPriceInput.addEventListener("input", () => {
    document.getElementById("max-price-value").textContent =
      maxPriceInput.value;
    productManager.filterProducts();
  });

  const sortSelect = document.getElementById("sort");
  sortSelect.addEventListener("change", () => productManager.sortProducts());

  const loadMoreButton = document.getElementById("load-more");
  loadMoreButton.addEventListener("click", () =>
    productManager.loadMoreProducts()
  );

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => productManager.filterProducts());
};
