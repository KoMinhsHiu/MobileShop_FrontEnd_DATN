import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSave } from '@fortawesome/free-solid-svg-icons';
import { PersonalInfoProps, AdminRole } from '../adminProfile.types';
import styles from '../AdminProfile.module.scss';

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  profile,
  errors,
  isLoading,
  onFieldChange,
  onAvatarUpload,
  onUpdate
}) => {
  return (
    <div className={styles.personalInfo}>
      <div className={styles.section}>
        <h2>Thông tin cá nhân</h2>
        
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <img
              src={profile.avatar || '/images/logo.png'}
              alt="Admin Avatar"
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
              <FontAwesomeIcon icon={faCamera} />
              Đổi ảnh đại diện
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Họ tên *</label>
            <input
              type="text"
              id="fullName"
              value={profile.fullName}
              onChange={(e) => onFieldChange('fullName', e.target.value)}
              className={`${styles.input} ${errors.fullName ? styles.error : ''}`}
              placeholder="Nhập họ tên"
              disabled={isLoading}
            />
            {errors.fullName && (
              <small className={styles.errorText}>{errors.fullName}</small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              className={`${styles.input} ${styles.disabled}`}
              disabled
            />
            <small className={styles.helpText}>Email không thể thay đổi</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              value={profile.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              placeholder="Nhập số điện thoại"
              disabled={isLoading}
            />
            {errors.phone && (
              <small className={styles.errorText}>{errors.phone}</small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Vai trò</label>
            <select
              id="role"
              value={profile.role}
              onChange={(e) => onFieldChange('role', e.target.value)}
              className={styles.select}
              disabled={isLoading}
            >
              <option value={AdminRole.ADMIN}>{AdminRole.ADMIN}</option>
              <option value={AdminRole.SUPER_ADMIN}>{AdminRole.SUPER_ADMIN}</option>
            </select>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={styles.updateButton}
            onClick={onUpdate}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faSave} />
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
