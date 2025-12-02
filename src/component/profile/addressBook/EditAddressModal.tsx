import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import customerAPI, { AddressData, AddAddressRequest } from '@/utils/api/customer';
import { useLocation } from '@/utils/hooks/useLocation';
import { useToast } from '@/component/common/ToastContainer';
import styles from './AddressModal.module.scss';

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address: AddressData | null;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  address 
}) => {
  const { 
    provinces, 
    communes, 
    selectedProvince, 
    selectedCommune, 
    loading: locationLoading, 
    handleProvinceChange, 
    handleCommuneChange 
  } = useLocation();

  const { showError } = useToast();

  const isProvinceLoading = typeof locationLoading === 'object' 
    ? locationLoading.provinces 
    : locationLoading;

  const isCommuneLoading = typeof locationLoading === 'object' 
    ? locationLoading.communes 
    : locationLoading;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && address) {
      setFormData({
        fullName: address.recipientName,
        phone: address.recipientPhone,
        street: address.street
      });
      setErrors({});

      if (address.province?.code) {
        handleProvinceChange(address.province.code.toString());
      }
      
      if (address.commune?.code) {
        setTimeout(() => {
            handleCommuneChange(address.commune.code.toString());
        }, 100);
      }
    }
  }, [isOpen, address, handleProvinceChange, handleCommuneChange]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    const phoneRegex = /^0\d{9}$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    }

    if (!selectedProvince) newErrors.province = "Vui lòng chọn Tỉnh/Thành phố";
    if (!selectedCommune) newErrors.commune = "Vui lòng chọn Phường/Xã";
    if (!formData.street.trim()) newErrors.street = "Vui lòng nhập tên đường/số nhà";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !address) return;

    try {
      setIsSubmitting(true);

      const provinceObj = provinces.find(p => p.code.toString() === selectedProvince);
      const communeObj = communes.find(c => c.code.toString() === selectedCommune);

      if (!provinceObj || !communeObj) {
        showError("Lỗi dữ liệu địa chính. Vui lòng chọn lại.");
        return;
      }

      const requestData: Partial<AddAddressRequest> = {
        recipientName: formData.fullName,
        recipientPhone: formData.phone,
        street: formData.street,
        communeId: communeObj.id,
        provinceId: provinceObj.id,
      };

      await customerAPI.updateAddress(address.id, requestData);
      
      onSuccess();
      onClose();

    } catch (error: any) {
      console.error(error);
      showError(error.message || "Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Cập nhật địa chỉ</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Họ và tên *</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className={errors.fullName ? styles.errorInput : ''}
              />
              {errors.fullName && <small className={styles.errorText}>{errors.fullName}</small>}
            </div>

            <div className={styles.formGroup}>
              <label>Số điện thoại *</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={errors.phone ? styles.errorInput : ''}
              />
              {errors.phone && <small className={styles.errorText}>{errors.phone}</small>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tỉnh / Thành phố *</label>
              <select 
                value={selectedProvince || ''}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className={errors.province ? styles.errorInput : ''}
                disabled={isProvinceLoading}
              >
                <option value="">-- Chọn Tỉnh/Thành --</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.code}>{p.name}</option>
                ))}
              </select>
              {errors.province && <small className={styles.errorText}>{errors.province}</small>}
            </div>

            <div className={styles.formGroup}>
              <label>Quận / Huyện / Xã *</label>
              <select 
                value={selectedCommune || ''}
                onChange={(e) => handleCommuneChange(e.target.value)}
                className={errors.commune ? styles.errorInput : ''}
                disabled={!selectedProvince || isCommuneLoading}
              >
                <option value="">-- Chọn Phường/Xã --</option>
                {communes.map(c => (
                  <option key={c.id} value={c.code}>{c.name}</option>
                ))}
              </select>
              {errors.commune && <small className={styles.errorText}>{errors.commune}</small>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Địa chỉ cụ thể (Số nhà, tên đường) *</label>
            <input 
              type="text" 
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
              className={errors.street ? styles.errorInput : ''}
            />
             {errors.street && <small className={styles.errorText}>{errors.street}</small>}
          </div>

          {/* Đã xóa phần checkbox isDefault */}

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Hủy bỏ
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              <FontAwesomeIcon icon={faSave} /> 
              {isSubmitting ? ' Đang lưu...' : ' Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;