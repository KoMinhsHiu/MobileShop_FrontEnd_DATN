import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUpload, 
  faImage,
  faTrash,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import { Product, ProductFormData, ProductVariant } from '../admin.types';
import styles from './ProductForm.module.scss';

interface ProductFormProps {
  product?: Product | null;
  onSave: (formData: ProductFormData) => void;
  onClose: () => void;
}

const CATEGORIES = [
  'Điện thoại',
  'Laptop',
  'Tablet',
  'Phụ kiện',
  'Đồng hồ thông minh',
  'Thời trang',
  'Gia dụng'
];

const SUPPLIERS = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'Oppo',
  'Vivo',
  'OnePlus',
  'Huawei',
  'Realme'
];

const COLORS = [
  'Đen',
  'Trắng',
  'Xám',
  'Bạc',
  'Vàng',
  'Đỏ',
  'Xanh lá',
  'Xanh dương',
  'Tím',
  'Hồng',
  'Cam',
  'Titan Xanh',
  'Titan Trắng',
  'Titan Đen',
  'Titan Vàng',
  'Xám Space'
];

const STORAGE_OPTIONS = [
  '64GB',
  '128GB',
  '256GB',
  '512GB',
  '1TB',
  '2TB'
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    supplier: '',
    status: 'visible',
    mainImage: '',
    variants: []
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [mainImagePreview, setMainImagePreview] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        supplier: product.supplier,
        status: product.status,
        mainImage: product.mainImage,
        variants: product.variants
      });
      setMainImagePreview(product.mainImage);
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    if (!formData.supplier) {
      newErrors.supplier = 'Vui lòng chọn nhà cung cấp';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả sản phẩm không được để trống';
    }

    if (formData.variants.length === 0) {
      newErrors.variants = 'Vui lòng thêm ít nhất một biến thể sản phẩm';
    }

    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.color.trim()) {
        newErrors[`variant_${index}_color`] = 'Màu sắc không được để trống';
      }
      if (!variant.storage.trim()) {
        newErrors[`variant_${index}_storage`] = 'Dung lượng không được để trống';
      }
      if (variant.price <= 0) {
        newErrors[`variant_${index}_price`] = 'Giá phải lớn hơn 0';
      }
      if (variant.quantity < 0) {
        newErrors[`variant_${index}_quantity`] = 'Số lượng không được âm';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      color: '',
      storage: '',
      price: 0,
      quantity: 0
    };
    setFormData(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Part 1: Basic Product Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin sản phẩm chính</h3>
            <div className={styles.formGrid}>
              {/* Product Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên sản phẩm <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Category */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Danh mục <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`${styles.select} ${errors.category ? styles.error : ''}`}
                >
                  <option value="">Chọn danh mục</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className={styles.errorText}>{errors.category}</span>}
              </div>

              {/* Supplier */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nhà cung cấp <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  className={`${styles.select} ${errors.supplier ? styles.error : ''}`}
                >
                  <option value="">Chọn nhà cung cấp</option>
                  {SUPPLIERS.map(supplier => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
                {errors.supplier && <span className={styles.errorText}>{errors.supplier}</span>}
              </div>

              {/* Status */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Trạng thái <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="status"
                      value="visible"
                      checked={formData.status === 'visible'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    />
                    <span>Hiển thị</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="status"
                      value="hidden"
                      checked={formData.status === 'hidden'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    />
                    <span>Ẩn</span>
                  </label>
                </div>
              </div>

              {/* Main Image */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Ảnh đại diện</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="mainImageUpload"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className={styles.fileInput}
                  />
                  <label htmlFor="mainImageUpload" className={styles.uploadButton}>
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Tải lên ảnh đại diện</span>
                  </label>
                  {mainImagePreview && (
                    <div className={styles.mainImagePreview}>
                      <img src={mainImagePreview} alt="Main preview" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>
                  Mô tả sản phẩm <span className={styles.required}>*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                  rows={4}
                />
                {errors.description && <span className={styles.errorText}>{errors.description}</span>}
              </div>
            </div>
          </div>

          {/* Part 2: Product Variants */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Biến thể sản phẩm</h3>
              <button
                type="button"
                className={styles.addVariantButton}
                onClick={addVariant}
              >
                <FontAwesomeIcon icon={faPlus} />
                Thêm biến thể
              </button>
            </div>
            
            {errors.variants && (
              <div className={styles.errorText}>{errors.variants}</div>
            )}

            {formData.variants.length > 0 && (
              <div className={styles.variantsTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Màu sắc</th>
                      <th>Dung lượng</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Ảnh biến thể</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.map((variant, index) => (
                      <tr key={variant.id || index}>
                        <td>
                          <select
                            value={variant.color}
                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                            className={`${styles.select} ${errors[`variant_${index}_color`] ? styles.error : ''}`}
                          >
                            <option value="">Chọn màu</option>
                            {COLORS.map(color => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                          {errors[`variant_${index}_color`] && (
                            <div className={styles.errorText}>{errors[`variant_${index}_color`]}</div>
                          )}
                        </td>
                        <td>
                          <select
                            value={variant.storage}
                            onChange={(e) => updateVariant(index, 'storage', e.target.value)}
                            className={`${styles.select} ${errors[`variant_${index}_storage`] ? styles.error : ''}`}
                          >
                            <option value="">Chọn dung lượng</option>
                            {STORAGE_OPTIONS.map(storage => (
                              <option key={storage} value={storage}>{storage}</option>
                            ))}
                          </select>
                          {errors[`variant_${index}_storage`] && (
                            <div className={styles.errorText}>{errors[`variant_${index}_storage`]}</div>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={variant.price === 0 ? '' : variant.price.toLocaleString('vi-VN')}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d]/g, '');
                              updateVariant(index, 'price', value ? Number(value) : 0);
                            }}
                            onFocus={(e) => {
                              if (variant.price === 0) {
                                e.target.value = '';
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                updateVariant(index, 'price', 0);
                              }
                            }}
                            className={`${styles.input} ${errors[`variant_${index}_price`] ? styles.error : ''}`}
                            placeholder="Nhập giá"
                          />
                          {errors[`variant_${index}_price`] && (
                            <div className={styles.errorText}>{errors[`variant_${index}_price`]}</div>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={variant.quantity === 0 ? '' : variant.quantity.toString()}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d]/g, '');
                              updateVariant(index, 'quantity', value ? Number(value) : 0);
                            }}
                            onFocus={(e) => {
                              if (variant.quantity === 0) {
                                e.target.value = '';
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                updateVariant(index, 'quantity', 0);
                              }
                            }}
                            className={`${styles.input} ${errors[`variant_${index}_quantity`] ? styles.error : ''}`}
                            placeholder="Nhập số lượng"
                          />
                          {errors[`variant_${index}_quantity`] && (
                            <div className={styles.errorText}>{errors[`variant_${index}_quantity`]}</div>
                          )}
                        </td>
                        <td>
                          <div className={styles.variantImageUpload}>
                            <input
                              type="file"
                              id={`variantImages-${index}`}
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  const currentImages = variant.images || [];
                                  updateVariant(index, 'images', [...currentImages, ...files]);
                                }
                              }}
                              className={styles.fileInput}
                            />
                            <label htmlFor={`variantImages-${index}`} className={styles.variantUploadButton}>
                              <FontAwesomeIcon icon={faUpload} />
                              <span>Upload</span>
                            </label>
                            {variant.images && variant.images.length > 0 && (
                              <div className={styles.variantImagesPreview}>
                                {variant.images.map((image, imageIndex) => (
                                  <div key={imageIndex} className={styles.variantImagePreview}>
                                    <img 
                                      src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                                      alt={`Variant ${index + 1} - Image ${imageIndex + 1}`} 
                                    />
                                    <button
                                      type="button"
                                      className={styles.removeVariantImage}
                                      onClick={() => {
                                        const newImages = variant.images?.filter((_, i) => i !== imageIndex) || [];
                                        updateVariant(index, 'images', newImages);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.removeVariantButton}
                            onClick={() => removeVariant(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.saveButton}
            >
              {product ? 'Cập nhật' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
