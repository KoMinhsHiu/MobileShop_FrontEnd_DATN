import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faPhone, faEnvelope, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";

import { footerLink, socialMediaLinks } from "@/const/FooterLink";
import useWindowSize from "@/utils/hooks/useWindowSize";

import AccordionItem from "../accordionItem";

import styles from "./footer.module.scss";

const Footer: FC = () => {
  const { width } = useWindowSize();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Main Footer Content */}
        <div className={styles.mainFooter}>
          {width < 768 ? (
            footerLink.map((item) => {
              return (
                <AccordionItem
                  titleLink={item.footerLink}
                  title={item.footerTitle}
                  links={item.link}
                  key={item.id}
                />
              );
            })
          ) : (
            <div className={styles.desktopFooter}>
              <div className={styles.columnWrapper}>
                {footerLink.map((item) => {
                  return (
                    <div className={styles.column} key={item.id}>
                      <div className={styles.titleRow}>
                        <p className={styles.title}>{item.footerTitle}</p>
                      </div>
                      <div className={styles.linkBox}>
                        {item.link?.map((link, idx) => {
                          return (
                            <a
                              href={link.link}
                              className={styles.subLink}
                              key={idx}
                            >
                              {link.title}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Contact Info */}
              <div className={styles.contactInfo}>
                <h3 className={styles.contactTitle}>Liên hệ với chúng tôi</h3>
                <div className={styles.contactItems}>
                  <div className={styles.contactItem}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.contactIcon} />
                    <span>123 Đường ABC, Quận 1, TP.HCM</span>
                  </div>
                  <div className={styles.contactItem}>
                    <FontAwesomeIcon icon={faPhone} className={styles.contactIcon} />
                    <a href="tel:1900xxxx">1900-xxxx</a>
                  </div>
                  <div className={styles.contactItem}>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.contactIcon} />
                    <a href="mailto:support@phonehub.vn">support@phonehub.vn</a>
                  </div>
                  <div className={styles.contactItem}>
                    <FontAwesomeIcon icon={faClock} className={styles.contactIcon} />
                    <span>8:00 - 22:00 (T2-CN)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Media */}
        <div className={styles.socialBox}>
          <p className={styles.socialTitle}>Kết nối với chúng tôi</p>
          <div className={styles.socialItems}>
            <a
              href={socialMediaLinks.faceBook}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} />
              <span>Facebook</span>
            </a>
            <a
              href={socialMediaLinks.instagram}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
              <span>Instagram</span>
            </a>
            <a
              href={socialMediaLinks.youtube}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faYoutube} />
              <span>YouTube</span>
            </a>
            <a
              href={socialMediaLinks.tiktok}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTiktok} />
              <span>TikTok</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <div className={styles.copyrightContent}>
            <p>&copy; 2024 PhoneHub. Tất cả quyền được bảo lưu.</p>
            <p>Được thiết kế và phát triển bởi PhoneHub Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
