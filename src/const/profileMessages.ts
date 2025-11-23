export const PROFILE_MESSAGES = {
  SUCCESS: {
    UPDATE_INFO: 'Cập nhật thông tin thành công!',
    CHANGE_PASSWORD: 'Đổi mật khẩu thành công!',
    LOGOUT: 'Đăng xuất thành công!'
  },
  ERROR: {
    UPDATE_INFO: 'Có lỗi xảy ra khi cập nhật thông tin!',
    CHANGE_PASSWORD: 'Có lỗi xảy ra khi đổi mật khẩu!',
    PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp!',
    PASSWORD_TOO_SHORT: 'Mật khẩu mới phải có ít nhất 6 ký tự!'
  },
  INFO: {
    FEATURE_DEVELOPING: 'Tính năng đang phát triển'
  },
  LOADING: {
    UPDATE_INFO: 'Đang cập nhật...',
    CHANGE_PASSWORD: 'Đang đổi mật khẩu...'
  }
} as const;
