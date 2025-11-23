import React, { FC } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { mainSliderImage } from "@/const/mainSliderImage";

import styles from "./mainSlider.module.scss";

import Image from 'next/image';

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
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={320}
                  priority
                  className={styles.image}
                  style={{ objectFit: 'cover', borderRadius: '12px' }}
                />
              </Link>
            ) : (
              <Image
                src={item.image}
                alt={item.title}
                width={800}
                height={320}
                priority
                className={styles.image}
                style={{ objectFit: 'cover', borderRadius: '12px' }}
              />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default MainSlider;
