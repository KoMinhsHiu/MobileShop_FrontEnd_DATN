import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './PhoneManagement.module.scss';
import { faChevronLeft, faChevronRight, faEye, faFilter, faMobileAlt, faPlus, faSearch, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { message } from 'antd';
import { PaginationInfo } from "../admin.types";
import { usePhoneList } from "@/utils/hooks/api/usePhoneList";
import { Phone } from "@/utils/api/phone";
import { useRouter } from "next/router";
import AddPhoneForm from "./AddPhoneForm";
import phonesAPI from "@/utils/api/phone";

interface PhoneLine {
  id: number;
  name: string;
  brand: string;
  description: string;
  image: string;
  createdAt: string;
  variantCount: number;
}

const PhoneManagement = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [showAddPhoneFormModal, setShowAddPhoneFormModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const { phones, total, isLoading, error } = usePhoneList({
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
  });

  const { deletePhone } = phonesAPI;

  const phoneLines: PhoneLine[] = phones.map((phone: Phone) => ({
    id: phone.id,
    name: phone.name,
    brand: phone.brand.name,
    description: `${phone.category.name} - ${phone.brand.name}`,
    image: phone.variants[0]?.images[0]?.image.imageUrl || '',
    createdAt: phone.createdAt,
    variantCount: phone.variants.length
  }));

  const brands = Array.from(new Set(phoneLines.map(line => line.brand)));

  const filteredPhoneLines = phoneLines.filter(line => {
    const matchesSearch = line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         line.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || line.brand === filterBrand;

    return matchesSearch && matchesBrand;
  });

  useEffect(() => {
    setPagination(prev => ({
      ...prev, 
      totalItems: total,
      totalPages: Math.ceil(total / prev.itemsPerPage)
    }));
  }, [total]);

  const handleAddPhone = () => {
    setShowAddPhoneFormModal(true);
    setEditingPhone(null);
  }

  const handleView = (id: number) => {
    // Navigate to the phone detail page
    router.push(`/admin/phones/${id}`);
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa dòng điện thoại này?')) {
      try {
        await deletePhone(id);
        messageApi.success('Xóa dòng điện thoại thành công');
        // Reload phone list
        window.location.reload();
      } catch (error) {
        messageApi.error('Không thể xóa dòng điện thoại. Vui lòng thử lại sau.');
      }
    }
  }

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

  if (isLoading && phoneLines.length === 0) {
    return (
      <div className={styles.phoneLineManagement}>
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          <p>Đang tải danh sách dòng điện thoại...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.phoneLineManagement}>
        <div className={styles.errorContainer}>
          <h2>Lỗi tải dữ liệu</h2>
          <p>Không thể tải danh sách dòng điện thoại. Vui lòng thử lại sau.</p>
          <button onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    {contextHolder}
    <div className={styles.phoneManagement}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FontAwesomeIcon icon={faMobileAlt} className={styles.titleIcon} />
            Quản lý dòng điện thoại
          </h1>
          <p className={styles.subtitle}>Quản lý các dòng điện thoại và biến thể</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.addBtn}
            onClick={handleAddPhone}
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
            ) : filteredPhoneLines.length > 0 ? (
              filteredPhoneLines.map(line => (
                <tr key={line.id}>
                  <td>
                    <div className={styles.imageCell}>
                      <img 
                        src={line.image}
                        alt={line.name}
                        className={styles.productImage}
                      />
                    </div>
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      <h4>{line.name}</h4>
                      <p>{line.description}</p>
                    </div>
                  </td>
                  <td>
                    <span className={styles.brandTag}>{line.brand}</span>
                  </td>
                  <td>
                    <span className={styles.variantCount}>{line.variantCount}</span>
                  </td>
                  <td>
                    <span className={styles.dateText}>
                      {new Date(line.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleView(line.id)}
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(line.id)}
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

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số {pagination.totalItems} điện thoại
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
            <span>điện thoại/trang</span>
          </div>

          {pagination.totalPages > 1 && (
            <div className={styles.pageControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
                title="Trang đầu"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                title="Trang trước"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              {(() => {
                const totalPages = pagination.totalPages;
                const currentPage = pagination.currentPage;
                const pages = [];

                if (totalPages <= 6) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <button
                        key={i}
                        className={`${styles.paginationButton} ${i === currentPage ? styles.active : ''}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                } else {
                  pages.push(
                    <button
                      key={1}
                      className={`${styles.paginationButton} ${1 === currentPage ? styles.active : ''}`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  );

                  if (currentPage > 4) {
                    pages.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
                  }

                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(totalPages - 1, currentPage + 1);
                  
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        className={`${styles.paginationButton} ${i === currentPage ? styles.active : ''}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }

                  if (currentPage < totalPages - 3) {
                    pages.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
                  }

                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        className={`${styles.paginationButton} ${totalPages === currentPage ? styles.active : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                }

                return pages;
              })()}

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                title="Trang sau"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
                title="Trang cuối"
              >
                <FontAwesomeIcon icon={faChevronRight} />
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Phone Form Modal */}
      {showAddPhoneFormModal && (
        <AddPhoneForm
          onSave={() => {
            setShowAddPhoneFormModal(false);
            setEditingPhone(null);
          }}
          onClose={() => {
            setShowAddPhoneFormModal(false);
            setEditingPhone(null);
          }}
          onSuccess={() => {
            // Reset về trang đầu tiên và reload dữ liệu
            setPagination(prev => ({ ...prev, currentPage: 1 }));
          }}
        />
      )}
    </div>
    </>
  );
}

export default PhoneManagement;