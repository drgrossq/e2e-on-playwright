import { expect, test } from '../fixtures/fixtures';
import { PRODUCTS, SHIPPING_DETAILS } from '../data/products';
import { USERS } from '../data/users';

// Единственный бизнес-сценарий успешного UI-логина; setup тоже входит через UI.
test.use({ storageState: { cookies: [], origins: [] } });

test(
  'SMK-01: логин → корзина → checkout → logout',
  { tag: '@smoke' },
  async ({ page, loginPage, inventoryPage, cartPage, checkoutPage, menuComponent }) => {
    await test.step('Войти с пустой сессией', async () => {
      await loginPage.goto();
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await expect(page).toHaveURL(/\/inventory\.html$/);
    });

    await test.step('Добавить товар и открыть корзину', async () => {
      await inventoryPage.addToCart(PRODUCTS.backpack);
      await expect(inventoryPage.cartBadge).toHaveText('1');
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack.name]);
    });

    await test.step('Оформить заказ', async () => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
      await checkoutPage.fillShippingInfo(SHIPPING_DETAILS);
      await checkoutPage.continue();
      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
      await checkoutPage.finish();
      await expect(page).toHaveURL(/\/checkout-complete\.html$/);
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });

    await test.step('Вернуться в каталог и выйти', async () => {
      await checkoutPage.backToProducts();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await menuComponent.logout();
      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.loginButton).toBeVisible();
    });
  },
);
