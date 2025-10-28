export interface OrderSummaryData {
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
}

export interface OrderSummaryProps {
  products: any[];
  orderSummary: OrderSummaryData;
}
