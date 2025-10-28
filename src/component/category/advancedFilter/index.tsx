import React, { FC, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faChevronDown, faChevronUp, faMicrochip, faCog, faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./advancedFilter.module.scss";

export interface AdvancedFilterData {
  chipset?: string;
  os?: string;
  minRam?: number;
  maxRam?: number;
  minStorage?: number;
  maxStorage?: number;
  minScreenSize?: number;
  maxScreenSize?: number;
  nfc?: boolean;
}

interface AdvancedFilterProps {
  onFiltersChange: (filters: AdvancedFilterData) => void;
  initialFilters?: AdvancedFilterData;
}

const AdvancedFilter: FC<AdvancedFilterProps> = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState<AdvancedFilterData>(initialFilters);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    specs: true,
    features: true,
  });


  // Common chipset options
  const chipsetOptions = [
    "Snapdragon",
    "Apple A17", 
    "Apple A16",
    "Apple A15",
    "Apple A14",
    "MediaTek Dimensity",
    "Exynos",
    "Kirin",
  ];

  // Common OS options
  const osOptions = [
    "Android",
    "iOS", 
    "HarmonyOS",
  ];

  // RAM options (GB)
  const ramOptions = [4, 6, 8, 12, 16, 18, 24];

  // Storage options (GB)
  const storageOptions = [64, 128, 256, 512, 1024, 2048];

  // Screen size options (inches)
  const screenSizeOptions = [5.0, 5.5, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof AdvancedFilterData, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" ? undefined : value
    }));
  };


  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && value !== null
  );


  return (
    <div className={styles.advancedFilter}>
      <div className={styles.header}>
        <h3>Bộ lọc nâng cao</h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className={styles.clearAllBtn}>
            <FontAwesomeIcon icon={faTimes} />
            Xóa tất cả
          </button>
        )}
      </div>


      {/* Specifications */}
      <div className={styles.filterSection}>
        <div 
          className={styles.sectionHeader}
          onClick={() => toggleSection('specs')}
        >
          <h4>
            <FontAwesomeIcon icon={faMicrochip} />
            Thông số kỹ thuật
          </h4>
          <FontAwesomeIcon 
            icon={expandedSections.specs ? faChevronUp : faChevronDown}
            className={styles.chevron}
          />
        </div>
        {expandedSections.specs && (
          <div className={styles.sectionContent}>
            {/* Chipset */}
            <div className={styles.inputGroup}>
              <label>Chipset</label>
              <select
                value={filters.chipset || ""}
                onChange={(e) => updateFilter('chipset', e.target.value)}
                className={styles.selectInput}
              >
                <option value="">Tất cả chipset</option>
                {chipsetOptions.map(chipset => (
                  <option key={chipset} value={chipset}>{chipset}</option>
                ))}
              </select>
            </div>

            {/* OS */}
            <div className={styles.inputGroup}>
              <label>Hệ điều hành</label>
              <select
                value={filters.os || ""}
                onChange={(e) => updateFilter('os', e.target.value)}
                className={styles.selectInput}
              >
                <option value="">Tất cả hệ điều hành</option>
                {osOptions.map(os => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </select>
            </div>

            {/* RAM Range */}
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label>RAM tối thiểu (GB)</label>
                <select
                  value={filters.minRam || ""}
                  onChange={(e) => updateFilter('minRam', parseInt(e.target.value) || undefined)}
                  className={styles.selectInput}
                >
                  <option value="">Không giới hạn</option>
                  {ramOptions.map(ram => (
                    <option key={ram} value={ram}>{ram} GB</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>RAM tối đa (GB)</label>
                <select
                  value={filters.maxRam || ""}
                  onChange={(e) => updateFilter('maxRam', parseInt(e.target.value) || undefined)}
                  className={styles.selectInput}
                >
                  <option value="">Không giới hạn</option>
                  {ramOptions.map(ram => (
                    <option key={ram} value={ram}>{ram} GB</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Storage Range */}
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label>Bộ nhớ tối thiểu (GB)</label>
                <select
                  value={filters.minStorage || ""}
                  onChange={(e) => updateFilter('minStorage', parseInt(e.target.value) || undefined)}
                  className={styles.selectInput}
                >
                  <option value="">Không giới hạn</option>
                  {storageOptions.map(storage => (
                    <option key={storage} value={storage}>{storage} GB</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Bộ nhớ tối đa (GB)</label>
                <select
                  value={filters.maxStorage || ""}
                  onChange={(e) => updateFilter('maxStorage', parseInt(e.target.value) || undefined)}
                  className={styles.selectInput}
                >
                  <option value="">Không giới hạn</option>
                  {storageOptions.map(storage => (
                    <option key={storage} value={storage}>{storage} GB</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Screen Size Range */}
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label>Màn hình tối thiểu (inch)</label>
                <select
                  value={filters.minScreenSize || ""}
                  onChange={(e) => updateFilter('minScreenSize', parseFloat(e.target.value) || undefined)}
                  className={styles.selectInput}
                >
                  <option value="">Không giới hạn</option>
                  {screenSizeOptions.map(size => (
                    <option key={size} value={size}>{size}"</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Màn hình tối đa (inch)</label>
                <select
                  value={filters.maxScreenSize || ""}
                  onChange={(e) => updateFilter('maxScreenSize', parseFloat(e.target.value) || undefined)}
                  className={styles.selectInput}
                >
                  <option value="">Không giới hạn</option>
                  {screenSizeOptions.map(size => (
                    <option key={size} value={size}>{size}"</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className={styles.filterSection}>
        <div 
          className={styles.sectionHeader}
          onClick={() => toggleSection('features')}
        >
          <h4>
            <FontAwesomeIcon icon={faCog} />
            Tính năng
          </h4>
          <FontAwesomeIcon 
            icon={expandedSections.features ? faChevronUp : faChevronDown}
            className={styles.chevron}
          />
        </div>
        {expandedSections.features && (
          <div className={styles.sectionContent}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.nfc === true}
                  onChange={(e) => updateFilter('nfc', e.target.checked ? true : undefined)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Hỗ trợ NFC</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilter;
