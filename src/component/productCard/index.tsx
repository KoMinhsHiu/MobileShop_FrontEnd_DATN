import React, { FC, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faEye } from "@fortawesome/free-solid-svg-icons";

import Price from "../product/price";
import { useCart } from "@/context/cartContext";

import { ProductCardProps } from "./productCard.types";

import styles from "./productCard.module.scss";

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isLoading } = useCart();

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(price.replace(/\./g, '')));
  };

  const calculateDiscountPrice = (originalPrice: string, discount: number) => {
    const price = parseInt(originalPrice.replace(/\./g, ''));
    const discountedPrice = price - discount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(discountedPrice);
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

  return (
    <div 
      className={styles.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          {product.image && (
            <img
              className={styles.image}
              src={product.image}
              alt={product.name}
            />
          )}
          
          {/* Discount Badge */}
          {parseInt(product.disconnect) > 0 && (
            <div className={styles.discountBadge}>
              -{Math.round((parseInt(product.disconnect) / parseInt(product.price.replace(/\./g, ''))) * 100)}%
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
            <Link href={`/product/${product.id}`} className={styles.quickBtn} title="Xem chi tiết">
              <FontAwesomeIcon icon={faEye} />
            </Link>
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
            {parseInt(product.disconnect) > 0 ? (
              <>
                <span className={styles.discountPrice}>
                  {calculateDiscountPrice(product.price, parseInt(product.disconnect))}
                </span>
                <span className={styles.originalPrice}>
                  {formatPrice(product.price)}
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
