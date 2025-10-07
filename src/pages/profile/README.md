# Profile Page

Trang quản lý tài khoản người dùng với các chức năng chính:

## Cấu trúc thư mục

```
src/pages/profile/
├── index.tsx                 # Component chính của trang profile
├── profile.module.scss       # Styles cho trang profile
├── profile.types.ts          # TypeScript types và interfaces
├── hooks/
│   └── useProfile.ts         # Custom hook cho profile logic
├── constants/
│   └── profileMessages.ts    # Constants cho messages
└── README.md                # File này

src/component/profile/
├── personalInfo/             # Component thông tin cá nhân
│   ├── index.tsx
│   └── personalInfo.module.scss
├── changePassword/           # Component đổi mật khẩu
│   ├── index.tsx
│   └── changePassword.module.scss
├── additionalOptions/        # Component tùy chọn bổ sung
│   ├── index.tsx
│   └── additionalOptions.module.scss
└── tabNavigation/            # Component navigation tabs
    ├── index.tsx
    └── tabNavigation.module.scss
```

## Tính năng

### 1. Thông tin cá nhân (Personal Info)
- Họ tên (có thể chỉnh sửa)
- Email (không thể chỉnh sửa)
- Số điện thoại
- Địa chỉ mặc định
- Upload/đổi ảnh đại diện
- Nút cập nhật thông tin

### 2. Đổi mật khẩu (Change Password)
- Mật khẩu hiện tại
- Mật khẩu mới
- Xác nhận mật khẩu mới
- Validation mật khẩu
- Nút đổi mật khẩu

### 3. Tùy chọn bổ sung (Additional Options)
- Xem lịch sử đăng nhập
- Quản lý phương thức thanh toán
- Các tùy chọn khác

## Cách sử dụng

1. Truy cập `/profile`
2. Nếu chưa đăng nhập, sẽ tự động chuyển đến trang login
3. Sử dụng các tab để chuyển đổi giữa các chức năng
4. Cập nhật thông tin và lưu thay đổi

## Tích hợp

- Sử dụng `AuthContext` để quản lý thông tin người dùng
- Tích hợp với `react-hot-toast` cho notifications
- Responsive design cho mobile và desktop
- TypeScript support đầy đủ

## API Endpoints (Mock)

- `PUT /api/profile` - Cập nhật thông tin cá nhân
- `PUT /api/profile/password` - Đổi mật khẩu
- `POST /api/profile/avatar` - Upload ảnh đại diện
