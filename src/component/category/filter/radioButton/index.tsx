import React, { FC } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import { CheckBoxProps } from "../checkBox/checkBox.types";

import styles from "./radioButton.module.scss";

const RadioButton: FC<CheckBoxProps> = ({ filter, setFilterQuery }) => {
  const handleToggle = () => {
    console.log('RadioButton clicked:', filter.label, filter.filterQuery, filter.active);
    // Always set the filter (radio button behavior)
    setFilterQuery(filter.filterQuery);
  };

  return (
    <div className={styles.content}>
      <div
        className={styles.radio}
        onClick={handleToggle}
      >
        <div
          className={`${styles.circle} ${filter.active ? styles.active : ""}`}
          style={{
            backgroundColor: filter.properties.color
              ? filter.properties.color
              : undefined,
          }}
        >
          {filter.active && <FontAwesomeIcon icon={faCircle} color="#fff" />}
        </div>
        <p className={styles.label}>{filter.label}</p>
        <p className={styles.count}>( {filter.productCount} )</p>
      </div>
    </div>
  );
};

export default RadioButton;
