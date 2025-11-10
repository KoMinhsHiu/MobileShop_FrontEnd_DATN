import useFetchPhoneDetail from '@/utils/hooks/api/useFetchPhoneDetail';
import styles from './PhoneDetailManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faPen, faChevronDown, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PhoneVariant } from "@/utils/type";
import UpdatePhoneForm from './UpdatePhoneForm';
import UpdatePhoneVariantForm from './UpdatePhoneVariantForm';
import AddPhoneVariantForm from './AddPhoneVariantForm';
import phonesAPI from '@/utils/api/phone';
import { message } from 'antd';

type PhoneDetailManagementProps = {
  id: string;
};

const PhoneDetailManagement = ({ id }: PhoneDetailManagementProps) => {
  const [expandedVariants, setExpandedVariants] = useState<number[]>([]);
  const [showUpdatePhoneModal, setShowUpdatePhoneModal] = useState(false);
  const [showUpdateVariantModal, setShowUpdateVariantModal] = useState(false);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Omit<PhoneVariant, 'phone'> | null>(null);
  const { loading, error, phone } = useFetchPhoneDetail(Number(id));
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { deletePhoneVariant } = phonesAPI;

  const handleBack = () => {
    router.push('/admin/phones');
  }

  const handleDelete = async (variantId: number) => {
    try {
      await deletePhoneVariant(variantId);
      messageApi.success('Xóa biến thể điện thoại thành công!');
      // Reload phone data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting phone variant:', error);
      messageApi.error('Không thể xóa biến thể điện thoại. Vui lòng thử lại sau.');
    }
  }

  if (loading) {
    return (
      <div className={styles.phoneDetail}>
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          <p>Đang tải chi tiết điện thoại...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.phoneDetail}>
        <div className={styles.errorContainer}>
          <h2>Lỗi tải dữ liệu</h2>
          <p>Không thể tải chi tiết điện thoại. Vui lòng thử lại sau.</p>
          <button onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
    {contextHolder}
    <div className={styles.phoneDetail}>
      <div>
        <button 
          onClick={handleBack}
          className={styles.backButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Quay lại</span>
        </button>
      </div>

      <div className={styles.phoneGeneralInfo}>
        <div className={styles.header}>
          <h2>Thông tin chung</h2>
          <button 
            className={styles.editButton}
            onClick={() => setShowUpdatePhoneModal(true)}
            title="Chỉnh sửa thông tin"
          >
            <FontAwesomeIcon icon={faPen} />
            <span>Sửa</span>
          </button>
        </div>
        
        <div className={styles.infoContent}>
          <div className={styles.infoGroup}>
            <label>Tên sản phẩm:</label>
            <span>{phone?.name || "Chưa có thông tin"}</span>
          </div>

          <div className={styles.infoGroup}>
            <label>Thương hiệu:</label>
            <span>{phone?.brand?.name || "Chưa có thông tin"}</span>
          </div>

          <div className={styles.infoGroup}>
            <label>Danh mục:</label>
            <span>{phone?.category?.name || "Chưa có thông tin"}</span>
          </div>
        </div>
      </div>
      <div className={styles.variantsSection}>
        <div className={styles.variantsHeader}>
          <h2>Thông tin biến thể</h2>
          <button 
            className={styles.addVariantButton}
            onClick={() => setShowAddVariantModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm biến thể</span>
          </button>
        </div>

        <div className={styles.variantsList}>
          {phone?.variants?.map((variant) => {
            const isExpanded = expandedVariants.includes(variant.id);
            
            return (
              <div key={variant.id} className={styles.variantItem}>
                <div 
                  className={styles.variantHeader}
                  onClick={() => {
                    setExpandedVariants(prev => 
                      isExpanded 
                        ? prev.filter(id => id !== variant.id)
                        : [...prev, variant.id]
                    );
                  }}
                >
                  <div className={styles.headerContent}>
                    <h3>{variant.variantName}</h3>
                  </div>
                  <div className={styles.headerActions}>
                    <button 
                      className={styles.editButton} 
                      title="Sửa biến thể"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(variant);
                        setShowUpdateVariantModal(true);
                        e.stopPropagation();
                        console.log('Edit clicked');
                      }}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button 
                      className={styles.deleteButton} 
                      title="Xóa biến thể"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Bạn có chắc chắn muốn xóa biến thể này không?')) {
                          handleDelete(variant.id);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`${styles.collapseIcon} ${isExpanded ? styles.expanded : ''}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.variantContent}>
                    <div className={styles.contentLayout}>
                      <div className={styles.leftSection}>
                        <div className={styles.infoSection}>
                          <div className={styles.infoGroup}>
                            <label>Tên biến thể:</label>
                            <span>{variant.variantName}</span>
                          </div>
                          
                          <div className={styles.infoGroup}>
                            <label>Giá bán:</label>
                            <span>{variant.price.price.toLocaleString('vi-VN')} đ</span>
                          </div>
                          
                          <div className={styles.infoGroup}>
                            <label>Giảm giá:</label>
                            <span>{variant.discount ? `${variant.discount.discountPercent}%` : "0%"}</span>
                          </div>

                          <div className={styles.descriptionGroup}>
                            <label>Mô tả:</label>
                            <span>{variant.description || "Chưa có mô tả"}</span>
                          </div>
                        </div>

                        <div className={styles.colorSection}>
                          <h4>Màu sắc</h4>
                          <div className={styles.colorsList}>
                            {variant.colors.map((color) => (
                              <div key={color.color.id} className={styles.colorItem}>
                                <div className={styles.colorImage}>
                                  <img 
                                    src={variant.images.find(img => img.image.id === color.imageId)?.image.imageUrl || ''} 
                                    alt={color.color.name}
                                  />
                                </div>
                                <span>{color.color.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={styles.imagesSection}>
                          <h4>Hình ảnh khác</h4>
                          <div className={styles.imagesList}>
                            {variant.images
                              .filter(img => !variant.colors.some(color => color.imageId === img.image.id))
                              .map((img) => (
                                <div key={img.id} className={styles.imageItem}>
                                  <img src={img.image.imageUrl} alt={`Ảnh ${img.id}`} />
                                </div>
                              ))}
                            {variant.images.filter(img => !variant.colors.some(color => color.imageId === img.id)).length === 0 && (
                              <p className={styles.noImages}>Không có hình ảnh khác</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.rightSection}>
                        <div className={styles.specificationsSection}>
                          <h4>Thông số kỹ thuật</h4>
                          <table className={styles.specificationsTable}>
                            <tbody>
                              {variant.specifications.map((spec) => (
                                <tr key={spec.specification.name}>
                                  <td>{spec.specification.name}</td>
                                  <td>{spec.info}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Update Phone Modal */}
      {showUpdatePhoneModal && phone && (
        <UpdatePhoneForm
          phone={phone}
          onSave={() => {
            setShowUpdatePhoneModal(false);
          }}
          onClose={() => {
            setShowUpdatePhoneModal(false);
          }}
          onSuccess={() => {
            setShowUpdatePhoneModal(false);
            // Reload phone data
            window.location.reload();
          }}
        />
      )}

      {/* Update Variant Modal */}
      {showUpdateVariantModal && selectedVariant && (
        <UpdatePhoneVariantForm
          variant={selectedVariant}
          onSave={() => {
            setShowUpdateVariantModal(false);
            setSelectedVariant(null);
          }}
          onClose={() => {
            setShowUpdateVariantModal(false);
            setSelectedVariant(null);
          }}
          onSuccess={() => {
            setShowUpdateVariantModal(false);
            setSelectedVariant(null);
            // Reload phone data
            window.location.reload();
          }}
        />
      )}

      {/* Add Variant Modal */}
      {showAddVariantModal && phone && (
        <AddPhoneVariantForm
          phoneId={phone.id}
          onSave={() => {
            setShowAddVariantModal(false);
          }}
          onClose={() => {
            setShowAddVariantModal(false);
          }}
          onSuccess={() => {
            setShowAddVariantModal(false);
            // Reload phone data
            window.location.reload();
          }}
        />
      )}
    </div>
    </>
  );
}

export default PhoneDetailManagement;