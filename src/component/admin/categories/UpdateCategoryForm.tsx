import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AddCategoryForm.module.scss';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import phonesAPI, { PhoneCategory, UpdateCategoryRequest } from '@/utils/api/phone';
import { isEqual } from 'lodash';

interface UpdateCategoryFormProps {
  editingCategory: PhoneCategory;
  categories: PhoneCategory[];
  onSave: () => void;
  onClose: () => void;
}

interface UpdateCategoryFormData {
  name: string;
  parentId: number | null;
}

interface FormErrors {
  name?: string;
}

const UpdateCategoryForm: React.FC<UpdateCategoryFormProps> = ({ 
  editingCategory, 
  categories, 
  onSave, 
  onClose 
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateCategoryFormData>({
    name: editingCategory.name,
    parentId: editingCategory.parentId || null
  });

  // Lưu trữ dữ liệu ban đầu để so sánh
  const initialData = useRef<UpdateCategoryFormData>({
    name: editingCategory.name,
    parentId: editingCategory.parentId || null
  });

  const { updateCategory } = phonesAPI;

  // Reset form khi đổi category đang edit
  useEffect(() => {
    setFormData({
      name: editingCategory.name,
      parentId: editingCategory.parentId || null
    });
    initialData.current = {
      name: editingCategory.name,
      parentId: editingCategory.parentId || null
    };
    setErrors({});
    setSubmitError(null);
  }, [editingCategory]);

  // Kiểm tra xem một danh mục có phải là con của một danh mục khác không
  const isChildCategory = useCallback((parentId: number | null, targetId: number): boolean => {
    const category = categories.find(cat => cat.id === parentId);
    if (!category) return false;
    if (category.id === targetId) return true;
    return isChildCategory(category.parentId, targetId);
  }, [categories]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc.';
    }

    // Validate không cho chọn chính nó làm cha
    if (formData.parentId === editingCategory.id) {
      newErrors.name = 'Không thể chọn chính danh mục này làm danh mục cha.';
    }

    // Validate không cho chọn con của nó làm cha
    if (formData.parentId && isChildCategory(formData.parentId, editingCategory.id)) {
      newErrors.name = 'Không thể chọn danh mục con làm danh mục cha.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleInputChange = useCallback((field: keyof UpdateCategoryFormData, value: any) => {
    setFormData(prev => {
      if (prev[field] === value) {
        return prev;
      }
      return { ...prev, [field]: value };
    });

    setErrors(prev => {
      const errorKey = field as keyof FormErrors;
      if (prev[errorKey]) {
        return { ...prev, [errorKey]: undefined };
      }
      return prev;
    });
  }, []);

  const hasChanges = (): boolean => {
    return !isEqual(formData, initialData.current);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Kiểm tra xem có thay đổi gì không
    if (!hasChanges()) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const requestData: UpdateCategoryRequest = {
        name: formData.name
      };

      // Chỉ thêm parentId vào request nếu có thay đổi về danh mục cha
      if (formData.parentId !== initialData.current.parentId) {
        requestData.parentId = formData.parentId;
      }

      await updateCategory(editingCategory.id, requestData);
      
      console.log('Category updated successfully');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to update category:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi cập nhật danh mục.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Lọc ra các danh mục có thể chọn làm cha (không bao gồm chính nó và các con của nó)
  const availableParentCategories = categories.filter(category => 
    category.id !== editingCategory.id && !isChildCategory(category.parentId, editingCategory.id)
  );
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Cập nhật danh mục
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
                  placeholder="Ví dụ: Điện thoại cao cấp"
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
                  {availableParentCategories.map(category => (
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
              disabled={isSubmitting || !hasChanges()}
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

export default UpdateCategoryForm;
