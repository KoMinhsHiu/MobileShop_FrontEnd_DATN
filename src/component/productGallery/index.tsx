import React, { FC, useEffect, useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
  faSearchPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { productGalleryProps } from "./productGallery.types";

import styles from "./productGallery.module.scss";

import Image from 'next/image';

const ProductGallery: FC<productGalleryProps> = ({ images }) => {
  const sliderImages = images;
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainImage, setMainImage] = useState(images[activeIndex]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isLastItem = activeIndex === sliderImages.length - 1;
  const isFirstItem = activeIndex === 0;

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setMainImage(sliderImages[activeIndex]);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setMainImage(sliderImages[activeIndex]);
    }
  }, [activeIndex, images, isTransitioning, sliderImages]);

  const handleImageChange = (newIndex: number) => {
    if (newIndex !== activeIndex && !isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex(newIndex);
    }
  };

  return (
    <>
      <div className={styles.imageWrapper}>
        <div className={styles.mainImageBox}>
          <div
            className={`${styles.arrow} ${styles.left} ${
              isFirstItem ? styles.disable : ""
            }`}
            onClick={() => !isFirstItem && handleImageChange(activeIndex - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} color="#fff" fontSize={24} />
          </div>
          <div
            className={`${styles.arrow} ${styles.right} ${
              isLastItem ? styles.disable : ""
            }`}
            onClick={() => !isLastItem && handleImageChange(activeIndex + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} color="#fff" fontSize={24} />
          </div>
          <div className={styles.zoomButton} onClick={() => setIsZoomed(true)}>
            <FontAwesomeIcon icon={faSearchPlus} color="#fff" fontSize={20} />
          </div>
          <Image
            alt="product image"
            src={mainImage.src}
            width={400}
            height={400}
            priority
            className={`${styles.mainImage} ${isTransitioning ? styles.transitioning : ""}`}
            style={{ objectFit: 'contain', borderRadius: '12px' }}
            onClick={() => setIsZoomed(true)}
          />
        </div>
        <div className={styles.sliderWrapper}>
          {sliderImages?.map((image, idx) => {
            return (
              <Image
                alt="product image"
                src={image.src}
                width={60}
                height={60}
                priority
                className={`${styles.sliderImage} ${
                  idx === activeIndex ? styles.active : ""
                }`}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
                key={idx}
                onClick={() => handleImageChange(idx)}
              />
            );
          })}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className={styles.zoomModal} onClick={() => setIsZoomed(false)}>
          <div className={styles.zoomContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setIsZoomed(false)}
            >
              <FontAwesomeIcon icon={faTimes} color="#fff" fontSize={24} />
            </button>
            <Image
              alt="product image zoomed"
              src={mainImage.src}
              width={800}
              height={800}
              priority
              className={styles.zoomedImage}
              style={{ objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductGallery;
