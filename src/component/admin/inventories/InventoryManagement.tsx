import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxes, 
  faPlus, 
  faSearch, 
  faFilter, 
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { phonesAPI } from '@/utils/api/phone';
import { PhoneVariant } from '@/utils/type/phoneVariant';
import UpsertInventoryForm from './UpsertInventoryForm';
import styles from './InventoryManagement.module.scss';

interface InventoryItem {
  id: number;
  sku: string;
  phoneName: string;
  variantName: string;
  colorName: string;
  stockQuantity: number;
  variantId: number;
  colorId: number;
}

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('all');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [variants, setVariants] = useState<PhoneVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch variants and transform to inventory items
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await phonesAPI.getVariants();
      const variantsList: PhoneVariant[] = response.data;
      
      // Store variants for UpsertInventoryForm
      setVariants(variantsList);
      
      // Transform variants to inventory items
      const items: InventoryItem[] = [];
      
      variantsList.forEach(variant => {
        // Create inventory items for each inventory record
        variant.inventories.forEach(inventory => {
          // Find the color name for this inventory
          const colorVariant = variant.colors.find(c => c.color.id === inventory.colorId);
          const colorName = colorVariant?.color.name || 'Unknown';
          
          items.push({
            id: inventory.id,
            sku: inventory.sku,
            phoneName: variant.phone.name,
            variantName: variant.variantName,
            colorName: colorName,
            stockQuantity: inventory.stockQuantity,
            variantId: variant.id,
            colorId: inventory.colorId
          });
        });
      });
      
      setInventoryItems(items);
    } catch (error: any) {
      console.error('Error fetching inventory data:', error);
      setError(error.message || 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Filter inventory items based on search and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.colorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStock = filterStock === 'all' ||
      (filterStock === 'in_stock' && item.stockQuantity > 0) ||
      (filterStock === 'low_stock' && item.stockQuantity > 0 && item.stockQuantity <= 10) ||
      (filterStock === 'out_of_stock' && item.stockQuantity === 0);

    return matchesSearch && matchesStock;
  });

  // Helper functions
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { status: 'out_of_stock', label: 'Hết hàng', className: 'outOfStock' };
    } else if (stock <= 10) {
      return { status: 'low_stock', label: 'Sắp hết', className: 'lowStock' };
    }
    return { status: 'in_stock', label: 'Còn hàng', className: 'inStock' };
  };

  const handleUpsertInventory = () => {
    setIsUpsertModalOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setIsUpsertModalOpen(false);
  };

  const handleUpsertSuccess = () => {
    messageApi.success('Cập nhật tồn kho thành công!');
    setIsUpsertModalOpen(false);
    fetchInventoryData();
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.inventoryManagement}>
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          <p>Đang tải dữ liệu tồn kho...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.inventoryManagement}>
        <div className={styles.errorContainer}>
          <h2>Lỗi tải dữ liệu</h2>
          <p>{error}</p>
          <button onClick={() => fetchInventoryData()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className={styles.inventoryManagement}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <FontAwesomeIcon icon={faBoxes} className={styles.titleIcon} />
              Quản lý tồn kho
            </h1>
            <p className={styles.subtitle}>Theo dõi và quản lý số lượng tồn kho sản phẩm</p>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.addBtn}
              onClick={handleUpsertInventory}
            >
              <FontAwesomeIcon icon={faPlus} />
              Cập nhật tồn kho
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo SKU, tên sản phẩm, biến thể hoặc màu sắc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterItem}>
              <FontAwesomeIcon icon={faBoxes} className={styles.filterIcon} />
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="in_stock">Còn hàng</option>
                <option value="low_stock">Sắp hết hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className={styles.statistics}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{inventoryItems.length}</div>
            <div className={styles.statLabel}>Tổng sản phẩm</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {inventoryItems.filter(item => item.stockQuantity > 0).length}
            </div>
            <div className={styles.statLabel}>Còn hàng</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {inventoryItems.filter(item => item.stockQuantity <= 10 && item.stockQuantity > 0).length}
            </div>
            <div className={styles.statLabel}>Sắp hết</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {inventoryItems.filter(item => item.stockQuantity === 0).length}
            </div>
            <div className={styles.statLabel}>Hết hàng</div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th>Màu sắc</th>
                <th>Số lượng tồn</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => {
                  const stockStatus = getStockStatus(item.stockQuantity);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.skuCode}>
                          <code>{item.sku}</code>
                        </div>
                      </td>
                      <td>
                        <div className={styles.productName}>
                          <h4>{item.phoneName}</h4>
                          <p>{item.variantName}</p>
                        </div>
                      </td>
                      <td>
                        <div className={styles.colorInfo}>
                          <span className={styles.colorName}>{item.colorName}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.stockQuantity}>
                          <span className={styles.stockNumber}>{item.stockQuantity}</span>
                          <span className={styles.stockUnit}>chiếc</span>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusTag} ${styles[stockStatus.className]}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    {searchTerm || filterStock !== 'all' 
                      ? 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc'
                      : 'Không có dữ liệu tồn kho'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <p>
            Hiển thị {filteredItems.length} / {inventoryItems.length} sản phẩm
          </p>
        </div>

        {/* Upsert Inventory Modal */}
        {isUpsertModalOpen && (
          <UpsertInventoryForm
            variants={variants}
            onClose={handleCloseUpsertModal}
            onSuccess={handleUpsertSuccess}
          />
        )}
      </div>
    </>
  );
};

export default InventoryManagement;