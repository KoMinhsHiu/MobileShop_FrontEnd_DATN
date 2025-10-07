import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import MetaTags from "@/component/metaTags";
import { Order } from "@/utils/type/order";
import { mockOrders } from "./mockData";
import OrderDetail from "@/component/order/orderDetail";

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Simulate loading order detail
      const loadOrderDetail = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundOrder = mockOrders.find(o => o.id === id);
        setOrder(foundOrder || null);
        setLoading(false);
      };

      loadOrderDetail();
    }
  }, [id]);


  const getMetaTitle = () => {
    if (loading) return "Chi tiết đơn hàng - PhoneHub";
    if (!order) return "Không tìm thấy đơn hàng - PhoneHub";
    return `Chi tiết đơn hàng ${order.orderNumber} - PhoneHub`;
  };

  const getMetaDescription = () => {
    if (loading) return "Xem chi tiết đơn hàng của bạn";
    if (!order) return "Đơn hàng không tồn tại";
    return "Xem chi tiết đơn hàng của bạn";
  };

  return (
    <>
      <MetaTags
        title={getMetaTitle()}
        description={getMetaDescription()}
      />
      <OrderDetail order={order} loading={loading} />
    </>
  );
};

export default OrderDetailPage;
