import { 
  faTachometerAlt,
  faBox,
  faShoppingCart,
  faUsers,
  faMobileAlt,
  faLayerGroup,
  faWarehouse,
  faTicket
} from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from './admin.types';

export const MENU_ITEMS: MenuItem[] = [
  { icon: faTachometerAlt, label: 'Dashboard', href: '/admin', active: false },
  { icon: faBox, label: 'Quản lý thương hiệu', href: '/admin/brands', active: false },
  { icon: faLayerGroup, label: 'Quản lý danh mục', href: '/admin/categories', active: false },
  { icon: faMobileAlt, label: 'Quản lý điện thoại', href: '/admin/phones', active: false },
  { icon: faShoppingCart, label: 'Quản lý đơn hàng', href: '/admin/orders', active: false },
  { icon: faUsers, label: 'Quản lý khách hàng', href: '/admin/customers', active: false },
  { icon: faTicket, label: 'Quản lý voucher', href: '/admin/vouchers', active: false },
  { icon: faWarehouse, label: 'Quản lý tồn kho', href: '/admin/inventories', active: false },
];