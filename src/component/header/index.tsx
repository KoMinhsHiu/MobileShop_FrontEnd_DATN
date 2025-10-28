import React, { FC } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";

import Search from "../search";
import MegaMenu from "../megaMenu";
import styles from "./header.module.scss";

const Header: FC = () => {
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={`${styles.headerContent} container`}>
        <div className={styles.logoWrapper}>
          <Link href={"/"}>
            <img src="/images/PhoneHubLogo.png" alt="PhoneHub Logo" className={styles.logo} />
          </Link>
          <MegaMenu />
        </div>
        
        <div className={styles.navigationMenu}>
          <Link href="/" className={styles.navItem}>Trang chủ</Link>
          <Link href="/products" className={styles.navItem}>Sản phẩm</Link>
          <Link href="/cart" className={styles.navItem}>Giỏ hàng</Link>
          <Link href="/orders" className={styles.navItem}>Đơn hàng</Link>
          <Link href="/profile" className={styles.navItem}>Tài khoản</Link>
        </div>
        
        <div className={styles.rightSection}>
          <Search />
          <div className={styles.authButtons}>
            {isAuthenticated ? (
              <div className={styles.userSection}>
                <span className={styles.welcomeText}>Xin chào, {user?.fullName || user?.username}!</span>
                <button 
                  onClick={() => logout()} 
                  className={styles.logoutBtn}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link href="/LoginSignup/login" className={styles.loginBtn}>Đăng nhập</Link>
                <Link href="/LoginSignup/register" className={styles.registerBtn}>Đăng ký</Link>
              </>
            )}
          </div>
          <div className={styles.iconBox}>
            <Link href="/cart" className={styles.cartLink}>
              <div className={styles.cartIcon}>
                {cart?.products?.length > 0 && (
                  <div className={styles.badge}>
                    <span>{cart?.products?.length}</span>
                  </div>
                )}
                <FontAwesomeIcon 
                  icon={faCartShopping} 
                  style={{ fontSize: '20px', color: '#333' }}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
