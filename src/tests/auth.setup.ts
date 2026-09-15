import { expect, test as setup } from '@playwright/test';
import { USERS } from '../data/users';
import { LoginPage } from '../pages/LoginPage';
import { AUTH_FILE } from '../data/auth';

/**
 * Setup-проект (см. playwright.config.ts, projects: ['setup']).
 *
 * Выполняет UI-логин ровно один раз и сохраняет сессию (cookies + localStorage)
 * в файл storageState. Smoke и негативные auth-тесты используют пустую сессию.
 */
setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);

  // Убеждаемся, что авторизация действительно прошла.
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByTestId('title')).toHaveText('Products');
  await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();

  // Сохраняем состояние сессии для переиспользования в тестах.
  await page.context().storageState({ path: AUTH_FILE });
});
