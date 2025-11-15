import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faBoxes } from '@fortawesome/free-solid-svg-icons';
import { inventoryAPI, UpsertInventoryRequest } from '@/utils/api/inventory';
import { PhoneVariant } from '@/utils/type/phoneVariant';
import styles from './UpsertInventoryForm.module.scss';

interface UpsertInventoryFormProps {
  variants: PhoneVariant[];
  onClose: () => void;
  onSuccess?: () => void;
}

interface UpsertInventoryFormData {
  variantId: number | null;
  colorId: number | null;
  sku: string;
  stockQuantity: number;
}

interface FormErrors {
  variantId?: string;
  colorId?: string;
  sku?: string;
  stockQuantity?: string;
}

const UpsertInventoryForm: React.FC<UpsertInventoryFormProps> = ({ variants, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UpsertInventoryFormData>({
    variantId: null,
    colorId: null,
    sku: '',
    stockQuantity: 0
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PhoneVariant | null>(null);
  const [availableColors, setAvailableColors] = useState<Array<{id: number, name: string}>>([]);
  const [existingInventory, setExistingInventory] = useState<{id: number, sku: string} | null>(null);

  const handleInputChange = (field: keyof UpsertInventoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    const errorKey = field as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
    }
  };

  // Handle variant selection
  const handleVariantChange = (variantId: string) => {
    const variantIdNum = parseInt(variantId) || null;
    const variant = variants.find(v => v.id === variantIdNum);
    
    setSelectedVariant(variant || null);
    setFormData(prev => ({ 
      ...prev, 
      variantId: variantIdNum,
      colorId: null,
      sku: '',
      stockQuantity: 0
    }));
    setExistingInventory(null);
    
    if (variant) {
      // Set available colors for this variant
      const colors = variant.colors.map(c => ({
        id: c.color.id,
        name: c.color.name
      }));
      setAvailableColors(colors);
    } else {
      setAvailableColors([]);
    }
  };

  // Handle color selection
  const handleColorChange = (colorId: string) => {
    const colorIdNum = parseInt(colorId) || null;
    
    setFormData(prev => ({ 
      ...prev, 
      colorId: colorIdNum,
      sku: '',
      stockQuantity: 0
    }));
    
    // Check if inventory exists for this variant-color combination
    if (selectedVariant && colorIdNum) {
      const inventory = selectedVariant.inventories.find(
        inv => inv.colorId === colorIdNum
      );
      
      if (inventory) {
        setExistingInventory({
          id: inventory.id,
          sku: inventory.sku
        });
        setFormData(prev => ({
          ...prev,
          sku: inventory.sku
        }));
      } else {
        setExistingInventory(null);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Variant validation
    if (!formData.variantId) {
      newErrors.variantId = 'Vui lòng chọn biến thể sản phẩm.';
    }

    // Color validation
    if (!formData.colorId) {
      newErrors.colorId = 'Vui lòng chọn màu sắc.';
    }

    // SKU validation
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU là bắt buộc.';
    }

    // Stock quantity validation
    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Số lượng không được âm.';
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

      const requestData: UpsertInventoryRequest = {
        variantId: formData.variantId!,
        colorId: formData.colorId!,
        sku: formData.sku.trim(),
        stockQuantity: formData.stockQuantity
      };

      await inventoryAPI.upsertInventory(requestData);

      if (onSuccess) {
        onSuccess();
      }
      onClose();

    } catch (error: any) {
      console.error('Error upserting inventory:', error);
      setSubmitError(error.message || 'Có lỗi xảy ra khi cập nhật tồn kho');
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
              <FontAwesomeIcon icon={faBoxes} style={{ marginRight: '12px', color: '#059669' }} />
              Cập nhật Tồn kho
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
            {/* Chon san pham */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin sản phẩm</h3>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    Chọn biến thể sản phẩm <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={formData.variantId || ''}
                    onChange={(e) => handleVariantChange(e.target.value)}
                    className={`${styles.select} ${errors.variantId ? styles.error : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn biến thể sản phẩm</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.phone.name} - {variant.variantName}
                      </option>
                    ))}
                  </select>
                  {errors.variantId && <span className={styles.errorText}>{errors.variantId}</span>}
                </div>

                {selectedVariant && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>
                      Chọn màu sắc <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={formData.colorId || ''}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className={`${styles.select} ${errors.colorId ? styles.error : ''}`}
                      disabled={isSubmitting}
                    >
                      <option value="">Chọn màu sắc</option>
                      {availableColors.map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    {errors.colorId && <span className={styles.errorText}>{errors.colorId}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Thong tin ton kho */}
            {formData.variantId && formData.colorId && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Thông tin tồn kho</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      SKU <span className={styles.required}>*</span>
                    </label>
                    {existingInventory ? (
                      <>
                        <input
                          type="text"
                          value={formData.sku}
                          className={`${styles.input} ${styles.readOnly}`}
                          disabled
                        />
                        <small className={styles.infoText}>
                          SKU sẽ được giữ nguyên cho sản phẩm đã tồn tại
                        </small>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          className={`${styles.input} ${errors.sku ? styles.error : ''}`}
                          placeholder="Nhập mã SKU"
                          disabled={isSubmitting}
                        />
                        {errors.sku && <span className={styles.errorText}>{errors.sku}</span>}
                      </>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Số lượng {existingInventory ? 'cần thêm' : 'ban đầu'} <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
                      className={`${styles.input} ${errors.stockQuantity ? styles.error : ''}`}
                      placeholder="Nhập số lượng"
                      min="0"
                      step="1"
                      disabled={isSubmitting}
                    />
                    {errors.stockQuantity && <span className={styles.errorText}>{errors.stockQuantity}</span>}
                    <small className={styles.infoText}>
                      {existingInventory 
                        ? 'Số lượng sẽ được cộng vào tồn kho hiện tại'
                        : 'Số lượng tồn kho ban đầu'
                      }
                    </small>
                  </div>
                </div>
              </div>
            )}

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
                disabled={isSubmitting || !formData.variantId || !formData.colorId}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBoxes} />
                    {existingInventory ? 'Cập nhật tồn kho' : 'Thêm tồn kho'}
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

export default UpsertInventoryForm;
