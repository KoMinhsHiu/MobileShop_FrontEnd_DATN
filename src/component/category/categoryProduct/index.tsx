import React, { FC, useEffect } from "react";

import ProductCard from "@/component/productCard";

import { CategoryProductProps } from "./categoryProduct.types";

import styles from "./categoryProduct.module.scss";

const CategoryProduct: FC<CategoryProductProps> = ({ product }) => {
  useEffect(() => {
    // Debug logging moved to useEffect to prevent hydration issues
    if (process.env.NODE_ENV === 'development') {
      console.log('CategoryProduct received products:', product);
      console.log('Product length:', product?.length);
    }
  }, [product]);

  return (
    <div className={styles.productWrapper}>
      {product ? product.map((item) => {
        return <ProductCard product={item} key={item.id} />;
      }) : null}
    </div>
  );
};

export default CategoryProduct;
