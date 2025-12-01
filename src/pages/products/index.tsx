import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useWindowSize from "@/utils/hooks/useWindowSize";
import { useFetchPhoneVariants } from "@/utils/hooks/api/useFetchPhoneVariants";
import CategoryProduct from "@/component/category/categoryProduct";
import CategoryOptions from "@/component/category/categoryOptions/index";
import Sort from "@/component/category/sort";
import Pagination from "@/component/pagination";
import Placeholder from "@/component/category/placeholder";
import MetaTags from "@/component/metaTags";
import styles from "./styles.module.scss";

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

const ProductsPage: FC = () => {
  const router = useRouter();
  const [filterQuery, setFilterQuery] = useState<string | undefined>();
  const [orderQuery, setOrderQuery] = useState<string | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSortOption, setShowSortOption] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<{
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
  const page = parseInt(router.query.page as string, 10) || 1;
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const isDesktop = width > 768;
  
  // Initialize filters from URL on mount
  useEffect(() => {
    const { brand, price, sort } = router.query;
    const filtersFromUrl: string[] = [];
    
    // Add brand filter from URL
    if (brand && typeof brand === 'string') {
      const validBrands = ['Apple', 'Samsung', 'Xiaomi', 'Vivo', 'OPPO'];
      if (validBrands.includes(brand)) {
        filtersFromUrl.push(brand);
      }
    }
    
    // Add price filter from URL
    if (price && typeof price === 'string') {
      const validPrices = ['0-5000000', '5000000-10000000', '10000000-20000000', '20000000+'];
      if (validPrices.includes(price)) {
        filtersFromUrl.push(price);
      }
    }
    
    // Set active filters if any found in URL
    if (filtersFromUrl.length > 0) {
      console.log('Initializing filters from URL:', filtersFromUrl);
      setActiveFilters(filtersFromUrl);
      setFilterQuery(filtersFromUrl.join(','));
    }
    
    // Set sort from URL
    if (sort && typeof sort === 'string') {
      const validSorts = ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'rating_desc'];
      if (validSorts.includes(sort)) {
        setOrderQuery(sort);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount
  
  // Update URL when filters or sort change
  useEffect(() => {
    const query: Record<string, string> = {};
    
    // Add page to query if not page 1
    if (page !== 1) {
      query.page = page.toString();
    }
    
    // Parse active filters into URL params
    activeFilters.forEach(filter => {
      // Check if it's a brand filter
      if (['Apple', 'Samsung', 'Xiaomi', 'Vivo', 'OPPO'].includes(filter)) {
        query.brand = filter;
      }
      // Check if it's a price filter
      else if (['0-5000000', '5000000-10000000', '10000000-20000000', '20000000+'].includes(filter)) {
        query.price = filter;
      }
    });
    
    // Add sort to query if set
    if (orderQuery && orderQuery !== 'default') {
      query.sort = orderQuery;
    }
    
    // Update URL with shallow routing (no page reload)
    router.push(
      {
        pathname: '/products',
        query,
      },
      undefined,
      { shallow: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, orderQuery, page]);
  
  // Handle filter changes
  const handleFilterChange = (newFilter: string) => {
    console.log('Filter change:', newFilter);
    if (newFilter === "undefined") {
      setActiveFilters([]);
      setFilterQuery(undefined);
    } else {
      // Check if it's a brand filter (single selection)
      const isBrandFilter = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'].includes(newFilter);
      // Check if it's a price filter (single selection)
      const isPriceFilter = ['0-5000000', '5000000-10000000', '10000000-20000000', '20000000+'].includes(newFilter);
      
      if (isBrandFilter) {
        // For brand filters: single selection (radio button behavior)
        setActiveFilters(prev => {
          // Remove any existing brand filters
          const nonBrandFilters = prev.filter(f => !['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'].includes(f));
          // Add the new brand filter
          const updatedFilters = [...nonBrandFilters, newFilter];
          setFilterQuery(updatedFilters.length > 0 ? updatedFilters.join(',') : undefined);
          return updatedFilters;
        });
      } else if (isPriceFilter) {
        // For price filters: single selection (radio button behavior)
        setActiveFilters(prev => {
          // Remove any existing price filters
          const nonPriceFilters = prev.filter(f => !['0-5000000', '5000000-10000000', '10000000-20000000', '20000000+'].includes(f));
          // Add the new price filter
          const updatedFilters = [...nonPriceFilters, newFilter];
          setFilterQuery(updatedFilters.length > 0 ? updatedFilters.join(',') : undefined);
          return updatedFilters;
        });
      } else {
        // For other filters: multiple selection (checkbox behavior)
        setActiveFilters(prev => {
          const updatedFilters = prev.includes(newFilter)
            ? prev.filter(f => f !== newFilter)
            : [...prev, newFilter];
          
          setFilterQuery(updatedFilters.length > 0 ? updatedFilters.join(',') : undefined);
          return updatedFilters;
        });
      }
    }
  };

  // Handle sort changes
  const handleSortChange = (newSort: string) => {
    setOrderQuery(newSort === "default" ? undefined : newSort);
  };
  
  // Parse filter query for price and brand filters
  const parseFilterQuery = (filterQuery?: string) => {
    if (!filterQuery) return {};
    
    const filters: any = {};
    const filterArray = filterQuery.split(',');
    
    filterArray.forEach(filter => {
      // Price range filters (single selection)
      if (filter.includes('-')) {
        const [min, max] = filter.split('-');
        if (max === '+') {
          filters.minPrice = parseInt(min);
        } else {
          filters.minPrice = parseInt(min);
          filters.maxPrice = parseInt(max);
        }
      }
      // Brand filters (single selection)
      else if (['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'].includes(filter)) {
        // Only take the first brand filter (single selection)
        if (!filters.brand) {
          filters.brand = filter;
        }
      }
    });
    
    return filters;
  };

  // Use the new phone variants API
  const sortParams = mapSortParams(orderQuery);
  const checkboxFilters = parseFilterQuery(filterQuery);
  const { data: phoneVariantsData, isLoading, error } = useFetchPhoneVariants({
    page,
    limit: 12,
    ...sortParams,
    ...checkboxFilters,
    ...advancedFilters,
  });

  // Show loading placeholder only on initial load
  if (isLoading && !phoneVariantsData) {
    return <Placeholder />;
  }

  if (error) {
    console.error('Products query error:', error);
  }

  // Create filters with dynamic active state
  const filters = [
    {
      label: "Giá",
      display: true,
      type: "radio",
      options: [
        { label: "Dưới 5 triệu", active: activeFilters.includes("0-5000000"), display: true, productCount: 0, filterQuery: "0-5000000", properties: { color: "" } },
        { label: "5 - 10 triệu", active: activeFilters.includes("5000000-10000000"), display: true, productCount: 0, filterQuery: "5000000-10000000", properties: { color: "" } },
        { label: "10 - 20 triệu", active: activeFilters.includes("10000000-20000000"), display: true, productCount: 0, filterQuery: "10000000-20000000", properties: { color: "" } },
        { label: "Trên 20 triệu", active: activeFilters.includes("20000000+"), display: true, productCount: 0, filterQuery: "20000000+", properties: { color: "" } }
      ]
    },
    {
      label: "Thương hiệu",
      display: true,
      type: "radio",
      options: [
        { label: "Apple", active: activeFilters.includes("Apple"), display: true, productCount: 0, filterQuery: "Apple", properties: { color: "" } },
        { label: "Samsung", active: activeFilters.includes("Samsung"), display: true, productCount: 0, filterQuery: "Samsung", properties: { color: "" } },
        { label: "Xiaomi", active: activeFilters.includes("Xiaomi"), display: true, productCount: 0, filterQuery: "Xiaomi", properties: { color: "" } },
        { label: "OPPO", active: activeFilters.includes("OPPO"), display: true, productCount: 0, filterQuery: "OPPO", properties: { color: "" } },
        { label: "Vivo", active: activeFilters.includes("Vivo"), display: true, productCount: 0, filterQuery: "Vivo", properties: { color: "" } }
      ]
    }
  ];

  const sortOptions = [
    { label: "Mặc định", value: "default", querySort: "default", isActive: !orderQuery },
    { label: "Giá (↑)", value: "price_asc", querySort: "price_asc", isActive: orderQuery === "price_asc" },
    { label: "Giá (↓)", value: "price_desc", querySort: "price_desc", isActive: orderQuery === "price_desc" },
    { label: "Tên (A→Z)", value: "name_asc", querySort: "name_asc", isActive: orderQuery === "name_asc" },
    { label: "Tên (Z→A)", value: "name_desc", querySort: "name_desc", isActive: orderQuery === "name_desc" },
    { label: "Đánh giá (cao→thấp)", value: "rating_desc", querySort: "rating_desc", isActive: orderQuery === "rating_desc" }
  ];

  return (
    <>
      <MetaTags title="Tất cả sản phẩm" />
      
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Tất cả sản phẩm</h1>
          <p>Khám phá bộ sưu tập điện thoại đa dạng của chúng tôi</p>
        </div>
        
        <div className={styles.contentWrapper}>
          {/* Sidebar with filters */}
          <div className={styles.sidebar}>
            <CategoryOptions
              filters={filters}
              sortOptions={sortOptions}
              count={(phoneVariantsData as any)?.totalProducts || 0}
              setFilterQuery={handleFilterChange}
              setOrderQuery={handleSortChange}
              onAdvancedFiltersChange={setAdvancedFilters}
            />
          </div>
          
          {/* Main content area */}
          <div className={styles.mainContent}>
            {/* Mobile sort and count */}
            {!isDesktop && (
              <div className={styles.mobileControls}>
                <p className={styles.count}>
                  {(phoneVariantsData as any)?.totalProducts || 0} {t("category.items")}
                </p>
                <Sort
                  sortOptions={sortOptions}
                  setOrderQuery={handleSortChange}
                  showSortOption={showSortOption}
                  setShowSortOption={setShowSortOption}
                />
              </div>
            )}
            
            {/* Show loading indicator when filtering */}
            {isLoading && phoneVariantsData && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner}></div>
                <p>Đang tải...</p>
              </div>
            )}

            {/* Show products or no products message */}
            {phoneVariantsData && (phoneVariantsData as any).products && (phoneVariantsData as any).products.length > 0 ? (
              <>
                <CategoryProduct product={(phoneVariantsData as any).products} />
                {phoneVariantsData && (phoneVariantsData as any).totalPages && (phoneVariantsData as any).totalPages > 1 && (
                  <Pagination totalPages={(phoneVariantsData as any).totalPages} />
                )}
              </>
            ) : !isLoading ? (
              <div className={styles.noProducts}>
                <h2>Không tìm thấy sản phẩm nào</h2>
                <p>Vui lòng thử lại với bộ lọc khác hoặc quay lại sau.</p>
                <div className={styles.noProductsActions}>
                  <button 
                    onClick={() => {
                      setActiveFilters([]);
                      setFilterQuery(undefined);
                      setAdvancedFilters({});
                    }}
                    className={styles.clearFiltersBtn}
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
