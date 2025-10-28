import React, { FC, useState, useEffect } from "react";
import Link from "next/link";

import { fetchBrandsSafe } from "@/utils/api/brands";
import { TransformedBrand } from "@/utils/type/brand";

import styles from "./homeCategory.module.scss";

const HomeCategory: FC = () => {
  const [brands, setBrands] = useState<TransformedBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      try {
        const brandsData = await fetchBrandsSafe();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading brands:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.sectionTitle}>
        <h2>Khám phá các hãng điện thoại hàng đầu</h2>
      </div>
      
      {loading ? (
        <div className={styles.brandsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.brandCard}>
              <div className={styles.brandIcon}>
                <div className={styles.skeletonImage}></div>
              </div>
              <div className={styles.brandInfo}>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonSubtext}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.brandsGrid}>
          {brands.map((brand) => {
            return (
              <Link
                href={brand.link}
                className={styles.brandCard}
                key={brand.id}
              >
                <div className={styles.brandIcon}>
                  <img 
                    src={brand.imageUrl} 
                    alt={`${brand.name} logo`}
                    className={styles.brandLogo}
                  />
                </div>
                <div className={styles.brandInfo}>
                  <h3 className={styles.brandName}>{brand.name}</h3>
                  <p className={styles.brandDescription}>Điện thoại {brand.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomeCategory;
