import React, { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import searchAPI, { SearchResponse } from "@/utils/api/search";
import styles from "./search.module.scss";
import { formatCurrency } from "../admin/admin.utils";

const Search: FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse['data'] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const response = await searchAPI.searchPhones(query);
          if (response && response.data) {
            setResults(response.data);
            setIsOpen(true);
          }
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      {/* Input Section */}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bạn cần tìm gì hôm nay?"
          className={styles.input}
          onFocus={() => {
            if (results && query.length >= 2) setIsOpen(true);
          }}
        />
        <div className={styles.iconWrapper}>
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
          ) : query.length > 0 ? (
            <FontAwesomeIcon icon={faXmark} className={styles.clearIcon} onClick={handleClear} />
          ) : (
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
          )}
        </div>
      </div>

      {/* Dropdown Results Section */}
      {isOpen && results && (
        <div className={styles.dropdown}>
          {results.categories && results.categories.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                Có phải bạn muốn tìm
              </div>
              <ul className={styles.categoryList}>
                {results.categories.map((cat, index) => (
                  <li key={index} className={styles.categoryItem}>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.phones && results.phones.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                Sản phẩm gợi ý
              </div>
              <div className={styles.productList}>
                {results.phones.map((phone) => {
                  const finalPrice = phone.originalPrice * (1 - phone.discountPercent / 100);
                  
                  return (
                    <Link 
                      href={`/product/${phone.id}`} 
                      key={phone.id} 
                      className={styles.productItem}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={styles.productImage}>
                        <img src={phone.imageUrl} alt={phone.name} />
                      </div>
                      <div className={styles.productInfo}>
                        <h4 className={styles.productName}>{phone.name}</h4>
                        <div className={styles.priceWrapper}>
                          <span className={styles.finalPrice}>
                            {formatCurrency(finalPrice)}
                          </span>
                          {phone.discountPercent > 0 && (
                            <span className={styles.originalPrice}>
                              {formatCurrency(phone.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          
          {results.phones.length === 0 && results.categories.length === 0 && (
            <div className={styles.emptyState}>
              Không tìm thấy kết quả nào cho "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;