import { test as base, expect, type Page } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { MenuComponent } from '../pages/components/MenuComponent';

/**
 * Кастомные фикстуры проекта.
 *
 * Каждый POM создаётся один раз на тест и автоматически переиспользуется —
 * тесты получают готовые объекты вместо ручного конструирования.
 */

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  menuComponent: MenuComponent;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  menuComponent: async ({ page }, use) => {
    await use(new MenuComponent(page));
  },
});

/** Авторизованные сценарии начинают с каталога и пустой корзины. */
export const authenticatedTest = test.extend<{ authenticatedPage: Page }>({
  authenticatedPage: [
    async ({ page, inventoryPage }, use) => {
      await inventoryPage.goto();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.cartBadge).toBeHidden();
      await use(page);
    },
    { auto: true },
  ],
});

export { expect };
