import { expect, test } from '../fixtures/fixtures';
import { LOGIN_ERRORS, USERS, WRONG_PASSWORD } from '../data/users';

/**
 * Негативные сценарии авторизации.
 * Как и в smoke-тесте, стартуем без сохранённой сессии.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Авторизация: негативные сценарии', { tag: '@auth' }, () => {
  test('AUTH-01: locked_out_user не может войти в систему', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(LOGIN_ERRORS.lockedOut);
    // Пользователь остаётся на странице логина
    await expect(page).toHaveURL(/\/$/);
  });

  test('AUTH-02: неверный пароль отклоняется', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, WRONG_PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(LOGIN_ERRORS.wrongCredentials);
    await expect(page).toHaveURL(/\/$/);
  });

  test('AUTH-03: пустые поля показывают обязательные ошибки', async ({ page, loginPage }) => {
    await loginPage.goto();

    // Пустая форма → требуется username
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toHaveText(LOGIN_ERRORS.usernameRequired);

    // Заполнен только username → требуется пароль
    await loginPage.usernameInput.fill(USERS.standard.username);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toHaveText(LOGIN_ERRORS.passwordRequired);
    await expect(page).toHaveURL(/\/$/);
  });
});
