import { type Locator, type Page } from '@playwright/test';
import { type ShippingDetails } from '../data/products';

/** Форма покупателя, Overview и подтверждение заказа. */
export class CheckoutPage {
  readonly title: Locator;
  readonly errorMessage: Locator;
  readonly summaryItems: Locator;
  readonly summaryItemNames: Locator;
  readonly summaryItemPrices: Locator;
  readonly summaryItemQuantities: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(public readonly page: Page) {
    this.title = page.getByTestId('title');
    this.errorMessage = page.getByTestId('error');
    this.summaryItems = page.getByTestId('inventory-item');
    this.summaryItemNames = this.summaryItems.getByTestId('inventory-item-name');
    this.summaryItemPrices = this.summaryItems.getByTestId('inventory-item-price');
    this.summaryItemQuantities = this.summaryItems.getByTestId('item-quantity');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
  }

  async fillShippingInfo(details: ShippingDetails): Promise<void> {
    await this.page.getByTestId('firstName').fill(details.firstName);
    await this.page.getByTestId('lastName').fill(details.lastName);
    await this.page.getByTestId('postalCode').fill(details.postalCode);
  }

  async continue(): Promise<void> {
    await this.page.getByTestId('continue').click();
  }

  async finish(): Promise<void> {
    await this.page.getByTestId('finish').click();
  }

  async backToProducts(): Promise<void> {
    await this.page.getByTestId('back-to-products').click();
  }
}
