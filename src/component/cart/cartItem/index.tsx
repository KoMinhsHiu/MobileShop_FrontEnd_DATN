import React, { FC, useMemo, useCallback } from "react";
import Link from "next/link";

import { useCart } from "@/context/cartContext";
import { formatPrice, parsePrice } from "@/utils/function/formatPrice";

import UpdateQuantity from "./updateQuantity";
import { CartItemProps } from "./cartItem.types";

import styles from "./cartItem.module.scss";

const CartItem: FC<CartItemProps> = ({ product }) => {
  const { id, productAttributeId, quantity, name, image, price, discount, attributes } = product;
  const { removeFromCart, isLoading } = useCart();

  // Calculate total price for this item
  const itemTotal = useMemo(() => {
    const unitPrice = parsePrice(price);
    const discountAmount = discount ? parsePrice(discount) : 0;
    return (unitPrice - discountAmount) * quantity;
  }, [price, quantity, discount]);

  // Handle remove item from cart
  const handleRemove = useCallback(() => {
    removeFromCart({ id, productAttributeId });
  }, [id, productAttributeId, removeFromCart]);

  const productLink = `/product/${id}`;

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageColumn}>
        <Link href={productLink}>
          <img src={image} alt={name} className={styles.productImage} />
        </Link>
      </div>

      <div className={styles.infoColumn}>
        <Link href={productLink} className={styles.productName}>
          {name}
        </Link>
        
        {Object.entries(attributes)?.map(([key, value], index) => (
          <div className={styles.attribute} key={index}>
            <span className={styles.attributeName}>{key}: </span>
            <span className={styles.attributeValue}>{value}</span>
          </div>
        ))}
      </div>

      <div className={styles.priceColumn}>
        {discount ? (
          <span className={styles.unitPrice}>
            {formatPrice(parsePrice(price) - (discount ? parsePrice(discount) : 0))}
          </span>
        ) : (
          <span className={styles.unitPrice}>
            {formatPrice(parsePrice(price))}
          </span>
        )}
      </div>

      <div className={styles.quantityColumn}>
        <UpdateQuantity
          id={id}
          productAttributeId={productAttributeId}
          quantity={quantity}
        />
      </div>

      <div className={styles.totalColumn}>
        <span className={styles.totalPrice}>{formatPrice(itemTotal)}</span>
      </div>

      <div className={styles.actionColumn}>
        <button
          className={`${styles.removeButton} ${isLoading ? styles.disabled : ""}`}
          disabled={isLoading}
          onClick={handleRemove}
          title="Xóa sản phẩm"
          aria-label="Xóa sản phẩm khỏi giỏ hàng"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartItem;
