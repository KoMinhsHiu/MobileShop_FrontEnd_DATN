import React from "react";
import { OrderStatus } from "@/utils/type/order";

interface OrderStatusBadgeProps {
  status: keyof OrderStatus;
  statusConfig: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, statusConfig }) => {
  const config = statusConfig[status];
  
  return (
    <span 
      className="order-status-badge"
      style={{ backgroundColor: config.color }}
    >
      {config.icon} {config.label}
    </span>
  );
};

export default OrderStatusBadge;
