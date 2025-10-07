import React, { FC } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { mainSliderImage } from "@/const/mainSliderImage";

import styles from "./mainSlider.module.scss";

const MainSlider: FC = () => {
  return (
    <Swiper
      pagination={true}
      modules={[Pagination]}
      className={styles.sliderContainer}
    >
      {mainSliderImage.map((item, index) => {
        return (
          <SwiperSlide key={index}>
            {item.link ? (
              <Link href={item.link}>
                <img src={item.image} alt={item.title} className={styles.image} />
              </Link>
            ) : (
              <img src={item.image} alt={item.title} className={styles.image} />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default MainSlider;
