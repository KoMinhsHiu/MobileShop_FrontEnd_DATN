import { MegaMenuAPI, ProductDetailAPI } from "@/const/endPoint";
import { getData } from "@/utils/api/fetchData/apiCall";
import { GetServerSidePropsContext } from "next";
import React, { FC } from "react";
import ProductDetails from "@/component/productDetails";
import { ProductPageProps } from "@/utils/type";
import { ProductTransformer } from "@/utils/api/transformer/product";
import ProductPlaceholder from "./placeholder";
import { useFetchProductData } from "@/utils/hooks/api/useFetchProductData";
import { useFetchPhoneVariantDetail } from "@/utils/hooks/api/useFetchPhoneVariantDetail";
import MetaTags from "@/component/metaTags";
import { MegaMenuTransformer } from "@/utils/api/transformer/megaMenu";

const ProductPage: FC<ProductPageProps> = ({ initialProduct, productId }) => {
  // Try to parse productId as variantId (number)
  let variantId: number = 0;
  if (typeof productId === 'string') {
    variantId = parseInt(productId, 10);
  } else if (typeof productId === 'number') {
    variantId = productId;
  }
  const isValidVariantId = typeof variantId === 'number' && !isNaN(variantId) && variantId > 0;

  // Use new phone variant API if productId is a valid number
  const { data: phoneVariant, isLoading: isPhoneVariantLoading } = useFetchPhoneVariantDetail({
    variantId: isValidVariantId ? variantId : 0,
    initialData: undefined,
  });

  // Fallback to old product API if productId is not a valid number
  const { data: product, isLoading: isProductLoading } = useFetchProductData({
    productId,
    initialProduct,
  });

  // Determine which data to use
  const currentProduct = isValidVariantId ? phoneVariant : product;
  const isLoading = isValidVariantId ? isPhoneVariantLoading : isProductLoading;

  if (isLoading) {
    return <ProductPlaceholder />;
  }

  console.log("Rendering ProductPage with currentProduct:", currentProduct);

  return (
    <>
      <MetaTags title={currentProduct?.title} />
      {currentProduct && <ProductDetails product={currentProduct} />}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const productId = context.query.slug;
  const referer = context.req.headers.referer || null;
  
  // Try to parse productId as variantId (number)
  let variantId: number = 0;
  if (typeof productId === 'string') {
    variantId = parseInt(productId, 10);
  } else if (typeof productId === 'number') {
    variantId = productId;
  }
  const isValidVariantId = typeof variantId === 'number' && !isNaN(variantId) && variantId > 0;
  
  if (!referer) {
    let initialProduct = null;
    
    // For now, let's skip server-side phone variant API and let client-side handle it
    // This avoids potential issues with axios in server-side rendering
    if (isValidVariantId) {
      // Don't fetch phone variant data on server-side, let client-side handle it
      initialProduct = null;
    } else {
      // Use old API for non-numeric productIds
      const productData = productId && (await getData(ProductDetailAPI, { product_id: productId }));
      initialProduct = ProductTransformer(productData);
    }
    
    const megaMenuData = await getData(MegaMenuAPI);
    const menu = MegaMenuTransformer(megaMenuData).menuItems;
    return { props: { initialProduct, productId, menu } };
  }
  return { props: { initialProduct: null, productId } };
}

export default ProductPage;
