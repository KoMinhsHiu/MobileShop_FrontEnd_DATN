# Mock Data Documentation

## Tổng quan
Thư mục này chứa dữ liệu mẫu cho ứng dụng e-commerce, bao gồm sản phẩm của các hãng điện thoại khác nhau.

## Cấu trúc dữ liệu

### 1. `mockData.ts`
Chứa dữ liệu sản phẩm mẫu cho 8 hãng điện thoại:

#### Các hãng được hỗ trợ:
- **Apple**: iPhone 15 series, iPhone 14 series, iPhone 13
- **Samsung**: Galaxy S24 series, Galaxy Z Fold/Flip, Galaxy A series
- **Xiaomi**: Mi 14 series, Redmi Note series, Redmi series
- **OPPO**: Find X7 series, Reno 11 series, A series
- **Vivo**: X100 series, V30 series, Y series
- **Huawei**: Mate 60 series, P60 series, Nova series
- **OnePlus**: OnePlus 12 series, OnePlus 11 series, Nord series
- **Realme**: GT 5 series, Realme 12 series, C series

#### Cấu trúc sản phẩm:
```typescript
interface CategoryProducts {
  id_product: string;        // ID duy nhất của sản phẩm
  name: string;             // Tên sản phẩm
  price: string;            // Giá (định dạng VND)
  cover: { url: string };   // URL hình ảnh
  discount_amount: number;  // Số tiền giảm giá
  quantity: number;         // Số lượng tồn kho
  rate: string;            // Đánh giá (1-5)
}
```

### 2. `mockCategoryData.ts`
Chứa dữ liệu mẫu cho trang category, bao gồm:
- Danh sách sản phẩm
- Tùy chọn sắp xếp
- Bộ lọc (giá, màu sắc, bộ nhớ)
- Thông tin phân trang

## Cách sử dụng

### Import dữ liệu sản phẩm:
```typescript
import { appleProducts, samsungProducts, getProductsByBrand } from '@/const/mockData';

// Lấy sản phẩm của một hãng cụ thể
const applePhones = appleProducts;

// Lấy sản phẩm theo tên hãng
const xiaomiPhones = getProductsByBrand('xiaomi');
```

### Import dữ liệu category:
```typescript
import { appleCategoryData, getCategoryDataByBrand } from '@/const/mockCategoryData';

// Lấy dữ liệu category cho Apple
const appleCategory = appleCategoryData;

// Lấy dữ liệu category theo tên hãng
const samsungCategory = getCategoryDataByBrand('samsung');
```

## Lưu ý

1. **Hình ảnh**: Các URL hình ảnh trong dữ liệu mẫu là đường dẫn giả định. Trong thực tế, cần thay thế bằng URL hình ảnh thật.

2. **Giá cả**: Giá được định dạng theo VND (Việt Nam Đồng) và có thể cần điều chỉnh theo thị trường thực tế.

3. **Số lượng**: Số lượng tồn kho là dữ liệu mẫu và cần được cập nhật từ hệ thống quản lý kho.

4. **Đánh giá**: Đánh giá sản phẩm từ 1-5 sao, có thể được cập nhật từ hệ thống đánh giá thực tế.

## Mở rộng

Để thêm hãng mới hoặc sản phẩm mới:

1. Thêm dữ liệu sản phẩm vào `mockData.ts`
2. Cập nhật `allBrandProducts` object
3. Thêm dữ liệu category tương ứng vào `mockCategoryData.ts`
4. Cập nhật `allCategoryData` object

## Ví dụ thêm hãng mới:

```typescript
// Trong mockData.ts
export const newBrandProducts: CategoryProducts[] = [
  {
    id_product: "newbrand-001",
    name: "New Brand Phone",
    price: "10.990.000",
    cover: { url: "/images/products/newbrand/phone.jpg" },
    discount_amount: 0,
    quantity: 30,
    rate: "4.5"
  }
];

// Cập nhật allBrandProducts
export const allBrandProducts = {
  // ... existing brands
  newbrand: newBrandProducts
};
```
