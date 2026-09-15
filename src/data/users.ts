/**
 * Тестовые пользователи SauceDemo.
 *
 * Учётные данные хранятся ТОЛЬКО в этом файле — тесты не содержат хардкода
 * логинов/паролей. Если данные поменяются, обновление будет в одном месте.
 */

export interface User {
  username: string;
  password: string;
}

/** Общий пароль всех демо-пользователей SauceDemo. */
const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
} as const satisfies Record<string, User>;

/** Заведомо неверный пароль для негативных сценариев. */
export const WRONG_PASSWORD = 'wrong_password';

/** Ожидаемые сообщения об ошибках на странице логина. */
export const LOGIN_ERRORS = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  wrongCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  inventoryRequiresLogin:
    "Epic sadface: You can only access '/inventory.html' when you are logged in.",
} as const;
