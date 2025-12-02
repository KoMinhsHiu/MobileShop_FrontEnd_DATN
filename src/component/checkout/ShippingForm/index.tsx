import React, { useCallback, useEffect, useState } from "react";
import { ShippingInfo } from "./types";
import { Province, Commune } from "@/utils/api/locations";
import styles from "./shippingForm.module.scss";
import customerAPI, { AddressData } from "@/utils/api/customer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  phoneError: string;
  onInputChange: (field: keyof ShippingInfo, value: string) => void;
  provinces: Province[];
  communes: Commune[];
  selectedProvince: string;
  selectedCommune: string;
  loading: {
    provinces: boolean;
    communes: boolean;
  };
  onProvinceChange: (provinceCode: string) => void;
  onCommuneChange: (communeCode: string) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingInfo,
  phoneError,
  onInputChange,
  provinces,
  communes,
  selectedProvince,
  selectedCommune,
  loading,
  onProvinceChange,
  onCommuneChange
}) => {
  const [savedAddresses, setSavedAddresses] = useState<AddressData[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const handleSelectSavedAddress = useCallback((value: string) => {
    if (value === 'new') {
      setSelectedAddressId('new');
      onInputChange('fullName', '');
      onInputChange('phone', '');
      onInputChange('address', '');
      onInputChange('province', '');
      onInputChange('commune', '');
      onProvinceChange('');
      return;
    }

    const addressId = parseInt(value);
    setSelectedAddressId(addressId);

    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      console.log('📦 Auto-filling address:', address);

      onInputChange('fullName', address.recipientName);
      onInputChange('phone', address.recipientPhone);
      onInputChange('address', address.street);

      if (address.province) {
        onInputChange('province', address.province.name);
        const pCode = address.province.code.toString();
        onProvinceChange(pCode);

        if (address.commune) {
          const cCode = address.commune.code.toString();
          onInputChange('commune', address.commune.name);

          setTimeout(() => {
            onCommuneChange(cCode);
          }, 500);
        }
      }
    }
  }, [savedAddresses, onInputChange, onProvinceChange, onCommuneChange]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await customerAPI.getAddresses();
        if (response && response.data) {
          setSavedAddresses(response.data);
          
          const defaultAddr = response.data.find(addr => addr.isDefault);
          if (defaultAddr) {
            handleSelectSavedAddress(defaultAddr.id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to load saved addresses", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [handleSelectSavedAddress]);

  // Handle province selection
  const handleProvinceSelect = (provinceCode: string) => {
    console.log('🏙️ handleProvinceSelect called with:', provinceCode);
    
    const province = provinces.find(p => p.code.toString() === provinceCode);
    console.log('🔍 Found province:', province);
    
    if (province) {
      console.log('✅ Setting province name:', province.name);
      onInputChange('province', province.name);
      onProvinceChange(provinceCode);
    } else {
      console.warn('⚠️ Province not found for code:', provinceCode);
    }
  };

  // Handle commune selection
  const handleCommuneSelect = (communeCode: string) => {
    console.log('🏘️ handleCommuneSelect called with:', communeCode);
    
    const commune = communes.find(c => c.code.toString() === communeCode);
    console.log('🔍 Found commune:', commune);
    
    if (commune) {
      console.log('✅ Setting commune name:', commune.name);
      onInputChange('commune', commune.name);
      onCommuneChange(communeCode);
    } else {
      console.warn('⚠️ Commune not found for code:', communeCode);
    }
  };

  return (
    <div className={styles.shippingForm}>
      {savedAddresses.length > 0 && (
        <div className={`${styles.formGroup} ${styles.savedAddressGroup}`}>
          <label className={styles.highlightLabel}>
            <FontAwesomeIcon icon={faAddressBook} /> Chọn từ sổ địa chỉ
          </label>
          <select
            value={selectedAddressId}
            onChange={(e) => handleSelectSavedAddress(e.target.value)}
            className={styles.addressSelect}
            disabled={isLoadingAddresses}
          >
            <option value="new">-- Nhập địa chỉ mới --</option>
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.isDefault ? '[Mặc định] ' : ''}{addr.recipientName} - {addr.street}, {addr.commune?.name}, {addr.province?.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="fullName">Họ tên người nhận</label>
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
        <label htmlFor="phone">Số điện thoại</label>
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
          <label htmlFor="province">Tỉnh/Thành phố</label>
          <select
            id="province"
            value={selectedProvince}
            onChange={(e) => handleProvinceSelect(e.target.value)}
            required
            disabled={loading.provinces}
            className={loading.provinces ? styles.loading : ''}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
          {loading.provinces && (
            <div className={styles.loadingText}>Đang tải...</div>
          )}
        </div>
              <div className={styles.formGroup}>
                <label htmlFor="commune">Phường/Xã</label>
                <select
                  id="commune"
                  value={selectedCommune}
                  onChange={(e) => {
                    console.log('🔄 Commune select changed:', e.target.value);
                    handleCommuneSelect(e.target.value);
                  }}
                  required
                  disabled={!selectedProvince || loading.communes}
                  className={loading.communes ? styles.loading : ''}
                >
                  <option value="">Chọn phường/xã</option>
                  {communes.map((commune) => {
                    console.log('🏘️ Rendering commune option:', commune.code, commune.name);
                    return (
                      <option key={commune.code} value={commune.code}>
                        {commune.name}
                      </option>
                    );
                  })}
                </select>
                {loading.communes && (
                  <div className={styles.loadingText}>Đang tải...</div>
                )}
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Debug: {communes.length} communes loaded
                </div>
              </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address">Số nhà/Đường</label>
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
  );
};

export default ShippingForm;
