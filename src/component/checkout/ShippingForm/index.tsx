import React from "react";
import { ShippingInfo } from "./types";
import styles from "./shippingForm.module.scss";

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  phoneError: string;
  onInputChange: (field: keyof ShippingInfo, value: string) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingInfo,
  phoneError,
  onInputChange
}) => {
  return (
    <div className={styles.shippingForm}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Thông tin giao hàng</h2>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Họ tên người nhận *</label>
          <input
            type="text"
            id="fullName"
            value={shippingInfo.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            placeholder="Nhập họ tên đầy đủ"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Số điện thoại *</label>
          <input
            type="tel"
            id="phone"
            value={shippingInfo.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="Nhập số điện thoại (VD: 0123456789)"
            required
            className={phoneError ? styles.inputError : ''}
          />
          {phoneError && (
            <div className={styles.errorMessage}>
              {phoneError}
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="province">Tỉnh/Thành phố *</label>
            <input
              type="text"
              id="province"
              value={shippingInfo.province}
              onChange={(e) => onInputChange('province', e.target.value)}
              placeholder="Ví dụ: Hà Nội"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="district">Quận/Huyện *</label>
            <input
              type="text"
              id="district"
              value={shippingInfo.district}
              onChange={(e) => onInputChange('district', e.target.value)}
              placeholder="Ví dụ: Cầu Giấy"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="ward">Phường/Xã *</label>
            <input
              type="text"
              id="ward"
              value={shippingInfo.ward}
              onChange={(e) => onInputChange('ward', e.target.value)}
              placeholder="Ví dụ: Dịch Vọng"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Số nhà/Đường *</label>
            <input
              type="text"
              id="address"
              value={shippingInfo.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              placeholder="Ví dụ: 123 Đường ABC"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="note">Ghi chú đơn hàng</label>
          <textarea
            id="note"
            value={shippingInfo.note}
            onChange={(e) => onInputChange('note', e.target.value)}
            placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
