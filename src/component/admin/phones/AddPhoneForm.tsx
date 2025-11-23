import { faSpinner, faTimes, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './AddPhoneForm.module.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import { fetchBrandsSafe } from "@/utils/api/brands";
import phonesAPI, { CreatePhoneRequest, PhoneCategory, PhoneColor, PhoneSpecification } from "@/utils/api/phone";
import { TransformedBrand } from "@/utils/type";
import ImageUploader, { ImageUploaderRef } from '../../uploadImage/ImageUploader';
import { message } from "antd";

interface ProductFormProps {
  onSave: () => void;
  onClose: () => void;
  onSuccess?: () => void;
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

interface AddPhoneFormData {
  name: string;
  brandId: number;
  categoryId: number;
  variantName: string;
  description: string;
  colors: VariantColor[];
  price: number;
  discountPercent?: number;
  images: string[];
  specifications: VariantSpecification[];
}

interface FormErrors {
  name?: string;
  brandId?: string;
  categoryId?: string;
  variantName?: string;
  description?: string;
  colors?: string;
  price?: string;
  images?: string;
  specifications?: string;
}

const AddPhoneForm: React.FC<ProductFormProps> = ({ onSave, onClose }) => {
  const [brands, setBrands] = useState<TransformedBrand[]>([]);
  const [categories, setCategories] = useState<PhoneCategory[]>([]);
  const [colors, setColors] = useState<PhoneColor[]>([]);
  const [specifications, setSpecifications] = useState<PhoneSpecification[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newSpecName, setNewSpecName] = useState('');
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isAddingSpec, setIsAddingSpec] = useState(false);
  const [hasColorImages, setHasColorImages] = useState<{ [key: number]: boolean }>({});
  const [hasAdditionalImages, setHasAdditionalImages] = useState(false);
  const [colorKeys, setColorKeys] = useState<{ [key: number]: string }>({});
  const [messageApi, contextHolder] = message.useMessage();
  
  const colorUploaderRefs = useRef<{ [key: number]: ImageUploaderRef }>({});
  const additionalImagesRef = useRef<ImageUploaderRef>(null);
  
  const { getAllCategories, getAllColors, createColor, getAllSpecifications, createSpecification, createPhone } = phonesAPI;

  const resetColorUploader = (index: number) => {
    setHasColorImages(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
    updateColor(index, 'imageUrl', '');
  };

  const fetchColors = useCallback(async () => {
    try {
      const colorsData = await getAllColors();
      setColors(Array.isArray(colorsData) ? colorsData : []);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
    }
  }, [getAllColors]);

  const fetchSpecifications = useCallback(async () => {
    try {
      const specsData = await getAllSpecifications();
      setSpecifications(Array.isArray(specsData) ? specsData : []);
    } catch (error) {
      console.error('Error fetching specifications:', error);
      setSpecifications([]);
    }
  }, [getAllSpecifications]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          fetchBrandsSafe(),
          getAllCategories()
        ]);

        setBrands(brandsData || []);
        setCategories(categoriesData || []);
        await Promise.all([fetchColors(), fetchSpecifications()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [getAllCategories, fetchColors, fetchSpecifications]);

  const [formData, setFormData] = useState<AddPhoneFormData>({
    name: '',
    brandId: 0,
    categoryId: 0,
    variantName: '',
    description: '',
    colors: [],
    price: 0,
    discountPercent: 0,
    images: [],
    specifications: []
  });

  // Color handling functions
  const addColor = () => {
    const newColor: VariantColor = {
      colorId: 0,
      imageUrl: ''
    };
    const newIndex = formData.colors.length;
    setColorKeys(prev => ({
      ...prev,
      [newIndex]: Date.now().toString()
    }));
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, newColor]
    }));
  };

  const removeColor = (index: number) => {
    resetColorUploader(index);
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

  const handleAddNewColor = async () => {
    if (!newColorName.trim()) return;
    
    try {
      setIsAddingColor(true);
      await createColor(newColorName.trim());
      await fetchColors(); // Refresh colors list
      setNewColorName(''); // Reset input
    } catch (error) {
      console.error('Error adding new color:', error);
    } finally {
      setIsAddingColor(false);
    }
  };

  const handleAddNewSpec = async () => {
    if (!newSpecName.trim()) return;
    
    try {
      setIsAddingSpec(true);
      await createSpecification(newSpecName.trim());
      await fetchSpecifications(); // Refresh specifications list
      setNewSpecName(''); // Reset input
    } catch (error) {
      console.error('Error adding new specification:', error);
    } finally {
      setIsAddingSpec(false);
    }
  };

  // Specification handling functions
  const addSpecification = (type: 'number' | 'text') => {
    const newSpec: VariantSpecification = {
      specId: 0,
      info: '',
      unit: type === 'number' ? '' : undefined
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof AddPhoneFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    const errorKey = field as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
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

    if (!formData.variantName.trim()) {
      newErrors.variantName = 'Tên biến thể là bắt buộc.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả biến thể là bắt buộc.';
    }

    if (formData.colors.length === 0) {
      newErrors.colors = 'Vui lòng thêm ít nhất một màu sắc.';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Giá bán phải lớn hơn 0.';
    }

    if (formData.specifications.length === 0) {
      newErrors.specifications = 'Vui lòng thêm ít nhất một thông số kỹ thuật.';
    }

    formData.colors.forEach((color, index) => {
      if (color.colorId <= 0) {
        newErrors.colors = `Vui lòng chọn màu sắc cho màu thứ ${index + 1}.`;
        return;
      }
      
      if (!hasColorImages[index]) {
        newErrors.colors = `Vui lòng chọn ảnh cho màu sắc thứ ${index + 1}.`;
        return;
      }
    });

    formData.specifications.forEach((spec, index) => {
      if (spec.specId <= 0) {
        newErrors.specifications = `Vui lòng chọn loại thông số cho thông số thứ ${index + 1}.`;
        return;
      }

      if (!spec.info.trim()) {
        newErrors.specifications = `Vui lòng cung cấp thông tin cho thông số kỹ thuật thứ ${index + 1}.`;
        return;
      }

      if (spec.unit !== undefined && !spec.unit.trim()) {
        newErrors.specifications = `Vui lòng nhập đơn vị cho thông số thứ ${index + 1}.`;
        return;
      }
    });

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

      // Upload color images
      const colorUploads = await Promise.all(
        formData.colors.map(async (color, index) => {
          const uploader = colorUploaderRefs.current[index];
          if (!uploader) {
            throw new Error(`Không thể upload ảnh cho màu sắc thứ ${index + 1}`);
          }
          const urls = await uploader.upload();
          if (!urls || urls.length === 0) {
            throw new Error(`Không thể upload ảnh cho màu sắc thứ ${index + 1}`);
          }
          return urls[0]; // Take first URL since color only needs one image
        })
      );

      // Upload additional images if any
      let additionalImages: string[] = [];
      if (hasAdditionalImages && additionalImagesRef.current) {
        const additionalUrls = await additionalImagesRef.current.upload();
        if (additionalUrls && additionalUrls.length > 0) {
          additionalImages = additionalUrls;
        }
      }

      // Update form data with uploaded image URLs
      const updatedFormData = {
        ...formData,
        colors: formData.colors.map((color, index) => ({
          ...color,
          imageUrl: colorUploads[index]
        })),
        images: additionalImages
      };

      const phoneRequestData: CreatePhoneRequest = {
        name: updatedFormData.name,
        brandId: updatedFormData.brandId,
        categoryId: updatedFormData.categoryId,
        variants: [{
          variantName: updatedFormData.variantName,
          description: updatedFormData.description,
          colors: updatedFormData.colors,
          price: updatedFormData.price,
          discountPercent: updatedFormData.discountPercent,
          images: updatedFormData.images.length > 0 ? updatedFormData.images : undefined,
          specifications: updatedFormData.specifications
        }]
      }

      console.log('Submitting phone data:', phoneRequestData);

      await createPhone(phoneRequestData);

      messageApi.success('Thêm dòng điện thoại thành công');

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to create phone:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi thêm dòng điện thoại.');
      messageApi.error('Không thể thêm dòng điện thoại. Vui lòng thử lại sau.');
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
            Thêm dòng điện thoại mới
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
                  Giá bán (VND) <span className={styles.required}>*</span>
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
                  Phần trăm giảm giá (%)
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

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mô tả chi tiết <span className={styles.required}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                placeholder="Nhập mô tả chi tiết"
                rows={4}
              />
              {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Màu sắc</h3>
            </div>
            
            <div className={styles.colorSection}>
              {/* Left side: Color form */}
              <div>
                <button 
                  type="button"
                  className={styles.addColorButton}
                  onClick={addColor}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Thêm màu mới
                </button>

                <div className={styles.colorList}>
                  {formData.colors.map((color, index) => (
                    <div key={index} className={styles.colorItem}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Chọn màu <span className={styles.required}>*</span>
                        </label>
                        <select 
                          className={styles.select}
                          value={color.colorId}
                          onChange={(e) => updateColor(index, 'colorId', parseInt(e.target.value))}
                        >
                          <option value="">Chọn màu sắc</option>
                          {(Array.isArray(colors) ? colors : []).map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Ảnh đi kèm <span className={styles.required}>*</span>
                        </label>
                        <ImageUploader 
                          key={colorKeys[index] || Date.now().toString()}
                          ref={(ref) => {
                            if (ref) colorUploaderRefs.current[index] = ref;
                          }}
                          mode='single'
                          folder='mobile-shop/phones/colors'
                          onImagesChange={(hasImages) => {
                            setHasColorImages(prev => ({
                              ...prev,
                              [index]: hasImages
                            }));
                          }}
                        />
                      </div>

                      <div className={styles.colorActions}>
                        <button
                          type="button"
                          className={styles.removeColorButton}
                          onClick={() => removeColor(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side: Quick add color */}
              <div>
                <div className={`${styles.colorList}`}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Danh sách màu có sẵn</label>
                    <select 
                      className={styles.select}
                      size={6}
                      onChange={(e) => {
                        const colorId = parseInt(e.target.value);
                        if (!formData.colors.some(c => c.colorId === colorId)) {
                          const newColor: VariantColor = {
                            colorId: colorId,
                            imageUrl: ''
                          };
                          setFormData(prev => ({
                            ...prev,
                            colors: [...prev.colors, newColor]
                          }));
                        }
                      }}
                    >
                      {colors.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.quickAddColor}>
                    <input
                      type="text"
                      placeholder="Thêm màu mới"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewColor}
                      disabled={isAddingColor || !newColorName.trim()}
                    >
                      {isAddingColor ? 'Đang thêm...' : 'Thêm'}
                    </button>
                  </div>
                </div>
              </div>
              {errors.colors && <span className={styles.errorText}>{errors.colors}</span>}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Thông số kỹ thuật</h3>
            </div>
            
            <div className={styles.colorSection}>
              {/* Left side: Specification form */}
              <div>
                <div className={styles.buttonGroup}>
                  <button 
                    type="button"
                    className={styles.addColorButton}
                    onClick={() => addSpecification('number')}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm thông số (số)
                  </button>
                  <button 
                    type="button"
                    className={styles.addColorButton}
                    onClick={() => addSpecification('text')}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm thông số (chữ)
                  </button>
                </div>

                <div className={styles.colorList}>
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className={styles.colorItem}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Loại thông số <span className={styles.required}>*</span>
                        </label>
                        <select 
                          className={styles.select}
                          value={spec.specId}
                          onChange={(e) => updateSpecification(index, 'specId', parseInt(e.target.value))}
                        >
                          <option value="">Chọn thông số</option>
                          {specifications.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Thông tin <span className={styles.required}>*</span>
                        </label>
                        <input
                          type={spec.unit !== undefined ? "number" : "text"}
                          className={styles.input}
                          placeholder={`Nhập ${spec.unit !== undefined ? 'số' : 'thông tin'}`}
                          value={spec.info}
                          onChange={(e) => updateSpecification(index, 'info', e.target.value)}
                        />
                      </div>

                      {spec.unit !== undefined && (
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Đơn vị <span className={styles.required}>*</span>
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="Ví dụ: GB, MHz, etc."
                            value={spec.unit}
                            onChange={(e) => updateSpecification(index, 'unit', e.target.value)}
                          />
                        </div>
                      )}

                      <div className={styles.colorActions}>
                        <button
                          type="button"
                          className={styles.removeColorButton}
                          onClick={() => removeSpecification(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side: Quick add specification */}
              <div>
                <div className={`${styles.colorList}`}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Danh sách thông số có sẵn</label>
                    <select 
                      className={styles.select}
                      size={6}
                      onChange={(e) => {
                        const specId = parseInt(e.target.value);
                        if (!formData.specifications.some(s => s.specId === specId)) {
                          const spec = specifications.find(s => s.id === specId);
                          if (spec) {
                            const newSpec: VariantSpecification = {
                              specId: spec.id,
                              info: '',
                            };
                            setFormData(prev => ({
                              ...prev,
                              specifications: [...prev.specifications, newSpec]
                            }));
                          }
                        }
                      }}
                    >
                      {specifications.map(spec => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.quickAddColor}>
                    <input
                      type="text"
                      placeholder="Thêm thông số mới"
                      value={newSpecName}
                      onChange={(e) => setNewSpecName(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewSpec}
                      disabled={isAddingSpec || !newSpecName.trim()}
                    >
                      {isAddingSpec ? 'Đang thêm...' : 'Thêm'}
                    </button>
                  </div>
                </div>
              </div>
              {errors.specifications && <span className={styles.errorText}>{errors.specifications}</span>}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Hình ảnh bổ sung</h3>
            </div>

            {/* Image */}
            <div className={styles.formGroup}>
                <ImageUploader 
                  ref={additionalImagesRef}
                  mode='multiple'
                  folder='mobile-shop/phones/additional'
                  onImagesChange={setHasAdditionalImages}
                />
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
    </>
  );
}

export default AddPhoneForm;