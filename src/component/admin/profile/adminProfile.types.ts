// Enums
export enum AdminRole {
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Super Admin'
}

export enum ProfileTab {
  PERSONAL = 'personal',
  PASSWORD = 'password',
  ACTIVITY = 'activity'
}

// Main interfaces
export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: AdminRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// Form validation interfaces
export interface FormErrors {
  fullName?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Component props interfaces
export interface AdminProfileProps {
  // Future props can be added here
}

export interface PersonalInfoProps {
  profile: AdminProfile;
  errors: FormErrors;
  isLoading: boolean;
  onFieldChange: (field: keyof AdminProfile, value: string) => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

export interface ActivityLogProps {
  logs: ActivityLog[];
  isLoading: boolean;
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

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FormErrors;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  role: AdminRole;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
