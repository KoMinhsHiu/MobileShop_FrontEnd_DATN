import { MegaMenuAPI } from "@/const/endPoint";
import { getData } from "@/utils/api/fetchData/apiCall";
import { GetServerSidePropsContext } from "next";
import React, { FC, useState, useEffect } from "react";
import styles from "./styles.module.scss";
import CategoryProduct from "@/component/category/categoryProduct";
import CategoryOptions from "@/component/category/categoryOptions";
import AccordionItem from "@/component/accordionItem";
import { Category, CategoryPageProps } from "@/utils/type";
import Pagination from "@/component/pagination";
import { useRouter } from "next/router";
import Placeholder from "@/component/category/placeholder";
import { useMegaMenu } from "@/context/menuContext";
import { useQuery } from "@tanstack/react-query";
import MetaTags from "@/component/metaTags";
import { MegaMenuTransformer } from "@/utils/api/transformer/megaMenu";
import { useFetchPhoneVariants } from "@/utils/hooks/api/useFetchPhoneVariants";


// Map UI sort key to API sort + order per spec
const mapSortParams = (
  orderQuery?: string
): { sort?: string; order?: "asc" | "desc" } => {
  switch (orderQuery) {
    case "price_asc":
      return { sort: "price", order: "asc" };
    case "price_desc":
      return { sort: "price", order: "desc" };
    case "name_asc":
      return { sort: "name", order: "asc" };
    case "name_desc":
      return { sort: "name", order: "desc" };
    case "rating_desc":
      return { sort: "rating", order: "desc" };
    default:
      return {};
  }
};


const CategoryPage: FC<CategoryPageProps> = ({ initialCategory }) => {
  const router = useRouter();
  const menu = useMegaMenu();
  const page = parseInt(router.query.page as string, 10) || 1;
  const categoryId = String(router.query.slug);

  const [filterQuery, setFilterQuery] = useState<string | undefined>();
  const [orderQuery, setOrderQuery] = useState<string | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    chipset?: string;
    os?: string;
    minRam?: number;
    maxRam?: number;
    minStorage?: number;
    maxStorage?: number;
    minScreenSize?: number;
    maxScreenSize?: number;
    nfc?: boolean;
  }>({});

  // Use the new phone variants API
  const sortParams = mapSortParams(orderQuery);
  const { data: phoneVariantsData, isLoading, error } = useFetchPhoneVariants({
    page,
    limit: 12,
    ...sortParams,
    category: categoryId !== 'all' ? categoryId : undefined,
    ...advancedFilters,
  });

  const category = React.useMemo(() => ({
    title: categoryId === 'all' ? "Tất cả điện thoại" : categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
    product: phoneVariantsData?.products || [],
    totalProducts: phoneVariantsData?.totalProducts || 0,
    totalPage: phoneVariantsData?.totalPages || 0,
    filters: [
      {
        name: "Giá",
        options: [
          { label: "Dưới 5 triệu", value: "0-5000000" },
          { label: "5 - 10 triệu", value: "5000000-10000000" },
          { label: "10 - 20 triệu", value: "10000000-20000000" },
          { label: "Trên 20 triệu", value: "20000000+" }
        ]
      },
      {
        name: "Thương hiệu",
        options: [
          { label: "Apple", value: "Apple" },
          { label: "Samsung", value: "Samsung" },
          { label: "Xiaomi", value: "Xiaomi" },
          { label: "Oppo", value: "Oppo" },
          { label: "Vivo", value: "Vivo" }
        ]
      }
    ],
    sortOptions: [
      { label: "Mặc định", value: "default", querySort: "default", isActive: !orderQuery },
      { label: "Giá (↑)", value: "price_asc", querySort: "price_asc", isActive: orderQuery === "price_asc" },
      { label: "Giá (↓)", value: "price_desc", querySort: "price_desc", isActive: orderQuery === "price_desc" },
      { label: "Tên (A→Z)", value: "name_asc", querySort: "name_asc", isActive: orderQuery === "name_asc" },
      { label: "Tên (Z→A)", value: "name_desc", querySort: "name_desc", isActive: orderQuery === "name_desc" },
      { label: "Đánh giá (cao→thấp)", value: "rating_desc", querySort: "rating_desc", isActive: orderQuery === "rating_desc" }
    ]
  }), [categoryId, phoneVariantsData, orderQuery]);

  useEffect(() => {
    // Effect logic here...
  }, [isLoading, error, category, initialCategory]);
  
  // Handle filter changes
  const handleFilterChange = (newFilter: string) => {
    if (newFilter === "undefined") {
      setActiveFilters([]);
      setFilterQuery(undefined);
    } else {
      setActiveFilters(prev => {
        const updatedFilters = prev.includes(newFilter)
          ? prev.filter(f => f !== newFilter)
          : [...prev, newFilter];
        
        setFilterQuery(updatedFilters.length > 0 ? updatedFilters.join(',') : undefined);
        return updatedFilters;
      });
    }
  };

  // Handle sort changes
  const handleSortChange = (newSort: string) => {
    setOrderQuery(newSort === "default" ? undefined : newSort);
  };

  // Redirect /category/all to /products
  if (categoryId === 'all') {
    router.replace('/products');
    return null;
  }

  // Only show placeholder on initial load, not on filter changes
  if (isLoading && !phoneVariantsData) {
    return <Placeholder />;
  }

  if (error) {
    console.error('Category query error:', error);
  }

  // Show message when no products are found
  if (!isLoading && phoneVariantsData && phoneVariantsData.products.length === 0) {
    return (
      <>
        <MetaTags title={category?.title} />
        <div className={styles.wrapper}>
          <div className={styles.productWrapper}>
            <div className={styles.noProducts}>
              <h2>Không tìm thấy sản phẩm nào</h2>
              <p>Vui lòng thử lại với bộ lọc khác hoặc quay lại sau.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title={category?.title} />

      <div className={styles.wrapper}>
        <div className={styles.categoryWrapper}>
          <div className={styles.title}>
            <p>Categories</p>
          </div>
          {menu ? menu.map((item) => (
            <AccordionItem
              title={item.label}
              links={item.children}
              titleLink={item.link}
              mode="dark"
              key={item.id}
            />
          )) : null}
        </div>
        

        {category ? (
          <div className={styles.productWrapper}>
          <CategoryOptions
            filters={category.filters}
            sortOptions={category.sortOptions}
            count={category.totalProducts}
            setFilterQuery={handleFilterChange}
            setOrderQuery={handleSortChange}
            onAdvancedFiltersChange={setAdvancedFilters}
          />
            {isLoading && phoneVariantsData ? (
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: 'rgba(0,0,0,0.7)', 
                  color: 'white', 
                  padding: '5px 10px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  zIndex: 1000
                }}>
                  Đang tải...
                </div>
                <CategoryProduct product={category.product} />
              </div>
            ) : (
              <CategoryProduct product={category.product} />
            )}
            <Pagination totalPages={category.totalPage} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const categoryId = context.query.slug;
  const page = context.query.page;
  const referer = context.req.headers.referer || null;
  
  // Get mega menu data
  const megaMenuData = await getData(MegaMenuAPI);
  const menu = MegaMenuTransformer(megaMenuData).menuItems;
  
  return {
    props: { initialCategory: null, menu },
  };
}

export default CategoryPage;
