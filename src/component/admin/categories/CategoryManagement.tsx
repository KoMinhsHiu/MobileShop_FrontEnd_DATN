import { 
  faPen, 
  faPlus, 
  faLayerGroup, 
  faTrash, 
  faSearch,
  faSpinner 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCategoryForm from './AddCategoryForm';
import UpdateCategoryForm from './UpdateCategoryForm';
import styles from './CategoryManagement.module.scss';
import phonesAPI, { PhoneCategory } from '@/utils/api/phone';
import { useState, useEffect, useCallback } from "react";

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<PhoneCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PhoneCategory | null>(null);

  const { getAllCategories, deleteCategory } = phonesAPI;

  // Fetch categories data
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Không thể tải danh sách danh mục');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getAllCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = () => {
    setShowAddForm(true);
  };

  const handleEdit = (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setEditingCategory(category);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await deleteCategory(id);
        setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Không thể xóa danh mục. Vui lòng thử lại.');
      }
    }
  };

  const getParentCategoryName = (parentId: number | null): string => {
    if (!parentId) return '';
    const parentCategory = categories.find(cat => cat.id === parentId);
    return parentCategory ? parentCategory.name : 'Không xác định';
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className={styles.categoryManagement}>
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

  return (
    <div className={styles.categoryManagement}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FontAwesomeIcon icon={faLayerGroup} className={styles.titleIcon} />
            Quản lý danh mục
          </h1>
          <p className={styles.subtitle}>Quản lý danh sách danh mục sản phẩm</p>
        </div>

        <div className={styles.headerRight}>
          <button 
            className={styles.addBtn}
            onClick={handleAddCategory}
          >
            <FontAwesomeIcon icon={faPlus} />
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Category Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Danh mục cha</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className={styles.loadingRow}>
                  <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                  <span>Đang tải danh sách danh mục...</span>
                </td>
              </tr>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <tr key={category.id}>
                  <td className={styles.nameCell}>
                    <h4>{category.name}</h4>
                  </td>
                  <td className={styles.parentCell}>
                    {getParentCategoryName(category.parentId)}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(category.id)}
                        title="Sửa"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(category.id)}
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
                <td colSpan={3} className={styles.noData}>
                  Không tìm thấy danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Category Form Modal */}
      {showAddForm && (
        <AddCategoryForm
          categories={categories}
          onSave={() => {
            setShowAddForm(false);
            // Reload categories after adding
            loadCategories();
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Update Category Form Modal */}
      {editingCategory && (
        <UpdateCategoryForm
          editingCategory={editingCategory}
          categories={categories}
          onSave={() => {
            setEditingCategory(null);
            // Reload categories after updating
            loadCategories();
          }}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}

export default CategoryManagement;