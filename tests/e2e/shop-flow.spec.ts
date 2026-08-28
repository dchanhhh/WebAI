import { test, expect } from "@playwright/test";

const ADMIN = { email: "admin@webai.local", password: "admin12345" };

test.describe("Luồng mua hàng xương sống", () => {
  test("duyệt → thêm giỏ → đặt hàng → admin xử lý → tra cứu", async ({ page }) => {
    // 1. Chi tiết sản phẩm → chọn size → thêm vào giỏ
    await page.goto("/san-pham/dam-lua-eterna-den");
    await page.getByRole("button", { name: "M", exact: true }).click();
    await page.getByRole("button", { name: /Thêm vào giỏ/ }).click();
    await expect(page.getByText("Giỏ hàng (1)")).toBeVisible();

    // 2. Thanh toán (chuyển khoản)
    await page.getByRole("link", { name: "Tiến hành đặt hàng" }).click();
    await page.waitForURL("**/thanh-toan");
    await page.fill("#customerName", "Nguyễn Văn Test");
    await page.fill("#phone", "0912345678");
    await page.fill("#address", "12 Nguyễn Huệ, phường Bến Nghé, Quận 1, TP.HCM");
    await page.check('input[name="paymentMethod"][value="bank_transfer"]');
    await page.getByRole("button", { name: "Xác nhận đặt hàng" }).click();

    // 3. Trang thành công
    await page.waitForURL("**/dat-hang-thanh-cong/**");
    const code = decodeURIComponent(page.url().split("/").pop()!);
    expect(code).toMatch(/^NM-[A-Z0-9]{6}$/);
    await expect(page.getByText("Thông tin chuyển khoản")).toBeVisible();
    await expect(page.getByText(code).first()).toBeVisible();

    // 4. Giỏ hàng đã xoá
    await page.goto("/gio-hang");
    await expect(page.getByText("Giỏ hàng đang trống")).toBeVisible();

    // 5. Middleware chặn /admin
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    // 6. Đăng nhập admin
    await page.fill("#email", ADMIN.email);
    await page.fill("#password", ADMIN.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForURL("**/admin");
    await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();

    // 7. Mở đơn, đổi trạng thái
    await page.goto("/admin/don-hang");
    await page.getByRole("link", { name: code }).click();
    await page.waitForURL("**/admin/don-hang/**");
    await expect(page.getByText("Nguyễn Văn Test")).toBeVisible();
    await page.selectOption('select[name="status"]', "confirmed");
    await page.waitForTimeout(1000);

    // 8. Tra cứu đơn phản ánh trạng thái mới
    await page.goto(`/tra-cuu-don-hang?code=${code}&phone=0912345678`);
    await expect(page.getByText("Đã xác nhận")).toBeVisible();
  });
});
