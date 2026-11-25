// Лаб 1: saucedemo.com дээрх UI автомат тест (Playwright)
import { test, expect, Page } from '@playwright/test';

// Туслах функц: нэвтрэх. Тест бүр өөрөө нэвтэрдэг тул тестүүд бие даасан (test isolation).
async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  // Placeholder-оор нь олно: XPath-аас илүү уншигдахуйц, UI өөрчлөгдөхөд тэсвэртэй
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

// Туслах функц: гарах (Алхам 5). Menu нээгээд Logout дарж, нэвтрэх хуудас руу буцсаныг шалгана.
async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByTestId('logout-sidebar-link').click();
  // Logout хийсний дараа үндсэн URL (login хуудас) руу буцсаныг шалгана
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
}

// Тест 1: Зөв нэр, нууц үгээр амжилттай нэвтрэх
test('амжилттай нэвтрэх', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  // Нэвтэрсний дараа бүтээгдэхүүний хуудас руу шилжсэн байх ёстой
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('title')).toHaveText('Products');

  await logout(page);
});

// Тест 2: Буруу нууц үгээр нэвтрэхэд алдааны мессеж гарах (сөрөг тест)
test('амжилтгүй нэвтрэх (буруу нууц үг)', async ({ page }) => {
  await login(page, 'standard_user', 'wrong_password');

  // Алдааны мессеж харагдах ёстой
  await expect(page.getByTestId('error')).toBeVisible();
  await expect(page.getByTestId('error')).toContainText(
    'Username and password do not match'
  );
  // Нэвтрээгүй тул URL өөрчлөгдөөгүй, inventory руу орохгүй
  await expect(page).not.toHaveURL(/inventory\.html/);
  // Энд нэвтрээгүй тул logout хийх шаардлагагүй
});

// Тест 3: Нэвтэрсний дараа бараа сагслах
test('нэвтэрсний дараа бараа сагслах', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);

  // Нэг барааг сагсанд нэмнэ
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  // Сагсны тоо 1 болсныг шалгана
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  // Товч "Remove" болж өөрчлөгдсөн байх ёстой
  await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();

  await logout(page);
});
