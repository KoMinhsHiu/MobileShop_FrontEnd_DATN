export type AddToCartItem = {
  update: number;
  id: string;
  productAttributeId: number;
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
  addToCart: (item: AddToCartItem) => void;
  addToCartApi: (item: AddToCartApiItem) => Promise<void>;
  removeFromCart: (item: RemoveFromCart) => void;
  updateQuantity: (item: AddToCartItem, action: "up" | "down") => void;
  isLoading: boolean;
};
