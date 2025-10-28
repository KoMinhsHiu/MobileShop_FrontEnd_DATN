// Validation utilities for forms

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateDateOfBirth = (dateOfBirth: string): boolean => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 13; // At least 13 years old
  }
  return age >= 13;
};

export const validateRegisterForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
}): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!formData.firstName.trim()) {
    errors.push('Tên là bắt buộc');
  }

  if (!formData.lastName.trim()) {
    errors.push('Họ là bắt buộc');
  }

  if (!formData.email.trim()) {
    errors.push('Email là bắt buộc');
  } else if (!validateEmail(formData.email)) {
    errors.push('Email không hợp lệ');
  }

  if (!formData.username.trim()) {
    errors.push('Tên đăng nhập là bắt buộc');
  } else if (!validateUsername(formData.username)) {
    errors.push('Tên đăng nhập phải có 3-20 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới');
  }

  if (!formData.password) {
    errors.push('Mật khẩu là bắt buộc');
  } else if (!validatePassword(formData.password)) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
  }

  if (!formData.confirmPassword) {
    errors.push('Xác nhận mật khẩu là bắt buộc');
  } else if (formData.password !== formData.confirmPassword) {
    errors.push('Mật khẩu xác nhận không khớp');
  }

  if (!formData.phone.trim()) {
    errors.push('Số điện thoại là bắt buộc');
  } else if (!validatePhone(formData.phone)) {
    errors.push('Số điện thoại phải có 10-11 chữ số');
  }

  if (!formData.dateOfBirth) {
    errors.push('Ngày sinh là bắt buộc');
  } else if (!validateDateOfBirth(formData.dateOfBirth)) {
    errors.push('Bạn phải ít nhất 13 tuổi để đăng ký');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
