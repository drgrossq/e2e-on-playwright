import { expect, authenticatedTest as test } from '../fixtures/fixtures';
import { PRODUCTS } from '../data/products';
import { LOGIN_ERRORS } from '../data/users';

test.describe('Боковое меню', { tag: '@menu' }, () => {
  test('MNU-01: открывает и закрывает меню', async ({ menuComponent }) => {
    await menuComponent.open();
    await expect(menuComponent.inventoryLink).toBeVisible();
    await expect(menuComponent.logoutLink).toBeVisible();
    await expect(menuComponent.resetLink).toBeVisible();

    await menuComponent.close();
    await expect(menuComponent.inventoryLink).toBeHidden();
    await expect(menuComponent.logoutLink).toBeHidden();
    await expect(menuComponent.resetLink).toBeHidden();
  });

  test('MNU-02: Reset App State очищает корзину', async ({
    page,
    inventoryPage,
    cartPage,
    menuComponent,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.fleeceJacket);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await menuComponent.resetAppState();
    await expect(inventoryPage.cartBadge).toBeHidden();
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(0);
    await page.reload();
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('MNU-03: после logout каталог недоступен без авторизации', async ({
    page,
    loginPage,
    inventoryPage,
    menuComponent,
  }) => {
    await menuComponent.logout();
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();

    await inventoryPage.goto();
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toHaveText(LOGIN_ERRORS.inventoryRequiresLogin);
    await expect(inventoryPage.itemCards).toHaveCount(0);
  });
});
