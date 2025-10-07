import React from "react";
import { PaymentMethod } from "./types";
import styles from "./paymentMethods.module.scss";

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  selectedPayment: string;
  onPaymentChange: (paymentType: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethods,
  selectedPayment,
  onPaymentChange
}) => {
  return (
    <div className={styles.paymentMethods}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Phương thức thanh toán</h2>
        </div>
        
        <div className={styles.paymentOptions}>
          {paymentMethods.map((method) => (
            <div key={method.type} className={styles.paymentOption}>
              <input
                type="radio"
                id={method.type}
                name="paymentMethod"
                value={method.type}
                checked={selectedPayment === method.type}
                onChange={(e) => onPaymentChange(e.target.value)}
              />
              <label htmlFor={method.type}>
                <span className={styles.radioButton}></span>
                {method.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
