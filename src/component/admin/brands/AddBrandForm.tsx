import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AddBrandForm.module.scss';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import ImageUploader, { ImageUploaderRef } from '@/component/uploadImage/ImageUploader';
import phonesAPI, { CreateBrandRequest } from '@/utils/api/phone';

interface BrandFormProps {
  onSave: () => void;
  onClose: () => void;
}

interface AddBrandFormData {
  name: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  imageUrl?: string;
}

const AddBrandForm: React.FC<BrandFormProps> = ({ onSave, onClose }) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const uploaderRef = useRef<ImageUploaderRef>(null);
  const [hasImages, setHasImages] = useState(false);
  const [formData, setFormData] = useState<AddBrandFormData>({
    name: '',
    imageUrl: ''
  });

  const { createBrand } = phonesAPI;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên thương hiệu là bắt buộc.';
    }

    if (!hasImages) {
      newErrors.imageUrl = 'Vui lòng chọn ảnh cho thương hiệu.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleInputChange = (field: keyof AddBrandFormData, value: any) => {
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

      const imageUrls = await uploaderRef.current?.upload();
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error('Không thể upload ảnh. Vui lòng thử lại.');
      }

      const requestData: CreateBrandRequest = {
        name: formData.name,
        imageUrl: imageUrls[0]
      };

      await createBrand(requestData);
      
      console.log('Brand created successfully');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to create brand:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi thêm thương hiệu.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Thêm thương hiệu mới
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
                  onImagesChange={setHasImages}
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

export default AddBrandForm;