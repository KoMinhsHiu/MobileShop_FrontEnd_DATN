import React, { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import useWindowSize from "@/utils/hooks/useWindowSize";
import { useScrollLock } from "@/utils/hooks";

import Modal from "@/component/modal";
import CheckBox from "../filter/checkBox";
import RadioButton from "../filter/radioButton";
import AdvancedFilter, { AdvancedFilterData } from "../advancedFilter";

import { Filter } from "@/utils/type";
import { FilterProps } from "../filter/filter.types";

import styles from "./sidebarFilter.module.scss";

interface SidebarFilterProps extends FilterProps {
  onAdvancedFiltersChange?: (filters: AdvancedFilterData) => void;
  initialAdvancedFilters?: AdvancedFilterData;
}

const SidebarFilter: FC<SidebarFilterProps> = ({
  filters,
  setFilterQuery,
  isOpenFilter,
  setIsOpenFilter,
  onAdvancedFiltersChange,
  initialAdvancedFilters = {},
}) => {
  const { lockScroll, unlockScroll } = useScrollLock();
  const { width } = useWindowSize();
  const { t } = useTranslation();
  const isDesktop = width > 768;
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterData>(initialAdvancedFilters);

  // Track active filters
  useEffect(() => {
    const regularActive = filters?.flatMap(filter => 
      filter.options.filter(option => option.active).map(option => option.label)
    ) || [];
    
    setActiveFilters(regularActive);
  }, [filters]);

  const removeFilter = (filterLabel: string) => {
    const filterToRemove = filters?.find(filter => 
      filter.options.some(option => option.label === filterLabel)
    );
    
    if (filterToRemove) {
      const optionToRemove = filterToRemove.options.find(option => option.label === filterLabel);
      if (optionToRemove) {
        setFilterQuery(optionToRemove.filterQuery);
      }
    }
  };

  const clearAllFilters = () => {
    setFilterQuery("undefined");
    setAdvancedFilters({});
    setIsOpenFilter(false);
  };

  const handleAdvancedFiltersChange = (newFilters: AdvancedFilterData) => {
    setAdvancedFilters(newFilters);
    if (onAdvancedFiltersChange) {
      onAdvancedFiltersChange(newFilters);
    }
  };

  const hasActiveFilters = activeFilters.length > 0 || Object.values(advancedFilters).some(value => 
    value !== undefined && value !== "" && value !== null
  );

  // Desktop sidebar view
  if (isDesktop) {
    return (
      <div className={styles.sidebarFilter}>
        {/* Active Filters Display */}
        {hasActiveFilters && (
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

        {/* Regular Filters */}
        {filters?.map((filter, idx) => {
          return (
            filter.display && (
              <div className={styles.filterSection} key={idx}>
                <div className={styles.filterHeader}>
                  <p className={styles.filterTitle}>{filter.label}</p>
                </div>
                {filter.options.map((option, optionIdx) => {
                  return filter.type === "radio" ? (
                    <RadioButton
                      filter={option}
                      setFilterQuery={setFilterQuery}
                      key={optionIdx}
                    />
                  ) : (
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

        {/* Advanced Filters */}
        <AdvancedFilter
          onFiltersChange={handleAdvancedFiltersChange}
          initialFilters={advancedFilters}
        />
      </div>
    );
  }

  // Mobile modal view
  return (
    <>
      {/* Active Filters Display */}
      {hasActiveFilters && (
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
        isFullScreen={true}
        closeClickOutSide={true}
      >
        <div className={styles.modalHeader}>
          <h3>Bộ lọc sản phẩm</h3>
        </div>
        
        <div className={styles.modalBody}>
          {/* Regular filters */}
          {filters?.map((filter, idx) => {
            return (
              filter.display && (
                <div className={styles.filterColumn} key={idx}>
                  <div className={styles.filterHeader}>
                    <p className={styles.filterTitle}>{filter.label}</p>
                  </div>
                  {filter.options.map((option, optionIdx) => {
                    return filter.type === "radio" ? (
                      <RadioButton
                        filter={option}
                        setFilterQuery={setFilterQuery}
                        key={optionIdx}
                      />
                    ) : (
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

          {/* Advanced filters */}
          <div className={styles.advancedFilterMobile}>
            <AdvancedFilter
              onFiltersChange={handleAdvancedFiltersChange}
              initialFilters={advancedFilters}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SidebarFilter;
