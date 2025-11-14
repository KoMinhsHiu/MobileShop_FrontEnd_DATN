import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/component/common/ToastContainer';
import styles from '../AdminProfile.module.scss';

interface AdminData {
  id: number;
  username: string;
  email: string;
  phone: string;
  roleId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface PersonalInfoProps {
  adminData: AdminData | null;
  error: string | null;
  isLoading: boolean;
  onUpdateProfile: (username: string) => Promise<void>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  adminData,
  error,
  isLoading,
  onUpdateProfile
}) => {
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(adminData?.username || '');
  const [updateLoading, setUpdateLoading] = useState(false);
  const { showSuccess, showError, ToastContainer } = useToast();

  // Update local username when adminData changes
  React.useEffect(() => {
    if (adminData?.username) {
      setNewUsername(adminData.username);
    }
  }, [adminData?.username]);

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      showError('Tên đăng nhập không được để trống');
      return;
    }

    if (newUsername === adminData?.username) {
      setEditingUsername(false);
      return;
    }

    try {
      setUpdateLoading(true);
      await onUpdateProfile(newUsername);
      setEditingUsername(false);
      showSuccess('Cập nhật tên đăng nhập thành công!');
    } catch (error: any) {
      showError(error.message || 'Cập nhật thất bại');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setNewUsername(adminData?.username || '');
    setEditingUsername(false);
  };

  if (!adminData) {
    return (
      <div className={styles.personalInfo}>
        <div className={styles.section}>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.personalInfo}>
      <div className={styles.section}>
        <h2>Thông tin cá nhân</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            <p>❌ {error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="username">Tên đăng nhập *</label>
            <div className={styles.editableField}>
              {editingUsername ? (
                <>
                  <input
                    type="text"
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className={styles.input}
                    placeholder="Nhập tên đăng nhập"
                    disabled={updateLoading}
                    autoFocus
                  />
                  <div className={styles.editActions}>
                    <button 
                      className={styles.saveBtn}
                      onClick={handleUsernameUpdate}
                      disabled={updateLoading}
                    >
                      <FontAwesomeIcon icon={faSave} />
                      {updateLoading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button 
                      className={styles.cancelBtn}
                      onClick={handleCancelEdit}
                      disabled={updateLoading}
                    >
                      Hủy
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={adminData.username}
                    className={`${styles.input} ${styles.readonly}`}
                    readOnly
                  />
                  <button 
                    className={styles.editBtn}
                    onClick={() => setEditingUsername(true)}
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Sửa
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={adminData.email}
              className={`${styles.input} ${styles.disabled}`}
              readOnly
              disabled
            />
            <small className={styles.helpText}>Email không thể thay đổi</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              value={adminData.phone || 'Chưa cập nhật'}
              className={`${styles.input} ${styles.disabled}`}
              readOnly
              disabled
            />
            <small className={styles.helpText}>Số điện thoại không thể thay đổi</small>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PersonalInfo;
