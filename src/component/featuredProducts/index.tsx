import React, { FC, useState } from "react";
import Link from "next/link";
import { featuredProducts, newProducts } from "@/const/mockData";
import { CategoryProducts } from "@/utils/type";
import styles from "./featuredProducts.module.scss";

const FeaturedProducts: FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'new'>('featured');
  
  const currentProducts = activeTab === 'featured' ? featuredProducts : newProducts;
  const displayProducts = currentProducts.slice(0, 8); // Show first 8 products

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

  return (
    <div className={styles.featuredProducts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'featured' ? styles.active : ''}`}
              onClick={() => setActiveTab('featured')}
            >
              Sản phẩm nổi bật
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'new' ? styles.active : ''}`}
              onClick={() => setActiveTab('new')}
            >
              Sản phẩm mới
            </button>
          </div>
          <div className={styles.viewAllButtons}>
            <Link href="/category/featured" className={styles.viewAllBtn}>
              Xem tất cả
            </Link>
            <Link href="/category/all" className={styles.viewAllProductsBtn}>
              Tất cả sản phẩm
            </Link>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {displayProducts.map((product) => (
            <div key={product.id_product} className={styles.productCard}>
              <Link href={`/product/${product.id_product}`} className={styles.productLink}>
                <div className={styles.imageContainer}>
                  <img
                    src={product.cover.url}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  {product.discount_amount > 0 && (
                    <div className={styles.discountBadge}>
                      -{Math.round((product.discount_amount / parseInt(product.price.replace(/\./g, ''))) * 100)}%
                    </div>
                  )}
                  {activeTab === 'new' && (
                    <div className={styles.newBadge}>Mới</div>
                  )}
                </div>
                
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  
                  <div className={styles.rating}>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.star} ${
                            i < Math.floor(parseFloat(product.rate)) ? styles.filled : ''
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className={styles.ratingText}>({product.rate})</span>
                  </div>
                  
                  <div className={styles.priceContainer}>
                    {product.discount_amount > 0 ? (
                      <>
                        <span className={styles.discountPrice}>
                          {calculateDiscountPrice(product.price, product.discount_amount)}
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
                  
                  <div className={styles.stockInfo}>
                    {product.quantity > 0 ? (
                      <span className={styles.inStock}>Còn {product.quantity} sản phẩm</span>
                    ) : (
                      <span className={styles.outOfStock}>Hết hàng</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
