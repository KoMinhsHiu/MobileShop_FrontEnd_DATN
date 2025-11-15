import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faTag, faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { voucherAPI, CreateVoucherRequest } from '@/utils/api/voucher';
import { phonesAPI, PhoneCategory } from '@/utils/api/phone';
import { paymentAPI, PaymentMethod } from '@/utils/api/payment';
import styles from './VoucherForm.module.scss';

interface VoucherFormProps {
  onSave: () => void;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AddVoucherFormData {
  title: string;
  code: string;
  description: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usageLimitPerUser: number;
  appliesTo: 'all' | 'category' | 'payment_method';
  startDate: string;
  endDate: string;
  categories: number[];
  paymentMethod: number | null;
}

interface FormErrors {
  title?: string;
  code?: string;
  description?: string;
  discountValue?: string;
  minOrderValue?: string;
  maxDiscountValue?: string;
  usageLimit?: string;
  usageLimitPerUser?: string;
  startDate?: string;
  endDate?: string;
  categories?: string;
  paymentMethod?: string;
}

const AddVoucherForm: React.FC<VoucherFormProps> = ({ onSave, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<PhoneCategory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  const [formData, setFormData] = useState<AddVoucherFormData>({
    title: '',
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountValue: 0,
    usageLimit: 1,
    usageLimitPerUser: 1,
    appliesTo: 'all',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    categories: [],
    paymentMethod: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, paymentMethodsData] = await Promise.all([
          phonesAPI.getAllCategories(),
          paymentAPI.getPaymentMethods()
        ]);
        
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setPaymentMethods(Array.isArray(paymentMethodsData) ? paymentMethodsData : []);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (field: keyof AddVoucherFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    const errorKey = field as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const handleCategoryChange = (categoryId: number, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: isChecked 
        ? [...prev.categories, categoryId]
        : prev.categories.filter(id => id !== categoryId)
    }));

    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề voucher là bắt buộc.';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Mã voucher là bắt buộc.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả voucher là bắt buộc.';
    }

    // Discount value validation
    if (formData.discountValue <= 0) {
      newErrors.discountValue = 'Giá trị giảm giá phải lớn hơn 0.';
    } else if (formData.discountType === 'percent' && formData.discountValue > 100) {
      newErrors.discountValue = 'Phần trăm giảm giá không được vượt quá 100%.';
    } else if (formData.discountType === 'amount' && formData.minOrderValue > 0 && formData.discountValue > formData.minOrderValue) {
      newErrors.discountValue = 'Giá trị giảm giá không được vượt quá giá trị đơn hàng tối thiểu.';
    }

    // Min order value validation
    if (formData.minOrderValue <= 0) {
      newErrors.minOrderValue = 'Giá trị đơn hàng tối thiểu phải lớn hơn 0.';
    }

    // Max discount value validation (only for percent type)
    if (formData.discountType === 'percent') {
      if (formData.maxDiscountValue <= 0) {
        newErrors.maxDiscountValue = 'Giá trị giảm tối đa phải lớn hơn 0.';
      } else if (formData.maxDiscountValue > formData.minOrderValue && formData.minOrderValue > 0) {
        newErrors.maxDiscountValue = 'Giá trị giảm tối đa không được vượt quá giá trị đơn hàng tối thiểu.';
      }
    }

    // Usage limit validation
    if (formData.usageLimit <= 0) {
      newErrors.usageLimit = 'Giới hạn sử dụng phải lớn hơn 0.';
    }

    // Usage limit per user validation
    if (formData.usageLimitPerUser <= 0) {
      newErrors.usageLimitPerUser = 'Giới hạn sử dụng mỗi người dùng phải lớn hơn 0.';
    } else if (formData.usageLimitPerUser > formData.usageLimit) {
      newErrors.usageLimitPerUser = 'Giới hạn sử dụng mỗi người dùng không được vượt quá tổng giới hạn sử dụng.';
    }

    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc.';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại.';
      }
    }

    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
      }
    }

    // Applies to validation
    if (formData.appliesTo === 'category' && formData.categories.length === 0) {
      newErrors.categories = 'Vui lòng chọn ít nhất một danh mục khi áp dụng cho danh mục cụ thể.';
    }

    if (formData.appliesTo === 'payment_method' && !formData.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán khi áp dụng cho phương thức thanh toán cụ thể.';
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

      const requestData: CreateVoucherRequest = {
        title: formData.title.trim(),
        code: formData.code.trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        minOrderValue: formData.minOrderValue,
        maxDiscountValue: formData.discountType === 'amount' ? formData.discountValue : formData.maxDiscountValue,
        usageLimit: formData.usageLimit,
        usageLimitPerUser: formData.usageLimitPerUser,
        appliesTo: formData.appliesTo,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        ...(formData.appliesTo === 'category' && { categories: formData.categories }),
        ...(formData.appliesTo === 'payment_method' && { paymentMethods: formData.paymentMethod! })
      };

      await voucherAPI.createVoucher(requestData);
      
      // Call callbacks
      onSave();
      if (onSuccess) {
        onSuccess();
      }
      onClose();

    } catch (error: any) {
      console.error('Error creating voucher:', error);
      setSubmitError(error.message || 'Có lỗi xảy ra khi tạo voucher');
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
              <FontAwesomeIcon icon={faTag} style={{ marginRight: '12px', color: '#8b5cf6' }} />
              Tạo Voucher Mới
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
            {/* Thông tin cơ bản */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Tiêu đề voucher <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`${styles.input} ${errors.title ? styles.error : ''}`}
                    placeholder="Nhập tiêu đề voucher"
                    disabled={isSubmitting}
                  />
                  {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Mã voucher <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                    className={`${styles.input} ${errors.code ? styles.error : ''}`}
                    placeholder="Nhập mã voucher (VD: DISCOUNT20)"
                    disabled={isSubmitting}
                  />
                  {errors.code && <span className={styles.errorText}>{errors.code}</span>}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    Mô tả <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                    placeholder="Nhập mô tả chi tiết về voucher"
                    disabled={isSubmitting}
                    rows={3}
                  />
                  {errors.description && <span className={styles.errorText}>{errors.description}</span>}
                </div>
              </div>
            </div>

            {/* Thiết lập giảm giá */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thiết lập giảm giá</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Loại giảm giá <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => handleInputChange('discountType', e.target.value as 'percent' | 'amount')}
                    className={styles.select}
                    disabled={isSubmitting}
                  >
                    <option value="percent">Phần trăm (%)</option>
                    <option value="amount">Số tiền cố định (VND)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Giá trị giảm giá <span className={styles.required}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                      className={`${styles.input} ${errors.discountValue ? styles.error : ''}`}
                      placeholder={formData.discountType === 'percent' ? 'VD: 20' : 'VD: 50000'}
                      min="0"
                      max={formData.discountType === 'percent' ? 100 : undefined}
                      step={formData.discountType === 'percent' ? 0.01 : 1000}
                      disabled={isSubmitting}
                    />
                    <FontAwesomeIcon 
                      icon={formData.discountType === 'percent' ? faPercent : faDollarSign} 
                      style={{ 
                        position: 'absolute', 
                        right: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#6b7280'
                      }} 
                    />
                  </div>
                  {errors.discountValue && <span className={styles.errorText}>{errors.discountValue}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Giá trị đơn hàng tối thiểu <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => handleInputChange('minOrderValue', parseFloat(e.target.value) || 0)}
                    className={`${styles.input} ${errors.minOrderValue ? styles.error : ''}`}
                    placeholder="VD: 100000"
                    min="0"
                    step="1000"
                    disabled={isSubmitting}
                  />
                  {errors.minOrderValue && <span className={styles.errorText}>{errors.minOrderValue}</span>}
                </div>

                {/* Only show maxDiscountValue for percent type */}
                {formData.discountType === 'percent' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Giá trị giảm tối đa <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscountValue}
                      onChange={(e) => handleInputChange('maxDiscountValue', parseFloat(e.target.value) || 0)}
                      className={`${styles.input} ${errors.maxDiscountValue ? styles.error : ''}`}
                      placeholder="VD: 50000"
                      min="0"
                      step="1000"
                      disabled={isSubmitting}
                    />
                    {errors.maxDiscountValue && <span className={styles.errorText}>{errors.maxDiscountValue}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Giới hạn sử dụng */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Giới hạn sử dụng</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Tổng số lần sử dụng <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value) || 1)}
                    className={`${styles.input} ${errors.usageLimit ? styles.error : ''}`}
                    placeholder="VD: 100"
                    min="1"
                    disabled={isSubmitting}
                  />
                  {errors.usageLimit && <span className={styles.errorText}>{errors.usageLimit}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Giới hạn mỗi người dùng <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimitPerUser}
                    onChange={(e) => handleInputChange('usageLimitPerUser', parseInt(e.target.value) || 1)}
                    className={`${styles.input} ${errors.usageLimitPerUser ? styles.error : ''}`}
                    placeholder="VD: 1"
                    min="1"
                    max={formData.usageLimit}
                    disabled={isSubmitting}
                  />
                  {errors.usageLimitPerUser && <span className={styles.errorText}>{errors.usageLimitPerUser}</span>}
                </div>
              </div>
            </div>

            {/* Thời gian áp dụng */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thời gian áp dụng</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Ngày bắt đầu <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`${styles.input} ${errors.startDate ? styles.error : ''}`}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && <span className={styles.errorText}>{errors.startDate}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`${styles.input} ${errors.endDate ? styles.error : ''}`}
                    disabled={isSubmitting}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    placeholder="Chọn ngày kết thúc (để trống = không giới hạn)"
                  />
                  {errors.endDate && <span className={styles.errorText}>{errors.endDate}</span>}
                  <small style={{ color: '#6b7280', fontSize: '12px' }}>
                    Để trống nếu không muốn giới hạn thời gian kết thúc
                  </small>
                </div>
              </div>
            </div>

            {/* Phạm vi áp dụng */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Phạm vi áp dụng</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Áp dụng cho <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.appliesTo}
                  onChange={(e) => {
                    const value = e.target.value as 'all' | 'category' | 'payment_method';
                    handleInputChange('appliesTo', value);
                    // Reset related fields when changing applies to
                    if (value !== 'category') {
                      handleInputChange('categories', []);
                    }
                    if (value !== 'payment_method') {
                      handleInputChange('paymentMethod', null);
                    }
                  }}
                  className={styles.select}
                  disabled={isSubmitting}
                >
                  <option value="all">Tất cả đơn hàng</option>
                  <option value="category">Danh mục cụ thể</option>
                  <option value="payment_method">Phương thức thanh toán cụ thể</option>
                </select>
              </div>

              <br />

              {/* Category selection */}
              {formData.appliesTo === 'category' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Chọn danh mục <span className={styles.required}>*</span>
                  </label>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: 'white' }}>
                    {categories.map((category) => (
                      <label key={category.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category.id)}
                          onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                          disabled={isSubmitting}
                          style={{ marginRight: '8px' }}
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.categories && <span className={styles.errorText}>{errors.categories}</span>}
                </div>
              )}

              {/* Payment method selection */}
              {formData.appliesTo === 'payment_method' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Chọn phương thức thanh toán <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={formData.paymentMethod || ''}
                    onChange={(e) => handleInputChange('paymentMethod', parseInt(e.target.value) || null)}
                    className={`${styles.select} ${errors.paymentMethod ? styles.error : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn phương thức thanh toán</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                  {errors.paymentMethod && <span className={styles.errorText}>{errors.paymentMethod}</span>}
                </div>
              )}
            </div>

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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTag} />
                    Tạo voucher
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

export default AddVoucherForm;