import React, { FC, useState } from "react";
import Link from "next/link";
import { featuredProducts, newProducts } from "@/const/mockData";
import { CategoryProducts } from "@/utils/type";
import { useFetchPhoneVariants } from "@/utils/hooks/api/useFetchPhoneVariants";
import styles from "./featuredProducts.module.scss";

const FeaturedProducts: FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'new'>('featured');
  
  // Fetch featured products from API
  const { data: featuredApiData } = useFetchPhoneVariants({
    page: 1,
    limit: 8,
    order: 'rating_desc', // Featured products by rating
  });

  // Fetch new products from API
  const { data: newApiData } = useFetchPhoneVariants({
    page: 1,
    limit: 8,
    order: 'created_desc', // New products by creation date
  });

  // Use API data if available, otherwise fall back to mock data
  const currentProducts = activeTab === 'featured' 
    ? (featuredApiData?.products || featuredProducts)
    : (newApiData?.products || newProducts);
  
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
            <Link href="/products" className={styles.viewAllProductsBtn}>
              Tất cả sản phẩm
            </Link>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {displayProducts.map((product) => {
            // Handle both API data format and mock data format
            const isApiData = 'id' in product;
            const productId = isApiData ? product.id : product.id_product;
            const productName = product.name;
            const productPrice = isApiData ? product.price : product.price;
            const productImage = isApiData ? product.image : product.cover.url;
            const productRate = isApiData ? product.rate : parseFloat(product.rate);
            const productQuantity = isApiData ? parseInt(product.quantity) : product.quantity;
            const discountAmount = isApiData ? 0 : product.discount_amount;

            return (
              <div key={productId} className={styles.productCard}>
                <Link href={`/product/${productId}`} className={styles.productLink}>
                  <div className={styles.imageContainer}>
                    <img
                      src={productImage}
                      alt={productName}
                      className={styles.productImage}
                    />
                    {discountAmount > 0 && (
                      <div className={styles.discountBadge}>
                        -{Math.round((discountAmount / parseInt(productPrice.replace(/\./g, ''))) * 100)}%
                      </div>
                    )}
                    {activeTab === 'new' && (
                      <div className={styles.newBadge}>Mới</div>
                    )}
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{productName}</h3>
                    
                    <div className={styles.rating}>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`${styles.star} ${
                              i < Math.floor(productRate) ? styles.filled : ''
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={styles.ratingText}>({productRate})</span>
                    </div>
                    
                    <div className={styles.priceContainer}>
                      {discountAmount > 0 ? (
                        <>
                          <span className={styles.discountPrice}>
                            {calculateDiscountPrice(productPrice, discountAmount)}
                          </span>
                          <span className={styles.originalPrice}>
                            {formatPrice(productPrice)}
                          </span>
                        </>
                      ) : (
                        <span className={styles.price}>
                          {formatPrice(productPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.stockInfo}>
                      {productQuantity > 0 ? (
                        <span className={styles.inStock}>Còn {productQuantity} sản phẩm</span>
                      ) : (
                        <span className={styles.outOfStock}>Hết hàng</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
