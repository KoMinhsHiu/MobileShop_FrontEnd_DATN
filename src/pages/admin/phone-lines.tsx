import React, { useState, useEffect } from 'react';
import AdminLayout from '../../component/admin/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch,
  faFilter,
  faSort,
  faEye,
  faMobileAlt,
  faLayerGroup,
  faBox,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import styles from '../../component/admin/phone-lines/PhoneLineManagement.module.scss';
import { usePhoneList } from '../../utils/hooks/api/usePhoneList';
import { Phone } from '../../utils/api/phone';

interface PhoneLine {
  id: number;
  name: string;
  brand: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  variantCount: number;
}

const PhoneLineManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPhoneLine, setSelectedPhoneLine] = useState<PhoneLine | null>(null);

  // Fetch phones from API
  const { phones, total, isLoading, error } = usePhoneList({
    page: currentPage,
    limit: itemsPerPage,
    order: sortOrder
  });

  // Transform API data to PhoneLine format
  const phoneLines: PhoneLine[] = phones.map((phone: Phone) => ({
    id: phone.id,
    name: phone.name,
    brand: phone.brand.name,
    description: `${phone.category.name} - ${phone.brand.name}`,
    image: phone.brand.image?.imageUrl || '/images/placeholder.png',
    status: phone.isDeleted ? 'inactive' : 'active',
    createdAt: phone.createdAt,
    updatedAt: phone.updatedAt,
    variantCount: 0 // This would need to be fetched separately or included in API
  }));

  // Get unique brands from API data
  const brands = Array.from(new Set(phoneLines.map(line => line.brand)));

  // Filter phones based on search and filters
  const filteredPhoneLines = phoneLines.filter(line => {
    const matchesSearch = line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         line.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || line.brand === filterBrand;
    const matchesStatus = filterStatus === 'all' || line.status === filterStatus;
    
    return matchesSearch && matchesBrand && matchesStatus;
  });

  // Sort is handled by API, so we use filteredPhoneLines directly
  const sortedPhoneLines = filteredPhoneLines;

  // Calculate pagination info
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleEdit = (phoneLine: PhoneLine) => {
    setSelectedPhoneLine(phoneLine);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa dòng điện thoại này?')) {
      // Implement delete logic
      console.log('Delete phone line:', id);
    }
  };

  const handleViewVariants = (phoneLine: PhoneLine) => {
    // Navigate to variants page with phone line filter
    window.location.href = `/admin/products?phoneLine=${phoneLine.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1); // Reset to first page when sort order changes
  };

  // Show loading state
  if (isLoading && phoneLines.length === 0) {
    return (
      <AdminLayout currentPage="/admin/phone-lines">
        <div className={styles.phoneLineManagement}>
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
            <p>Đang tải danh sách dòng điện thoại...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AdminLayout currentPage="/admin/phone-lines">
        <div className={styles.phoneLineManagement}>
          <div className={styles.errorContainer}>
            <h2>Lỗi tải dữ liệu</h2>
            <p>Không thể tải danh sách dòng điện thoại. Vui lòng thử lại sau.</p>
            <button onClick={() => window.location.reload()}>
              Tải lại trang
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/phone-lines">
      <div className={styles.phoneLineManagement}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <FontAwesomeIcon icon={faLayerGroup} className={styles.titleIcon} />
              Quản lý dòng điện thoại
            </h1>
            <p className={styles.subtitle}>Quản lý các dòng điện thoại và biến thể</p>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.addBtn}
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Thêm dòng điện thoại
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm dòng điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <div className={styles.filterItem}>
              <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Tất cả thương hiệu</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterItem}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>
            
            <div className={styles.filterItem}>
              <FontAwesomeIcon icon={faSort} className={styles.filterIcon} />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="name">Sắp xếp theo tên</option>
                <option value="brand">Sắp xếp theo thương hiệu</option>
                <option value="createdAt">Sắp xếp theo ngày tạo</option>
              </select>
            </div>
            
            <button
              className={styles.sortOrderBtn}
              onClick={handleSortOrderChange}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FontAwesomeIcon icon={faLayerGroup} />
            </div>
            <div className={styles.statContent}>
              <h3>{total}</h3>
              <p>Tổng số dòng điện thoại</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FontAwesomeIcon icon={faMobileAlt} />
            </div>
            <div className={styles.statContent}>
              <h3>{phoneLines.filter(line => line.status === 'active').length}</h3>
              <p>Đang hoạt động</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FontAwesomeIcon icon={faBox} />
            </div>
            <div className={styles.statContent}>
              <h3>{phoneLines.reduce((sum, line) => sum + line.variantCount, 0)}</h3>
              <p>Tổng số biến thể</p>
            </div>
          </div>
        </div>

        {/* Phone Lines Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên dòng</th>
                <th>Thương hiệu</th>
                <th>Số biến thể</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className={styles.loadingRow}>
                    <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                    <span>Đang tải...</span>
                  </td>
                </tr>
              ) : sortedPhoneLines.length > 0 ? (
                sortedPhoneLines.map(phoneLine => (
                <tr key={phoneLine.id}>
                  <td>
                    <div className={styles.imageCell}>
                      <img 
                        src={phoneLine.image} 
                        alt={phoneLine.name}
                        className={styles.productImage}
                      />
                    </div>
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      <h4>{phoneLine.name}</h4>
                      <p>{phoneLine.description}</p>
                    </div>
                  </td>
                  <td>
                    <span className={styles.brandTag}>{phoneLine.brand}</span>
                  </td>
                  <td>
                    <span className={styles.variantCount}>{phoneLine.variantCount}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusTag} ${styles[phoneLine.status]}`}>
                      {phoneLine.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.dateText}>
                      {new Date(phoneLine.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleViewVariants(phoneLine)}
                        title="Xem biến thể"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(phoneLine)}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(phoneLine.id)}
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.noData}>
                  <p>Không tìm thấy dòng điện thoại nào</p>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!isLoading && sortedPhoneLines.length === 0 && (
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faLayerGroup} className={styles.emptyIcon} />
            <h3>Không tìm thấy dòng điện thoại nào</h3>
            <p>Hãy thử thay đổi bộ lọc hoặc thêm dòng điện thoại mới</p>
            <button 
              className={styles.addBtn}
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Thêm dòng điện thoại
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, total)} trong tổng số {total} dòng điện thoại
            </div>
            <div className={styles.paginationControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`${styles.paginationButton} ${page === currentPage ? styles.active : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PhoneLineManagement;
