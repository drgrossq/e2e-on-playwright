import { type Locator, type Page } from '@playwright/test';

export class MenuComponent {
  readonly inventoryLink: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(public readonly page: Page) {
    this.inventoryLink = page.getByTestId('inventory-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetLink = page.getByTestId('reset-sidebar-link');
  }

  async open(): Promise<void> {
    // data-test="open-menu" стоит на декоративной картинке, а не на кнопке.
    await this.page.getByRole('button', { name: 'Open Menu', exact: true }).click();
  }

  async close(): Promise<void> {
    await this.page.getByRole('button', { name: 'Close Menu', exact: true }).click();
  }

  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetLink.click();
    // Reset не закрывает меню: закрываем явно перед дальнейшими действиями.
    await this.close();
  }

  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }
}
