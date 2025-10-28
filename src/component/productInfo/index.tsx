import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";

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
  onDebugInfo,
}) => {
  const [selectedOption, setSelectedOption] = useState<
    { id: string; value: string }[]
  >([]);
  const router = useRouter();
  const locale = router.locale || "en";
  const { addToCart, addToCartApi, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();

  // Extract color options for phone variants
  const colorOptions = React.useMemo(() => 
    options?.filter(opt => 
      opt.type === 'color' || 
      opt.title?.toLowerCase().includes('color') || 
      opt.title?.toLowerCase().includes('màu')
    ) || [], [options]
  );
  
  const allColorItems = colorOptions.flatMap(opt => opt.items || []);
  const [selectedColorId, setSelectedColorId] = useState('');

  const handleSelectOption = React.useCallback((id: string, value: string) => {
    const index = selectedOption.findIndex((option) => option.id === id);
    if (index > -1) {
      const newOptions = [...selectedOption];
      newOptions[index].value = value;
      setSelectedOption(newOptions);
    } else {
      setSelectedOption([...selectedOption, { id, value }]);
    }
  }, [selectedOption]);

  // Auto-select first color when component loads
  React.useEffect(() => {
    if (allColorItems.length > 0 && !selectedColorId) {
      const firstColor = allColorItems[0];
      const debugData = {
        firstColor,
        selectedColorId,
        allColorItems,
        colorOptions,
        selectedOption
      };
      console.log('🎨 Auto-selecting first color:', debugData);
      onDebugInfo?.(debugData);
      
      setSelectedColorId(firstColor.id);
      // Also update selectedOption state
      const originalOption = colorOptions.find(opt => 
        opt.items?.some(i => i.id === firstColor.id)
      );
      if (originalOption) {
        console.log('🎨 Calling handleSelectOption with:', originalOption.id, firstColor.id);
        handleSelectOption(originalOption.id, firstColor.id);
      }
    }
  }, [allColorItems, colorOptions, handleSelectOption, selectedColorId, onDebugInfo, selectedOption]);

  // Additional auto-select when allColorItems changes
  React.useEffect(() => {
    if (allColorItems.length > 0 && !selectedColorId) {
      const firstColor = allColorItems[0];
      console.log('🎨 Additional auto-select triggered:', {
        firstColor,
        selectedColorId,
        allColorItems
      });
      
      setSelectedColorId(firstColor.id);
      const originalOption = colorOptions.find(opt => 
        opt.items?.some(i => i.id === firstColor.id)
      );
      if (originalOption) {
        console.log('🎨 Additional handleSelectOption call:', originalOption.id, firstColor.id);
        handleSelectOption(originalOption.id, firstColor.id);
      }
    }
  }, [allColorItems, selectedColorId, colorOptions, handleSelectOption]);

  // Force auto-select after a short delay to ensure component is fully mounted
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (allColorItems.length > 0 && !selectedColorId) {
        const firstColor = allColorItems[0];
        console.log('🎨 Force auto-select after delay:', {
          firstColor,
          selectedColorId,
          allColorItems
        });
        
        setSelectedColorId(firstColor.id);
        const originalOption = colorOptions.find(opt => 
          opt.items?.some(i => i.id === firstColor.id)
        );
        if (originalOption) {
          console.log('🎨 Force handleSelectOption call:', originalOption.id, firstColor.id);
          handleSelectOption(originalOption.id, firstColor.id);
        }
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, [allColorItems, selectedColorId, colorOptions, handleSelectOption]);

  // Don't fetch product data again if we already have it from props
  // const { data: productData } = useFetchProductData({
  //   productId: id,
  //   selectedOption,
  //   refresh: true,
  //   locale: locale,
  // });

  const handleAdd = async () => {
    // Check if this is a phone variant (numeric ID means it's a variantId)
    const variantId = parseInt(id);
    const isPhoneVariant = !isNaN(variantId);

    if (isPhoneVariant) {
      // Use new API for phone variants
      console.log('🛒 handleAdd - selectedOption state:', selectedOption);
      console.log('🛒 handleAdd - allColorItems:', allColorItems);
      console.log('🛒 handleAdd - selectedColorId state:', selectedColorId);
      
      const selectedColorIdFromOption = selectedOption.find(opt => opt.id === "colors")?.value;
      console.log('🛒 handleAdd - found selectedColorId from selectedOption:', selectedColorIdFromOption);
      
      if (!selectedColorIdFromOption) {
        console.log('❌ No color selected, showing error');
        toast.error("Vui lòng chọn màu sắc");
        return;
      }

      // Extract price and discount from the price string (remove currency symbols)
      const priceStr = price.replace(/[^\d]/g, ''); // Remove all non-digits
      const originalPriceStr = originalPrice?.replace(/[^\d]/g, '') || priceStr;
      
      const finalPrice = parseInt(priceStr);
      const originalPriceNum = parseInt(originalPriceStr);
      const discountAmount = originalPriceNum - finalPrice;

      const apiItem = {
        variantId: variantId,
        colorId: parseInt(selectedColorIdFromOption),
        quantity: quantity,
        price: originalPriceNum,
        discount: discountAmount
      };

      console.log('🔍 ProductInfo - Selected data:', {
        variantId,
        selectedColorIdFromOption,
        selectedOption,
        quantity,
        price: priceStr,
        originalPrice: originalPriceStr,
        finalPrice,
        originalPriceNum,
        discountAmount,
        apiItem
      });

      await addToCartApi(apiItem);
    } else {
      // Use old logic for non-phone variants
      const item = {
        id,
        update: 1,
        productAttributeId,
        quantity,
      };
      addToCart(item);
    }
  };

  const handleBuyNow = async () => {
    // Check if this is a phone variant (numeric ID means it's a variantId)
    const variantId = parseInt(id);
    const isPhoneVariant = !isNaN(variantId);

    if (isPhoneVariant) {
      // Use new API for phone variants
      console.log('🛒 handleBuyNow - selectedOption state:', selectedOption);
      const selectedColorIdFromOption = selectedOption.find(opt => opt.id === "colors")?.value;
      console.log('🛒 handleBuyNow - found selectedColorId from selectedOption:', selectedColorIdFromOption);
      
      if (!selectedColorIdFromOption) {
        console.log('❌ No color selected in handleBuyNow, showing error');
        toast.error("Vui lòng chọn màu sắc");
        return;
      }

      // Extract price and discount from the price string (remove currency symbols)
      const priceStr = price.replace(/[^\d]/g, ''); // Remove all non-digits
      const originalPriceStr = originalPrice?.replace(/[^\d]/g, '') || priceStr;
      
      const finalPrice = parseInt(priceStr);
      const originalPriceNum = parseInt(originalPriceStr);
      const discountAmount = originalPriceNum - finalPrice;

      const apiItem = {
        variantId: variantId,
        colorId: parseInt(selectedColorIdFromOption),
        quantity: quantity,
        price: originalPriceNum,
        discount: discountAmount
      };

      await addToCartApi(apiItem);
      // Navigate to checkout page after adding to cart
      router.push('/checkout');
    } else {
      // Use old logic for non-phone variants
      const item = {
        id,
        update: 1,
        productAttributeId,
        quantity,
      };
      addToCart(item);
      // Navigate to checkout page
      router.push('/checkout');
    }
  };

  return (
    <div className={styles.productInfo}>
      <h1 className={styles.productTitle}>{title}</h1>
      
      <div className={styles.priceSection}>
        <Price price={price} originalPrice={originalPrice} />
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
        // Group non-color options
        const nonColorOptions = options.filter(opt => 
          opt.type !== 'color' && 
          !opt.title?.toLowerCase().includes('color') && 
          !opt.title?.toLowerCase().includes('màu')
        );

        // Since API already returns Vietnamese color names, we can use them directly
        const getDisplayColor = (color: string) => {
          // If color is already in Vietnamese, use it as is
          // Otherwise, try to map from English to Vietnamese
          const colorMap: { [key: string]: string } = {
            'red': 'Đỏ', 'blue': 'Xanh dương', 'green': 'Xanh lá',
            'yellow': 'Vàng', 'black': 'Đen', 'white': 'Trắng',
            'pink': 'Hồng', 'purple': 'Tím', 'orange': 'Cam',
            'brown': 'Nâu', 'gray': 'Xám', 'grey': 'Xám',
            'silver': 'Bạc', 'gold': 'Vàng kim'
          };
          
          const lowerColor = color.toLowerCase();
          const mappedColor = colorMap[lowerColor];
          
          // If we have a mapping, use it; otherwise use the original color
          return mappedColor || color;
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
                <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap'}}>
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
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 12px',
                          border: `2px solid ${isSelected ? '#007bff' : '#f1f2f3'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          backgroundColor: isSelected ? '#f8f9fa' : 'transparent',
                          boxShadow: isSelected ? '0 2px 4px rgba(0, 123, 255, 0.15)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#007bff';
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#f1f2f3';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        title={getDisplayColor(item.value)} // Tooltip hiển thị tên màu
                      >
                        {/* Color circle */}
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: item.hex_value || '#ccc',
                            borderRadius: '50%',
                            border: '1px solid #ddd',
                            position: 'relative'
                          }}
                        >
                          {/* Checkmark for selected color */}
                          {isSelected && (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '12px',
                              height: '12px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '8px',
                              color: '#007bff',
                              fontWeight: 'bold'
                            }}>
                              ✓
                            </div>
                          )}
                        </div>
                        {/* Color name */}
                        <span style={{
                          fontSize: '14px',
                          color: isSelected ? '#007bff' : '#333',
                          fontWeight: isSelected ? '500' : '400'
                        }}>
                          {getDisplayColor(item.value)}
                        </span>
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
