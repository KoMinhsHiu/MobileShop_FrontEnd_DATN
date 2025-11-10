import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AddBrandForm.module.scss';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import ImageUploader, { ImageUploaderRef } from '@/component/uploadImage/ImageUploader';
import phonesAPI, { UpdateBrandRequest } from '@/utils/api/phone';
import { TransformedBrand } from "@/utils/type";
import { isEqual } from 'lodash';

interface UpdateBrandFormProps {
  editingBrand: TransformedBrand;
  onSave: () => void;
  onClose: () => void;
}

interface UpdateBrandFormData {
  name: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  imageUrl?: string;
}

const UpdateBrandForm: React.FC<UpdateBrandFormProps> = ({ editingBrand, onSave, onClose }) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const uploaderRef = useRef<ImageUploaderRef>(null);
  const [hasImages, setHasImages] = useState(true); // true vì đã có ảnh ban đầu
  const [formData, setFormData] = useState<UpdateBrandFormData>({
    name: editingBrand.name,
    imageUrl: editingBrand.imageUrl
  });

  // Lưu trữ dữ liệu ban đầu để so sánh
  const initialData = useRef<UpdateBrandFormData>({
    name: editingBrand.name,
    imageUrl: editingBrand.imageUrl
  });

  const { updateBrand } = phonesAPI;

  // Reset form khi đổi brand đang edit
  useEffect(() => {
    setFormData({
      name: editingBrand.name,
      imageUrl: editingBrand.imageUrl
    });
    initialData.current = {
      name: editingBrand.name,
      imageUrl: editingBrand.imageUrl
    };
    setHasImages(true);
    setErrors({});
    setSubmitError(null);
  }, [editingBrand]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên thương hiệu là bắt buộc.';
    }

    if (!hasImages && !formData.imageUrl) {
      newErrors.imageUrl = 'Vui lòng chọn ảnh cho thương hiệu.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleInputChange = useCallback((field: keyof UpdateBrandFormData, value: any) => {
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

    if (!hasChanges()) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      let requestData: UpdateBrandRequest = {
        name: formData.name
      };

      // Chỉ xử lý ảnh nếu có thay đổi về ảnh
      const hasImageChanges = formData.imageUrl !== initialData.current.imageUrl;
      
      if (hasImageChanges) {
        if (!hasImages) {
          // Nếu đã xóa ảnh
          requestData.imageUrl = '';
        } else {
          // Nếu có ảnh mới cần upload
          const imageUrls = await uploaderRef.current?.upload();
          // ImageUploader sẽ trả về mảng rỗng nếu không có file mới
          if (imageUrls && imageUrls.length > 0) {
            requestData.imageUrl = imageUrls[0];
          }
        }
      }

      await updateBrand(editingBrand.id, requestData);
      
      console.log('Brand updated successfully');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to update brand:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi cập nhật thương hiệu.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Cập nhật thương hiệu
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin thương hiệu</h3>
            <div className={styles.formGrid}>
              {/* Brand Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên thương hiệu <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  placeholder="Ví dụ: Apple"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
              
              {/* Image URL */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Hình ảnh <span className={styles.required}>*</span>
                </label>
                <ImageUploader 
                  ref={uploaderRef}
                  mode='single'
                  defaultUrls={formData.imageUrl ? [formData.imageUrl] : []}
                  onImagesChange={useCallback((hasImages: boolean) => {
                    setHasImages(hasImages);
                    if (!hasImages) {
                      handleInputChange('imageUrl', '');
                    }
                  }, [handleInputChange])}
                  onUrlsChange={useCallback((urls: string[]) => {
                    const newUrl = urls.length > 0 ? urls[0] : '';
                    handleInputChange('imageUrl', newUrl);
                  }, [handleInputChange])}
                />
                {errors.imageUrl && <span className={styles.errorText}>{errors.imageUrl}</span>}
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

export default UpdateBrandForm;
