export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Phạm Thu Hà",
    role: "Khách hàng thân thiết",
    quote:
      "Chất vải mặc rất mát và lên dáng đẹp. Mình đặt ba lần rồi, lần nào đóng gói cũng cẩn thận và giao đúng hẹn.",
  },
  {
    name: "Nguyễn Minh Khoa",
    role: "Mua cho vợ",
    quote:
      "Tư vấn size nhiệt tình, đầm về vừa in. Kiểu dáng tối giản nên vợ mình mặc đi làm lẫn đi tiệc đều hợp.",
  },
  {
    name: "Lê Alicia",
    role: "Stylist tự do",
    quote:
      "Bảng màu trung tính rất dễ phối đồ cho khách. Đường may sạch, chi tiết hoàn thiện tốt trong tầm giá.",
  },
  {
    name: "Trần Gia Bảo",
    role: "Khách mới",
    quote:
      "Website gọn gàng, đặt hàng nhanh. Nhận áo đúng như ảnh, không bị lệch màu như mình lo ban đầu.",
  },
];
