export const productTransformer = (data: any[]) => {
  const product = data?.map((product) => {
    return {
      id: product.id_product,
      name: product.name,
      productAttributeId:Number(product.id_product_attribute),
      price: product.formatted_price,
      image: product.image_url,
      totalPrice:product.formatted_total,
      disconnect: product.discount_amount,
      quantity: product.quantity,
      rate: product.rate,
      attributes:product.attributes_array
    };
  });
  return product;
};


export const CartTransformer = (data: any) => {
  // Handle both real API data and mock data
  let productsData;
  let totalProduct;
  let totalPrice;
  
  if (data?.psdata?.products) {
    // Real API data structure
    productsData = data.psdata.products;
    totalProduct = data.psdata.products_count;
    totalPrice = data.psdata.totals?.total?.value;
  } else if (data?.products) {
    // Mock data structure
    productsData = data.products;
    totalProduct = data.products?.length || 0;
    totalPrice = data.total || 0;
  } else {
    // Fallback
    productsData = [];
    totalProduct = 0;
    totalPrice = 0;
  }

  const card = {
    products: productTransformer(productsData),
    totalProduct: totalProduct,
    totalPrice: totalPrice
  }

  return card;
};
