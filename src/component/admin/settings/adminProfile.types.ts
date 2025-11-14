export enum ProfileTab {
  PERSONAL = 'personal',
  PASSWORD = 'password',
  ACCOUNT = 'account',
  NOTIFICATION = 'notification'
}

// Main interfaces
export interface AdminProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  lastChangePass?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Form validation interfaces
export interface FormErrors {
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface PersonalInfoProps {
  profile: AdminProfile;
  errors: FormErrors;
  isLoading: boolean;
  onFieldChange: (field: keyof AdminProfile, value: string) => void;
  onUpdate: () => void;
}

export interface ChangePasswordProps {
  passwordData: ChangePasswordData;
  errors: FormErrors;
  isLoading: boolean;
  showPasswords: PasswordVisibility;
  onPasswordChange: (field: keyof ChangePasswordData, value: string) => void;
  onToggleVisibility: (field: keyof PasswordVisibility) => void;
  onChangePassword: () => void;
}

export interface TabNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

// Utility types
export interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export interface TabConfig {
  id: ProfileTab;
  label: string;
  icon: any; // FontAwesome icon type
}

export interface UpdateProfileRequest {
  username: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
