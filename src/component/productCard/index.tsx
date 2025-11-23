import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faEye } from "@fortawesome/free-solid-svg-icons";

import Price from "../product/price";
import { useCart } from "@/context/cartContext";

import { ProductCardProps } from "./productCard.types";

import styles from "./productCard.module.scss";

import Image from 'next/image';

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isLoading } = useCart();

  useEffect(() => {
    // Debug logging moved to useEffect to prevent hydration issues
    if (process.env.NODE_ENV === 'development') {
      console.log('ProductCard received product:', product);
    }
  }, [product]);

  const formatPrice = (price: string) => {
    try {
      const numericPrice = parseInt(price.replace(/\./g, ''));
      if (isNaN(numericPrice)) return price;
      
      // Use a more consistent formatting approach
      return `${numericPrice.toLocaleString('vi-VN')} VNĐ`;
    } catch (error) {
      console.error('Error formatting price:', error, 'Price:', price);
      return price;
    }
  };

  const calculateDiscountPrice = (originalPrice: string, discount: number) => {
    try {
      const price = parseInt(originalPrice.replace(/\./g, ''));
      const discountedPrice = price - discount;
      return `${discountedPrice.toLocaleString('vi-VN')} VNĐ`;
    } catch (error) {
      console.error('Error calculating discount price:', error, 'Original price:', originalPrice, 'Discount:', discount);
      return originalPrice;
    }
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const item = {
      id: product.id,
      update: 1,
      productAttributeId: 0,
      quantity: 1,
    };
    addToCart(item);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`${styles.star} ${
          i < Math.floor(rating) ? styles.filled : ''
        }`}
      >
        ★
      </span>
    ));
  };

  if (!product) {
    return null;
  }

  return (
    <div 
      className={styles.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          {product.image && (
            <Image
              className={styles.image}
              src={product.image}
              alt={product.name}
              width={180}
              height={180}
              priority
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          )}
          
          {/* Discount Badge */}
          {parseInt(product.disconnect) > parseInt(product.price.replace(/\./g, '')) && (
            <div className={styles.discountBadge}>
              -{Math.round(((parseInt(product.disconnect) - parseInt(product.price.replace(/\./g, ''))) / parseInt(product.disconnect)) * 100)}%
            </div>
          )}
          
          {/* Quick Actions */}
          <div className={`${styles.quickActions} ${isHovered ? styles.show : ''}`}>
            <button 
              className={styles.quickBtn}
              onClick={handleQuickAddToCart}
              disabled={isLoading}
              title="Thêm vào giỏ hàng"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
            </button>
            <button className={styles.quickBtn} title="Yêu thích">
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button 
              className={styles.quickBtn} 
              title="Xem chi tiết"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/product/${product.id}`;
              }}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <h3 className={styles.name}>{product.name}</h3>
          
          {/* Rating */}
          <div className={styles.rating}>
            <div className={styles.stars}>
              {renderStars(product.rate)}
            </div>
            <span className={styles.ratingText}>({product.rate})</span>
          </div>
          
          {/* Price */}
          <div className={styles.priceContainer}>
            {parseInt(product.disconnect) > parseInt(product.price) ? (
              <>
                <span className={styles.discountPrice}>
                  {formatPrice(product.price)}
                </span>
                <span className={styles.originalPrice}>
                  {formatPrice(product.disconnect)}
                </span>
              </>
            ) : (
              <span className={styles.price}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Stock Info */}
          <div className={styles.stockInfo}>
            {parseInt(product.quantity) > 0 ? (
              <span className={styles.inStock}>Còn {product.quantity} sản phẩm</span>
            ) : (
              <span className={styles.outOfStock}>Hết hàng</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
