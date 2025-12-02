import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import styles from './pointSelector.module.scss';
import { formatPrice } from "@/utils/function/formatPrice";

interface PointSelectorProps {
  userPoints: number;
  subtotal: number;
  onApply: (discountAmount: number, pointsUsed: number) => void;
}

const PointSelector: React.FC<PointSelectorProps> = ({ 
  userPoints, 
  subtotal, 
  onApply 
}) => {
  const [isUsed, setIsUsed] = useState(false);

  const RATE_PER_POINT = 50;
  const MAX_PERCENTAGE = 0.1;

  const maxAllowedDiscount = Math.floor(subtotal * MAX_PERCENTAGE);
  
  const maxPointsNeed = Math.floor(maxAllowedDiscount / RATE_PER_POINT);

  const actualPointsToUse = Math.min(userPoints, maxPointsNeed);
  
  const actualDiscountAmount = actualPointsToUse * RATE_PER_POINT;

  useEffect(() => {
    if (isUsed) {
      onApply(actualDiscountAmount, actualPointsToUse);
    } else {
      onApply(0, 0);
    }
  }, [isUsed, actualDiscountAmount, actualPointsToUse, onApply]);

  if (userPoints <= 0) return null;

  return (
    <div className={styles.pointContainer}>
      <div className={styles.header}>
        <div className={styles.title}>
          <FontAwesomeIcon icon={faCoins} className={styles.icon} />
          <span>Dùng PHONEHUB Xu</span>
        </div>
        <div className={styles.switchWrapper}>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={isUsed}
                onChange={(e) => setIsUsed(e.target.checked)}
                disabled={actualPointsToUse === 0}
              />
              <span className={styles.slider}></span>
            </label>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.balance}>
           Bạn đang có <strong>{userPoints.toLocaleString()}</strong> điểm
        </p>
        
        {isUsed ? (
           <div className={styles.appliedInfo}>
             <p className={styles.highlight}>
               Đã dùng <strong>{actualPointsToUse.toLocaleString()}</strong> điểm 
               để giảm <span className={styles.discountValue}>{formatPrice(actualDiscountAmount)}</span>
             </p>
             {actualPointsToUse < userPoints && maxPointsNeed < userPoints && (
                <small className={styles.note}>
                  (Giới hạn giảm tối đa 10% giá trị đơn hàng)
                </small>
             )}
           </div>
        ) : (
           <p className={styles.hint}>
             Dùng điểm để được giảm tối đa {formatPrice(actualDiscountAmount)}
           </p>
        )}
      </div>
    </div>
  );
};

export default PointSelector;