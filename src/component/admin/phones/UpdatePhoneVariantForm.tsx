import { faSpinner, faTimes, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './AddPhoneForm.module.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import phonesAPI, { PhoneColor, PhoneSpecification, UpdateVariantColor, UpdateVariantImage, UpdateVariantRequest, UpdateVariantSpecification } from "@/utils/api/phone";
import { PhoneVariant, ColorVariant, SpecificationInfo, ImageVariant } from "@/utils/type/phoneVariant";
import ImageUploader, { ImageUploaderRef } from "@/component/uploadImage/ImageUploader";
import { message } from "antd";

interface UpdatePhoneVariantFormProps {
  variant: Omit<PhoneVariant, 'phone'>;
  onSave: () => void;
  onClose: () => void;
  onSuccess?: () => void;
}

interface UpdateVariantFormData {
  variantName: string;
  description: string;
  colors: ColorVariant[];
  price: number;
  discountPercent?: number;
  images: ImageVariant[];
  specifications: SpecificationInfo[];
}

interface FormErrors {
  variantName?: string;
  description?: string;
  colors?: string;
  price?: string;
  specifications?: string;
}

const UpdatePhoneVariantForm: React.FC<UpdatePhoneVariantFormProps> = ({
  variant,
  onSave,
  onClose,
  onSuccess
}) => {
  const [colors, setColors] = useState<PhoneColor[]>([]);
  const [specifications, setSpecifications] = useState<PhoneSpecification[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newSpecName, setNewSpecName] = useState('');
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isAddingSpec, setIsAddingSpec] = useState(false);
  const [hasColorImages, setHasColorImages] = useState<{ [key: number]: boolean }>({});
  // Track modified colors
  const [modifiedColors, setModifiedColors] = useState<{ [key: number]: { colorChanged?: boolean; imageChanged?: boolean } }>({});
  // Store original color data for comparison
  const [originalColors] = useState<ColorVariant[]>(variant.colors);
  // Store color image URLs
  const [colorImageUrls, setColorImageUrls] = useState<{ [key: number]: string }>({});
  // Store additional image URLs
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  // Track deleted image URLs
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  // Convert variant data to form data
  const [formData, setFormData] = useState<UpdateVariantFormData>({
    variantName: variant.variantName,
    description: variant.description,
    price: variant.price.price,
    discountPercent: variant.discount?.discountPercent,
    colors: variant.colors,
    specifications: variant.specifications,
    images: variant.images,
  });

  const [messageApi, contextHolder] = message.useMessage();
  
  // Check if form has changes
  const checkFormChanges = useCallback(() => {
    // Check basic fields
    const basicFieldsChanged = 
      formData.variantName !== variant.variantName ||
      formData.description !== variant.description ||
      formData.price !== variant.price.price ||
      formData.discountPercent !== variant.discount?.discountPercent;

    // Check colors changes
    const colorsChanged = 
      formData.colors.length !== variant.colors.length ||
      Object.keys(modifiedColors).length > 0;

    // Check specifications changes
    const specsChanged = 
      formData.specifications.length !== variant.specifications.length ||
      JSON.stringify(formData.specifications) !== JSON.stringify(variant.specifications);

    // Check additional images changes
    const imagesChanged = 
      additionalImageUrls.length !== variant.images.filter(img => 
        !variant.colors.some(color => color.imageId === img.image.id)
      ).length ||
      deletedImageUrls.length > 0;

    setIsFormChanged(basicFieldsChanged || colorsChanged || specsChanged || imagesChanged);
  }, [
    formData, 
    variant, 
    modifiedColors, 
    additionalImageUrls, 
    deletedImageUrls
  ]);

  // Initialize color images state from variant data
  useEffect(() => {
    // Initialize color images
    const initialImageUrls: { [key: number]: string } = {};
    const initialHasImages: { [key: number]: boolean } = {};

    variant.colors.forEach((color, index) => {
      const image = variant.images.find(img => img.image.id === color.imageId);
      if (image) {
        initialImageUrls[index] = image.image.imageUrl;
        initialHasImages[index] = true;
      } else {
        initialImageUrls[index] = '';
        initialHasImages[index] = false;
      }
    });

    setColorImageUrls(initialImageUrls);
    setHasColorImages(initialHasImages);

    // Initialize additional images
    const additionalImages = variant.images
      .filter(img => !variant.colors.some(color => color.imageId === img.image.id));
    
    const additionalUrls = additionalImages.map(img => img.image.imageUrl);
    setAdditionalImageUrls(additionalUrls);
    setDeletedImageUrls([]);
  }, [variant.colors, variant.images]);

  const colorUploaderRefs = useRef<{ [key: number]: ImageUploaderRef }>({});
  const additionalImagesRef = useRef<ImageUploaderRef>(null);

  const { getAllColors, createColor, getAllSpecifications, createSpecification, updatePhoneVariant } = phonesAPI;

  // Effect to check form changes
  useEffect(() => {
    checkFormChanges();
  }, [
    formData,
    modifiedColors,
    additionalImageUrls,
    deletedImageUrls,
    checkFormChanges
  ]);

  // Memoize handlers
  const handleColorImageChange = useCallback((index: number, hasImages: boolean) => {
    console.log(`Color ${index} image change:`, { hasImages, prev: hasColorImages[index] });
    
    // Update has images state
    setHasColorImages(prev => {
      const newState = {
        ...prev,
        [index]: hasImages
      };
      console.log('New hasColorImages state:', newState);
      return newState;
    });

    // Get the current color
    const currentColor = formData.colors[index];
    const hasOriginalImage = Boolean(currentColor.imageId && 
      variant.images.some(img => img.image.id === currentColor.imageId));

    console.log(`Color ${index} state:`, {
      hasOriginalImage,
      currentImageId: currentColor.imageId,
      newHasImages: hasImages
    });

    if (hasOriginalImage !== hasImages) {
      console.log(`Marking color ${index} as modified due to image ${hasImages ? 'addition' : 'removal'}`);
      setModifiedColors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          imageChanged: true
        }
      }));
    }
  }, [formData.colors, variant.images, hasColorImages]);

  // Fetch colors and specifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colorsData, specsData] = await Promise.all([
          getAllColors(),
          getAllSpecifications()
        ]);
        setColors(Array.isArray(colorsData) ? colorsData : []);
        setSpecifications(Array.isArray(specsData) ? specsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getAllColors, getAllSpecifications]);

  // Color handling functions
  const addColor = () => {
    const newColor: ColorVariant = {
      variantId: variant.id,
      imageId: 0,
      color: { id: 0, name: ''}
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

    // Remove the image state and refs for this color
    setHasColorImages(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });

    setModifiedColors(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });

    // Clean up ref
    delete colorUploaderRefs.current[index];
  };

  const updateColor = (index: number, field: keyof ColorVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
    
    // Track color changes
    if (field === 'color') {
      setModifiedColors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          colorChanged: true
        }
      }));
    }
  };

  // Specification handling functions
  const addSpecification = (type: 'number' | 'text') => {
    const newSpec: SpecificationInfo = {
      specification: { name: '' },
      info: '',
      unit: type === 'number' ? '' : undefined,
      valueNumeric: type === 'number' ? 0 : undefined,
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

  const updateSpecification = (index: number, field: keyof SpecificationInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));

    // Mark specification as modified
    setModifiedSpecs(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Form handling
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [modifiedSpecs, setModifiedSpecs] = useState<{ [key: number]: boolean }>({}); // Track modified specifications

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      return newData;
    });

    const errorKey = field as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
      if (color.color.id <= 0) {
        newErrors.colors = `Vui lòng chọn màu sắc cho màu thứ ${index + 1}.`;
        return;
      }
      
      if (!hasColorImages[index]) {
        newErrors.colors = `Vui lòng chọn ảnh cho màu sắc thứ ${index + 1}.`;
        return;
      }
    });

    formData.specifications.forEach((spec, index) => {
      if (spec.specification.name === '') {
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

      // Prepare color update data
      const colorUpdates: UpdateVariantColor[] = [];
    
      // Process each color
      for (let i = 0; i < formData.colors.length; i++) {
        const currentColor = formData.colors[i];
        const originalColor = originalColors.find(c => c.color.id === currentColor.color.id);
        const modifications = modifiedColors[i] || {};

        // Case 1: New color
        if (!originalColor) {
          // For new colors, we must have an image
          const colorRef = colorUploaderRefs.current[i];
          if (!colorRef) {
            throw new Error(`Không thể tìm thấy reference cho ảnh màu ${currentColor.color.name}`);
          }

          // Upload image for new color
          const uploadedUrls = await colorRef.upload();
          if (!uploadedUrls || uploadedUrls.length === 0) {
            throw new Error(`Không thể upload ảnh cho màu ${currentColor.color.name}`);
          }

          colorUpdates.push({
            colorId: currentColor.color.id,
            imageUrl: uploadedUrls[0]
          });
          continue;
        }

        // Case 2: Modified color
        if (modifications.colorChanged || modifications.imageChanged) {
          const update: UpdateVariantColor = {
            colorId: originalColor.color.id
          };

          // Handle color change
          if (modifications.colorChanged) {
            update.newColorId = currentColor.color.id;
          }

          // Handle image change
          if (modifications.imageChanged) {
            if (!hasColorImages[i]) {
              // If no images, mark for deletion
              update.isDeleted = true;
              console.log(`Color ${i} marked for deletion`);
            } else if (colorImageUrls[i]) {
              update.imageUrl = colorImageUrls[i];
              console.log(`Color ${i} new image:`, update.imageUrl);
            }
          }

          colorUpdates.push(update);
          continue;
        }
      }

      // Case 3: Deleted colors
      originalColors.forEach(originalColor => {
        if (!formData.colors.some(c => c.color.id === originalColor.color.id)) {
          colorUpdates.push({
            colorId: originalColor.color.id,
            isDeleted: true
          });
        }
      });

      // Process additional images
      const imageUpdates: UpdateVariantImage[] = [];

      // Xử lý ảnh đã bị xóa
      const deletedExistingImages = variant.images
        .filter(img => 
          !variant.colors.some(color => color.imageId === img.image.id) &&
          deletedImageUrls.includes(img.image.imageUrl)
        )
        .map(img => ({
          id: img.id,
          imageUrl: '',
          isDeleted: true
        }));

      console.log('Deleted existing images:', deletedExistingImages);
      imageUpdates.push(...deletedExistingImages);

      // Upload additional images
      if (additionalImagesRef.current) {
        const uploadedUrls = await additionalImagesRef.current.upload();
        if (uploadedUrls && uploadedUrls.length > 0) {
          uploadedUrls.forEach(url => {
            imageUpdates.push({
              imageUrl: url
            });
          });
        }
      }

      // Prepare update request
      const updateRequest: UpdateVariantRequest = {
        variantName: formData.variantName !== variant.variantName ? formData.variantName : undefined,
        description: formData.description !== variant.description ? formData.description : undefined,
        price: formData.price !== variant.price.price ? formData.price : undefined,
        discount: formData.discountPercent !== variant.discount?.discountPercent ? formData.discountPercent || 0 : undefined,
        colors: colorUpdates.length > 0 ? colorUpdates : undefined,
        images: imageUpdates.length > 0 ? imageUpdates : undefined,
        specifications: formData.specifications
          .map((spec, index): UpdateVariantSpecification | null => {
            // Find specification ID from name
            const specDefinition = specifications.find(s => s.name === spec.specification.name);
            if (!specDefinition) {
              console.warn(`Could not find specification with name: ${spec.specification.name}`);
              return null;
            }

            // Find the original spec if it exists
            const originalSpec = variant.specifications.find(
              os => os.specification.name === spec.specification.name
            );
            
            const info = spec.valueNumeric !== undefined ? spec.valueNumeric.toString() : spec.info;

            // Case 1: New specification - only provide specId and info
            if (!originalSpec) {
              return {
                specId: specDefinition.id,
                info,
                unit: spec.unit
              };
            }

            // Case 2: Modified specification - include newSpecId for spec change
            if (modifiedSpecs[index]) {
              const specUpdate: UpdateVariantSpecification = {
                specId: specDefinition.id,
                info
              };

              // Only include unit if it changed
              if (spec.unit !== originalSpec.unit) {
                specUpdate.unit = spec.unit;
              }

              // Only include newSpecId if spec type changed
              if (originalSpec.specification.name !== spec.specification.name) {
                specUpdate.newSpecId = specDefinition.id;
              }

              return specUpdate;
            }

            return null;
          })
          .concat(
            // Case 3: Deleted specifications
            variant.specifications
              .filter(originalSpec => !formData.specifications
                .some(spec => spec.specification.name === originalSpec.specification.name))
              .map((deletedSpec): UpdateVariantSpecification => {
                // Find the specification definition for the deleted spec
                const deletedSpecDefinition = specifications.find(
                  s => s.name === deletedSpec.specification.name
                );
                if (!deletedSpecDefinition) {
                  console.warn(`Could not find specification with name: ${deletedSpec.specification.name}`);
                  return {
                    specId: 0, // Fallback ID if spec definition not found
                    info: '',
                    isDeleted: true
                  };
                }
                return {
                  specId: deletedSpecDefinition.id,
                  info: '',
                  isDeleted: true
                };
              })
          )
          .filter((spec): spec is UpdateVariantSpecification => spec !== null)
      };

      // Log request for debugging
      console.log('Update Request:', {
        ...updateRequest,
        specifications: updateRequest.specifications?.map(spec => ({
          ...spec,
          name: specifications.find(s => s.id === spec.specId)?.name
        }))
      });

      // Call API to update variant
      await updatePhoneVariant(variant.id, updateRequest);
    
      messageApi.success('Cập nhật biến thể điện thoại thành công!');

      onSuccess?.();
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to update variant:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi cập nhật biến thể.');
      messageApi.error('Không thể cập nhật biến thể điện thoại. Vui lòng thử lại sau.');
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
            Cập nhật biến thể
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin biến thể</h3>
            <div className={styles.formGrid}>
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
                  placeholder="Ví dụ: 128GB, 256GB"
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
                  value={formData.discountPercent}
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
                          value={color.color.id}
                          onChange={(e) => updateColor(index, 'color', { id: parseInt(e.target.value), name: '' })}
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
                          key={`color-${color.color.id || index}`}
                          ref={(ref) => {
                            if (ref) colorUploaderRefs.current[index] = ref;
                          }}
                          mode='single'
                          folder='mobile-shop/phones/colors'
                          onImagesChange={(hasImages) => handleColorImageChange(index, hasImages)}
                          onUrlsChange={(urls) => {
                            const newUrl = urls.length > 0 ? urls[0] : '';
                            setColorImageUrls(prev => ({
                              ...prev,
                              [index]: newUrl
                            }));
                          }}
                          defaultUrls={colorImageUrls[index] ? [colorImageUrls[index]] : []}
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
                        if (!formData.colors.some(c => c.color.id === colorId)) {
                          const newColor: ColorVariant = {
                            variantId: variant.id,
                            imageId: 0,
                            color: { id: colorId, name: ''}
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
                      onClick={async () => {
                        if (!newColorName.trim()) return;
                        try {
                          setIsAddingColor(true);
                          await createColor(newColorName.trim());
                          const colorsData = await getAllColors();
                          setColors(Array.isArray(colorsData) ? colorsData : []);
                          setNewColorName('');
                        } catch (error) {
                          console.error('Error adding new color:', error);
                        } finally {
                          setIsAddingColor(false);
                        }
                      }}
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
                          value={spec.specification.name}
                          onChange={(e) => updateSpecification(index, 'specification', { name: e.target.value })}
                        >
                          <option value="">Chọn thông số</option>
                          {specifications.map(s => (
                            <option key={s.id} value={s.name}>
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
                          value={spec.valueNumeric !== undefined ? spec.valueNumeric : spec.info}
                          onChange={(e) => {
                            if (spec.unit !== undefined) {
                              updateSpecification(index, 'valueNumeric', parseFloat(e.target.value) || 0);
                            } else {
                              updateSpecification(index, 'info', e.target.value);
                            }
                          }}
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
                        const specName = e.target.value;
                        if (!formData.specifications.some(s => s.specification.name === specName)) {
                          const spec = specifications.find(s => s.name === specName);
                          if (spec) {
                            const newSpec: SpecificationInfo = {
                              specification: { name: spec.name },
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
                      onClick={async () => {
                        if (!newSpecName.trim()) return;
                        try {
                          setIsAddingSpec(true);
                          await createSpecification(newSpecName.trim());
                          const specsData = await getAllSpecifications();
                          setSpecifications(Array.isArray(specsData) ? specsData : []);
                          setNewSpecName('');
                        } catch (error) {
                          console.error('Error adding new specification:', error);
                        } finally {
                          setIsAddingSpec(false);
                        }
                      }}
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

            <div className={styles.formGroup}>
                <ImageUploader 
                  ref={additionalImagesRef}
                  mode='multiple'
                  folder='mobile-shop/phones/additional'
                  defaultUrls={additionalImageUrls}
                  onUrlDelete={(url) => {
                    console.log('Additional image URL deleted:', url);
                    setDeletedImageUrls(prev => ([...prev, url]));
                  }}
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

export default UpdatePhoneVariantForm;
