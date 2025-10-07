# LoginSignup Pages

Thư mục chứa các trang đăng nhập và đăng ký của ứng dụng PhoneHub.

## Cấu trúc

```
LoginSignup/
├── login.tsx              # Trang đăng nhập (sử dụng AuthLayout + LoginForm)
├── register.tsx           # Trang đăng ký (sử dụng AuthLayout + RegisterForm)
└── README.md             # Tài liệu này

src/component/auth/
├── AuthLayout.tsx         # Layout chung cho auth pages
├── LoginForm.tsx          # Form đăng nhập
├── RegisterForm.tsx       # Form đăng ký
├── auth.module.scss       # CSS styles chung
└── index.ts              # Export components
```

## Tính năng

### Trang đăng nhập (`/LoginSignup/login`)
- Form đăng nhập với username và password
- Thông tin demo: username: `user`, password: `user123`
- Nút hiện/ẩn mật khẩu
- Đăng nhập nhanh bằng Google/Facebook (placeholder)
- Link chuyển đến trang đăng ký
- Link quên mật khẩu (placeholder)

### Trang đăng ký (`/LoginSignup/register`)
- Form đăng ký với các trường: họ tên, email, username, mật khẩu, xác nhận mật khẩu
- Validation cơ bản cho mật khẩu khớp
- Đăng ký nhanh bằng Google/Facebook (placeholder)
- Link chuyển đến trang đăng nhập

## Architecture

### Component-based Design
- **AuthLayout**: Layout chung với logo, title, subtitle và demo info
- **LoginForm**: Form đăng nhập với validation và social login
- **RegisterForm**: Form đăng ký với validation và social login

### Separation of Concerns
- **Pages**: Chỉ chứa logic routing và authentication state
- **Components**: Chứa UI logic và form handling
- **Styles**: Tập trung trong `auth.module.scss`

## Styling

- Sử dụng `auth.module.scss` cho tất cả auth components
- Responsive design cho mobile và desktop
- Gradient background đẹp mắt
- Animation slideUp khi load trang
- Custom layout không có header/footer

## Authentication

- Sử dụng `AuthContext` để quản lý trạng thái đăng nhập
- Lưu trữ thông tin user trong localStorage
- Auto-redirect khi đã đăng nhập
- Toast notifications cho feedback

## URLs

- Đăng nhập: `/LoginSignup/login`
- Đăng ký: `/LoginSignup/register`

## Tương lai

- Implement đăng nhập Google/Facebook
- Implement chức năng quên mật khẩu
- Implement đăng ký thực tế với API
- Thêm validation nâng cao
