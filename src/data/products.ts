/**
 * Тестовые данные: товары каталога SauceDemo и данные для оформления заказа.
 *
 * Поля id используются для построения data-test селекторов
 * вида `add-to-cart-${id}` / `remove-${id}`.
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const PRODUCTS = {
  backpack: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
  },
  bikeLight: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
  },
  boltTShirt: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    description:
      'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
  },
  fleeceJacket: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
  },
  onesie: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: 7.99,
    description:
      'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-way stretch fabric.',
  },
  tShirtRed: {
    id: 'test.allthethings-t-shirt-red',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    description:
      'This classic Sauce Labs t-shirt is perfect for days when you need to be slightly more stylish than your usual testing attire. Made from 100% cotton.',
  },
} as const satisfies Record<string, Product>;

export const PRODUCT_LIST: readonly Product[] = Object.values(PRODUCTS);

/** Варианты сортировки каталога (value у <select>). */
export const SORT_OPTIONS = {
  nameAsc: 'az',
  nameDesc: 'za',
  priceAsc: 'lohi',
  priceDesc: 'hilo',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

/** Данные покупателя для формы Checkout: Your Information. */
export interface ShippingDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const SHIPPING_DETAILS: ShippingDetails = {
  firstName: 'Иван',
  lastName: 'Петров',
  postalCode: '101000',
};

/** Ожидаемые сообщения об ошибках в форме Checkout. */
export const CHECKOUT_ERRORS = {
  firstNameRequired: 'Error: First Name is required',
} as const;
