import { expect, authenticatedTest as test } from '../fixtures/fixtures';
import { PRODUCTS, PRODUCT_LIST, SORT_OPTIONS } from '../data/products';

test.describe('Каталог товаров', { tag: '@inventory' }, () => {
  test('INV-01: отображает список из 6 товаров с ценами', async ({ inventoryPage }) => {
    await expect(inventoryPage.itemCards).toHaveCount(PRODUCT_LIST.length);
    await expect(inventoryPage.itemNames).toHaveText(PRODUCT_LIST.map((product) => product.name));
    await expect(inventoryPage.itemPrices).toHaveText(
      PRODUCT_LIST.map((product) => `$${product.price.toFixed(2)}`),
    );
  });

  test('INV-02: меняет сортировку с Z–A на A–Z', async ({ inventoryPage }) => {
    const ascending = PRODUCT_LIST.map((product) => product.name).sort();
    // A–Z — исходный порядок. Сначала меняем его, чтобы обнаружить неработающий select.
    await inventoryPage.sortBy(SORT_OPTIONS.nameDesc);
    await expect(inventoryPage.itemNames).toHaveText([...ascending].reverse());

    await inventoryPage.sortBy(SORT_OPTIONS.nameAsc);
    await expect(inventoryPage.sortSelect).toHaveValue(SORT_OPTIONS.nameAsc);
    await expect(inventoryPage.itemNames).toHaveText(ascending);
  });

  test('INV-03: сортирует по цене от высокой к низкой', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.priceDesc);
    const expected = PRODUCT_LIST.map((product) => product.price)
      .sort((a, b) => b - a)
      .map((price) => `$${price.toFixed(2)}`);

    await expect(inventoryPage.sortSelect).toHaveValue(SORT_OPTIONS.priceDesc);
    await expect(inventoryPage.itemPrices).toHaveText(expected);
    await expect(inventoryPage.itemNames.first()).toHaveText(PRODUCTS.fleeceJacket.name);
  });

  test('INV-04: открывает детали товара и возвращается в каталог', async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.openProduct(PRODUCTS.backpack);

    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(inventoryPage.itemNames).toHaveText(PRODUCTS.backpack.name);
    await expect(inventoryPage.itemPrices).toHaveText(`$${PRODUCTS.backpack.price.toFixed(2)}`);
    await expect(inventoryPage.itemDescriptions).toHaveText(PRODUCTS.backpack.description);

    await inventoryPage.backToProducts();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.itemCards).toHaveCount(PRODUCT_LIST.length);
  });
});
