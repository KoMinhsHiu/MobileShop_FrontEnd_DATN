import React from 'react';
import { UserProfile } from '@/utils/type/profile';
import { PROFILE_MESSAGES } from '@/const/profileMessages';
import styles from './personalInfo.module.scss';

interface PersonalInfoProps {
  personalInfo: UserProfile;
  isLoading: boolean;
  onFieldChange: (field: keyof UserProfile, value: string) => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  isLoading,
  onFieldChange,
  onUpdate
}) => {
  return (
    <div className={styles.personalInfoContainer}>
      <div className={styles.section}>
        <h2>Thông tin cá nhân</h2>

        {/* Personal Info Form */}
        <div className={styles.formGroup}>
          <label htmlFor="firstName">Tên *</label>
          <input
            type="text"
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            className={styles.input}
            placeholder="Nhập tên của bạn"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">Họ *</label>
          <input
            type="text"
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            className={styles.input}
            placeholder="Nhập họ của bạn"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="username">Tên đăng nhập *</label>
          <input
            type="text"
            id="username"
            value={personalInfo.username}
            onChange={(e) => onFieldChange('username', e.target.value)}
            className={styles.input}
            placeholder="Nhập tên đăng nhập của bạn"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="gender">Giới tính</label>
          <select
            id="gender" 
            value={personalInfo.gender || ''}
            onChange={(e) => onFieldChange('gender', e.target.value)}
            className={styles.selectInput}
          >
            <option value="" disabled>-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="unknown">Khác</option>
          </select>
        </div>


        <div className={styles.formGroup}>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={personalInfo.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            className={`${styles.input} ${styles.disabled}`}
            placeholder="Email của bạn"
            disabled
          />
          <small className={styles.helpText}>Email không thể thay đổi</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Số điện thoại *</label>
          <input
            type="tel"
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            className={`${styles.input} ${styles.disabled}`}
            placeholder="Nhập số điện thoại"
            disabled
          />
          <small className={styles.helpText}>Số điện thoại không thể thay đổi</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dateOfBirth">Ngày sinh *</label>
          <input
            type="date"
            id="dateOfBirth"
            value={personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth).toISOString().split('T')[0] : ''}
            onChange={(e) => onFieldChange('dateOfBirth', e.target.value)}
            className={`${styles.input} ${styles.disabled}`}
            disabled
          />
          <small className={styles.helpText}>Ngày sinh không thể thay đổi</small>
        </div>

        <button
          onClick={onUpdate}
          disabled={isLoading}
          className={styles.updateButton}
        >
          {isLoading ? PROFILE_MESSAGES.LOADING.UPDATE_INFO : 'Cập nhật thông tin'}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
