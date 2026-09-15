import { type Locator, type Page } from '@playwright/test';
import { type Product } from '../data/products';

export class CartPage {
  readonly cartItems: Locator;
  readonly itemNames: Locator;

  constructor(public readonly page: Page) {
    this.cartItems = page.getByTestId('inventory-item');
    this.itemNames = this.cartItems.getByTestId('inventory-item-name');
  }

  async removeFromCart(product: Product): Promise<void> {
    await this.page.getByTestId(`remove-${product.id}`).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByTestId('checkout').click();
  }

  async continueShopping(): Promise<void> {
    await this.page.getByTestId('continue-shopping').click();
  }

  cartItem(product: Product): Locator {
    return this.cartItems.filter({
      has: this.page.getByTestId('inventory-item-name').filter({ hasText: product.name }),
    });
  }
}
