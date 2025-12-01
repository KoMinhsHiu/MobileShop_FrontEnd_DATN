export type AddToCartItem = {
  update: number;
  id: string;
  productAttributeId: number;
  itemId: number;
  quantity: number;
};

// New interface for the real API
export type AddToCartApiItem = {
  variantId: number;
  colorId: number;
  quantity: number;
  price: number;
  discount: number;
};

export type RemoveFromCart = {
  id: string;
  productAttributeId: number;
};

export type CartType = {
  products: ProductCart[];
  totalPrice: number;
  totalProduct: number;
};

export type ProductCart = {
  id: string;
  itemId: number;
  productAttributeId: number;
  name: string;
  attributes: { key: string };
  image: string;
  price: string;
  discount?: string;
  quantity: number;
  rate: number;
  totalPrice: string;
};

export type CartContextType = {
  cart: CartType;
  addToCartApi: (item: AddToCartApiItem) => Promise<void>;
  updateQuantityApi: (item: AddToCartItem, action: "up" | "down") => Promise<void>;
  deleteCartItemsApi: (itemIds: number[]) => Promise<void>;
  isLoading: boolean;
};
