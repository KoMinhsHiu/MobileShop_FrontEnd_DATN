import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCart } from "@/context/cartContext";

import AddToCart from "../product/addToCart";
import Options from "../product/options";
import Price from "../product/price";

import { productInfoProps } from "./productInfo.types";

import styles from "./productInfo.module.scss";
import { useFetchProductData } from "@/utils/hooks/api/useFetchProductData";
import { useRouter } from "next/router";

const ProductInfo: FC<productInfoProps> = ({
  id,
  title,
  price,
  originalPrice,
  options,
  description,
  shortDescription,
  specifications = [],
  productAttributeId,
}) => {
  const [selectedOption, setSelectedOption] = useState<
    { id: string; value: string }[]
  >([]);
  const router = useRouter();
  const locale = router.locale || "en";
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();

  const { data: productData } = useFetchProductData({
    productId: id,
    selectedOption,
    refresh: true,
    locale: locale,
  });

  const handleSelectOption = (id: string, value: string) => {
    const index = selectedOption.findIndex((option) => option.id === id);
    if (index > -1) {
      const newOptions = [...selectedOption];
      newOptions[index].value = value;
      setSelectedOption(newOptions);
    } else {
      setSelectedOption([...selectedOption, { id, value }]);
    }
  };

  const handleAdd = async () => {
    const item = {
      id,
      update: 1,
      productAttributeId,
      quantity,
    };
    addToCart(item);
  };

  const handleBuyNow = async () => {
    const item = {
      id,
      update: 1,
      productAttributeId,
      quantity,
    };
    addToCart(item);
    // Navigate to checkout page
    router.push('/checkout');
  };

  return (
    <div className={styles.productInfo}>
      <h1 className={styles.productTitle}>{productData?.title || title}</h1>
      
      <div className={styles.priceSection}>
        <Price price={productData?.price || price} originalPrice={originalPrice} />
      </div>

      {shortDescription && (
        <div className={styles.shortDescription}>
          <p>{shortDescription}</p>
        </div>
      )}

      {specifications && specifications.length > 0 && (
        <div className={styles.keySpecs}>
          <h3 className={styles.specsTitle}>{t("product.keySpecifications")}</h3>
          <div className={styles.specsList}>
            {specifications.slice(0, 4).map((spec, index) => (
              <div key={index} className={styles.specItem}>
                <span className={styles.specLabel}>{spec.label}:</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {options && (() => {
        // Group color options together
        const colorOptions = options.filter(opt => 
          opt.type === 'color' || 
          opt.title?.toLowerCase().includes('color') || 
          opt.title?.toLowerCase().includes('màu')
        );
        const nonColorOptions = options.filter(opt => 
          opt.type !== 'color' && 
          !opt.title?.toLowerCase().includes('color') && 
          !opt.title?.toLowerCase().includes('màu')
        );

        // Merge all color items into one array
        const allColorItems = colorOptions.flatMap(opt => opt.items || []);
        
        // Track selected color (default to first item)
        const [selectedColorId, setSelectedColorId] = React.useState(allColorItems[0]?.id || '');

        // Map English colors to Vietnamese
        const colorMap: { [key: string]: string } = {
          'red': 'Đỏ', 'blue': 'Xanh dương', 'green': 'Xanh lá',
          'yellow': 'Vàng', 'black': 'Đen', 'white': 'Trắng',
          'pink': 'Hồng', 'purple': 'Tím', 'orange': 'Cam',
          'brown': 'Nâu', 'gray': 'Xám', 'grey': 'Xám',
          'silver': 'Bạc', 'gold': 'Vàng kim'
        };
        
        const getVietnameseColor = (color: string) => {
          const lowerColor = color.toLowerCase();
          const vietnameseColor = colorMap[lowerColor] || color;
          return vietnameseColor.charAt(0).toUpperCase() + vietnameseColor.slice(1);
        };

        return (
          <div>
            {/* Render merged color options */}
            {allColorItems.length > 0 && (
              <div style={{
                padding: '12px 0', 
                borderBottom: '1px solid #f1f2f3',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{fontSize: '16px', fontWeight: '500', color: '#333'}}>
                  Màu:
                </span>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  {allColorItems.map((item, index) => {
                    const isSelected = item.id === selectedColorId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedColorId(item.id);
                          // Find the original option for this item
                          const originalOption = colorOptions.find(opt => 
                            opt.items?.some(i => i.id === item.id)
                          );
                          if (originalOption) {
                            handleSelectOption(originalOption.id, item.id);
                          }
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: item.hex_value || '#ccc',
                          border: `2px solid ${isSelected ? '#007bff' : '#f1f2f3'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.25)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.borderColor = '#007bff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = '#f1f2f3';
                          }
                        }}
                        title={getVietnameseColor(item.value)} // Tooltip hiển thị tên màu
                      >
                        {/* Checkmark for selected color */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '16px',
                            height: '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#007bff',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Render non-color options normally */}
            {nonColorOptions.map((option, idx) => (
              <div key={idx} style={{padding: '12px 0', borderBottom: '1px solid #f1f2f3'}}>
                <span style={{fontSize: '16px', fontWeight: '500', color: '#333'}}>
                  {option.title}: 
                </span>
                <span>
                  {option.items?.map((item, index) => (
                    <span key={item.id}>
                      <span 
                        onClick={() => handleSelectOption(option.id, item.id)}
                        style={{
                          cursor: 'pointer',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          color: '#666',
                          fontSize: '14px'
                        }}
                      >
                        {item.value}
                      </span>
                      {index < (option.items?.length || 0) - 1 && <span style={{color: '#999'}}>, </span>}
                    </span>
                  )) || 'No items'}
                </span>
              </div>
            ))}
          </div>
        );
      })()}
      
      <div className={styles.actionSection}>
        <div className={styles.quantitySection}>
          <div className={styles.quantityLabel}>
            <span>{t("product.quantity")}</span>
          </div>
          <div className={styles.quantityBox}>
            <button
              className={`${styles.minus} ${quantity <= 1 ? styles.disable : ""}`}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            ></button>
            <input
              type="text"
              className={styles.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              className={styles.plus}
              onClick={() => setQuantity(quantity + 1)}
            ></button>
          </div>
        </div>
        <div className={styles.buttonsRow}>
          <button
            className={`${styles.addToCartButton} ${
              isLoading ? styles.disable : ""
            }`}
            onClick={() => handleAdd()}
            disabled={isLoading}
          >
            {t("product.addToCard")}
          </button>
          <button
            className={styles.buyNowButton}
            onClick={handleBuyNow}
            disabled={isLoading}
          >
            {t("product.buyNow")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
