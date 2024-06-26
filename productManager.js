import { fetchProducts } from "./productService.js";
import {
  displayProducts,
  showLoadingIndicator,
  hideLoadingIndicator,
  showErrorMessage,
  setupEventListeners,
} from "./uiService.js";

const BATCH_SIZE = 10;

export class ProductManager {
  constructor() {
    this.products = [];
    this.displayedProducts = [];
    this.currentBatchIndex = 0;
  }

  async initialize() {
    showLoadingIndicator();

    try {
      this.products = await fetchProducts();
      this.filterProducts();
      setupEventListeners(this);
    } catch (error) {
      console.error("Error fetching products:", error);
      hideLoadingIndicator();
      showErrorMessage("Failed to fetch products. Please try again later.");
    }
  }

  filterProducts() {
    let filteredProducts = this.products;

    const selectedCategories = Array.from(
      document.querySelectorAll(".catgories input")
    )
      .filter((input) => input.checked)
      .map((input) => input.getAttribute("data-category"));
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    const minPrice =
      parseFloat(document.getElementById("min-price").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("max-price").value) || Infinity;
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    const searchQuery = document.getElementById("search").value.toLowerCase();
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery)
      );
    }

    this.displayedProducts = filteredProducts;
    this.currentBatchIndex = 0;
    displayProducts(this.displayedProducts, this.currentBatchIndex, BATCH_SIZE);
  }

  sortProducts() {
    const sortBy = document.getElementById("sort").value;
    if (sortBy === "price-low-high") {
      this.displayedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      this.displayedProducts.sort((a, b) => b.price - a.price);
    }
    this.currentBatchIndex = 0;
    displayProducts(this.displayedProducts, this.currentBatchIndex, BATCH_SIZE);
  }

  loadMoreProducts() {
    this.currentBatchIndex++;
    displayProducts(this.displayedProducts, this.currentBatchIndex, BATCH_SIZE);
  }
}
