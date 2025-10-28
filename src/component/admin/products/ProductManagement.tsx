import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faEdit, 
  faTrash, 
  faFilter,
  faImage,
  faEye,
  faSort,
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { Product, ProductFilters, ProductFormData, PaginationInfo } from '../admin.types';
import ProductForm from './ProductForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import ProductVariantsModal from './ProductVariantsModal';
import { useFetchPhoneVariants } from '@/utils/hooks/api/useFetchPhoneVariants';
import { PhoneVariantsParams } from '@/utils/type/phoneVariant';
import styles from './ProductManagement.module.scss';

// Helper function to transform API data to admin Product format
const transformApiDataToAdminProduct = (apiProduct: any): Product => {
  // Use the quantity that was already calculated by PhoneVariantTransformer
  const totalStock = parseInt(apiProduct.quantity) || 0;

  // Determine status based on stock quantity
  const status = totalStock > 0 ? 'visible' : 'hidden';
  
  console.log(`[Admin] Product ${apiProduct.id} total stock:`, totalStock, 'Status:', status);

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || 'Không có mô tả',
    category: apiProduct.category || 'Điện thoại',
    supplier: apiProduct.brand || 'Không xác định',
    status: status,
    mainImage: apiProduct.image || '/images/placeholder.png',
    color: apiProduct.color || 'Không xác định',
    colorId: apiProduct.colorId || null,
    variants: [
      {
        id: `${apiProduct.id}-1`,
        color: apiProduct.color || 'Mặc định',
        storage: '128GB',
        price: parseFloat(apiProduct.price.replace(/[^\d]/g, '')) || 0,
        quantity: totalStock,
        images: [apiProduct.image || '/images/placeholder.png']
      }
    ],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
};

const CATEGORIES = [
  'Tất cả',
  'Điện thoại',
  'Laptop',
  'Tablet',
  'Phụ kiện',
  'Đồng hồ thông minh'
];

const SUPPLIERS = [
  'Tất cả',
  'Apple',
  'Samsung',
  'Xiaomi',
  'Oppo',
  'Vivo',
  'OnePlus'
];

const ProductManagement: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'Tất cả',
    supplier: 'Tất cả',
    status: 'Tất cả',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Prepare API parameters
  const apiParams: PhoneVariantsParams = {
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    order: filters.sortOrder,
    search: filters.search || undefined,
    brand: filters.supplier !== 'Tất cả' ? filters.supplier : undefined,
    sort: filters.sortBy === 'createdAt' ? 'name' : filters.sortBy,
  };

  // Fetch data from API
  const { data: apiData, isLoading, error } = useFetchPhoneVariants(apiParams);

  // Transform API data to admin format
  const products = (apiData as any)?.products?.map(transformApiDataToAdminProduct) || [];
  const filteredProducts = products; // API already handles filtering

  // Update pagination from API response
  useEffect(() => {
    if (apiData && typeof apiData === 'object' && 'currentPage' in apiData) {
      setPagination(prev => ({
        ...prev,
        currentPage: (apiData as any).currentPage || 1,
        totalPages: (apiData as any).totalPages || 1,
        totalItems: (apiData as any).totalProducts || 0
      }));
    }
  }, [apiData]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleViewVariants = (product: Product) => {
    setViewingProduct(product);
    setShowVariantsModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingProduct) {
      // TODO: Implement API call to delete product
      console.log('Delete product:', deletingProduct.id);
      setShowDeleteModal(false);
      setDeletingProduct(null);
    }
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    // TODO: Implement API call to save product
    console.log('Save product:', formData);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSort = (sortBy: 'createdAt' | 'quantity') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage,
      currentPage: 1 // Reset to first page when changing items per page
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusText = (status: string) => {
    return status === 'visible' ? 'Hiển thị' : 'Ẩn';
  };

  const getStatusClass = (status: string) => {
    return status === 'visible' ? styles.visible : styles.hidden;
  };

  const getTotalQuantity = (variants: any[]) => {
    return variants.reduce((sum, variant) => sum + variant.quantity, 0);
  };

  const getStockClass = (quantity: number) => {
    if (quantity === 0) return styles.stockEmpty;
    if (quantity < 10) return styles.stockLow;
    if (quantity < 50) return styles.stockMedium;
    return styles.stockHigh;
  };

  const getSortIcon = (column: 'createdAt' | 'quantity') => {
    if (filters.sortBy !== column) {
      return <FontAwesomeIcon icon={faSort} className={styles.sortIcon} />;
    }
    return filters.sortOrder === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className={styles.sortIcon} />
      : <FontAwesomeIcon icon={faSortDown} className={styles.sortIcon} />;
  };

  // Show loading state
  if (isLoading && !apiData) {
    return (
      <div className={styles.productManagement}>
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          <p>Đang tải danh sách biến thể...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.productManagement}>
        <div className={styles.errorContainer}>
          <h2>Lỗi tải dữ liệu</h2>
          <p>Không thể tải danh sách biến thể. Vui lòng thử lại sau.</p>
          <button onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productManagement}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý biến thể điện thoại</h1>
        <button 
          className={styles.addButton}
          onClick={handleAddProduct}
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm biến thể mới
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên biến thể..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className={styles.filterSelect}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filters.supplier}
            onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
            className={styles.filterSelect}
          >
            {SUPPLIERS.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className={styles.filterSelect}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Hiển thị">Hiển thị</option>
            <option value="Ẩn">Ẩn</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({ ...filters, sortBy: sortBy as 'createdAt' | 'quantity', sortOrder: sortOrder as 'asc' | 'desc' });
            }}
            className={styles.filterSelect}
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="quantity-desc">Số lượng giảm dần</option>
            <option value="quantity-asc">Số lượng tăng dần</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên biến thể</th>
              <th className={styles.desktopOnly}>Danh mục</th>
              <th className={styles.desktopOnly}>Nhà cung cấp</th>
              <th>Trạng thái</th>
              <th className={styles.desktopOnly}>
                <button 
                  className={styles.sortableHeader}
                  onClick={() => handleSort('quantity')}
                >
                  Tồn kho
                  {getSortIcon('quantity')}
                </button>
              </th>
              <th className={styles.desktopOnly}>Màu sắc</th>
              <th className={styles.desktopOnly}>
                <button 
                  className={styles.sortableHeader}
                  onClick={() => handleSort('createdAt')}
                >
                  Ngày tạo
                  {getSortIcon('createdAt')}
                </button>
              </th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && apiData ? (
              <tr>
                <td colSpan={9} className={styles.loadingRow}>
                  <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                  <span>Đang tải...</span>
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.imageCell}>
                    {product.mainImage ? (
                      <img 
                        src={product.mainImage} 
                        alt={product.name}
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.noImage}>
                        <FontAwesomeIcon icon={faImage} />
                      </div>
                    )}
                  </div>
                </td>
                <td className={styles.productName}>{product.name}</td>
                <td className={styles.desktopOnly}>{product.category}</td>
                <td className={styles.desktopOnly}>{product.supplier}</td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td className={`${styles.stockQuantity} ${styles.desktopOnly}`}>
                  <span className={`${styles.stockBadge} ${getStockClass(product.variants[0]?.quantity || 0)}`}>
                    {product.variants[0]?.quantity || 0}
                  </span>
                </td>
                <td className={`${styles.colorCell} ${styles.desktopOnly}`}>
                  <span>{product.color}</span>
                </td>
                <td className={`${styles.createdDate} ${styles.desktopOnly}`}>{product.createdAt}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleViewVariants(product)}
                      title="Xem biến thể"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className={`${styles.editButton} ${styles.desktopOnly}`}
                      onClick={() => handleEditProduct(product)}
                      title="Sửa"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className={`${styles.deleteButton} ${styles.desktopOnly}`}
                      onClick={() => handleDeleteProduct(product)}
                      title="Xóa"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className={`${styles.mobileDetailsButton} ${styles.mobileOnly}`}
                      onClick={() => handleViewVariants(product)}
                      title="Chi tiết"
                    >
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className={styles.noData}>
                  <p>Không tìm thấy biến thể nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số {pagination.totalItems} biến thể
        </div>
        
        <div className={styles.paginationControls}>
          <div className={styles.itemsPerPage}>
            <label>Hiển thị:</label>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
              className={styles.itemsPerPageSelect}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>biến thể/trang</span>
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
              
              {/* Show page numbers with ellipsis for large page counts */}
              {(() => {
                const totalPages = pagination.totalPages;
                const currentPage = pagination.currentPage;
                const pages = [];
                
                if (totalPages <= 7) {
                  // Show all pages if 7 or fewer
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
                  // Show first page
                  pages.push(
                    <button
                      key={1}
                      className={`${styles.paginationButton} ${1 === currentPage ? styles.active : ''}`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  );
                  
                  // Show ellipsis if current page is far from start
                  if (currentPage > 4) {
                    pages.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
                  }
                  
                  // Show pages around current page
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
                  
                  // Show ellipsis if current page is far from end
                  if (currentPage < totalPages - 3) {
                    pages.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
                  }
                  
                  // Show last page
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

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          onSave={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Product Variants Modal */}
      {showVariantsModal && viewingProduct && (
        <ProductVariantsModal
          product={viewingProduct}
          onClose={() => {
            setShowVariantsModal(false);
            setViewingProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;
