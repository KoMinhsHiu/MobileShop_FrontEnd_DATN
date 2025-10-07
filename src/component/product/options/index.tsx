import React, { FC } from "react";

import { optionType } from "@/const/productOption";

import SelectBox from "./selectBox";
import ColorSelect from "./colorSelect";
import { OptionsProps } from "./options.type";

import styles from "./options.module.scss";

const Options: FC<OptionsProps> = ({ options, handleSelectOption }) => {
  return (
    <div className={styles.options}>
      {options.map((option, idx) => {
        // Check if this is a color option based on title or content
        const isColorOption = option.title?.toLowerCase().includes('color') || 
                             option.title?.toLowerCase().includes('màu') ||
                             option.title?.toLowerCase().includes('colour');
        
        if (isColorOption || option.type === optionType.color) {
          return (
            <ColorSelect
              productOption={option}
              handleSelectOption={handleSelectOption}
              key={idx}
            />
          );
        }
        
        switch (option.type) {
          case optionType.radio:
            return (
              <SelectBox
                productOption={option}
                handleSelectOption={handleSelectOption}
                key={idx}
              />
            );
          case optionType.select:
            return (
              <SelectBox
                productOption={option}
                handleSelectOption={handleSelectOption}
                key={idx}
              />
            );
          default:
            return (
              <SelectBox
                productOption={option}
                handleSelectOption={handleSelectOption}
                key={idx}
              />
            );
        }
      })}
    </div>
  );
};

export default Options;
