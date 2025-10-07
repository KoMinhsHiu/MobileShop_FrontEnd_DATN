import React, { FC } from "react";
import Link from "next/link";

import { phoneBrands } from "@/const/categoryImage";

import styles from "./homeCategory.module.scss";

const HomeCategory: FC = () => {
  return (
    <div className={styles.categoryContainer}>
      <div className={styles.sectionTitle}>
        <h2>Danh mục sản phẩm</h2>
        <p>Khám phá các hãng điện thoại hàng đầu</p>
      </div>
      
      <div className={styles.brandsGrid}>
        {phoneBrands.map((brand) => {
          return (
            <Link
              href={brand.link}
              className={styles.brandCard}
              key={brand.id}
            >
              <div className={styles.brandIcon}>
                <img 
                  src={brand.logo || `/images/brands/${brand.id}.png`} 
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
    </div>
  );
};

export default HomeCategory;
