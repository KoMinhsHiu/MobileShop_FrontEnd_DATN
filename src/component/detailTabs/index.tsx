import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { DetailTabsProps } from "./detailTabs.types";
import styles from "./detailTabs.module.scss";

const DetailTabs: FC<DetailTabsProps> = ({ 
  description, 
  specifications, 
  reviews = [] 
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: t("product.tabs.description") },
    { id: "specifications", label: t("product.tabs.specifications") },
    { id: "reviews", label: t("product.tabs.reviews") }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`${styles.star} ${index < rating ? styles.filled : ""}`}
      >
        ★
      </span>
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className={styles.tabContent}>
            <div 
              dangerouslySetInnerHTML={{ __html: description }}
              className={styles.description}
            />
          </div>
        );
      
      case "specifications":
        return (
          <div className={styles.tabContent}>
            <div className={styles.specifications}>
              {specifications && specifications.length > 0 ? (
                <table className={styles.specsTable}>
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className={styles.specLabel}>{spec.label}</td>
                        <td className={styles.specValue}>
                          {spec.value
                            .split(';')
                            .map((v, i, arr) => (
                              <React.Fragment key={i}>
                                {v.trim()}
                                {i < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>{t("product.noSpecifications")}</p>
              )}
            </div>
          </div>
        );
      
      case "reviews":
        return (
          <div className={styles.tabContent}>
            <div className={styles.reviews}>
              {reviews.length > 0 ? (
                <>
                  <div className={styles.reviewsSummary}>
                    <h4>{t("product.customerReviews")} ({reviews.length})</h4>
                  </div>
                  {reviews.map((review, index) => (
                    <div key={index} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewerName}>{review.name}</span>
                        <div className={styles.rating}>
                          {renderStars(review.rating)}
                        </div>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                      <p className={styles.reviewComment}>{review.comment ? review.comment : t("product.noComment")}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p>{t("product.noReviews")}</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.detailTabs}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabHeader} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default DetailTabs;
