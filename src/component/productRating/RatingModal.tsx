import React, { useState } from "react";
import styles from "./RatingModal.module.scss";
import { phonesAPI } from "@/utils/api/phone";

interface RatingModalProps {
	variantId: number;
	onSave: () => void;
	onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ variantId, onSave, onClose }) => {
	const [rating, setRating] = useState<number>(0);
	const [comment, setComment] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (rating < 1 || rating > 5) {
			setError("Vui lòng chọn số sao (1-5)");
			return;
		}
		setIsSubmitting(true);
		setError(null);
		try {
			await phonesAPI.createReview({ variantId, rating, comment });
			onSave();
		} catch (err: any) {
			setError(err?.message || "Không thể gửi đánh giá");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>Đánh giá sản phẩm</h2>
					<button className={styles.closeButton} onClick={onClose}>&times;</button>
				</div>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.section}>
						<div className={styles.starRow}>
							{[1,2,3,4,5].map(star => (
								<span
									key={star}
									style={{
										fontSize: "2rem",
										color: star <= rating ? "#ffc107" : "#e2e8f0",
										cursor: "pointer",
										transition: "color 0.2s"
									}}
									onClick={() => setRating(star)}
									data-testid={`star-${star}`}
								>★</span>
							))}
						</div>
						<label className={styles.label} htmlFor="comment">Nhận xét (tùy chọn)</label>
						<textarea
							id="comment"
							className={styles.textarea}
							value={comment}
							onChange={e => setComment(e.target.value)}
							placeholder="Nhập nhận xét của bạn..."
							rows={4}
							maxLength={500}
						/>
						{error && <div className={styles.errorText}>{error}</div>}
					</div>
					<div className={styles.formActions}>
						<button
							type="button"
							className={styles.cancelButton}
							onClick={onClose}
							disabled={isSubmitting}
						>Hủy</button>
						<button
							type="submit"
							className={styles.saveButton}
							disabled={isSubmitting || rating < 1}
						>Gửi đánh giá</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RatingModal;