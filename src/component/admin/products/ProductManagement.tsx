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
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { Product, ProductFilters, ProductFormData, PaginationInfo } from '../admin.types';
import ProductForm from './ProductForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import ProductVariantsModal from './ProductVariantsModal';
import styles from './ProductManagement.module.scss';

// Mock data - trong thực tế sẽ fetch từ API
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ',
    category: 'Điện thoại',
    supplier: 'Apple',
    status: 'visible',
    mainImage: '/images/products/iphone15.jpg',
    variants: [
      { 
        id: '1-1', 
        color: 'Titan Xanh', 
        storage: '256GB', 
        price: 29990000, 
        quantity: 20, 
        images: [
          '/images/products/iphone15-blue-1.jpg',
          '/images/products/iphone15-blue-2.jpg',
          '/images/products/iphone15-blue-3.jpg'
        ]
      },
      { 
        id: '1-2', 
        color: 'Titan Trắng', 
        storage: '512GB', 
        price: 33990000, 
        quantity: 15, 
        images: [
          '/images/products/iphone15-white-1.jpg',
          '/images/products/iphone15-white-2.jpg'
        ]
      },
      { 
        id: '1-3', 
        color: 'Titan Đen', 
        storage: '1TB', 
        price: 37990000, 
        quantity: 10, 
        images: [
          '/images/products/iphone15-black-1.jpg'
        ]
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra với camera 200MP',
    category: 'Điện thoại',
    supplier: 'Samsung',
    status: 'visible',
    mainImage: '/images/products/samsung-s24.jpg',
    variants: [
      { 
        id: '2-1', 
        color: 'Titan Đen', 
        storage: '256GB', 
        price: 25990000, 
        quantity: 25, 
        images: [
          '/images/products/samsung-s24-black-1.jpg',
          '/images/products/samsung-s24-black-2.jpg'
        ]
      },
      { 
        id: '2-2', 
        color: 'Titan Vàng', 
        storage: '512GB', 
        price: 28990000, 
        quantity: 18,
        images: [
          '/images/products/samsung-s24-gold-1.jpg'
        ]
      }
    ],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    description: 'MacBook Pro với chip M3 mạnh mẽ',
    category: 'Laptop',
    supplier: 'Apple',
    status: 'hidden',
    mainImage: '/images/products/macbook-pro.jpg',
    variants: [
      { id: '3-1', color: 'Xám Space', storage: '512GB', price: 45990000, quantity: 8 },
      { id: '3-2', color: 'Bạc', storage: '1TB', price: 51990000, quantity: 5 }
    ],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13'
  }
];

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
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
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

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'Tất cả') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Supplier filter
    if (filters.supplier !== 'Tất cả') {
      filtered = filtered.filter(product => product.supplier === filters.supplier);
    }

    // Status filter
    if (filters.status !== 'Tất cả') {
      const statusValue = filters.status === 'Hiển thị' ? 'visible' : 'hidden';
      filtered = filtered.filter(product => product.status === statusValue);
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (filters.sortBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (filters.sortBy === 'quantity') {
        aValue = a.variants.reduce((sum, variant) => sum + variant.quantity, 0);
        bValue = b.variants.reduce((sum, variant) => sum + variant.quantity, 0);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Update pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    setFilteredProducts(paginatedProducts);
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages
    }));
  }, [products, filters, pagination.currentPage, pagination.itemsPerPage]);

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
      setProducts(products.filter(p => p.id !== deletingProduct.id));
      setShowDeleteModal(false);
      setDeletingProduct(null);
    }
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    if (editingProduct) {
      // Update existing product
      const updatedProduct: Product = {
        ...editingProduct,
        ...formData,
        mainImage: typeof formData.mainImage === 'string' 
          ? formData.mainImage 
          : URL.createObjectURL(formData.mainImage as File),
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        mainImage: typeof formData.mainImage === 'string' 
          ? formData.mainImage 
          : URL.createObjectURL(formData.mainImage as File),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
    }
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

  const getSortIcon = (column: 'createdAt' | 'quantity') => {
    if (filters.sortBy !== column) {
      return <FontAwesomeIcon icon={faSort} className={styles.sortIcon} />;
    }
    return filters.sortOrder === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className={styles.sortIcon} />
      : <FontAwesomeIcon icon={faSortDown} className={styles.sortIcon} />;
  };

  return (
    <div className={styles.productManagement}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý sản phẩm</h1>
        <button 
          className={styles.addButton}
          onClick={handleAddProduct}
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm..."
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
              <th>Tên sản phẩm</th>
              <th className={styles.desktopOnly}>Danh mục</th>
              <th className={styles.desktopOnly}>Nhà cung cấp</th>
              <th>Trạng thái</th>
              <th className={styles.desktopOnly}>Số biến thể</th>
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
            {filteredProducts.map(product => (
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
                <td className={`${styles.variantCount} ${styles.desktopOnly}`}>{product.variants.length}</td>
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
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className={styles.noData}>
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số {pagination.totalItems} sản phẩm
          </div>
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles.paginationButton} ${page === pagination.currentPage ? styles.active : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
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
