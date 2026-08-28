import { BANK_INFO } from "@/lib/constants";
import { formatVnd } from "@/lib/money";

export function BankTransferInfo({ code, amount }: { code: string; amount: number }) {
  const rows = [
    ["Ngân hàng", BANK_INFO.bankName],
    ["Chủ tài khoản", BANK_INFO.accountName],
    ["Số tài khoản", BANK_INFO.accountNumber],
    ["Chi nhánh", BANK_INFO.branch],
    ["Số tiền", formatVnd(amount)],
    ["Nội dung chuyển khoản", code],
  ];
  return (
    <div className="rounded-sm border border-info/30 bg-info/5 p-5">
      <p className="text-h4 text-ink">Thông tin chuyển khoản</p>
      <p className="mt-1 text-sm text-muted">
        Vui lòng chuyển khoản trong 24 giờ và ghi đúng nội dung để đơn được xử lý nhanh.
      </p>
      <dl className="mt-4 divide-y divide-info/15 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
