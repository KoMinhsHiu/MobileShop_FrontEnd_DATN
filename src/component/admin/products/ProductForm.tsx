import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faTrash,
  faPlus,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { createPhoneVariant, CreateVariantRequest } from '@/utils/api/phone';
import styles from './ProductForm.module.scss';

interface ProductFormProps {
  onSave: () => void;
  onClose: () => void;
}

interface VariantColor {
  colorId: number;
  imageUrl: string;
}

interface VariantSpecification {
  specId: number;
  info: string;
  unit?: string;
}

interface VariantFormData {
  phoneId: number;
  variantName: string;
  description: string;
  colors: VariantColor[];
  price: number;
  discountPercent: number;
  images: string[];
  specifications: VariantSpecification[];
}

const ProductForm: React.FC<ProductFormProps> = ({ onSave, onClose }) => {

  // Form data
  const [formData, setFormData] = useState<VariantFormData>({
    phoneId: 0,
    variantName: '',
    description: '',
    colors: [],
    price: 0,
    discountPercent: 0,
    images: [],
    specifications: []
  });

  const [errors, setErrors] = useState<Partial<VariantFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  const handleInputChange = (field: keyof VariantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addColor = () => {
    const newColor: VariantColor = {
      colorId: 0,
      imageUrl: ''
    };
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, newColor]
    }));
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index: number, field: keyof VariantColor, value: any) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  const addSpecification = () => {
    const newSpec: VariantSpecification = {
      specId: 0,
      info: '',
      unit: ''
    };
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, newSpec]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, field: keyof VariantSpecification, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.phoneId || formData.phoneId === 0) {
      newErrors.phoneId = 'Vui lòng chọn dòng điện thoại';
    }

    if (!formData.variantName.trim()) {
      newErrors.variantName = 'Tên biến thể không được để trống';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    if (formData.colors.length === 0) {
      newErrors.colors = 'Vui lòng thêm ít nhất một màu sắc';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (formData.specifications.length === 0) {
      newErrors.specifications = 'Vui lòng thêm ít nhất một thông số kỹ thuật';
    }

    // Validate colors
    formData.colors.forEach((color, index) => {
      if (!color.imageUrl.trim()) {
        newErrors.colors = `Hình ảnh cho màu ${index + 1} không được để trống`;
      }
    });

    // Validate specifications
    formData.specifications.forEach((spec, index) => {
      if (!spec.info.trim()) {
        newErrors.specifications = `Thông tin cho thông số ${index + 1} không được để trống`;
      }
    });

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

      // Transform form data to API format
      const requestData: CreateVariantRequest = {
        phoneId: formData.phoneId,
        data: {
          variantName: formData.variantName,
          description: formData.description,
          colors: formData.colors.map(color => ({
            colorId: color.colorId,
            imageUrl: color.imageUrl
          })),
          price: formData.price,
          discountPercent: formData.discountPercent || 0, // Always include, default to 0
          images: formData.images && formData.images.length > 0 
            ? formData.images.filter(img => img.trim() !== '') 
            : [], // Always include, default to empty array
          specifications: formData.specifications.map(spec => {
            const specData: { specId: number; info: string; unit?: string } = {
              specId: spec.specId,
              info: spec.info
            };
            
            // Only include unit if it's not empty
            if (spec.unit && spec.unit.trim()) {
              specData.unit = spec.unit.trim();
            }
            
            return specData;
          })
        }
      };

      // Log detailed information before sending to API
      console.log('=== PHONE VARIANT CREATION DEBUG ===');
      console.log('1. Raw Form Data:', formData);
      console.log('2. Form Data Colors:', formData.colors);
      console.log('3. Form Data Specifications:', formData.specifications);
      console.log('4. Form Data Images:', formData.images);
      console.log('5. Form Data Discount Percent:', formData.discountPercent);
      console.log('6. Transformed API Request Data:', JSON.stringify(requestData, null, 2));
      console.log('7. Request URL: http://localhost:3000/api/v1/phones/variants/create');
      console.log('8. Request Method: POST');
      console.log('9. Request Headers: { "Content-Type": "application/json", "Authorization": "Bearer [token]" }');
      console.log('=====================================');
      
      const response = await createPhoneVariant(requestData);
      
      if (response.status === 201) {
        // Success
        console.log('Variant created successfully:', response.data);
        onSave();
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to create variant:', error);
      setSubmitError(error.message || 'Có lỗi xảy ra khi tạo biến thể');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Thêm biến thể mới
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
            <div className={styles.formGrid}>
              {/* Phone Selection */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Dòng điện thoại <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.phoneId}
                  onChange={(e) => handleInputChange('phoneId', parseInt(e.target.value))}
                  className={`${styles.select} ${errors.phoneId ? styles.error : ''}`}
                >
                  <option value={0}>Chọn dòng điện thoại</option>
                  <option value={1}>iPhone 15 Pro - Apple</option>
                  <option value={2}>Galaxy S24 Ultra - Samsung</option>
                  <option value={3}>Pixel 8 Pro - Google</option>
                  <option value={4}>OnePlus 12 - OnePlus</option>
                </select>
                {errors.phoneId && <span className={styles.errorText}>{errors.phoneId}</span>}
              </div>

              {/* Variant Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên biến thể <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.variantName}
                  onChange={(e) => handleInputChange('variantName', e.target.value)}
                  className={`${styles.input} ${errors.variantName ? styles.error : ''}`}
                  placeholder="Ví dụ: 128GB, 256GB, Ultra 1TB"
                />
                {errors.variantName && <span className={styles.errorText}>{errors.variantName}</span>}
              </div>

              {/* Price */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Giá bán <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  className={`${styles.input} ${errors.price ? styles.error : ''}`}
                  placeholder="Nhập giá bán"
                  min="0"
                  step="1000"
                />
                {errors.price && <span className={styles.errorText}>{errors.price}</span>}
              </div>

              {/* Discount Percent */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Phần trăm giảm giá
                </label>
                <input
                  type="number"
                  value={formData.discountPercent || 0}
                  onChange={(e) => handleInputChange('discountPercent', parseFloat(e.target.value))}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mô tả chi tiết <span className={styles.required}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                placeholder="Nhập mô tả chi tiết về biến thể"
                rows={4}
              />
              {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            </div>
          </div>

          {/* Colors Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Màu sắc</h3>
              <button
                type="button"
                className={styles.addButton}
                onClick={addColor}
              >
                <FontAwesomeIcon icon={faPlus} />
                Thêm màu
              </button>
            </div>
            
            {errors.colors && <span className={styles.errorText}>{String(errors.colors)}</span>}
            
            {formData.colors.map((color, index) => (
              <div key={index} className={styles.colorItem}>
                <div className={styles.colorHeader}>
                  <h4>Màu {index + 1}</h4>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeColor(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Màu sắc</label>
                    <select
                      value={color.colorId}
                      onChange={(e) => updateColor(index, 'colorId', parseInt(e.target.value))}
                      className={styles.select}
                    >
                      <option value={0}>Chọn màu</option>
                      <option value={1}>Đen</option>
                      <option value={2}>Trắng</option>
                      <option value={3}>Vàng</option>
                      <option value={4}>Xanh</option>
                      <option value={5}>Đỏ</option>
                      <option value={6}>Tím</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>URL hình ảnh</label>
                    <input
                      type="url"
                      value={color.imageUrl}
                      onChange={(e) => updateColor(index, 'imageUrl', e.target.value)}
                      className={styles.input}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Specifications Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Thông số kỹ thuật</h3>
              <button
                type="button"
                className={styles.addButton}
                onClick={addSpecification}
              >
                <FontAwesomeIcon icon={faPlus} />
                Thêm thông số
              </button>
            </div>
            
            {errors.specifications && <span className={styles.errorText}>{String(errors.specifications)}</span>}
            
            {formData.specifications.map((spec, index) => (
              <div key={index} className={styles.specItem}>
                <div className={styles.specHeader}>
                  <h4>Thông số {index + 1}</h4>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeSpecification(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Thông số</label>
                    <select
                      value={spec.specId}
                      onChange={(e) => updateSpecification(index, 'specId', parseInt(e.target.value))}
                      className={styles.select}
                    >
                      <option value={0}>Chọn thông số</option>
                      <option value={1}>Dung lượng bộ nhớ</option>
                      <option value={2}>Camera chính</option>
                      <option value={3}>Màn hình</option>
                      <option value={4}>Pin</option>
                      <option value={5}>RAM</option>
                      <option value={6}>CPU</option>
                      <option value={7}>Hệ điều hành</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Thông tin</label>
                    <input
                      type="text"
                      value={spec.info}
                      onChange={(e) => updateSpecification(index, 'info', e.target.value)}
                      className={styles.input}
                      placeholder="Nhập thông tin chi tiết"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Đơn vị</label>
                    <input
                      type="text"
                      value={spec.unit || ''}
                      onChange={(e) => updateSpecification(index, 'unit', e.target.value)}
                      className={styles.input}
                      placeholder="Ví dụ: GB, MP, inch"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Images Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Hình ảnh bổ sung</h3>
              <button
                type="button"
                className={styles.addButton}
                onClick={addImage}
              >
                <FontAwesomeIcon icon={faPlus} />
                Thêm hình ảnh
              </button>
            </div>
            
            {formData.images.map((image, index) => (
              <div key={index} className={styles.imageItem}>
                <div className={styles.imageHeader}>
                  <h4>Hình ảnh {index + 1}</h4>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeImage(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                
                <input
                  type="url"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  className={styles.input}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            {submitError && (
              <div className={styles.errorContainer}>
                <span>
                  {submitError.includes('Authentication') || submitError.includes('Unauthorized') 
                    ? '🔐 ' + submitError 
                    : '❌ ' + submitError}
                </span>
              </div>
            )}
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
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
                  Đang tạo biến thể...
                </>
              ) : (
                'Lưu biến thể'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
