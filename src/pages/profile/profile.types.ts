export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ProfileTab = 'personal' | 'password';
