import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AddCategoryForm.module.scss';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import phonesAPI from '@/utils/api/phone';
import { PhoneCategory } from '@/utils/api/phone';

interface CategoryFormProps {
  categories: PhoneCategory[];
  onSave: () => void;
  onClose: () => void;
}

interface AddCategoryFormData {
  name: string;
  parentId: number | null;
}

interface FormErrors {
  name?: string;
}

const AddCategoryForm: React.FC<CategoryFormProps> = ({ categories, onSave, onClose }) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddCategoryFormData>({
    name: '',
    parentId: null
  });

  const { createCategory } = phonesAPI;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleInputChange = (field: keyof AddCategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    const errorKey = field as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }) );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await createCategory(formData.name, formData.parentId || undefined);
      
      console.log('Category created successfully');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to create category:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi thêm danh mục.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Thêm danh mục mới
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin danh mục</h3>
            <div className={styles.formGrid}>
              {/* Category Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên danh mục <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  placeholder="Ví dụ: iPhone 17 Series"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
              
              {/* Parent Category */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Danh mục cha
                </label>
                <select
                  value={formData.parentId || ''}
                  onChange={(e) => handleInputChange('parentId', e.target.value ? Number(e.target.value) : null)}
                  className={styles.select}
                >
                  <option value="">-- Không có danh mục cha --</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
              disabled={isSubmitting}
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
  );
}

export default AddCategoryForm;