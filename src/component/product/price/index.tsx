import React, { FC } from "react";
import styles from "./price.module.scss";
import { PriceProps } from "./price.type";

const Price: FC<PriceProps> = ({ price, originalPrice }) => {
  return (
    <div className={styles.priceBox}>
      <p className={styles.price}>{price}</p>
      {originalPrice && originalPrice !== price && (
        <p className={styles.originalPrice}>{originalPrice}</p>
      )}
    </div>
  );
};

export default Price;
