import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicket,
  faSpinner,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faPercent,
  faDollarSign,
  faCalendar,
  faGlobe,
  faTag,
  faCreditCard,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Voucher } from '@/utils/api/voucher';
import { useFetchVoucher } from '@/utils/hooks/api/useFetchVoucher';
import VoucherDetailForm from './VoucherDetailForm';
import AddVoucherForm from './AddVoucherForm';
import UpdateVoucherForm from './UpdateVoucherForm';
import styles from './VoucherManagement.module.scss';
import { message } from 'antd';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const VoucherManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscountType, setFilterDiscountType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVoucherForEdit, setSelectedVoucherForEdit] = useState<Voucher | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [messageApi, contextHolder] = message.useMessage();
  const { vouchers, total, loading, error, refetch } = useFetchVoucher({
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
  });

  // Filter vouchers based on search and filters
  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiscountType = filterDiscountType === 'all' || voucher.discountType === filterDiscountType;
    
    // Check if voucher is active based on dates
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;
    
    let isActive = startDate <= now;
    if (endDate) {
      isActive = isActive && now <= endDate;
    }
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && isActive) ||
                         (filterStatus === 'expired' && !isActive);

    return matchesSearch && matchesDiscountType && matchesStatus;
  });

  // Update pagination when total changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev, 
      totalItems: total,
      totalPages: Math.ceil(total / prev.itemsPerPage)
    }));
  }, [total]);

  // Helper functions
  const formatDiscountValue = (type: string, value: number) => {
    if (type === 'percent') {
      return `${value}%`;
    }
    return `${value.toLocaleString('vi-VN')}đ`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getAppliesToDisplay = (appliesTo: string) => {
    switch (appliesTo) {
      case 'all': return 'Tất cả';
      case 'category': return 'Danh mục';
      case 'payment_method': return 'Phương thức thanh toán';
      default: return appliesTo;
    }
  };

  const getVoucherStatus = (voucher: Voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;
    
    if (startDate > now) {
      return { status: 'upcoming', label: 'Sắp diễn ra', className: 'upcoming' };
    }
    
    if (endDate && now > endDate) {
      return { status: 'expired', label: 'Đã hết hạn', className: 'expired' };
    }
    
    return { status: 'active', label: 'Đang hoạt động', className: 'active' };
  };

  // Event handlers
  const handleView = (id: number) => {
    const voucher = vouchers.find(v => v.id === id);
    if (voucher) {
      setSelectedVoucher(voucher);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleSaveVoucher = () => {
    messageApi.success('Thêm voucher thành công!');
    setIsAddModalOpen(false);
  };

  const handleUpdateVoucher = () => {
    messageApi.success('Cập nhật voucher thành công!');
    setIsEditModalOpen(false);
    setSelectedVoucherForEdit(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVoucherForEdit(null);
  };

  const handleAddVoucher = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const voucher = vouchers.find(v => v.id === id);
    if (voucher) {
      setSelectedVoucherForEdit(voucher);
      setIsEditModalOpen(true);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage,
      currentPage: 1
    }));
  };

  // Loading state
  if (loading && vouchers.length === 0) {
    return (
      <div className={styles.voucherManagement}>
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          <p>Đang tải danh sách voucher...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.voucherManagement}>
        <div className={styles.errorContainer}>
          <h2>Lỗi tải dữ liệu</h2>
          <p>{error}</p>
          <button onClick={() => refetch()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    {contextHolder}
    <div className={styles.voucherManagement}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FontAwesomeIcon icon={faTicket} className={styles.titleIcon} />
            Quản lý Voucher
          </h1>
          <p className={styles.subtitle}>Quản lý các mã giảm giá và khuyến mại</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.addBtn}
            onClick={handleAddVoucher}
          >
            <FontAwesomeIcon icon={faPlus} />
            Thêm voucher
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã voucher hoặc tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterItem}>
            <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
            <select
              value={filterDiscountType}
              onChange={(e) => setFilterDiscountType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả loại giảm giá</option>
              <option value="percent">Giảm theo %</option>
              <option value="amount">Giảm theo số tiền</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <FontAwesomeIcon icon={faCalendar} className={styles.filterIcon} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Đã hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã voucher</th>
              <th>Loại giảm giá</th>
              <th>Giá trị giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Áp dụng cho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={styles.loadingRow}>
                  <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                  Đang tải...
                </td>
              </tr>
            ) : filteredVouchers.length > 0 ? (
              filteredVouchers.map(voucher => {
                const voucherStatus = getVoucherStatus(voucher);
                return (
                  <tr key={voucher.id}>
                    <td>
                      <div className={styles.voucherCode}>
                        <h4>{voucher.code}</h4>
                        <p>{voucher.title}</p>
                      </div>
                    </td>
                    <td>
                      <div className={styles.discountType}>
                        <FontAwesomeIcon 
                          icon={voucher.discountType === 'percent' ? faPercent : faDollarSign} 
                        />
                        {voucher.discountType === 'percent' ? 'Giảm theo %' : 'Giảm theo số tiền'}
                      </div>
                    </td>
                    <td className={styles.discountValue}>
                      {formatDiscountValue(voucher.discountType, voucher.discountValue)}
                    </td>
                    <td className={styles.dateText}>
                      {formatDate(voucher.startDate)}
                    </td>
                    <td className={styles.dateText}>
                      {voucher.endDate ? formatDate(voucher.endDate) : 'Không giới hạn'}
                    </td>
                    <td>
                      <div className={styles.appliesTo}>
                        <FontAwesomeIcon 
                          icon={
                            voucher.appliesTo === 'all' ? faGlobe :
                            voucher.appliesTo === 'category' ? faTag :
                            faCreditCard
                          } 
                        />
                        {getAppliesToDisplay(voucher.appliesTo)}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusTag} ${styles[voucherStatus.className]}`}>
                        {voucherStatus.label}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleView(voucher.id)}
                          title="Xem chi tiết"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleEdit(voucher.id)}
                          title="Chỉnh sửa"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className={styles.noData}>
                  Không tìm thấy voucher nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số {pagination.totalItems} voucher
        </div>

        <div className={styles.paginationControls}>
          <div className={styles.itemsPerPage}>
            <label>Hiển thị:</label>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>voucher/trang</span>
          </div>

          {pagination.totalPages > 1 && (
            <div className={styles.pageControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                ‹
              </button>

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
              >
                1
              </button>

              {(() => {
                const pages = [];
                const startPage = Math.max(2, pagination.currentPage - 2);
                const endPage = Math.min(pagination.totalPages - 1, pagination.currentPage + 2);

                if (startPage > 2) {
                  pages.push(
                    <span key="start-ellipsis" className={styles.ellipsis}>...</span>
                  );
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={`${styles.paginationButton} ${pagination.currentPage === i ? styles.active : ''}`}
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </button>
                  );
                }

                if (endPage < pagination.totalPages - 1) {
                  pages.push(
                    <span key="end-ellipsis" className={styles.ellipsis}>...</span>
                  );
                }

                return pages;
              })()}

              {pagination.totalPages > 1 && (
                <button
                  className={`${styles.paginationButton} ${pagination.currentPage === pagination.totalPages ? styles.active : ''}`}
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  {pagination.totalPages}
                </button>
              )}

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Voucher Detail Modal */}
      <VoucherDetailForm
        voucher={selectedVoucher}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      {/* Add Voucher Modal */}
      {isAddModalOpen && (
        <AddVoucherForm
          onSave={handleSaveVoucher}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {/* Update Voucher Modal */}
      {isEditModalOpen && selectedVoucherForEdit && (
        <UpdateVoucherForm
          voucher={selectedVoucherForEdit}
          onSave={handleUpdateVoucher}
          onClose={handleCloseEditModal}
          onSuccess={() => refetch()}
        />
      )}
    </div>
    </>
  );
}

export default VoucherManagement;