# Product Management System

Hệ thống quản lý sản phẩm cho Admin Dashboard với đầy đủ các tính năng CRUD và quản lý biến thể sản phẩm.

## Các Component

### 1. ProductManagement
Component chính hiển thị danh sách sản phẩm và các chức năng quản lý.

**Tính năng:**
- Hiển thị danh sách sản phẩm dạng bảng với phân trang
- Tìm kiếm theo tên sản phẩm
- Lọc theo danh mục, nhà cung cấp và trạng thái
- Sắp xếp theo ngày tạo hoặc số lượng tồn
- Thêm/sửa/xóa sản phẩm
- Xem chi tiết biến thể sản phẩm
- Responsive design (mobile chỉ hiển thị tên + trạng thái + nút "Chi tiết")

### 2. ProductForm
Modal form để thêm hoặc chỉnh sửa sản phẩm với quản lý biến thể.

**Phần 1 - Thông tin sản phẩm chính:**
- Tên sản phẩm (bắt buộc)
- Mô tả sản phẩm (bắt buộc)
- Danh mục (dropdown)
- Nhà cung cấp (dropdown)
- Ảnh đại diện (upload)
- Trạng thái (radio: Hiển thị/Ẩn)

**Phần 2 - Biến thể sản phẩm:**
- Bảng có thể thêm/xóa dòng động
- Màu sắc (dropdown)
- Dung lượng (dropdown)
- Giá (bắt buộc)
- Số lượng (bắt buộc)
- Ảnh biến thể (upload nhiều ảnh tùy chọn)
- Nút "+ Thêm biến thể" để thêm dòng mới

**Validation:**
- Kiểm tra các trường bắt buộc
- Validate giá và số lượng cho từng biến thể
- Ít nhất một biến thể sản phẩm
- Preview ảnh đại diện trước khi lưu

### 3. ProductVariantsModal
Modal hiển thị chi tiết tất cả biến thể của sản phẩm.

**Tính năng:**
- Hiển thị thông tin sản phẩm chính
- Bảng danh sách tất cả biến thể với ảnh, màu sắc, dung lượng, giá, số lượng
- Tóm tắt thống kê: tổng biến thể, tổng số lượng, khoảng giá
- Responsive design

### 4. DeleteConfirmModal
Modal xác nhận trước khi xóa sản phẩm.

**Tính năng:**
- Hiển thị thông tin sản phẩm sẽ bị xóa
- Cảnh báo về hậu quả của việc xóa
- Xác nhận hoặc hủy bỏ

## Cách sử dụng

### Truy cập trang
```
/admin/products
```

### Thêm sản phẩm mới
1. Click nút "Thêm sản phẩm mới"
2. Điền đầy đủ thông tin trong form
3. Upload hình ảnh (tùy chọn)
4. Click "Lưu sản phẩm"

### Chỉnh sửa sản phẩm
1. Click nút ✏️ (Edit) trong cột "Thao tác"
2. Chỉnh sửa thông tin cần thiết
3. Click "Cập nhật"

### Xóa sản phẩm
1. Click nút 🗑️ (Delete) trong cột "Thao tác"
2. Xác nhận trong popup
3. Sản phẩm sẽ bị xóa vĩnh viễn

### Tìm kiếm và lọc
- **Tìm kiếm:** Nhập tên sản phẩm vào ô tìm kiếm
- **Lọc danh mục:** Chọn danh mục từ dropdown
- **Lọc nhà cung cấp:** Chọn nhà cung cấp từ dropdown
- **Lọc trạng thái:** Chọn "Hiển thị" hoặc "Ẩn"
- **Sắp xếp:** Chọn theo ngày tạo hoặc số lượng tồn (tăng/giảm dần)

### Xem biến thể sản phẩm
1. Click nút 👁️ (Xem) trong cột "Hành động"
2. Modal sẽ hiển thị tất cả biến thể của sản phẩm
3. Xem thống kê tổng quan về sản phẩm

## Cấu trúc dữ liệu

### Product Interface
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  status: 'visible' | 'hidden';
  mainImage: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
```

### ProductVariant Interface
```typescript
interface ProductVariant {
  id: string;
  color: string;
  storage: string;
  price: number;
  quantity: number;
  images?: (File | string)[];
}
```

### ProductFormData Interface
```typescript
interface ProductFormData {
  name: string;
  description: string;
  category: string;
  supplier: string;
  status: 'visible' | 'hidden';
  mainImage: File | string;
  variants: ProductVariant[];
}
```

## Responsive Design

- **Desktop:** Hiển thị đầy đủ bảng với tất cả cột
- **Tablet:** Thu gọn một số cột, giữ nguyên chức năng
- **Mobile:** Chỉ hiển thị ảnh, tên sản phẩm, trạng thái và nút "Chi tiết"

## Styling

Sử dụng SCSS modules với:
- Gradient backgrounds
- Box shadows
- Smooth transitions
- Hover effects
- Color-coded status indicators

## Tương lai

Các tính năng có thể mở rộng:
- Export/Import dữ liệu
- Bulk operations (xóa nhiều, cập nhật trạng thái)
- Advanced filters (giá, ngày tạo, v.v.)
- Drag & drop để sắp xếp hình ảnh
- Upload nhiều ảnh cho từng biến thể
- Quản lý inventory cho từng biến thể
- Báo cáo thống kê sản phẩm
