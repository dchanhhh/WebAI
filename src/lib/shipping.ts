import { SHIPPING_FEE_VND, FREE_SHIPPING_THRESHOLD_VND } from "@/lib/constants";

/** Phí ship theo tạm tính. Dùng được ở cả client và server. */
export function calcShippingFee(subtotalVnd: number): number {
  if (FREE_SHIPPING_THRESHOLD_VND > 0 && subtotalVnd >= FREE_SHIPPING_THRESHOLD_VND) {
    return 0;
  }
  return SHIPPING_FEE_VND;
}
