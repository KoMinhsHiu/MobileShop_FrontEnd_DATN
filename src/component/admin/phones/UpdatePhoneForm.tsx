import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './AddPhoneForm.module.scss';
import { useEffect, useState } from 'react';
import { fetchBrandsSafe } from "@/utils/api/brands";
import phonesAPI, { PhoneCategory } from "@/utils/api/phone";
import { TransformedBrand } from "@/utils/type";
import { Phone } from "@/utils/type/phoneVariant";
import { message } from "antd";

interface UpdatePhoneFormProps {
  phone: Phone;
  onSave: () => void;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  brandId?: string;
  categoryId?: string;
}

const UpdatePhoneForm: React.FC<UpdatePhoneFormProps> = ({
  phone,
  onSave,
  onClose,
  onSuccess
}) => {
  const [brands, setBrands] = useState<TransformedBrand[]>([]);
  const [categories, setCategories] = useState<PhoneCategory[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { getAllCategories, updatePhone } = phonesAPI;

  const [formData, setFormData] = useState({
    name: phone.name,
    brandId: phone.brand.id,
    categoryId: phone.category.id,
  });

  // Fetch brands and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          fetchBrandsSafe(),
          getAllCategories()
        ]);

        setBrands(brandsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [getAllCategories]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check if form data has changed from initial values
    const hasChanged = 
      field === 'name' ? value !== phone.name :
      field === 'brandId' ? value !== phone.brand.id :
      field === 'categoryId' ? value !== phone.category.id :
      false;

    setIsFormChanged(hasChanged || 
      (field !== 'name' && formData.name !== phone.name) ||
      (field !== 'brandId' && formData.brandId !== phone.brand.id) ||
      (field !== 'categoryId' && formData.categoryId !== phone.category.id)
    );

    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên dòng điện thoại là bắt buộc.';
    }

    if (formData.brandId <= 0) {
      newErrors.brandId = 'Vui lòng chọn thương hiệu.';
    }

    if (formData.categoryId <= 0) {
      newErrors.categoryId = 'Vui lòng chọn danh mục.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const updateData = {
        name: formData.name !== phone.name ? formData.name : undefined,
        brandId: formData.brandId !== phone.brand.id ? formData.brandId : undefined,
        categoryId: formData.categoryId !== phone.category.id ? formData.categoryId : undefined
      };

      // Only send fields that have changed
      await updatePhone(phone.id, updateData);
      
      messageApi.success('Cập nhật dòng điện thoại thành công!');

      onSuccess?.();
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to update phone:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi cập nhật dòng điện thoại.');
      messageApi.error('Không thể cập nhật dòng điện thoại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    {contextHolder}
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Cập nhật dòng điện thoại
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin chung</h3>
            <div className={styles.formGrid}>
              {/* Phone Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên điện thoại <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  placeholder="Ví dụ: iPhone 14 Pro Max"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
              {/* Brand Selection */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Thương hiệu <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => handleInputChange('brandId', parseInt(e.target.value))}
                  className={`${styles.select} ${errors.brandId ? styles.error : ''}`}
                >
                  <option value={0}>Chọn thương hiệu</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && <span className={styles.errorText}>{errors.brandId}</span>}
              </div>

              {/* Category Selection */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Danh mục <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
                  className={`${styles.select} ${errors.categoryId ? styles.error : ''}`}
                >
                  <option value={0}>Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span className={styles.errorText}>{errors.categoryId}</span>}
              </div>
            </div>
          </div>

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
              disabled={isSubmitting || !isFormChanged}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default UpdatePhoneForm;
