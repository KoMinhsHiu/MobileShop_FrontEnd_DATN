import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Customer, UserRole } from '../../../admin.types';
import { ROLE_OPTIONS } from '../constants/customerConstants';
import styles from '../RoleAssignmentModal.module.scss';

interface RoleAssignmentModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerId: string, newRole: UserRole) => void;
}

const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  useEffect(() => {
    if (customer) {
      setSelectedRole(customer.role);
    }
  }, [customer]);

  if (!isOpen || !customer) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (selectedRole !== customer.role) {
      onSave(customer.id, selectedRole);
    }
    onClose();
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const isRoleChanged = selectedRole !== customer.role;
  const isCurrentUserAdmin = customer.role === 'admin';

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Phân quyền người dùng</h2>
          
          <div className={styles.customerInfo}>
            {customer.avatar ? (
              <img 
                src={customer.avatar} 
                alt={customer.name}
                className={styles.customerAvatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                👤
              </div>
            )}
            <div className={styles.customerDetails}>
              <h3 className={styles.customerName}>{customer.name}</h3>
              <p className={styles.customerEmail}>{customer.email}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Current Role */}
          <div className={styles.currentRole}>
            <div className={styles.currentRoleLabel}>Quyền hiện tại</div>
            <div className={styles.currentRoleValue}>
              <span className={styles.roleIcon}>
                {ROLE_OPTIONS.find(role => role.value === customer.role)?.icon}
              </span>
              {ROLE_OPTIONS.find(role => role.value === customer.role)?.label}
            </div>
          </div>

          {/* Role Selection */}
          <div className={styles.roleSelection}>
            <div className={styles.roleSelectionLabel}>
              Chọn quyền mới
            </div>
            <div className={styles.roleOptions}>
              {ROLE_OPTIONS.map((role) => (
                <div
                  key={role.value}
                  className={`${styles.roleOption} ${selectedRole === role.value ? styles.selected : ''}`}
                  onClick={() => handleRoleSelect(role.value as UserRole)}
                >
                  <div className={styles.roleHeader}>
                    <span className={styles.roleIcon}>{role.icon}</span>
                    <span className={styles.roleTitle}>{role.label}</span>
                  </div>
                  <div className={styles.roleDescription}>
                    {role.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning for Admin role */}
          {selectedRole === 'admin' && customer.role !== 'admin' && (
            <div className={styles.warning}>
              <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
              <p className={styles.warningText}>
                <strong>Cảnh báo:</strong> Cấp quyền Admin sẽ cho phép người dùng này truy cập vào tất cả chức năng quản trị. 
                Hãy đảm bảo bạn tin tưởng người dùng này.
              </p>
            </div>
          )}

          {/* Warning for removing Admin role */}
          {isCurrentUserAdmin && selectedRole !== 'admin' && (
            <div className={styles.warning}>
              <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
              <p className={styles.warningText}>
                <strong>Cảnh báo:</strong> Thu hồi quyền Admin sẽ hạn chế quyền truy cập của người dùng này vào hệ thống quản trị.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button 
            className={`${styles.btn} ${styles['btn-secondary']}`} 
            onClick={onClose}
          >
            Hủy
          </button>
          <button 
            className={`${styles.btn} ${styles['btn-primary']}`}
            onClick={handleSave}
            disabled={!isRoleChanged}
          >
            💾 Lưu quyền
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentModal;
