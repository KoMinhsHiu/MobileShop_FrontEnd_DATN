# Orders Module

Thư mục này chứa tất cả các file liên quan đến chức năng đơn hàng của ứng dụng.

## Cấu trúc thư mục

```
src/pages/orders/
├── index.tsx              # Trang danh sách đơn hàng (dạng bảng)
├── [id].tsx              # Trang chi tiết đơn hàng với timeline
├── success.tsx           # Trang thành công đặt hàng
├── mockData.ts           # Mock data và cấu hình chung
├── utils.ts              # Utility functions
├── orders.module.scss    # Styles cho trang danh sách đơn hàng
├── success.module.scss   # Styles cho trang thành công
└── README.md            # File này

src/component/order/
├── orderStatusBadge/     # Component hiển thị trạng thái đơn hàng
├── orderTable/          # Component bảng danh sách đơn hàng
├── orderTimeline/       # Component timeline trạng thái
├── orderItemsList/      # Component danh sách sản phẩm
├── orderSummary/        # Component tổng kết đơn hàng
└── orderInfo/           # Component thông tin đơn hàng và người nhận
```

## Các trang và chức năng

### 1. Danh sách đơn hàng (`/orders`)
- **File**: `index.tsx`
- **URL**: `http://localhost:3000/orders`
- **Chức năng**:
  - Hiển thị danh sách đơn hàng dạng bảng
  - Lọc đơn hàng theo trạng thái
  - Nút "Xem chi tiết" để chuyển đến trang chi tiết

### 2. Chi tiết đơn hàng (`/orders/[id]`)
- **File**: `[id].tsx`
- **URL**: `http://localhost:3000/orders/1` (với ID cụ thể)
- **Chức năng**:
  - Hiển thị thông tin chi tiết đơn hàng
  - Timeline trạng thái đơn hàng
  - Thông tin người nhận và sản phẩm
  - Tổng tiền và phương thức thanh toán

### 3. Trang thành công (`/orders/success`)
- **File**: `success.tsx`
- **URL**: `http://localhost:3000/orders/success`
- **Chức năng**:
  - Hiển thị thông báo đặt hàng thành công
  - Mã đơn hàng và thời gian đặt
  - Nút chuyển hướng về trang chủ hoặc xem đơn hàng
  - Auto redirect sau 10 giây

## Components

Các component được tách ra để tái sử dụng:

### OrderStatusBadge
- Hiển thị trạng thái đơn hàng với màu sắc và icon
- Props: `status`, `statusConfig`

### OrderTable
- Bảng danh sách đơn hàng với responsive design
- Props: `orders`

### OrderTimeline
- Timeline trạng thái đơn hàng với animation
- Props: `status`

### OrderItemsList
- Danh sách sản phẩm trong đơn hàng
- Props: `items`

### OrderSummary
- Tổng kết đơn hàng với breakdown chi tiết
- Props: `summary`, `paymentMethod`

### OrderInfo
- Thông tin đơn hàng và người nhận
- Props: `order`

## Types và Interfaces

Các types liên quan đến đơn hàng được định nghĩa trong:
- `src/utils/type/order.ts`

## Mock Data

Mock data được tập trung trong:
- `src/pages/orders/mockData.ts` - Mock orders và cấu hình
- `src/pages/orders/utils.ts` - Utility functions

Trong tương lai có thể:
- Kết nối với API thực tế
- Sử dụng state management (Redux, Zustand, etc.)

## Responsive Design

Tất cả các trang đều được thiết kế responsive cho:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Styling

Sử dụng SCSS modules với:
- BEM naming convention
- CSS Grid và Flexbox
- CSS animations và transitions
- Responsive breakpoints
