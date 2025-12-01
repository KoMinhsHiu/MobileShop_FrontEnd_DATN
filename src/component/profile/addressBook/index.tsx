import React, { useEffect, useState } from 'react';
import customerAPI, { AddressData } from '@/utils/api/customer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPenToSquare, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/component/common/ToastContainer'; 
import styles from './AddressBook.module.scss';
import AddressModal from './AddAddressModal';
import EditAddressModal from './EditAddressModal';

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddressToEdit, setSelectedAddressToEdit] = useState<AddressData | null>(null);

  const { showSuccess, showError, ToastContainer } = useToast();

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await customerAPI.getAddresses();
      if (response && response.data) {
        setAddresses(response.data);
      }
    } catch (error: any) {
      console.error('Failed to load addresses', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddSuccess = () => {
    showSuccess("Thêm địa chỉ mới thành công!");
    fetchAddresses();
  };

  const handleEditSuccess = () => {
    showSuccess("Cập nhật địa chỉ thành công!");
    fetchAddresses();
  };

  const handleSetDefault = async (id: number) => {
    try {
      await customerAPI.updateAddress(id, { isDefault: true } as any);
      showSuccess('Đã thay đổi địa chỉ mặc định');
      fetchAddresses();
    } catch (error: any) {
      showError(error.message || 'Không thể thiết lập mặc định');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      await customerAPI.deleteAddress(id);
      showSuccess('Đã xóa địa chỉ');
      fetchAddresses();
    } catch (error: any) {
      showError(error.message || 'Xóa thất bại');
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (address: AddressData) => {
    setSelectedAddressToEdit(address);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAddressToEdit(null);
  };

  return (
    <div className={styles.addressBookContainer}>
      <div className={styles.headerSection}>
        <h2>Sổ địa chỉ</h2>
        <button className={styles.addButton} onClick={handleOpenAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Thêm địa chỉ mới
        </button>
      </div>

      <div className={styles.addressList}>
        {isLoading ? (
          <p className={styles.loadingText}>Đang tải danh sách địa chỉ...</p>
        ) : addresses.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Bạn chưa lưu địa chỉ nào.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className={`${styles.addressItem} ${addr.isDefault ? styles.defaultItem : ''}`}>
              
              <div className={styles.topRow}>
                <div className={styles.contactInfo}>
                  <span className={styles.name}>{addr.recipientName}</span>
                  <span className={styles.divider}>|</span>
                  <span className={styles.phone}>{addr.recipientPhone}</span>
                </div>
                {addr.isDefault && (
                  <span className={styles.defaultBadge}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Mặc định
                  </span>
                )}
              </div>

              <div className={styles.addressDetail}>
                <span>{addr.street}</span>
                <span>, {addr.commune?.name}</span>
                <span>, {addr.province?.name}</span>
              </div>

              <div className={styles.actionRow}>
                <div className={styles.leftActions}>
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => handleOpenEditModal(addr)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} /> Sửa
                  </button>
                  
                  {!addr.isDefault && (
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                      onClick={() => handleDelete(addr.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Xóa
                    </button>
                  )}
                </div>

                {!addr.isDefault && (
                  <button 
                    className={styles.setDefaultBtn}
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    Thiết lập mặc định
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AddressModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditAddressModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        address={selectedAddressToEdit}
      />

      <ToastContainer />
    </div>
  );
};

export default AddressBook;