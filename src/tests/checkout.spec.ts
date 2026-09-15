import { expect, authenticatedTest as test } from '../fixtures/fixtures';
import { CHECKOUT_ERRORS, PRODUCTS, SHIPPING_DETAILS } from '../data/products';

test.describe('Оформление заказа', { tag: '@checkout' }, () => {
  test('CHK-01: не позволяет продолжить с пустым First Name', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.onesie);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    await checkoutPage.fillShippingInfo({ ...SHIPPING_DETAILS, firstName: '' });
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toHaveText(CHECKOUT_ERRORS.firstNameRequired);
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('CHK-02: проверяет состав, налог, итог и завершает заказ', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const items = [PRODUCTS.backpack, PRODUCTS.bikeLight];
    // Считаем в центах по тестовым данным, независимо от значений на странице.
    // Для выбранной пары контрольный пример: 39.98 + 3.20 = 43.18 USD.
    const subtotalCents = items.reduce((sum, product) => sum + Math.round(product.price * 100), 0);
    const taxCents = Math.round(subtotalCents * 0.08);
    const totalCents = subtotalCents + taxCents;

    for (const product of items) {
      await inventoryPage.addToCart(product);
    }
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(SHIPPING_DETAILS);
    await checkoutPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.summaryItemNames).toHaveText(items.map((product) => product.name));
    await expect(checkoutPage.summaryItemPrices).toHaveText(
      items.map((product) => `$${product.price.toFixed(2)}`),
    );
    await expect(checkoutPage.summaryItemQuantities).toHaveText(['1', '1']);
    await expect(checkoutPage.subtotalLabel).toHaveText(
      `Item total: $${(subtotalCents / 100).toFixed(2)}`,
    );
    await expect(checkoutPage.taxLabel).toHaveText(`Tax: $${(taxCents / 100).toFixed(2)}`);
    await expect(checkoutPage.totalLabel).toHaveText(`Total: $${(totalCents / 100).toFixed(2)}`);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.completeText).toContainText('has been dispatched');
    await expect(inventoryPage.cartBadge).toBeHidden();

    await checkoutPage.backToProducts();
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
