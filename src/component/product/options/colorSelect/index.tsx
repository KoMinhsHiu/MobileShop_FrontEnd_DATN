import React, { FC, useState } from "react";
import styles from "./colorSelect.module.scss";
import { selectBoxProps } from "./ colorSelect.types";

const ColorSelect: FC<selectBoxProps> = ({ productOption ,handleSelectOption }) => {
  const [selectedColorId, setSelectedColorId] = useState(productOption.items[0].id);
  
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
    // Capitalize first letter if it's not already capitalized
    return vietnameseColor.charAt(0).toUpperCase() + vietnameseColor.slice(1);
  };
  
  return (
    <div className={styles.colorSelect}>
      <span className={styles.title}>Màu: </span>
      <span className={styles.colorList}>
        {productOption.items.map((option, index) => {
          return (
            <React.Fragment key={option.id}>
              <span
                onClick={() => {
                  setSelectedColorId(option.id); 
                  handleSelectOption(productOption.id, option.id);
                }}
                className={`${styles.colorOption} ${
                  option.id === selectedColorId ? styles.selected : ""
                }`}
              >
                {getVietnameseColor(option.value)}
              </span>
              {index < productOption.items.length - 1 && <span className={styles.separator}>, </span>}
            </React.Fragment>
          );
        })}
      </span>
    </div>
  );
};

export default ColorSelect;
