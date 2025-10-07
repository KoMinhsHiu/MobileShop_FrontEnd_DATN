import React from "react";
import { OrderItem } from "@/utils/type/order";
import { formatPrice } from "@/utils/function/formatPrice";

import styles from "./orderItemsList.module.scss";

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  return (
    <div className={styles.orderItems}>
      <h3>Danh sách sản phẩm</h3>
      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <div className={styles.itemImage}>
              <img src={item.image} alt={item.name} />
            </div>
            <div className={styles.itemInfo}>
              <h4 className={styles.itemName}>{item.name}</h4>
              <p className={styles.itemAttributes}>
                {item.attributes.key}
              </p>
              <p className={styles.itemQuantity}>
                Số lượng: {item.quantity}
              </p>
            </div>
            <div className={styles.itemPrice}>
              {formatPrice(item.price)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsList;
