import React, { FC } from "react";
import { useQuery } from "@tanstack/react-query";

import { FeaturedProductAPI } from "@/const/endPoint";
import { FeaturedProductTransformer } from "@/utils/api/transformer/featuredProduct";
import { getData } from "@/utils/api/fetchData/apiCall";

import ProductCarousel from "../productCarousel";
import ProductInfo from "../productInfo";
import ProductGallery from "../productGallery";
import DetailTabs from "../detailTabs";

import { productDetailsProps } from "./productDetails.types";
import styles from "./productDetails.module.scss";

const ProductDetails: FC<productDetailsProps> = ({ product }) => {
  const { data: featuredProduct = [] } = useQuery({
    queryKey: ["featuredProduct"],
    queryFn: async () => {
      const productData = await getData(FeaturedProductAPI);
      return FeaturedProductTransformer(productData);
    },
    enabled: !!product.id,
  });

  // Mock data for specifications and reviews (in real app, this would come from API)
  const mockSpecs = [
    { label: "Screen Size", value: "6.1 inch" },
    { label: "RAM", value: "8GB" },
    { label: "Storage", value: "256GB" },
    { label: "Camera", value: "48MP" },
    { label: "Battery", value: "4000mAh" },
    { label: "OS", value: "Android 13" }
  ];

  const mockReviews = [
    {
      name: "Nguyen Van A",
      rating: 5,
      comment: "Sản phẩm rất tốt, chất lượng cao, giao hàng nhanh!",
      date: "2024-01-15"
    },
    {
      name: "Tran Thi B", 
      rating: 4,
      comment: "Điện thoại đẹp, camera chụp ảnh đẹp. Giá hợp lý.",
      date: "2024-01-10"
    }
  ];

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
            specifications={mockSpecs}
            productAttributeId={product.productAttributeId}
          />
        </div>
      </div>

      {/* Detail Tabs Section */}
      <div className={styles.detailSection}>
        <DetailTabs
          description={product.description}
          specifications={mockSpecs}
          reviews={mockReviews}
        />
      </div>

      {/* Featured Products Section */}
      <div className={styles.carouselContainer}>
        <ProductCarousel product={featuredProduct} />
      </div>
    </div>
  );
};

export default ProductDetails;
