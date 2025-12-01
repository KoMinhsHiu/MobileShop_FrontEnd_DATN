import React, { FC } from "react";
import { useQuery } from "@tanstack/react-query";

import { FeaturedProductAPI } from "@/const/endPoint";
import { FeaturedProductTransformer } from "@/utils/api/transformer/featuredProduct";
import { getData } from "@/utils/api/fetchData/apiCall";

import ProductInfo from "../productInfo";
import ProductGallery from "../productGallery";
import DetailTabs from "../detailTabs";

import { productDetailsProps } from "./productDetails.types";
import styles from "./productDetails.module.scss";
import ProductRating from "../productRating";

const ProductDetails: FC<productDetailsProps> = ({ product }) => {
  const { data: featuredProduct = [] } = useQuery({
    queryKey: ["featuredProduct"],
    queryFn: async () => {
      const productData = await getData(FeaturedProductAPI);
      return FeaturedProductTransformer(productData);
    },
    enabled: !!product.id,
  });

  // Use specifications and reviews from product data if available, otherwise use mock data
  const specifications = product.specifications && product.specifications.length > 0 
    ? product.specifications 
    : [
        { label: "Screen Size", value: "6.1 inch" },
        { label: "RAM", value: "8GB" },
        { label: "Storage", value: "256GB" },
        { label: "Camera", value: "48MP" },
        { label: "Battery", value: "4000mAh" },
        { label: "OS", value: "Android 13" }
      ];

  const reviews = product.reviews && product.reviews.length > 0 
    ? product.reviews 
    : [];

  return (
    <div className={styles.productContainer}>
      {/* Product Overview Section */}
      <div className={styles.productOverview}>
        <div className={styles.galleryContainer}>
          <ProductGallery images={product.images} />
        </div>
        <div className={styles.infoContainer}>
          <ProductInfo
            id={product.id}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            options={product.options}
            description={product.description}
            shortDescription={product.shortDescription}
            specifications={specifications}
            productAttributeId={product.productAttributeId}
          />
        </div>
      </div>

      {/* Product Rating Section */}
      <div className={styles.ratingSection}>
        <ProductRating 
          averageRating={
            reviews.length > 0 
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
              : 0
          } 
          reviews={reviews} 
          productId={product.id} 
        />
      </div>

      {/* Detail Tabs Section */}
      <div className={styles.detailSection}>
        <DetailTabs
          description={product.description}
          specifications={specifications}
          reviews={reviews}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
