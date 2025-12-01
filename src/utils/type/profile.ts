export interface UserProfile {
  fullName: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  gender?: 'male' | 'female' | 'unknown';
  avatar?: string;
  dateOfBirth?: string;
  pointsBalance?: number;
}

export interface PointHistory {
  id: number;
  customerId: number;
  type: 'earn' | 'redeem' | 'refund';
  moneyValue: number;
  points: number;
  createdAt: string;
  orderCode: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ProfileTab = 'personal' | 'address' | 'point' | 'password';
