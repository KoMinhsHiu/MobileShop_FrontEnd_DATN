export interface UserProfile {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  dateOfBirth?: string;
  pointsBalance?: number;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ProfileTab = 'personal' | 'password';
