import { 
  faPen, 
  faPlus,
  faTrash, 
  faSearch,
  faSpinner, 
  faBox
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BrandManagement.module.scss";
import { fetchBrandsSafe } from "@/utils/api/brands";
import Image from "next/image";
import { TransformedBrand } from "@/utils/type";
import { useState, useEffect } from "react";
import AddBrandForm from "./AddBrandForm";
import UpdateBrandForm from "./UpdateBrandForm";
import phonesAPI from "@/utils/api/phone";

const BrandManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState<TransformedBrand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState<TransformedBrand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { deleteBrand } = phonesAPI;

  // Fetch brands data
  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBrandsSafe();
        setBrands(data || []);
      } catch (err) {
        setError('Không thể tải danh sách thương hiệu');
        console.error('Error fetching brands:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  const handleAddBrand = () => {
    setShowAddForm(true);
    setEditingBrand(null);
  };

  const handleEdit = (id: number) => {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      setEditingBrand(brand);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        await deleteBrand(id);
        setBrands(prevBrands => prevBrands.filter(brand => brand.id !== id));
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Không thể xóa thương hiệu. Vui lòng thử lại.');
      }
    }
  };

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className={styles.brandManagement}>
        <div className={styles.errorContainer}>
          <h2>Lỗi tải dữ liệu</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  async function loadBrands() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBrandsSafe();
      setBrands(data || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Không thể tải danh sách thương hiệu");
    } finally {
      setIsLoading(false);
    }
    }

  return (
    <div className={styles.brandManagement}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FontAwesomeIcon icon={faBox} className={styles.titleIcon} />
            Quản lý thương hiệu
          </h1>
          <p className={styles.subtitle}>Quản lý danh sách thương hiệu</p>
        </div>

        <div className={styles.headerRight}>
          <button 
            className={styles.addBtn}
            onClick={handleAddBrand}
          >
            <FontAwesomeIcon icon={faPlus} />
            Thêm thương hiệu
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Brand Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên thương hiệu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className={styles.loadingRow}>
                  <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                  <span>Đang tải danh sách thương hiệu...</span>
                </td>
              </tr>
            ) : filteredBrands.length > 0 ? (
              filteredBrands.map(brand => (
                <tr key={brand.id}>
                  <td className={styles.imageCell}>
                    {brand.imageUrl ? (
                      <Image
                        src={brand.imageUrl}
                        alt={brand.name}
                        className={styles.productImage}
                        width={48}
                        height={48}
                        priority
                        unoptimized={brand.imageUrl.startsWith('http')}
                      />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </td>
                  <td className={styles.nameCell}>
                    <h4>{brand.name}</h4>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(brand.id)}
                        title="Sửa"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(brand.id)}
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
                <td colSpan={4} className={styles.noData}>
                  Không tìm thấy thương hiệu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <AddBrandForm
          onSave={() => {
            setShowAddForm(false);
            setEditingBrand(null);
            loadBrands();
          }}
          onClose={() => {
            setShowAddForm(false);
            setEditingBrand(null);
          }}
        />
      )}

      {editingBrand && (
        <UpdateBrandForm
          editingBrand={editingBrand}
          onSave={() => {
            setEditingBrand(null);
            // Reload brands list
            loadBrands();
          }}
          onClose={() => {
            setEditingBrand(null);
          }}
        />
      )}
    </div>
  );
}

export default BrandManagement;