# Customer Management Module

Module quản lý khách hàng cho admin dashboard với đầy đủ các chức năng theo yêu cầu.

## Tính năng

### 3️⃣ Bảng danh sách khách hàng
- **Cột hiển thị**: Ảnh đại diện, Họ tên, Email, SĐT, Quyền, Trạng thái, Ngày tạo, Hành động
- **Phân trang**: Hiển thị 10 khách hàng/trang với điều hướng
- **Sắp xếp**: Theo tên, email, hoặc ngày tạo (tăng/giảm dần)
- **Bộ lọc**: Tìm kiếm theo tên/email/SĐT, lọc theo quyền và trạng thái

### 4️⃣ Modal chi tiết khách hàng
- **Thông tin cá nhân**: Họ tên, Email, SĐT, Quyền, Trạng thái, Ngày tạo
- **Địa chỉ mặc định**: Hiển thị địa chỉ đầy đủ
- **Thống kê**: Số lượng đơn hàng và tổng giá trị chi tiêu
- **Lịch sử đơn hàng**: Bảng rút gọn với mã đơn, ngày đặt, tổng tiền, trạng thái

### 5️⃣ Phân quyền
- **Form chọn quyền**: Dropdown với 3 tùy chọn
  - 👑 Admin - Quyền quản trị viên cao nhất
  - 🧑‍💼 Nhân viên - Quyền nhân viên
  - 👤 Khách hàng - Quyền khách hàng thông thường
- **Xác nhận**: Cảnh báo khi cấp/thu hồi quyền Admin
- **Thông báo**: Toast notification khi cập nhật thành công

### 6️⃣ Khóa/Mở tài khoản
- **Nút hành động**: 🔒 Khóa / 🔓 Mở khóa
- **Xác nhận**: Popup xác nhận trước khi thực hiện
- **Cập nhật**: Thay đổi trạng thái active/inactive
- **Thông báo**: Toast notification khi thay đổi trạng thái

## Cấu trúc thư mục

```
src/component/admin/customers/
├── components/
│   ├── CustomerTable.tsx           # Bảng danh sách khách hàng
│   ├── CustomerFilters.tsx         # Bộ lọc và tìm kiếm
│   ├── CustomerDetailModal.tsx     # Modal chi tiết khách hàng
│   ├── RoleAssignmentModal.tsx     # Modal phân quyền
│   └── ToastContainer.tsx          # Container thông báo
├── constants/
│   └── customerConstants.ts        # Constants và mock data
├── hooks/
│   ├── useCustomerManagement.ts    # Hook quản lý state
│   └── useToast.ts                 # Hook quản lý toast
├── CustomerManagement.tsx          # Component chính
├── CustomerManagement.module.scss  # Styles chính
├── CustomerDetailModal.module.scss # Styles modal chi tiết
├── RoleAssignmentModal.module.scss # Styles modal phân quyền
├── Toast.module.scss               # Styles toast
├── index.ts                        # Export file
└── README.md                       # Tài liệu này
```

## Cách sử dụng

### 1. Import component
```tsx
import CustomerManagement from '../../component/admin/customers/CustomerManagement';
```

### 2. Sử dụng trong trang admin
```tsx
// src/pages/admin/customers.tsx
import React from 'react';
import AdminLayout from '../../component/admin/AdminLayout';
import CustomerManagement from '../../component/admin/customers/CustomerManagement';

const AdminCustomersPage: React.FC = () => {
  return (
    <AdminLayout currentPage="/admin/customers">
      <CustomerManagement />
    </AdminLayout>
  );
};
```

### 3. Truy cập trang
- URL: `/admin/customers`
- Menu: "Quản lý khách hàng" trong admin sidebar

## API Integration

Hiện tại sử dụng mock data. Để tích hợp với API thực:

1. **Thay thế mock data** trong `customerConstants.ts`
2. **Cập nhật hooks** để gọi API thay vì xử lý local state
3. **Thêm error handling** cho các API calls
4. **Implement real-time updates** nếu cần

## Responsive Design

- **Desktop**: Layout đầy đủ với tất cả cột
- **Tablet**: Bảng có thể scroll ngang
- **Mobile**: Layout stack, modal fullscreen

## Dependencies

- React 18+
- FontAwesome Icons
- SCSS Modules
- TypeScript

## Customization

### Thay đổi số items per page
```tsx
const { ... } = useCustomerManagement({
  initialCustomers: MOCK_CUSTOMERS,
  itemsPerPage: 20 // Thay đổi từ 10 thành 20
});
```

### Thêm cột mới vào bảng
1. Cập nhật `CustomerTableColumn` interface
2. Thêm cột vào `CUSTOMER_TABLE_COLUMNS`
3. Cập nhật render logic trong `CustomerTable.tsx`

### Thêm filter mới
1. Cập nhật `CustomerFilters` interface
2. Thêm UI trong `CustomerFilters.tsx`
3. Cập nhật logic filter trong `useCustomerManagement.ts`
