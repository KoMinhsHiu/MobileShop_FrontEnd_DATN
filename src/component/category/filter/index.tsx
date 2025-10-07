import React, { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import useWindowSize from "@/utils/hooks/useWindowSize";
import { useScrollLock } from "@/utils/hooks";

import Modal from "@/component/modal";

import CheckBox from "./checkBox";

import { FilterProps } from "./filter.types";

import styles from "./filter.module.scss";

const Filter: FC<FilterProps> = ({
  filters,
  setFilterQuery,
  isOpenFilter,
  setIsOpenFilter,
}) => {
  const { lockScroll, unlockScroll } = useScrollLock();
  const { width } = useWindowSize();
  const { t } = useTranslation();
  const isDeskTop = width > 768;
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Track active filters
  useEffect(() => {
    const active = filters?.flatMap(filter => 
      filter.options.filter(option => option.active).map(option => option.label)
    ) || [];
    setActiveFilters(active);
  }, [filters]);

  const removeFilter = (filterLabel: string) => {
    // Find and deactivate the filter
    const filterToRemove = filters?.find(filter => 
      filter.options.some(option => option.label === filterLabel)
    );
    
    if (filterToRemove) {
      const optionToRemove = filterToRemove.options.find(option => option.label === filterLabel);
      if (optionToRemove) {
        // Toggle the filter off
        setFilterQuery(optionToRemove.filterQuery);
      }
    }
  };

  const clearAllFilters = () => {
    setFilterQuery("undefined");
    setIsOpenFilter(false);
  };

  return (
    <>
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className={styles.activeFiltersContainer}>
          <div className={styles.activeFilters}>
            <span className={styles.activeFiltersLabel}>Bộ lọc đang áp dụng:</span>
            {activeFilters.map((filter, idx) => (
              <div key={idx} className={styles.activeFilterBadge}>
                <span>{filter}</span>
                <button 
                  onClick={() => removeFilter(filter)}
                  className={styles.removeFilterBtn}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
            <button 
              onClick={clearAllFilters}
              className={styles.clearAllBtn}
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      )}

      {/* Filter Button */}
      <div
        className={styles.filterWrapper}
        onClick={() => {
          setIsOpenFilter(true);
          lockScroll();
        }}
      >
        <FontAwesomeIcon icon={faFilter} fontSize={18} />
        <p className={styles.title}>
          {t("category.filters")}
          {activeFilters.length > 0 && (
            <span className={styles.filterCount}>({activeFilters.length})</span>
          )}
        </p>
        <FontAwesomeIcon icon={faChevronDown} fontSize={12} />
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={isOpenFilter}
        onClose={() => {
          setIsOpenFilter(false);
          unlockScroll();
        }}
        isFullScreen={!isDeskTop}
        closeClickOutSide={true}
      >
        <div className={styles.modalHeader}>
          <h3>Bộ lọc sản phẩm</h3>
        </div>
        
        <div className={isDeskTop ? styles.row : ""}>
          {filters?.map((filter, idx) => {
            return (
              filter.display && (
                <div className={styles.filterColumn} key={idx}>
                  <div className={styles.filterHeader}>
                    <p className={styles.filterTitle}>{filter.label}</p>
                    {filter.type === "range" && (
                      <span className={styles.priceFilterLabel}>💰 Khoảng giá</span>
                    )}
                    {filter.type === "color" && (
                      <span className={styles.colorFilterLabel}>🎨 Màu sắc</span>
                    )}
                    {filter.type === "checkbox" && filter.label === "Thương hiệu" && (
                      <span className={styles.brandFilterLabel}>🏷️ Thương hiệu</span>
                    )}
                    {filter.type === "checkbox" && filter.label === "Bộ nhớ" && (
                      <span className={styles.storageFilterLabel}>💾 Bộ nhớ</span>
                    )}
                  </div>
                  {filter.options.map((option, optionIdx) => {
                    return (
                      <CheckBox
                        filter={option}
                        setFilterQuery={setFilterQuery}
                        key={optionIdx}
                      />
                    );
                  })}
                </div>
              )
            );
          })}
          <button
            className={styles.clearFilter}
            onClick={clearAllFilters}
          >
            {t("category.clearAll")}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Filter;
