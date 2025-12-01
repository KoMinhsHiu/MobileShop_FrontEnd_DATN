import React, { FC, useMemo } from "react";
import Link from "next/link";

import { useCart } from "@/context/cartContext";
import { formatPrice, parsePrice } from "@/utils/function/formatPrice";

import UpdateQuantity from "./updateQuantity";
import { CartItemProps } from "./cartItem.types";

import styles from "./cartItem.module.scss";

import Image from 'next/image';

interface CartItemWithSelectProps extends CartItemProps {
  selected: boolean;
  onSelect: (id: number, checked: boolean) => void;
}

const CartItem: FC<CartItemWithSelectProps> = ({ product, selected, onSelect }) => {
  const { id, productAttributeId, quantity, name, image, price, discount, attributes, itemId } = product;
  const { isLoading } = useCart();

  // Calculate total price for this item
  const itemTotal = useMemo(() => {
    const unitPrice = parsePrice(price);
    const discountAmount = discount ? parsePrice(discount) : 0;
    return (unitPrice - discountAmount) * quantity;
  }, [price, quantity, discount]);

  const productLink = `/product/${id}`;

  return (
    <div className={styles.cartItem}>
      <div>
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelect(itemId, e.target.checked)}
          disabled={isLoading}
          aria-label="Chọn sản phẩm"
        />
      </div>
      <div className={styles.imageColumn}>
        <Link href={productLink}>
          <Image
            src={image}
            alt={name}
            width={60}
            height={60}
            priority
            className={styles.productImage}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
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
          itemId={itemId}
        />
      </div>

      <div className={styles.totalColumn}>
        <span className={styles.totalPrice}>{formatPrice(itemTotal)}</span>
      </div>
    </div>
  );
};

export default CartItem;
