import { expect, authenticatedTest as test } from '../fixtures/fixtures';
import { PRODUCTS } from '../data/products';

test.describe('Корзина', { tag: '@cart' }, () => {
  test('CR-01: сохраняет товары после перезагрузки и Continue Shopping', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack.name, PRODUCTS.bikeLight.name]);
    await page.reload();
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack.name, PRODUCTS.bikeLight.name]);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.removeButton(PRODUCTS.backpack)).toBeVisible();
    await expect(inventoryPage.removeButton(PRODUCTS.bikeLight)).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('CR-02: удаляет товары и скрывает бейдж после удаления последнего', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.boltTShirt);
    await inventoryPage.goToCart();

    await cartPage.removeFromCart(PRODUCTS.backpack);
    await expect(cartPage.cartItem(PRODUCTS.backpack)).toHaveCount(0);
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.boltTShirt.name]);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await cartPage.removeFromCart(PRODUCTS.boltTShirt);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
    await cartPage.continueShopping();
    await expect(inventoryPage.addButton(PRODUCTS.backpack)).toBeVisible();
    await expect(inventoryPage.addButton(PRODUCTS.boltTShirt)).toBeVisible();
  });
});
