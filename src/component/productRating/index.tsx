import React, { useEffect, useState } from "react";
import { voucherAPI, Voucher } from "@/utils/api/voucher";
import styles from "./productRating.module.scss";
import { Review } from "../detailTabs/detailTabs.types";
import RatingModal from "./RatingModal";

interface ProductRatingProps {
	averageRating: number;
	reviews: Review[];
	productId: string;
}

const ProductRating: React.FC<ProductRatingProps> = ({ averageRating, reviews, productId }) => {
	const totalReviews = reviews.length;
	const ratingCounts = [5, 4, 3, 2, 1].map(star =>
		reviews.filter(r => r.rating === star).length
	);

	const [vouchers, setVouchers] = useState<Voucher[]>([]);
	const [loadingVoucher, setLoadingVoucher] = useState(false);
	const [voucherError, setVoucherError] = useState<string | null>(null);

	// Modal đánh giá
	const [showRatingModal, setShowRatingModal] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		try {
			const tokens = typeof window !== "undefined" ? localStorage.getItem("phonehub_tokens") : null;
			let token = null;
			if (tokens) {
				const tokenData = JSON.parse(tokens);
				token = tokenData.accessToken || tokenData.access_token || tokenData.token;
			}
			setIsLoggedIn(!!token);
		} catch {
			setIsLoggedIn(false);
		}
	}, []);

	useEffect(() => {
		const fetchVouchers = async () => {
			setLoadingVoucher(true);
			setVoucherError(null);
			try {
				const variantIdNum = Number(productId);
				if (!variantIdNum) {
					setVouchers([]);
					setLoadingVoucher(false);
					return;
				}
				const res = await voucherAPI.getVouchersByVariantId([variantIdNum]);
				setVouchers(res.data || []);
			} catch (err: any) {
				setVoucherError("Không thể tải voucher");
				setVouchers([]);
			} finally {
				setLoadingVoucher(false);
			}
		};
		fetchVouchers();
	}, [productId]);

	const handleOpenRatingModal = () => {
		let token = null;
		try {
			const tokens = typeof window !== "undefined" ? localStorage.getItem("phonehub_tokens") : null;
			if (tokens) {
				const tokenData = JSON.parse(tokens);
				token = tokenData.accessToken || tokenData.access_token || tokenData.token;
			}
		} catch {}
		if (!token) {
			setIsLoggedIn(false);
			return;
		}
		setIsLoggedIn(true);
		setShowRatingModal(true);
	}

	return (
		<>
			<div className={styles.productRatingContainer}>
				<div className={styles.leftSection}>
					<div className={styles.voucherTitle}>Khuyến mãi hấp dẫn</div>
					<div className={styles.voucherList}>
						{loadingVoucher && <div className={styles.voucherItem}>Đang tải voucher...</div>}
						{voucherError && <div className={styles.voucherItem}>{voucherError}</div>}
						{!loadingVoucher && !voucherError && vouchers.length === 0 && (
							<div className={styles.voucherItem}>Chưa có voucher nào</div>
						)}
						{vouchers.map((voucher: Voucher) => (
							<div key={voucher.id} className={styles.voucherItem}>
								<span className={styles.voucherCodeIcon}>🏷️</span>
								<b>{voucher.code}</b>{voucher.title}
							</div>
						))}
					</div>
				</div>
        
				<div className={styles.rightSection}>
					<div className={styles.rightSummaryColumn}>
						<div className={styles.averageRatingBox}>
							<span className={styles.averageRating}>{averageRating?.toFixed(1) || "0.0"}</span>
							<span className={styles.maxRating}>/5</span>
						</div>
						<div className={styles.starsRow}>
							{[1,2,3,4,5].map(star => (
								<span key={star} className={styles.starIcon}>
									★
								</span>
							))}
						</div>
						<div className={styles.totalReviews}>{totalReviews} lượt đánh giá</div>
						<button
							className={styles.writeReviewButton}
							disabled={!isLoggedIn}
							onClick={handleOpenRatingModal}
						>Viết đánh giá</button>
						{!isLoggedIn && (
							<div style={{ color: '#c62828', fontSize: '0.98rem', marginTop: '0.5rem' }}>
								<p>Vui lòng đăng nhập</p>
								<p>để đánh giá sản phẩm.</p>
							</div>
						)}
					</div>
					<div className={styles.rightBreakdownColumn}>
						<div className={styles.ratingBreakdown}>
							{[5,4,3,2,1].map((star, idx) => (
								<div key={star} className={styles.ratingRow}>
									<span className={styles.starLabel}>{star} <span className={styles.starIcon}>★</span></span>
									<div className={styles.ratingBarWrapper}>
										<div
											className={styles.ratingBar}
											style={{ width: totalReviews ? `${(ratingCounts[idx] / totalReviews) * 100}%` : "0%" }}
										/>
									</div>
									<span className={styles.ratingCount}>({ratingCounts[idx]})</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{showRatingModal && (
				<React.Suspense fallback={null}>
					<RatingModal
						variantId={Number(productId)}
						onSave={() => {
							setShowRatingModal(false);
							window.location.reload();
						}}
						onClose={() => setShowRatingModal(false)}
					/>
				</React.Suspense>
			)}
		</>
	);
};

export default ProductRating;