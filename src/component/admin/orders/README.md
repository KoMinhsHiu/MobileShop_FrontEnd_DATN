# Order Management System

Hệ thống quản lý đơn hàng cho admin dashboard với đầy đủ tính năng CRUD, filtering, sorting và real-time updates.

## 🏗️ Cấu trúc thư mục

```
src/component/admin/orders/
├── components/           # UI Components
│   ├── OrderTable.tsx   # Bảng danh sách đơn hàng
│   ├── OrderFilters.tsx # Bộ lọc đơn hàng
│   ├── ErrorBoundary.tsx # Error boundary component
│   ├── ErrorDisplay.tsx # Hiển thị lỗi
│   ├── LoadingSpinner.tsx # Loading spinner
│   └── SEOHead.tsx      # SEO meta tags
├── constants/           # Constants và configuration
│   └── orderConstants.ts
├── hooks/              # Custom hooks
│   └── useOrderManagement.ts
├── services/           # API services
│   └── orderService.ts
├── styles/             # Shared styles
│   └── shared.scss
├── types/              # TypeScript types
│   └── strictTypes.ts
├── utils/              # Utility functions
│   └── orderUtils.ts
├── OrderManagement.tsx # Main component
├── OrderDetailModal.tsx # Modal chi tiết đơn hàng
├── Toast.tsx           # Toast notification
├── ToastContainer.tsx  # Toast container
├── useToast.ts         # Toast hook
└── index.ts           # Export file
```

## 🚀 Tính năng chính

### ✅ Quản lý đơn hàng
- **Danh sách đơn hàng** với bảng responsive
- **Tìm kiếm** theo mã đơn, tên khách hàng, SĐT, email
- **Lọc** theo trạng thái, phương thức thanh toán, khoảng thời gian
- **Sắp xếp** theo ngày đặt, tổng tiền, trạng thái
- **Phân trang** với điều hướng thông minh

### ✅ Chi tiết đơn hàng
- **Modal chi tiết** với thông tin đầy đủ
- **Thông tin khách hàng**: Họ tên, SĐT, Email, địa chỉ
- **Danh sách sản phẩm**: Tên, biến thể, số lượng, giá
- **Tổng tiền** và phương thức thanh toán
- **Ghi chú** từ khách hàng và nội bộ

### ✅ Cập nhật trạng thái
- **Dropdown trạng thái**: Chờ xác nhận → Đang giao → Đã giao → Đã hủy
- **Ghi chú nội bộ** cho admin
- **Validation** và error handling
- **Real-time updates** với toast notifications

### ✅ UX/UI Features
- **Loading states** với spinner
- **Error handling** với retry mechanism
- **Toast notifications** cho feedback
- **Responsive design** cho mobile/tablet
- **Accessibility** với ARIA labels
- **SEO optimization** với meta tags

## 🛠️ Công nghệ sử dụng

- **React 18** với hooks và functional components
- **TypeScript** với strict mode
- **SCSS** với CSS modules và mixins
- **FontAwesome** cho icons
- **Custom hooks** cho state management
- **Error boundaries** cho error handling

## 📦 Cách sử dụng

### Import component chính

```tsx
import { OrderManagement } from '@/component/admin/orders';

// Sử dụng trong admin layout
<AdminLayout currentPage="/admin/orders">
  <OrderManagement />
</AdminLayout>
```

### Import các component riêng lẻ

```tsx
import { 
  OrderTable,
  OrderFiltersComponent,
  ErrorBoundary,
  useOrderManagement,
  OrderService
} from '@/component/admin/orders';
```

### Sử dụng custom hooks

```tsx
import { useOrderManagement, useToast } from '@/component/admin/orders';

const MyComponent = () => {
  const { orders, filters, updateOrder } = useOrderManagement({
    initialOrders: [],
    itemsPerPage: 10
  });
  
  const { showSuccess, showError } = useToast();
  
  // Sử dụng hooks...
};
```

## 🎨 Styling

### CSS Variables
```scss
:root {
  --order-primary: #3b82f6;
  --order-success: #10b981;
  --order-warning: #f59e0b;
  --order-error: #ef4444;
  // ... more variables
}
```

### Mixins
```scss
@mixin button-base {
  // Base button styles
}

@mixin card {
  // Card component styles
}

@mixin mobile {
  @media (max-width: 768px) {
    @content;
  }
}
```

## 🔧 API Integration

### OrderService
```tsx
// Cập nhật trạng thái đơn hàng
await OrderService.updateOrderStatus(orderId, status, notes);

// Lấy danh sách đơn hàng
const orders = await OrderService.getOrders();

// Lấy đơn hàng theo ID
const order = await OrderService.getOrderById(orderId);
```

### Error Handling
```tsx
try {
  await OrderService.updateOrderStatus(orderId, status);
  showSuccess('Cập nhật thành công');
} catch (error) {
  const errorMessage = handleApiError(error);
  showError('Cập nhật thất bại', errorMessage);
}
```

## 🧪 Testing

### Unit Tests
```tsx
// Test utility functions
import { formatCurrency, formatDate } from './utils/orderUtils';

test('formatCurrency formats correctly', () => {
  expect(formatCurrency(1000000)).toBe('1.000.000 ₫');
});

// Test hooks
import { renderHook } from '@testing-library/react';
import { useOrderManagement } from './hooks/useOrderManagement';

test('useOrderManagement initializes correctly', () => {
  const { result } = renderHook(() => useOrderManagement({
    initialOrders: mockOrders
  }));
  
  expect(result.current.orders).toEqual(mockOrders);
});
```

## 📱 Responsive Design

- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Optimized grid
- **Desktop**: > 1024px - Full feature layout

## ♿ Accessibility

- **ARIA labels** cho screen readers
- **Keyboard navigation** support
- **Focus management** trong modal
- **Color contrast** đạt WCAG AA
- **Semantic HTML** structure

## 🔒 Type Safety

### Strict Types
```tsx
// Sử dụng strict types
import { StrictOrder, StrictOrderStatus } from './types/strictTypes';

const updateOrder = (order: StrictOrder, status: StrictOrderStatus) => {
  // Type-safe operations
};
```

### Type Guards
```tsx
import { isOrderStatus, isPaymentMethod } from './types/strictTypes';

if (isOrderStatus(status)) {
  // status is now StrictOrderStatus
}
```

## 🚀 Performance

- **React.memo** cho components
- **useCallback** cho event handlers
- **useMemo** cho expensive calculations
- **Lazy loading** cho modal content
- **Debounced search** input

## 📈 Monitoring

- **Error tracking** với ErrorBoundary
- **Performance monitoring** với React DevTools
- **User analytics** với custom events
- **API monitoring** với retry logic

## 🔄 State Management

- **Local state** với useState/useReducer
- **Custom hooks** cho business logic
- **Context** cho global state (nếu cần)
- **Optimistic updates** cho better UX

## 📝 Best Practices

1. **Component composition** over inheritance
2. **Single responsibility** principle
3. **DRY** - Don't repeat yourself
4. **Type safety** với TypeScript
5. **Error handling** ở mọi level
6. **Accessibility** first approach
7. **Performance** optimization
8. **Code documentation** với JSDoc

## 🐛 Troubleshooting

### Common Issues

1. **Modal không đóng**: Kiểm tra event propagation
2. **Toast không hiện**: Kiểm tra z-index và positioning
3. **Filter không hoạt động**: Kiểm tra state updates
4. **Performance issues**: Sử dụng React DevTools Profiler

### Debug Tools

```tsx
// Debug mode
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Order state:', orders);
  console.log('Filters:', filters);
}
```

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [Performance Best Practices](https://reactjs.org/docs/optimizing-performance.html)
