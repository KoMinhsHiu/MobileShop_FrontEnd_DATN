import React, { FC, useEffect, useRef } from "react";
import styles from "./sort.module.scss";
import { SortProps } from "./sort.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSort } from "@fortawesome/free-solid-svg-icons";

const Sort: FC<SortProps> = ({
  sortOptions,
  setOrderQuery,
  showSortOption,
  setShowSortOption,
}) => {
  const activeSort = sortOptions?.find((item) => item.isActive === true);

  const divRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      setShowSortOption(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.sortWrapper} ref={divRef}>
      <div
        className={styles.activeItem}
        onClick={() => setShowSortOption(!showSortOption)}
      >
        <FontAwesomeIcon icon={faSort} fontSize={14} />
        <p className={styles.title}>
          Sắp xếp: {activeSort?.label}
        </p>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`${styles.chevron} ${showSortOption ? styles.rotated : ''}`}
        />
      </div>
      <div
        className={`${styles.sortOptions} ${showSortOption ? styles.show : ""}`}
      >
        <div className={styles.sortHeader}>
          <span className={styles.sortLabel}>📊 Sắp xếp theo:</span>
        </div>
        {sortOptions?.map((item, index) => {
          return (
            <div
              onClick={() => {
                console.log('Sort option clicked:', item.label, item.querySort, item.isActive);
                setOrderQuery(item.querySort);
                setShowSortOption(false);
              }}
              className={`${styles.item} ${item.isActive ? styles.active : ''}`}
              key={index}
            >
              <p>{item.label}</p>
              {item.isActive && (
                <span className={styles.activeIndicator}>✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sort;
