import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes,
  faImage,
  faBox
} from '@fortawesome/free-solid-svg-icons';
import { Product } from '../admin.types';
import styles from './ProductVariantsModal.module.scss';

interface ProductVariantsModalProps {
  product: Product;
  onClose: () => void;
}

const ProductVariantsModal: React.FC<ProductVariantsModalProps> = ({
  product,
  onClose
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusClass = (quantity: number) => {
    return quantity > 0 ? styles.inStock : styles.outOfStock;
  };

  const getStatusText = (quantity: number) => {
    return quantity > 0 ? 'Còn hàng' : 'Hết hàng';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.productInfo}>
            <div className={styles.productImage}>
              {product.mainImage ? (
                <img src={product.mainImage} alt={product.name} />
              ) : (
                <div className={styles.noImage}>
                  <FontAwesomeIcon icon={faImage} />
                </div>
              )}
            </div>
            <div className={styles.productDetails}>
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productCategory}>{product.category}</p>
              <p className={styles.productSupplier}>Nhà cung cấp: {product.supplier}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.sectionHeader}>
            <FontAwesomeIcon icon={faBox} className={styles.sectionIcon} />
            <h3>Danh sách biến thể sản phẩm</h3>
            <span className={styles.variantCount}>
              {product.variants.length} biến thể
            </span>
          </div>

          {product.variants.length > 0 ? (
            <div className={styles.variantsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Màu sắc</th>
                    <th>Dung lượng</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant, index) => (
                    <tr key={variant.id || index}>
                      <td>
                        <div className={styles.variantImageCell}>
                          {variant.images && variant.images.length > 0 ? (
                            <div className={styles.variantImagesGrid}>
                              {variant.images.slice(0, 3).map((image, imageIndex) => (
                                <img 
                                  key={imageIndex}
                                  src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                                  alt={`${variant.color} ${variant.storage} - ${imageIndex + 1}`}
                                  className={styles.variantImage}
                                />
                              ))}
                              {variant.images.length > 3 && (
                                <div className={styles.moreImagesIndicator}>
                                  +{variant.images.length - 3}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={styles.noVariantImage}>
                              <FontAwesomeIcon icon={faImage} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.colorCell}>
                          <div 
                            className={styles.colorIndicator}
                            style={{ backgroundColor: getColorCode(variant.color) }}
                          />
                          {variant.color}
                        </div>
                      </td>
                      <td className={styles.storage}>{variant.storage}</td>
                      <td className={styles.price}>{formatPrice(variant.price)}</td>
                      <td className={styles.quantity}>{variant.quantity}</td>
                      <td>
                        <span className={`${styles.status} ${getStatusClass(variant.quantity)}`}>
                          {getStatusText(variant.quantity)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noVariants}>
              <FontAwesomeIcon icon={faBox} />
              <p>Chưa có biến thể nào cho sản phẩm này</p>
            </div>
          )}

          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Tổng số biến thể:</span>
              <span className={styles.summaryValue}>{product.variants.length}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Tổng số lượng tồn:</span>
              <span className={styles.summaryValue}>
                {product.variants.reduce((sum, variant) => sum + variant.quantity, 0)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Giá từ:</span>
              <span className={styles.summaryValue}>
                {product.variants.length > 0 
                  ? formatPrice(Math.min(...product.variants.map(v => v.price)))
                  : 'N/A'
                }
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Giá đến:</span>
              <span className={styles.summaryValue}>
                {product.variants.length > 0 
                  ? formatPrice(Math.max(...product.variants.map(v => v.price)))
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.closeModalButton}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color code from color name
const getColorCode = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Titan Xanh': '#007AFF',
    'Titan Trắng': '#F2F2F7',
    'Titan Đen': '#1C1C1E',
    'Titan Vàng': '#FFD700',
    'Xám Space': '#8E8E93',
    'Bạc': '#C7C7CC',
    'Đỏ': '#FF3B30',
    'Xanh lá': '#34C759',
    'Xanh dương': '#007AFF',
    'Tím': '#AF52DE',
    'Cam': '#FF9500',
    'Hồng': '#FF2D92'
  };
  
  return colorMap[colorName] || '#8E8E93';
};

export default ProductVariantsModal;
