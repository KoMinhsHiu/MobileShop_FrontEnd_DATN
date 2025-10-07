import React from 'react';
import { UserProfile } from '@/pages/profile/profile.types';
import { PROFILE_MESSAGES } from '@/pages/profile/constants/profileMessages';
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
  onAvatarUpload,
  onUpdate
}) => {
  return (
    <div className={styles.personalInfoContainer}>
      <div className={styles.section}>
        <h2>Thông tin cá nhân</h2>
        
        {/* Avatar Upload */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <img
              src={personalInfo.avatar || '/images/logo.png'}
              alt="Avatar"
              className={styles.avatar}
            />
            <input
              type="file"
              accept="image/*"
              onChange={onAvatarUpload}
              className={styles.avatarInput}
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className={styles.avatarLabel}>
              Đổi ảnh đại diện
            </label>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Họ tên *</label>
          <input
            type="text"
            id="fullName"
            value={personalInfo.fullName}
            onChange={(e) => onFieldChange('fullName', e.target.value)}
            className={styles.input}
            placeholder="Nhập họ tên của bạn"
          />
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
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            className={styles.input}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Địa chỉ mặc định</label>
          <textarea
            id="address"
            value={personalInfo.address}
            onChange={(e) => onFieldChange('address', e.target.value)}
            className={styles.textarea}
            placeholder="Nhập địa chỉ mặc định"
            rows={3}
          />
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
