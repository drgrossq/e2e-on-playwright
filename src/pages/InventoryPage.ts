import { type Locator, type Page } from '@playwright/test';
import { type Product, type SortOption } from '../data/products';

/** Каталог и детали товара используют одинаковые data-test для имени, цены и описания. */
export class InventoryPage {
  readonly title: Locator;
  readonly itemCards: Locator;
  readonly itemNames: Locator;
  readonly itemDescriptions: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;
  readonly cartBadge: Locator;

  constructor(public readonly page: Page) {
    this.title = page.getByTestId('title');
    this.itemCards = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemDescriptions = page.getByTestId('inventory-item-desc');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async openProduct(product: Product): Promise<void> {
    await this.itemNames.filter({ hasText: product.name }).click();
  }

  async addToCart(product: Product): Promise<void> {
    await this.addButton(product).click();
  }

  addButton(product: Product): Locator {
    return this.page.getByTestId(`add-to-cart-${product.id}`);
  }

  removeButton(product: Product): Locator {
    return this.page.getByTestId(`remove-${product.id}`);
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async goToCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async backToProducts(): Promise<void> {
    await this.page.getByTestId('back-to-products').click();
  }
}
