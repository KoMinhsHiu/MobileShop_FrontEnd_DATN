import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import useWindowSize from "@/utils/hooks/useWindowSize";

import { CategoryOptionsProps } from "./categoryOptions.types";
import Sort from "../sort";
import SidebarFilter from "../sidebarFilter";

import styles from "./categoryOptions.module.scss";

const CategoryOptions: FC<CategoryOptionsProps> = ({
  filters,
  sortOptions,
  count,
  setFilterQuery,
  setOrderQuery,
  onAdvancedFiltersChange,
}) => {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [showSortOption, setShowSortOption] = useState(false);
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const isDesktop = width > 768;

  return (
    <div className={styles.optionsWrapper}>
      <SidebarFilter
        filters={filters}
        setFilterQuery={setFilterQuery}
        isOpenFilter={isOpenFilter}
        setIsOpenFilter={setIsOpenFilter}
        onAdvancedFiltersChange={onAdvancedFiltersChange}
      />
      
      {/* Only show count and sort on desktop */}
      {isDesktop && (
        <>
          <p className={styles.count}>
            {count} {t("category.items")}
          </p>
          <Sort
            sortOptions={sortOptions}
            setOrderQuery={setOrderQuery}
            showSortOption={showSortOption}
            setShowSortOption={setShowSortOption}
          />
        </>
      )}
    </div>
  );
};

export default CategoryOptions;
