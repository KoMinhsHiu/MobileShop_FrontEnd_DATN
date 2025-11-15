import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faEdit } from '@fortawesome/free-solid-svg-icons';
import { voucherAPI, UpdateVoucherRequest, Voucher } from '@/utils/api/voucher';
import styles from './VoucherForm.module.scss';
import { message } from 'antd';

interface UpdateVoucherFormProps {
  voucher: Voucher;
  onSave: () => void;
  onClose: () => void;
  onSuccess?: () => void;
}

interface UpdateVoucherFormData {
  title: string;
  description: string;
  endDate: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  endDate?: string;
}

const UpdateVoucherForm: React.FC<UpdateVoucherFormProps> = ({ voucher, onSave, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateVoucherFormData>({
    title: voucher.title,
    description: voucher.description,
    endDate: voucher.endDate ? voucher.endDate.split('T')[0] : ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof UpdateVoucherFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    const errorKey = field as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề voucher là bắt buộc.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả voucher là bắt buộc.';
    }

    // End date validation
    if (formData.endDate) {
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const requestData: UpdateVoucherRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        endDate: formData.endDate ? new Date(formData.endDate) : null
      };

      await voucherAPI.updateVoucher(voucher.id, requestData);
      
      // Call callbacks
      onSave();
      if (onSuccess) {
        onSuccess();
      }
      onClose();

    } catch (error: any) {
      console.error('Error updating voucher:', error);
      setSubmitError(error.message || 'Có lỗi xảy ra khi cập nhật voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '12px', color: '#8b5cf6' }} />
              Cập nhật Voucher
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Thông tin voucher hiển thị (readonly) */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin voucher</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mã voucher</label>
                  <input
                    type="text"
                    value={voucher.code}
                    className={styles.input}
                    disabled
                    style={{ background: '#f3f4f6', color: '#6b7280' }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Loại giảm giá</label>
                  <input
                    type="text"
                    value={voucher.discountType === 'percent' ? 'Phần trăm (%)' : 'Số tiền cố định (VND)'}
                    className={styles.input}
                    disabled
                    style={{ background: '#f3f4f6', color: '#6b7280' }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Giá trị giảm giá</label>
                  <input
                    type="text"
                    value={voucher.discountType === 'percent' ? `${voucher.discountValue}%` : `${voucher.discountValue.toLocaleString('vi-VN')}đ`}
                    className={styles.input}
                    disabled
                    style={{ background: '#f3f4f6', color: '#6b7280' }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={voucher.startDate.split('T')[0]}
                    className={styles.input}
                    disabled
                    style={{ background: '#f3f4f6', color: '#6b7280' }}
                  />
                </div>
              </div>
            </div>

            {/* Thông tin có thể chỉnh sửa */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin chỉnh sửa</h3>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    Tiêu đề voucher <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`${styles.input} ${errors.title ? styles.error : ''}`}
                    placeholder="Nhập tiêu đề voucher"
                    disabled={isSubmitting}
                  />
                  {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    Mô tả <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                    placeholder="Nhập mô tả chi tiết về voucher"
                    disabled={isSubmitting}
                    rows={4}
                  />
                  {errors.description && <span className={styles.errorText}>{errors.description}</span>}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`${styles.input} ${errors.endDate ? styles.error : ''}`}
                    disabled={isSubmitting}
                    min={voucher.startDate.split('T')[0]}
                    placeholder="Chọn ngày kết thúc (để trống = vô thời hạn)"
                  />
                  {errors.endDate && <span className={styles.errorText}>{errors.endDate}</span>}
                  <small style={{ color: '#6b7280', fontSize: '12px' }}>
                    Để trống nếu không muốn giới hạn thời gian kết thúc (voucher vô thời hạn)
                  </small>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              {submitError && (
                <div className={styles.errorContainer}>
                  {submitError}
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Hủy
              </button>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEdit} />
                    Cập nhật voucher
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateVoucherForm;