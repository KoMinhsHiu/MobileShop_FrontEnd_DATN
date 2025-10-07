import { CategoryAPI, MegaMenuAPI } from "@/const/endPoint";
import { getData } from "@/utils/api/fetchData/apiCall";
import { GetServerSidePropsContext } from "next";
import React, { FC, useState } from "react";
import styles from "./styles.module.scss";
import CategoryProduct from "@/component/category/categoryProduct";
import CategoryOptions from "@/component/category/categoryOptions";
import AccordionItem from "@/component/accordionItem";
import { Category, CategoryPageProps } from "@/utils/type";
import Pagination from "@/component/pagination";
import { useRouter } from "next/router";
import Placeholder from "@/component/category/placeholder";
import { CategoryTransformer } from "@/utils/api/transformer/category";
import { useMegaMenu } from "@/context/menuContext";
import { useQuery } from "@tanstack/react-query";
import MetaTags from "@/component/metaTags";
import { MegaMenuTransformer } from "@/utils/api/transformer/megaMenu";

const fetchCategoryData = async (
  categoryId: string,
  page: number,
  filterQuery?: string,
  orderQuery?: string
) => {
  // Check if it's a brand category and use mock data
  const brandCategories = ['apple', 'samsung', 'xiaomi', 'oppo', 'vivo', 'huawei', 'oneplus', 'realme', 'featured', 'all'];
  const isBrand = brandCategories.includes(categoryId.toLowerCase());
  
  if (isBrand) {
    // Use mock data for brand categories
    const baseData = CategoryTransformer(null, categoryId);
    
    // Update filter states based on current filterQuery
    const activeFiltersList = filterQuery ? filterQuery.split(',') : [];
    console.log('Active filters list:', activeFiltersList);
    const updatedFilters = baseData.filters.map(filter => ({
      ...filter,
      options: filter.options.map(option => ({
        ...option,
        active: activeFiltersList.includes(option.filterQuery)
      }))
    }));
    
    // Update sort states based on current orderQuery
    const currentOrderQuery = orderQuery || 'rating_desc'; // Default to rating_desc
    console.log('Current order query:', currentOrderQuery);
    const updatedSortOptions = baseData.sortOptions.map(option => ({
      ...option,
      isActive: option.querySort === currentOrderQuery
    }));
    console.log('Updated sort options:', updatedSortOptions);
    
    // Apply filters and sorting to mock data
    let filteredProducts = [...baseData.product];
    
    // Apply filters
    if (filterQuery && filterQuery !== "undefined") {
      filteredProducts = applyFilters(filteredProducts, filterQuery);
    }
    
    // Apply sorting
    filteredProducts = applySorting(filteredProducts, currentOrderQuery);
    
    return {
      ...baseData,
      filters: updatedFilters,
      sortOptions: updatedSortOptions,
      product: filteredProducts,
      totalProducts: filteredProducts.length
    };
  } else {
    // Use real API for other categories
    const categoryData = await getData(CategoryAPI, {
      id_category: categoryId,
      page,
      q: filterQuery,
      order: orderQuery,
    });
    return CategoryTransformer(categoryData);
  }
};

// Helper function to apply filters
const applyFilters = (products: any[], filterQuery: string) => {
  if (!filterQuery || filterQuery === "undefined") return products;

  const filters = filterQuery.split(',');
  console.log('Applying filters:', filters);

  // Group filters by type
  const filterGroups = {
    price: filters.filter(f => f.includes('price_')),
    brand: filters.filter(f => f.includes('brand_')),
    color: filters.filter(f => f.includes('color_')),
    storage: filters.filter(f => f.includes('storage_'))
  };

  console.log('Filter groups:', filterGroups);

  return products.filter(product => {
    const price = parseInt(product.price.replace(/\./g, ''));
    console.log(`Checking product: ${product.name} (${product.id}) - Price: ${price}`);

    // Check if product matches ALL filter groups (AND logic between groups)
    const matchesAllGroups = Object.entries(filterGroups).every(([groupType, groupFilters]) => {
      if (groupFilters.length === 0) return true; // No filters in this group

      // Check if product matches ANY filter in this group (OR logic within group)
      const matchesGroup = groupFilters.some(filter => {
        let matches = false;

        // Price filters
        if (filter.includes('price_0_5000000')) {
          matches = price < 5000000;
          console.log(`  Price < 5M filter: ${matches} (price: ${price})`);
        }
        else if (filter.includes('price_5000000_10000000')) {
          matches = price >= 5000000 && price < 10000000;
          console.log(`  Price 5-10M filter: ${matches} (price: ${price})`);
        }
        else if (filter.includes('price_10000000_20000000')) {
          matches = price >= 10000000 && price < 20000000;
          console.log(`  Price 10-20M filter: ${matches} (price: ${price})`);
        }
        else if (filter.includes('price_20000000_30000000')) {
          matches = price >= 20000000 && price < 30000000;
          console.log(`  Price 20-30M filter: ${matches} (price: ${price})`);
        }
        else if (filter.includes('price_30000000_99999999')) {
          matches = price >= 30000000;
          console.log(`  Price > 30M filter: ${matches} (price: ${price})`);
        }
        
        // Brand filters
        else if (filter.includes('brand_apple')) {
          matches = product.id.includes('apple');
          console.log(`  Brand Apple filter: ${matches}`);
        }
        else if (filter.includes('brand_samsung')) {
          matches = product.id.includes('samsung');
          console.log(`  Brand Samsung filter: ${matches}`);
        }
        else if (filter.includes('brand_xiaomi')) {
          matches = product.id.includes('xiaomi');
          console.log(`  Brand Xiaomi filter: ${matches}`);
        }
        else if (filter.includes('brand_oppo')) {
          matches = product.id.includes('oppo');
          console.log(`  Brand Oppo filter: ${matches}`);
        }
        else if (filter.includes('brand_vivo')) {
          matches = product.id.includes('vivo');
          console.log(`  Brand Vivo filter: ${matches}`);
        }
        else if (filter.includes('brand_huawei')) {
          matches = product.id.includes('huawei');
          console.log(`  Brand Huawei filter: ${matches}`);
        }
        else if (filter.includes('brand_oneplus')) {
          matches = product.id.includes('oneplus');
          console.log(`  Brand OnePlus filter: ${matches}`);
        }
        else if (filter.includes('brand_realme')) {
          matches = product.id.includes('realme');
          console.log(`  Brand Realme filter: ${matches}`);
        }
        
        // Color filters
        else if (filter.includes('color_black')) {
          matches = product.name.toLowerCase().includes('đen') || product.name.toLowerCase().includes('black');
          console.log(`  Color Black filter: ${matches}`);
        }
        else if (filter.includes('color_white')) {
          matches = product.name.toLowerCase().includes('trắng') || product.name.toLowerCase().includes('white');
          console.log(`  Color White filter: ${matches}`);
        }
        else if (filter.includes('color_gold')) {
          matches = product.name.toLowerCase().includes('vàng') || product.name.toLowerCase().includes('gold');
          console.log(`  Color Gold filter: ${matches}`);
        }
        else if (filter.includes('color_blue')) {
          matches = product.name.toLowerCase().includes('xanh') || product.name.toLowerCase().includes('blue');
          console.log(`  Color Blue filter: ${matches}`);
        }
        
        // Storage filters
        else if (filter.includes('storage_128gb')) {
          matches = product.name.toLowerCase().includes('128gb');
          console.log(`  Storage 128GB filter: ${matches}`);
        }
        else if (filter.includes('storage_256gb')) {
          matches = product.name.toLowerCase().includes('256gb');
          console.log(`  Storage 256GB filter: ${matches}`);
        }
        else if (filter.includes('storage_512gb')) {
          matches = product.name.toLowerCase().includes('512gb');
          console.log(`  Storage 512GB filter: ${matches}`);
        }
        else if (filter.includes('storage_1tb')) {
          matches = product.name.toLowerCase().includes('1tb');
          console.log(`  Storage 1TB filter: ${matches}`);
        }

        return matches;
      });

      console.log(`  ${groupType} group result: ${matchesGroup}`);
      return matchesGroup;
    });
    
    console.log(`  Final result: ${matchesAllGroups}`);
    return matchesAllGroups;
  });
};

// Helper function to apply sorting
const applySorting = (products: any[], orderQuery: string) => {
  if (!orderQuery) return products;
  
  const sortedProducts = [...products];
  
  switch (orderQuery) {
    case 'price_asc':
      return sortedProducts.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/\./g, ''));
        const priceB = parseInt(b.price.replace(/\./g, ''));
        return priceA - priceB;
      });
    
    case 'price_desc':
      return sortedProducts.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/\./g, ''));
        const priceB = parseInt(b.price.replace(/\./g, ''));
        return priceB - priceA;
      });
    
    case 'name_asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'name_desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    
    case 'rating_desc':
      return sortedProducts.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
    
    default:
      return sortedProducts;
  }
};

const CategoryPage: FC<CategoryPageProps> = ({ initialCategory }) => {
  const [filterQuery, setFilterQuery] = useState<string | undefined>();
  const [orderQuery, setOrderQuery] = useState<string | undefined>('rating_desc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const router = useRouter();
  const menu = useMegaMenu();
  const page = parseInt(router.query.page as string, 10) || 0;
  const categoryId = String(router.query.slug);
  
  // Handle filter changes
  const handleFilterChange = (newFilter: string) => {
    console.log('Filter changed:', newFilter);
    if (newFilter === "undefined") {
      setActiveFilters([]);
      setFilterQuery(undefined);
    } else {
      // Toggle the filter in active filters array
      setActiveFilters(prev => {
        const updatedFilters = prev.includes(newFilter)
          ? prev.filter(f => f !== newFilter)
          : [...prev, newFilter];
        
        console.log('Updated filters:', updatedFilters);
        setFilterQuery(updatedFilters.length > 0 ? updatedFilters.join(',') : undefined);
        return updatedFilters;
      });
    }
  };

  // Handle sort changes
  const handleSortChange = (newSort: string) => {
    console.log('Sort changed:', newSort);
    setOrderQuery(newSort);
  };
  
  const { data: category, isLoading } = useQuery<Category>({
    queryKey: ["categoryData", categoryId, page, filterQuery, orderQuery],
    queryFn: () => fetchCategoryData(categoryId, page, filterQuery, orderQuery),
    initialData: initialCategory || undefined,
    enabled: !initialCategory,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <Placeholder />;
  }

  return (
    <>
      <MetaTags title={category?.title} />

      <div className={styles.wrapper}>
        <div className={styles.categoryWrapper}>
          <div className={styles.title}>
            <p>Categories</p>
          </div>
          {menu?.map((item) => (
            <AccordionItem
              title={item.label}
              links={item.children}
              titleLink={item.link}
              mode="dark"
              key={item.id}
            />
          ))}
        </div>
        {category && (
          <div className={styles.productWrapper}>
            <CategoryOptions
              filters={category.filters}
              sortOptions={category.sortOptions}
              count={category.totalProducts}
              setFilterQuery={handleFilterChange}
              setOrderQuery={handleSortChange}
            />
            <CategoryProduct product={category.product} />
            <Pagination totalPages={category.totalPage} />
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const categoryId = context.query.slug;
  const page = context.query.page;
  const referer = context.req.headers.referer || null;
  
  if (!referer) {
    // Check if it's a brand category and use mock data
    const brandCategories = ['apple', 'samsung', 'xiaomi', 'oppo', 'vivo', 'huawei', 'oneplus', 'realme', 'featured', 'all'];
    const isBrand = brandCategories.includes(String(categoryId).toLowerCase());
    
    let data;
    if (isBrand) {
      // Use mock data for brand categories
      data = CategoryTransformer(null, String(categoryId));
    } else {
      // Use real API for other categories
      const categoryData = await getData(CategoryAPI, {
        id_category: categoryId,
        page,
      });
      data = CategoryTransformer(categoryData);
    }
    
    const megaMenuData = await getData(MegaMenuAPI);
    const menu = MegaMenuTransformer(megaMenuData).menuItems;
    return {
      props: { initialCategory: data, menu },
    };
  }

  return { props: { initialCategory: null, categoryId } };
}

export default CategoryPage;
