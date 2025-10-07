import React, { FC, useState } from "react";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { selectBoxProps } from "./selectBox.types";
import styles from "./selectBox.module.scss";

const SelectBox: FC<selectBoxProps> = ({
  productOption,
  handleSelectOption,
}) => {
  const [option, setOption] = useState(productOption.items[0].value);
  const [showMore, setShowMore] = useState(false);
  const [selectedId, setSelectedId] = useState(productOption.items[0].id);
  
  const SelectOption = (optionValue: string, optionId: string) => {
    setOption(optionValue);
    setSelectedId(optionId);
    setShowMore(false);
    handleSelectOption(productOption.id, optionId);
  };

  // Check if this is a color option
  const isColorOption = productOption.title?.toLowerCase().includes('color') || 
                       productOption.title?.toLowerCase().includes('màu') ||
                       productOption.title?.toLowerCase().includes('colour');

  // Map English colors to Vietnamese
  const colorMap: { [key: string]: string } = {
    'red': 'Đỏ',
    'blue': 'Xanh dương', 
    'green': 'Xanh lá',
    'yellow': 'Vàng',
    'black': 'Đen',
    'white': 'Trắng',
    'pink': 'Hồng',
    'purple': 'Tím',
    'orange': 'Cam',
    'brown': 'Nâu',
    'gray': 'Xám',
    'grey': 'Xám',
    'silver': 'Bạc',
    'gold': 'Vàng kim'
  };
  
  const getVietnameseColor = (color: string) => {
    const lowerColor = color.toLowerCase();
    const vietnameseColor = colorMap[lowerColor] || color;
    return vietnameseColor.charAt(0).toUpperCase() + vietnameseColor.slice(1);
  };

  // If this is a color option, render inline format
  if (isColorOption) {
    return (
      <div className={styles.colorInlineSelect}>
        <span className={styles.colorTitle}>Màu: </span>
        <span className={styles.colorOptions}>
          {productOption.items.map((item, index) => {
            return (
              <React.Fragment key={item.id}>
                <span
                  onClick={() => SelectOption(item.value, item.id)}
                  className={`${styles.colorItem} ${
                    item.id === selectedId ? styles.selected : ""
                  }`}
                >
                  {getVietnameseColor(item.value)}
                </span>
                {index < productOption.items.length - 1 && <span className={styles.separator}>, </span>}
              </React.Fragment>
            );
          })}
        </span>
      </div>
    );
  }

  // Regular dropdown for non-color options
  return (
    <div className={styles.selectBox}>
      <div
        className={styles.selectedOption}
        onClick={() => setShowMore(!showMore)}
      >
        <p>{option}</p>
        <FontAwesomeIcon icon={faChevronDown} className={styles.icon} />
      </div>
      <div className={`${styles.moreOption} ${showMore ? styles.show : ""}`}>
        {productOption.items.map((option) => {
          return (
            <p
              key={option.id}
              onClick={() => SelectOption(option.value, option.id)}
            >
              {option.value}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default SelectBox;
